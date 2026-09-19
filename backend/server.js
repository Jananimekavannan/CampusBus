import express from "express";
import http from "http";
import cors from "cors";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import { Server } from "socket.io";

dotenv.config();
const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*", methods: ["GET", "POST"] } });

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;
const SECRET = process.env.JWT_SECRET || "campusbus_dev_secret";

let mongoConnected = false;
if (process.env.MONGO_URI) {
  mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {
      mongoConnected = true;
      console.log("MongoDB connected");
    })
    .catch((e) =>
      console.log("MongoDB unavailable, running with in-memory store:", e.message)
    );
}

// Kalaignarkarunanidhi Institute of Technology (KIT Coimbatore) Campus Coordinates
export const KIT_CAMPUS = {
  name: "Kalaignar Karunanidhi Institute of Technology (KIT)",
  shortName: "KIT College Campus",
  lat: 10.9922,
  lng: 77.0864,
  address: "Kannampalayam Post, Trichy Road, Coimbatore, Tamil Nadu 641402",
};

// Comprehensive routes from all Coimbatore hubs to KIT College
const buses = [
  {
    id: "bus12",
    number: "12",
    name: "Bus 12 (Gandhipuram Express)",
    route: "Gandhipuram → Lakshmi Mills → Peelamedu → KIT College",
    driver: {
      name: "Kumarasamy S.",
      phone: "+91 98421 88412",
      rating: 4.9,
      experience: "12 yrs",
      plateNumber: "TN 38 BK 1212",
    },
    capacity: 52,
    occupancy: 34,
    status: "active",
    waypoints: [
      { name: "Gandhipuram Central Stand", lat: 11.0168, lng: 76.9558, time: "07:30 AM", etaMin: 35 },
      { name: "Lakshmi Mills Junction", lat: 11.0095, lng: 76.9748, time: "07:38 AM", etaMin: 28 },
      { name: "Nava India Signal", lat: 11.0118, lng: 76.989, time: "07:44 AM", etaMin: 23 },
      { name: "Peelamedu / PSG Tech", lat: 11.0264, lng: 77.0028, time: "07:50 AM", etaMin: 18 },
      { name: "Hope College Junction", lat: 11.0298, lng: 77.018, time: "07:56 AM", etaMin: 14 },
      { name: "Singanallur Bus Stand", lat: 10.9992, lng: 77.027, time: "08:04 AM", etaMin: 9 },
      { name: "Ondipudur Flyover", lat: 10.995, lng: 77.054, time: "08:10 AM", etaMin: 5 },
      { name: "Irugur Pirivu", lat: 10.9935, lng: 77.07, time: "08:14 AM", etaMin: 2 },
      { name: "KIT College Campus", lat: 10.9922, lng: 77.0864, time: "08:20 AM", etaMin: 0 },
    ],
  },
  {
    id: "bus15",
    number: "15",
    name: "Bus 15 (Saravanampatti & IT Corridor)",
    route: "Saravanampatti → Ganapathy → Ramanathapuram → KIT College",
    driver: {
      name: "Murugan V.",
      phone: "+91 97892 44315",
      rating: 4.8,
      experience: "9 yrs",
      plateNumber: "TN 38 BK 1515",
    },
    capacity: 52,
    occupancy: 41,
    status: "active",
    waypoints: [
      { name: "Saravanampatti Checkpost", lat: 11.082, lng: 76.996, time: "07:20 AM", etaMin: 42 },
      { name: "CHIL SEZ / KGISL", lat: 11.071, lng: 77.005, time: "07:28 AM", etaMin: 34 },
      { name: "Ganapathy Bus Stop", lat: 11.041, lng: 76.978, time: "07:37 AM", etaMin: 27 },
      { name: "Lakshmi Mills", lat: 11.0095, lng: 76.9748, time: "07:47 AM", etaMin: 20 },
      { name: "Ramanathapuram Signal", lat: 10.991, lng: 76.986, time: "07:54 AM", etaMin: 15 },
      { name: "Singanallur", lat: 10.9992, lng: 77.027, time: "08:03 AM", etaMin: 9 },
      { name: "Ondipudur", lat: 10.995, lng: 77.054, time: "08:10 AM", etaMin: 4 },
      { name: "KIT College Campus", lat: 10.9922, lng: 77.0864, time: "08:18 AM", etaMin: 0 },
    ],
  },
  {
    id: "bus21",
    number: "21",
    name: "Bus 21 (Pollachi & Kinathukadavu)",
    route: "Pollachi → Kinathukadavu → Eachanari → Sundarapuram → KIT College",
    driver: {
      name: "Rajendran K.",
      phone: "+91 94433 77821",
      rating: 4.95,
      experience: "15 yrs",
      plateNumber: "TN 38 BK 2121",
    },
    capacity: 52,
    occupancy: 46,
    status: "active",
    waypoints: [
      { name: "Pollachi Central Stand", lat: 10.658, lng: 77.009, time: "07:05 AM", etaMin: 55 },
      { name: "Kinathukadavu Bus Stop", lat: 10.82, lng: 77.019, time: "07:25 AM", etaMin: 38 },
      { name: "Malumichampatti", lat: 10.895, lng: 76.992, time: "07:38 AM", etaMin: 28 },
      { name: "Eachanari Temple", lat: 10.927, lng: 76.969, time: "07:46 AM", etaMin: 22 },
      { name: "Sundarapuram Junction", lat: 10.957, lng: 76.97, time: "07:53 AM", etaMin: 17 },
      { name: "Podanur Railway Junction", lat: 10.963, lng: 76.996, time: "08:00 AM", etaMin: 12 },
      { name: "Vellalore Bus Stop", lat: 10.97, lng: 77.03, time: "08:08 AM", etaMin: 6 },
      { name: "KIT College Campus", lat: 10.9922, lng: 77.0864, time: "08:18 AM", etaMin: 0 },
    ],
  },
  {
    id: "bus8",
    number: "08",
    name: "Bus 08 (Mettupalayam & Thudiyalur)",
    route: "Mettupalayam → Karamadai → Thudiyalur → Gandhipuram → KIT College",
    driver: {
      name: "Senthil Nathan",
      phone: "+91 96551 22808",
      rating: 4.75,
      experience: "11 yrs",
      plateNumber: "TN 38 BK 0808",
    },
    capacity: 52,
    occupancy: 38,
    status: "active",
    waypoints: [
      { name: "Mettupalayam Old Stand", lat: 11.3, lng: 76.94, time: "07:00 AM", etaMin: 60 },
      { name: "Karamadai Bus Stop", lat: 11.24, lng: 76.96, time: "07:12 AM", etaMin: 48 },
      { name: "Periyanaickenpalayam", lat: 11.14, lng: 76.942, time: "07:26 AM", etaMin: 36 },
      { name: "Thudiyalur Junction", lat: 11.08, lng: 76.94, time: "07:38 AM", etaMin: 26 },
      { name: "Saibaba Colony", lat: 11.025, lng: 76.945, time: "07:49 AM", etaMin: 18 },
      { name: "Gandhipuram", lat: 11.0168, lng: 76.9558, time: "07:56 AM", etaMin: 13 },
      { name: "Singanallur", lat: 10.9992, lng: 77.027, time: "08:08 AM", etaMin: 6 },
      { name: "KIT College Campus", lat: 10.9922, lng: 77.0864, time: "08:18 AM", etaMin: 0 },
    ],
  },
  {
    id: "bus5",
    number: "05",
    name: "Bus 05 (Tirupur & Sulur Line)",
    route: "Tirupur → Palladam → Karanampettai → Sulur → KIT College",
    driver: {
      name: "Arun Prakash",
      phone: "+91 98940 33505",
      rating: 4.85,
      experience: "8 yrs",
      plateNumber: "TN 38 BK 0505",
    },
    capacity: 52,
    occupancy: 44,
    status: "active",
    waypoints: [
      { name: "Tirupur Old Bus Stand", lat: 11.1085, lng: 77.3411, time: "07:10 AM", etaMin: 50 },
      { name: "Palladam Bus Stand", lat: 11.002, lng: 77.28, time: "07:30 AM", etaMin: 32 },
      { name: "Karanampettai", lat: 10.995, lng: 77.16, time: "07:45 AM", etaMin: 19 },
      { name: "Sulur Air Base / Stand", lat: 10.993, lng: 77.126, time: "07:55 AM", etaMin: 10 },
      { name: "Ravathur Pirivu", lat: 10.9925, lng: 77.1, time: "08:04 AM", etaMin: 4 },
      { name: "KIT College Campus", lat: 10.9922, lng: 77.0864, time: "08:12 AM", etaMin: 0 },
    ],
  },
  {
    id: "bus3",
    number: "03",
    name: "Bus 03 (RS Puram & Town Hall Line)",
    route: "RS Puram → Town Hall → Ukkadam → Sungam → Singanallur → KIT College",
    driver: {
      name: "Dhanapal M.",
      phone: "+91 99420 11303",
      rating: 4.9,
      experience: "14 yrs",
      plateNumber: "TN 38 BK 0303",
    },
    capacity: 52,
    occupancy: 29,
    status: "active",
    waypoints: [
      { name: "RS Puram Post Office", lat: 11.008, lng: 76.945, time: "07:35 AM", etaMin: 32 },
      { name: "Town Hall Clock Tower", lat: 10.998, lng: 76.96, time: "07:42 AM", etaMin: 26 },
      { name: "Ukkadam Bus Stand", lat: 10.99, lng: 76.961, time: "07:48 AM", etaMin: 22 },
      { name: "Sungam Bypass", lat: 10.994, lng: 76.98, time: "07:54 AM", etaMin: 17 },
      { name: "Ramanathapuram", lat: 10.991, lng: 76.986, time: "08:00 AM", etaMin: 12 },
      { name: "Singanallur", lat: 10.9992, lng: 77.027, time: "08:08 AM", etaMin: 6 },
      { name: "KIT College Campus", lat: 10.9922, lng: 77.0864, time: "08:18 AM", etaMin: 0 },
    ],
  },
  {
    id: "bus18",
    number: "18",
    name: "Bus 18 (Annur & Karumathampatti Line)",
    route: "Annur → Karumathampatti → Neelambur → Sulur RTO → KIT College",
    driver: {
      name: "Velusamy T.",
      phone: "+91 97500 66818",
      rating: 4.8,
      experience: "10 yrs",
      plateNumber: "TN 38 BK 1818",
    },
    capacity: 52,
    occupancy: 35,
    status: "active",
    waypoints: [
      { name: "Annur Bus Stand", lat: 11.233, lng: 77.108, time: "07:15 AM", etaMin: 45 },
      { name: "Karumathampatti", lat: 11.055, lng: 77.17, time: "07:35 AM", etaMin: 28 },
      { name: "Neelambur Bypass", lat: 11.045, lng: 77.08, time: "07:48 AM", etaMin: 18 },
      { name: "Sulur RTO Junction", lat: 10.998, lng: 77.115, time: "07:58 AM", etaMin: 9 },
      { name: "KIT College Campus", lat: 10.9922, lng: 77.0864, time: "08:12 AM", etaMin: 0 },
    ],
  },
];

