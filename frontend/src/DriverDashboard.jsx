import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import CoimbatoreTransitMap from "./CoimbatoreTransitMap";
import kitLogo from "./assets/kit-logo.png";

const API = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function DriverDashboard({
  sess,
  logout,
  buses,
  timeMode,
  setTimeMode,
  socket,
}) {
  const userBusId = sess.user.busId || "bus12";
  const bus = buses.find((b) => b.id === userBusId) || buses[0];

  const [tripStatus, setTripStatus] = useState(bus?.status || "active");
  const [location, setLocation] = useState(bus?.lastLocation || null);
  const [gpsBroadcasting, setGpsBroadcasting] = useState(false);
  const [occupancy, setOccupancy] = useState(bus?.occupancy || 34);
  const [currentStopIdx, setCurrentStopIdx] = useState(location?.currentStopIndex || 2);
  const [notice, setNotice] = useState("");
  const [activeDriverTab, setActiveDriverTab] = useState("cockpit"); // 'cockpit', 'manifest', 'incident'
  const [delayNotice, setDelayNotice] = useState("");
  const [incidentSent, setIncidentSent] = useState(false);

  const watchId = useRef(null);
  const waypoints = bus?.waypoints || [];
  const currentStop = waypoints[currentStopIdx] || waypoints[0];
  const nextStop = waypoints[currentStopIdx + 1] || waypoints[waypoints.length - 1];

  const headers = { Authorization: "Bearer " + sess.token };

  useEffect(() => {
    socket.emit("bus:join", userBusId);
    socket.on("location:update", (loc) => {
      if (loc.busId === userBusId) {
        setLocation(loc);
        if (loc.currentStopIndex !== undefined) {
          setCurrentStopIdx(loc.currentStopIndex);
        }
      }
    });

    return () => {
      socket.off("location:update");
    };
  }, [userBusId, socket]);

  // Start Trip
  const handleStartTrip = async () => {
    try {
      await axios.post(`${API}/api/trips/start`, {}, { headers });
      setTripStatus("active");
      setNotice("Trip started. GPS Telemetry broadcasting to student network.");
      startDeviceGps();
    } catch (e) {
      setNotice(e.response?.data?.message || "Failed to start trip.");
    }
  };

  // Stop Trip
  const handleStopTrip = async () => {
    try {
      await axios.post(`${API}/api/trips/stop`, {}, { headers });
      setTripStatus("inactive");
      setNotice("Trip ended. Bus marked Standby at KIT Campus.");
      stopDeviceGps();
    } catch (e) {
      setNotice("Failed to stop trip.");
    }
  };

  // Start HTML5 Device GPS Broadcast
  const startDeviceGps = () => {
    if (!navigator.geolocation) {
      setNotice("Device does not support GPS Geolocation. Using onboard autopilot.");
      return;
    }
    setGpsBroadcasting(true);
    watchId.current = navigator.geolocation.watchPosition(
      (pos) => {
        const payload = {
          busId: userBusId,
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
          accuracy: pos.coords.accuracy,
          speed: pos.coords.speed ? Math.round(pos.coords.speed * 3.6) : 38,
          heading: pos.coords.heading || 105,
          currentStopIndex: currentStopIdx,
          nextStop: nextStop?.name,
        };
        socket.emit("location:update", payload);
      },
      (err) => {
        console.warn("GPS error:", err.message);
      },
      { enableHighAccuracy: true, maximumAge: 3000, timeout: 10000 }
    );
  };

  const stopDeviceGps = () => {
    if (watchId.current !== null) {
      navigator.geolocation.clearWatch(watchId.current);
      watchId.current = null;
    }
    setGpsBroadcasting(false);
  };

  // Advance to next stop
  const handleDepartStop = () => {
    if (currentStopIdx < waypoints.length - 1) {
      const nextIdx = currentStopIdx + 1;
      setCurrentStopIdx(nextIdx);
      const target = waypoints[nextIdx];
      const payload = {
        busId: userBusId,
        lat: target.lat,
        lng: target.lng,
        accuracy: 3.5,
        speed: 36,
        heading: 105,
        currentStopIndex: nextIdx,
        nextStop: waypoints[nextIdx + 1]?.name || "KIT College Campus",
      };
      socket.emit("location:update", payload);
      setNotice(`Arrived at: ${target.name}. Students notified.`);
    }
  };

  // Report Delay / Incident
  const handleReportIncident = (type) => {
    setIncidentSent(true);
    socket.emit("admin:incident", {
      busId: userBusId,
      driverName: sess.user.name,
      type,
      note: delayNotice || `${type} reported near ${currentStop?.name}`,
      time: new Date().toISOString(),
    });
    setTimeout(() => {
      setIncidentSent(false);
      setDelayNotice("");
    }, 4000);
  };

  return (
    <div className={`app-container driver-theme ${timeMode}`}>
      {/* Driver Left Sidebar */}
      <aside className="sidebar-nav driver-sidebar">
        <div className="sidebar-brand-box">
          <div className="brand-logo-container">
            <div className="brand-logo-glow" />
            <img
              src={kitLogo}
              alt="KIT Coimbatore Emblem"
              className="brand-logo-img"
            />
          </div>
          <div className="brand-titles">
            <h2>KIT COIMBATORE</h2>
            <p>Driver Telemetry Handset</p>
          </div>
        </div>

        {/* Driver Profile Tag */}
        <div className="user-profile-badge driver-badge">
          <div className="user-avatar-circle driver-avatar">👨‍✈️</div>
          <div className="user-profile-info">
            <b>{sess.user.name}</b>
            <span className="role-tag driver">DRIVER • {bus?.number || "12"}</span>
          </div>
        </div>

        {/* Driver Navigation Tabs */}
        <nav className="nav-menu">
          <button
            className={`nav-item ${activeDriverTab === "cockpit" ? "active" : ""}`}
            onClick={() => setActiveDriverTab("cockpit")}
          >
            <span className="nav-icon">🎮</span>
            <span>Cockpit & GPS</span>
          </button>
          <button
            className={`nav-item ${activeDriverTab === "manifest" ? "active" : ""}`}
            onClick={() => setActiveDriverTab("manifest")}
          >
            <span className="nav-icon">👥</span>
            <span>Passenger RFID</span>
          </button>
          <button
            className={`nav-item ${activeDriverTab === "incident" ? "active" : ""}`}
            onClick={() => setActiveDriverTab("incident")}
          >
            <span className="nav-icon">⚠️</span>
            <span>Traffic & Incident</span>
          </button>
        </nav>

        {/* Vehicle Quick Info */}
        <div className="driver-vehicle-mini-box">
          <small>Assigned Vehicle</small>
          <b>{bus?.name}</b>
          <div className="vehicle-plate-pill">
            {bus?.driver?.plateNumber || "TN 38 BK 1212"}
          </div>
        </div>

        <button className="sidebar-logout-btn" onClick={logout}>
          <span>🚪</span> Sign Out
        </button>
      </aside>

      {/* Driver Main Workspace */}
      <main className="main-content-scroll driver-main">
        {/* Driver Top Header */}
        <header className="dashboard-top-header driver-header">
          <div>
            <span className="driver-eyebrow">KIT FLEET DRIVER HANDSET • ROUTE #{bus?.number}</span>
            <h1>{bus?.name} Telemetry Console</h1>
            <p className="driver-route-desc">
              📍 {bus?.route || "Gandhipuram → Peelamedu → KIT College Campus"}
            </p>
          </div>

          <div className="header-actions">
            {/* Day / Night Switcher */}
            <div className="theme-toggle-pill">
              <button
                className={`theme-toggle-btn ${timeMode === "day" ? "active" : ""}`}
                onClick={() => setTimeMode("day")}
                title="Day Mode"
              >
                ☀️
              </button>
              <button
                className={`theme-toggle-btn ${timeMode === "night" ? "active" : ""}`}
                onClick={() => setTimeMode("night")}
                title="Night Mode"
              >
                🌙
              </button>
            </div>

            {/* Trip Status Pill */}
            <div className={`driver-trip-status-pill ${tripStatus}`}>
              <span className={`pulse-dot ${tripStatus === "active" ? "active" : ""}`} />
              <span>{tripStatus === "active" ? "TRIP IN PROGRESS" : "TRIP STANDBY"}</span>
            </div>
          </div>
        </header>

        {notice && (
          <div className="notice-banner driver-notice">
            <span>🔔</span> {notice}
          </div>
        )}

        {/* TAB 1: DRIVER COCKPIT & LIVE GPS BROADCAST */}
        {activeDriverTab === "cockpit" && (
          <div className="tab-pane-fade-in">
            {/* Big Touch Action Banner for Driver */}
            <div className="driver-action-hero-card">
              <div className="hero-status-col">
                <div className="hero-status-indicator">
                  <span className="hero-status-icon">
                    {tripStatus === "active" ? "🟢" : "⚪"}
                  </span>
                  <div>
                    <h3>
                      {tripStatus === "active"
                        ? "Broadcasting Live Fleet Telemetry"
                        : "Ready to Depart from Starting Depot"}
                    </h3>
                    <p>
                      {tripStatus === "active"
                        ? "GPS coordinates are synchronizing in real-time with all student portals."
                        : "Click Start Trip to broadcast coordinates and enable live ETA countdowns."}
                    </p>
                  </div>
                </div>
              </div>

              <div className="hero-btn-col">
                {tripStatus === "active" ? (
                  <button
                    className="driver-btn-stop"
                    onClick={handleStopTrip}
                  >
                    ⏹️ End Trip & Park Bus
                  </button>
                ) : (
                  <button
                    className="driver-btn-start"
                    onClick={handleStartTrip}
                  >
                    🚀 Start Trip & Broadcast GPS
                  </button>
                )}
              </div>
            </div>

            {/* Telemetry Gauge Cards (Speed, Next Stop, Occupancy Counter) */}
            <div className="driver-telemetry-strip">
              {/* 1. Cruising Speedometer */}
              <div className="driver-stat-card">
                <div className="stat-card-head">
                  <span className="icon">🏎️</span>
                  <small>Vehicle Speed</small>
                </div>
                <div className="stat-card-value">
                  <b>{location?.speed || 38}</b>
                  <span>km/h</span>
                </div>
                <div className="stat-card-foot">
                  <span>GPS Accuracy: ±{Math.round(location?.accuracy || 4)}m</span>
                </div>
              </div>

              {/* 2. Waypoint Progression */}
              <div className="driver-stat-card current-stop-card">
                <div className="stat-card-head">
                  <span className="icon">📍</span>
                  <small>Current / Next Stop</small>
                </div>
                <div className="stat-stop-name">
                  <b>{currentStop?.name}</b>
                  <span className="next-arrow">➔ Next: {nextStop?.name}</span>
                </div>
                <button
                  className="depart-stop-btn"
                  onClick={handleDepartStop}
                >
                  Depart Stop ➔
                </button>
              </div>

              {/* 3. Passenger Counter with Touch Controls */}
              <div className="driver-stat-card">
                <div className="stat-card-head">
                  <span className="icon">💺</span>
                  <small>Passenger Count</small>
                </div>
                <div className="stat-card-value">
                  <b>{occupancy}</b>
                  <span>/ {bus?.capacity || 52}</span>
                </div>
                <div className="occupancy-touch-controls">
                  <button
                    className="occ-btn"
                    onClick={() => setOccupancy((p) => Math.max(0, p - 1))}
                  >
                    - 1
                  </button>
                  <button
                    className="occ-btn add"
                    onClick={() =>
                      setOccupancy((p) =>
                        Math.min(bus?.capacity || 52, p + 1)
                      )
                    }
                  >
                    + 1 Boarded
                  </button>
                </div>
              </div>
            </div>

            {/* Live Interactive Coimbatore Map for Driver */}
            <div className="driver-map-container">
              <div className="driver-map-head">
                <h3>🗺️ Route Transit Map & Real-Time Tracking</h3>
                <span className="map-badge">KIT Kannampalayam Corridor</span>
              </div>
              <CoimbatoreTransitMap
                bus={bus}
                location={location}
                timeMode={timeMode}
              />
            </div>
          </div>
        )}

        {/* TAB 2: PASSENGER MANIFEST & RFID LOG */}
        {activeDriverTab === "manifest" && (
          <div className="tab-pane-fade-in driver-manifest-panel">
            <div className="manifest-header-row">
              <div>
                <h2>Student Passenger Manifest & RFID Tap-Ins</h2>
                <p>Real-time automated boarding logs from onboard RFID card reader</p>
              </div>
              <div className="manifest-stats-chip">
                <b>{occupancy} Students Onboard</b>
              </div>
            </div>

            <div className="manifest-table-card">
              <table className="driver-manifest-table">
                <thead>
                  <tr>
                    <th>Student ID</th>
                    <th>Student Name</th>
                    <th>Boarding Stop</th>
                    <th>Tap Time</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td><b>KIT24CS104</b></td>
                    <td>Janani Student</td>
                    <td>Peelamedu / PSG Tech</td>
                    <td>07:51 AM</td>
                    <td><span className="badge-boarded">● Boarded</span></td>
                  </tr>
                  <tr>
                    <td><b>KIT24AI042</b></td>
                    <td>Karthik Raja</td>
                    <td>Lakshmi Mills Junction</td>
                    <td>07:40 AM</td>
                    <td><span className="badge-boarded">● Boarded</span></td>
                  </tr>
                  <tr>
                    <td><b>KIT24ME088</b></td>
                    <td>Praveen Kumar</td>
                    <td>Gandhipuram Central Stand</td>
                    <td>07:32 AM</td>
                    <td><span className="badge-boarded">● Boarded</span></td>
                  </tr>
                  <tr>
                    <td><b>KIT24EC019</b></td>
                    <td>Sneha M.</td>
                    <td>Singanallur Bus Stand</td>
                    <td>Expected 08:04 AM</td>
                    <td><span className="badge-waiting">🕒 Waiting</span></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 3: TRAFFIC ALERT & INCIDENT REPORTING */}
        {activeDriverTab === "incident" && (
          <div className="tab-pane-fade-in driver-incident-panel">
            <h2>Driver Incident & Road Condition Dispatch</h2>
            <p className="incident-sub">
              Quickly alert the KIT Transport Office and students of road delays,
              heavy traffic, or mechanical assistance.
            </p>

            {incidentSent ? (
              <div className="driver-incident-success">
                <span>✓</span>
                <h3>Incident Dispatched to Transport Room!</h3>
                <p>All waiting students on Route {bus?.number} have received the travel alert.</p>
              </div>
            ) : (
              <div className="incident-dispatch-grid">
                <div className="quick-incident-buttons">
                  <button
                    className="inc-btn traffic"
                    onClick={() => handleReportIncident("Traffic Congestion")}
                  >
                    🚦 Heavy Traffic (+10 min delay)
                  </button>
                  <button
                    className="inc-btn breakdown"
                    onClick={() => handleReportIncident("Vehicle Breakdown")}
                  >
                    🔧 Mechanical Breakdown / Tire
                  </button>
                  <button
                    className="inc-btn weather"
                    onClick={() => handleReportIncident("Heavy Rain / Weather")}
                  >
                    🌧️ Heavy Rain / Slow Moving
                  </button>
                  <button
                    className="inc-btn sos"
                    onClick={() => handleReportIncident("Driver Emergency")}
                  >
                    🚨 Urgent Security / Emergency
                  </button>
                </div>

                <div className="custom-incident-box">
                  <label>Custom Route Advisory / Message:</label>
                  <textarea
                    rows={4}
                    placeholder="e.g. Ondipudur signal blocked by roadwork, diverting via Irugur..."
                    value={delayNotice}
                    onChange={(e) => setDelayNotice(e.target.value)}
                  />
                  <button
                    className="broadcast-incident-btn"
                    onClick={() => handleReportIncident("Route Advisory")}
                  >
                    📢 Broadcast Alert to Transport Office
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
