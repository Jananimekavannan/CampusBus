# CampusBus Professional

Real-time college bus tracking prototype.

## Features
- Student, Driver and Admin demo roles
- Real GPS capture from the driver's phone/browser
- Socket.IO real-time location broadcasting
- Live Leaflet + OpenStreetMap map
- Start/stop trip
- Route and trip status
- JWT authentication
- MongoDB persistence when configured
- In-memory fallback for quick demonstration

## Run

### Backend
cd backend
npm install
npm run dev

### Frontend (new terminal)
cd frontend
npm install
npm run dev

Open the frontend URL printed by Vite.

## Real GPS demo
1. Open the frontend on a GPS-capable phone using HTTPS (or localhost during development).
2. Login as Driver.
3. Click Start Trip and allow location permission.
4. Open the Student dashboard in another browser/device.
5. Select the same bus to see live updates.

For LAN testing, expose the backend/frontend through HTTPS because mobile browsers generally require a secure context for geolocation.

## Demo credentials
- Student: student@campusbus.local / Student123!
- Driver: driver@campusbus.local / Driver123!
- Admin: admin@campusbus.local / Admin123!

MongoDB is optional. Set MONGO_URI in backend/.env for persistent data.