const users = [
  {
    id: "u1",
    name: "Janani Student",
    email: "student@campusbus.local",
    password: bcrypt.hashSync("Student123!", 10),
    role: "student",
    busId: "bus12",
  },
  {
    id: "u2",
    name: "Driver Kumarasamy",
    email: "driver@campusbus.local",
    password: bcrypt.hashSync("Driver123!", 10),
    role: "driver",
    busId: "bus12",
  },
  {
    id: "u3",
    name: "Transport Admin",
    email: "admin@campusbus.local",
    password: bcrypt.hashSync("Admin123!", 10),
    role: "admin",
  },
];

// Telemetry state store
const locations = new Map();
const simProgress = new Map();

// Initialize initial bus locations along their routes
buses.forEach((b) => {
  const startWp = b.waypoints[2] || b.waypoints[0];
  locations.set(b.id, {
    busId: b.id,
    lat: startWp.lat,
    lng: startWp.lng,
    accuracy: 4.5,
    speed: 38 + Math.floor(Math.random() * 12),
    heading: 105,
    currentStopIndex: 2,
    nextStop: b.waypoints[3]?.name || b.waypoints[b.waypoints.length - 1].name,
    updatedAt: new Date().toISOString(),
  });
  simProgress.set(b.id, { segIdx: 2, t: 0.35, forward: true });
});

