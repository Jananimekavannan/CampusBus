import express from "express";
import http from "http";
import cors from "cors";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import { Server } from "socket.io";

dotenv.config();
const app=express(), server=http.createServer(app);
const io=new Server(server,{cors:{origin:"*",methods:["GET","POST"]}});
app.use(cors()); app.use(express.json());
const PORT=process.env.PORT||5000, SECRET=process.env.JWT_SECRET||"campusbus_dev_secret";

let mongoConnected=false;
if(process.env.MONGO_URI){
  mongoose.connect(process.env.MONGO_URI).then(()=>{mongoConnected=true;console.log("MongoDB connected")}).catch(e=>console.log("MongoDB unavailable, using memory:",e.message));
}

const users=[
 {id:"u1",name:"Janani Student",email:"student@campusbus.local",password:bcrypt.hashSync("Student123!",10),role:"student",busId:"bus12"},
 {id:"u2",name:"Driver Kumar",email:"driver@campusbus.local",password:bcrypt.hashSync("Driver123!",10),role:"driver",busId:"bus12"},
 {id:"u3",name:"Transport Admin",email:"admin@campusbus.local",password:bcrypt.hashSync("Admin123!",10),role:"admin"}
];
const buses=[
 {id:"bus12",number:"12",name:"Bus 12",route:"Gandhipuram → KIT College",stops:["Gandhipuram","Singanallur","Peelamedu","Hope College","KIT College"],status:"inactive"},
 {id:"bus15",number:"15",name:"Bus 15",route:"Saravanampatti → KIT College",stops:["Saravanampatti","Ganapathy","Avinashi Road","Peelamedu","KIT College"],status:"inactive"},
 {id:"bus21",number:"21",name:"Bus 21",route:"Pollachi → KIT College",stops:["Pollachi","Kinathukadavu","Sundarapuram","Ukkadam","KIT College"],status:"inactive"}
];
const locations=new Map();

function auth(req,res,next){
 const token=(req.headers.authorization||"").replace("Bearer ","");
 try{req.user=jwt.verify(token,SECRET);next()}catch{return res.status(401).json({message:"Unauthorized"})}
}
app.get("/api/health",(req,res)=>res.json({ok:true,mongoConnected,time:new Date()}));
app.post("/api/auth/login",async(req,res)=>{
 const {email,password}=req.body;
 const u=users.find(x=>x.email===email);
 if(!u || !await bcrypt.compare(password,u.password)) return res.status(401).json({message:"Invalid email or password"});
 const token=jwt.sign({id:u.id,name:u.name,role:u.role,busId:u.busId},SECRET,{expiresIn:"12h"});
 res.json({token,user:{id:u.id,name:u.name,email:u.email,role:u.role,busId:u.busId}});
});
app.get("/api/buses",auth,(req,res)=>res.json(buses.map(b=>({...b,lastLocation:locations.get(b.id)||null}))));
app.post("/api/trips/start",auth,(req,res)=>{
 if(req.user.role!=="driver")return res.status(403).json({message:"Drivers only"});
 const b=buses.find(x=>x.id===req.user.busId); if(!b)return res.status(404).json({message:"No assigned bus"});
 b.status="active"; io.emit("trip:status",{busId:b.id,status:"active"}); res.json({message:"Trip started",bus:b});
});
app.post("/api/trips/stop",auth,(req,res)=>{
 if(req.user.role!=="driver")return res.status(403).json({message:"Drivers only"});
 const b=buses.find(x=>x.id===req.user.busId); b.status="inactive";
 io.emit("trip:status",{busId:b.id,status:"inactive"}); res.json({message:"Trip stopped"});
});
app.get("/api/location/:busId",auth,(req,res)=>res.json(locations.get(req.params.busId)||null));

io.on("connection",socket=>{
 socket.on("bus:join",busId=>socket.join(`bus:${busId}`));
 socket.on("location:update",data=>{
   if(!data?.busId||typeof data.lat!=="number"||typeof data.lng!=="number")return;
   const loc={busId:data.busId,lat:data.lat,lng:data.lng,accuracy:data.accuracy||null,speed:data.speed||null,heading:data.heading||null,updatedAt:new Date().toISOString()};
   locations.set(data.busId,loc);
   const b=buses.find(x=>x.id===data.busId); if(b)b.status="active";
   io.to(`bus:${data.busId}`).emit("location:update",loc);
   io.emit("admin:location",loc);
 });
});
server.listen(PORT,()=>console.log(`CampusBus API running on http://localhost:${PORT}`));