// Real-time smooth GPS simulation engine for realistic tracking
setInterval(() => {
  buses.forEach((b) => {
    if (b.status !== "active") return;
    const wps = b.waypoints;
    if (!wps || wps.length < 2) return;

    let sim = simProgress.get(b.id) || { segIdx: 0, t: 0, forward: true };
    const step = 0.025; // Smooth incremental movement

    if (sim.forward) {
      sim.t += step;
      if (sim.t >= 1) {
        sim.t = 0;
        sim.segIdx += 1;
        if (sim.segIdx >= wps.length - 1) {
          sim.forward = false;
          sim.segIdx = wps.length - 2;
          sim.t = 1;
        }
      }
    } else {
      sim.t -= step;
      if (sim.t <= 0) {
        sim.t = 1;
        sim.segIdx -= 1;
        if (sim.segIdx < 0) {
          sim.forward = true;
          sim.segIdx = 0;
          sim.t = 0;
        }
      }
    }

    simProgress.set(b.id, sim);

    const from = wps[sim.segIdx];
    const to = wps[sim.segIdx + 1];
    const lat = from.lat + (to.lat - from.lat) * sim.t;
    const lng = from.lng + (to.lng - from.lng) * sim.t;

    // Calculate heading in degrees
    const dLng = to.lng - from.lng;
    const dLat = to.lat - from.lat;
    let heading = Math.round((Math.atan2(dLng, dLat) * 180) / Math.PI);
    if (!sim.forward) heading = (heading + 180) % 360;
    if (heading < 0) heading += 360;

    const speed = 32 + Math.sin(Date.now() / 3000 + sim.segIdx) * 14;
    const currentStopIndex = sim.forward ? sim.segIdx : sim.segIdx + 1;
    const nextStop = sim.forward ? to.name : from.name;

    const loc = {
      busId: b.id,
      lat: Number(lat.toFixed(6)),
      lng: Number(lng.toFixed(6)),
      accuracy: 3.8 + Math.random() * 2,
      speed: Math.max(15, Math.round(speed)),
      heading,
      currentStopIndex,
      nextStop,
      updatedAt: new Date().toISOString(),
    };

    locations.set(b.id, loc);
    io.to(`bus:${b.id}`).emit("location:update", loc);
    io.emit("admin:location", loc);
  });
}, 1500);

function auth(req, res, next) {
  const token = (req.headers.authorization || "").replace("Bearer ", "");
  try {
    req.user = jwt.verify(token, SECRET);
    next();
  } catch {
    return res.status(401).json({ message: "Unauthorized access" });
  }
}

app.get("/api/health", (req, res) =>
  res.json({
    ok: true,
    campus: KIT_CAMPUS.name,
    activeFleet: buses.length,
    mongoConnected,
    time: new Date(),
  })
);

app.post("/api/auth/login", async (req, res) => {
  const { email, password } = req.body;
  const u = users.find((x) => x.email === email);
  if (!u || !(await bcrypt.compare(password, u.password))) {
    return res.status(401).json({ message: "Invalid credentials. Please select a valid role preset." });
  }
  const token = jwt.sign(
    { id: u.id, name: u.name, role: u.role, busId: u.busId },
    SECRET,
    { expiresIn: "12h" }
  );
  res.json({
    token,
    user: { id: u.id, name: u.name, email: u.email, role: u.role, busId: u.busId },
  });
});

app.get("/api/buses", auth, (req, res) => {
  res.json(
    buses.map((b) => ({
      ...b,
      stops: b.waypoints.map((w) => w.name),
      lastLocation: locations.get(b.id) || null,
    }))
  );
});

app.get("/api/buses/:id", auth, (req, res) => {
  const b = buses.find((x) => x.id === req.params.id);
  if (!b) return res.status(404).json({ message: "Bus not found" });
  res.json({
    ...b,
    stops: b.waypoints.map((w) => w.name),
    lastLocation: locations.get(b.id) || null,
  });
});

app.post("/api/trips/start", auth, (req, res) => {
  if (req.user.role !== "driver") return res.status(403).json({ message: "Drivers only" });
  const b = buses.find((x) => x.id === req.user.busId);
  if (!b) return res.status(404).json({ message: "No assigned bus" });
  b.status = "active";
  io.emit("trip:status", { busId: b.id, status: "active" });
  res.json({ message: "Trip started", bus: b });
});

app.post("/api/trips/stop", auth, (req, res) => {
  if (req.user.role !== "driver") return res.status(403).json({ message: "Drivers only" });
  const b = buses.find((x) => x.id === req.user.busId);
  if (b) b.status = "inactive";
  io.emit("trip:status", { busId: b?.id, status: "inactive" });
  res.json({ message: "Trip stopped" });
});

app.get("/api/location/:busId", auth, (req, res) =>
  res.json(locations.get(req.params.busId) || null)
);

// Campus announcements & Traffic updates feed
app.get("/api/announcements", auth, (req, res) => {
  res.json([
    {
      id: "a1",
      title: "Trichy Road - Singanallur Traffic Clear",
      type: "traffic",
      time: "Just now",
      desc: "Traffic is flowing smoothly near Ondipudur Flyover towards KIT Campus.",
    },
    {
      id: "a2",
      title: "Coimbatore Weather • Kannampalayam",
      type: "weather",
      time: "2 mins ago",
      desc: "28°C • Clear skies and optimal transit conditions across all routes.",
    },
    {
      id: "a3",
      title: "KIT Transport Advisory",
      type: "info",
      time: "10 mins ago",
      desc: "All KIT college buses are equipped with high-precision GPS tracking & RFID attendance.",
    },
  ]);
});

// SOS Emergency alert endpoint
app.post("/api/emergency/sos", auth, (req, res) => {
  const { busId, stopName, message } = req.body;
  const alert = {
    id: "sos_" + Date.now(),
    studentName: req.user.name,
    studentId: req.user.id,
    busId: busId || "bus12",
    stopName: stopName || "Coimbatore Transit",
    message: message || "Immediate campus security assistance requested.",
    time: new Date().toISOString(),
  };
  io.emit("admin:sos", alert);
  res.json({
    ok: true,
    message: "SOS alert broadcasted to KIT Campus Security Control Room (+91 422 2367890).",
    alert,
  });
});

io.on("connection", (socket) => {
  socket.on("bus:join", (busId) => socket.join(`bus:${busId}`));
  socket.on("location:update", (data) => {
    if (!data?.busId || typeof data.lat !== "number" || typeof data.lng !== "number") return;
    const loc = {
      busId: data.busId,
      lat: data.lat,
      lng: data.lng,
      accuracy: data.accuracy || 5,
      speed: data.speed || 35,
      heading: data.heading || 0,
      updatedAt: new Date().toISOString(),
    };
    locations.set(data.busId, loc);
    const b = buses.find((x) => x.id === data.busId);
    if (b) b.status = "active";
    io.to(`bus:${data.busId}`).emit("location:update", loc);
    io.emit("admin:location", loc);
  });
});

server.listen(PORT, () =>
  console.log(`KIT CampusBus Real-Time API running on http://localhost:${PORT}`)
);