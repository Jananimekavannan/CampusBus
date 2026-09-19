import React, { useEffect, useMemo, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import { io } from "socket.io-client";
import axios from "axios";
import SplashScreen from "./SplashScreen";
import RevolvingBusRoad from "./RevolvingBusRoad";
import AmbientBackground from "./AmbientBackground";
import LiveHeaderTimeWeather from "./LiveHeaderTimeWeather";
import CoimbatoreTransitMap from "./CoimbatoreTransitMap";
import StudentTelemetryWidget from "./StudentTelemetryWidget";
import RoutesExplorerView from "./RoutesExplorerView";
import TransitAdvisoryView from "./TransitAdvisoryView";
import BusScheduleView from "./BusScheduleView";
import DriverDashboard from "./DriverDashboard";
import AdminDashboard from "./AdminDashboard";
import SosModal from "./SosModal";
import StudentMessageModal from "./StudentMessageModal";
import kitLogo from "./assets/kit-logo.png";
import "./styles.css";
import "leaflet/dist/leaflet.css";

const API = import.meta.env.VITE_API_URL || "http://localhost:5000";

const ROLE_PRESETS = {
  student: {
    name: "Student",
    icon: "🎓",
    email: "student@campusbus.local",
    pass: "Student123!",
    badge: "Student Portal • Live GPS Tracking",
  },
  driver: {
    name: "Driver",
    icon: "🚌",
    email: "driver@campusbus.local",
    pass: "Driver123!",
    badge: "Driver Handset • GPS Broadcast",
  },
  admin: {
    name: "Admin",
    icon: "🛡️",
    email: "admin@campusbus.local",
    pass: "Admin123!",
    badge: "Transport Admin • Fleet Control",
  },
};

function Login({ onLogin, timeMode, setTimeMode }) {
  const [activeRole, setActiveRole] = useState("student");
  const [email, setEmail] = useState("student@campusbus.local");
  const [password, setPassword] = useState("Student123!");
  const [showPassword, setShowPassword] = useState(false);
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRoleSelect = (roleKey) => {
    setActiveRole(roleKey);
    setEmail(ROLE_PRESETS[roleKey].email);
    setPassword(ROLE_PRESETS[roleKey].pass);
    setErr("");
  };

  async function submit(e) {
    e.preventDefault();
    setLoading(true);
    setErr("");
    try {
      const r = await axios.post(`${API}/api/auth/login`, { email, password });
      onLogin(r.data);
    } catch (error) {
      setErr(
        error.response?.data?.message ||
          "Cannot connect to KIT backend server. Please verify backend."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={`login-page ${timeMode}`}>
      {/* Animated Ambient Background (Aurora Mesh Orbs, Cyber Grid & Laser Radar) */}
      <AmbientBackground timeMode={timeMode} />

      {/* Revolving Road & Revolving KIT Bus encircling the login box */}
      <RevolvingBusRoad timeMode={timeMode} />

      {/* Top Bar: Day / Night Switcher */}
      <div className="login-topbar">
        <div className="theme-pill-group">
          <button
            type="button"
            className={`theme-pill-btn ${timeMode === "day" ? "active" : ""}`}
            onClick={() => setTimeMode("day")}
            title="Daylight View"
          >
            ☀️ Day
          </button>
          <button
            type="button"
            className={`theme-pill-btn ${timeMode === "night" ? "active" : ""}`}
            onClick={() => setTimeMode("night")}
            title="Night View"
          >
            🌙 Night
          </button>
        </div>
      </div>

      {/* Center Hero: Login Card with Integrated Clean Fitted Logo */}
      <div className="login-center-wrapper">
        <div className="login-card">
          <div className="login-header-logo-badge">
            <img src={kitLogo} alt="KIT Coimbatore Logo" className="login-kit-logo-img" />
          </div>
          <span className="institution-tag">KIT COIMBATORE</span>
          <h1>KITBusMiss Portal</h1>
          <p className="subtitle">
            Real-Time Campus Fleet Intelligence & GPS Tracking
          </p>

          {/* Role Switcher Tabs (Student, Driver, Admin) */}
          <div className="role-tabs-segmented">
            <button
              type="button"
              className={`role-tab-btn ${activeRole === "student" ? "active" : ""}`}
              onClick={() => handleRoleSelect("student")}
            >
              <span className="role-tab-icon">🎓</span>
              <span>Student</span>
            </button>
            <button
              type="button"
              className={`role-tab-btn ${activeRole === "driver" ? "active" : ""}`}
              onClick={() => handleRoleSelect("driver")}
            >
              <span className="role-tab-icon">🚌</span>
              <span>Driver</span>
            </button>
            <button
              type="button"
              className={`role-tab-btn ${activeRole === "admin" ? "active" : ""}`}
              onClick={() => handleRoleSelect("admin")}
            >
              <span className="role-tab-icon">🛡️</span>
              <span>Admin</span>
            </button>
          </div>

          <form className="login-form" onSubmit={submit}>
            <div className="input-field-group">
              <label htmlFor="emailInput">
                <span>📧</span> {ROLE_PRESETS[activeRole].name} Email
              </label>
              <div className="input-with-icon">
                <input
                  id="emailInput"
                  type="email"
                  required
                  placeholder="name@campusbus.local"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div className="input-field-group">
              <label htmlFor="passwordInput">
                <span>🔒</span> Password
              </label>
              <div className="input-with-icon">
                <input
                  id="passwordInput"
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  className="pwd-toggle-btn"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? "👁️" : "🙈"}
                </button>
              </div>
            </div>

            {err && (
              <div className="error-banner">
                <span>⚠️</span>
                <span>{err}</span>
              </div>
            )}

            <button type="submit" className="submit-btn" disabled={loading}>
              {loading ? (
                <>
                  <div className="btn-spinner" />
                  <span>Authenticating...</span>
                </>
              ) : (
                <>
                  <span>Sign In as {ROLE_PRESETS[activeRole].name}</span>
                  <span>➔</span>
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [timeMode, setTimeMode] = useState("night");
  const [sess, setSess] = useState(() =>
    JSON.parse(localStorage.getItem("campusbus_session") || "null")
  );

  const login = (x) => {
    localStorage.setItem("campusbus_session", JSON.stringify(x));
    setSess(x);
  };

  const logout = () => {
    localStorage.removeItem("campusbus_session");
    setSess(null);
  };

  // Show animated KITBusMiss splash loader on initial load
  if (showSplash && !sess) {
    return <SplashScreen onFinish={() => setShowSplash(false)} />;
  }

  if (!sess) {
    return (
      <Login
        onLogin={login}
        timeMode={timeMode}
        setTimeMode={setTimeMode}
      />
    );
  }

  return (
    <Dashboard
      sess={sess}
      logout={logout}
      timeMode={timeMode}
      setTimeMode={setTimeMode}
    />
  );
}

function Dashboard({ sess, logout, timeMode, setTimeMode }) {
  const [buses, setBuses] = useState([]);
  const [selected, setSelected] = useState(sess.user.busId || "bus12");
  const [location, setLocation] = useState(null);
  const [trip, setTrip] = useState("active");
  const [notice, setNotice] = useState("");
  const [selectedStop, setSelectedStop] = useState(null);
  const [isSosOpen, setIsSosOpen] = useState(false);
  const [isMsgModalOpen, setIsMsgModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("tracking"); // 'tracking', 'routes', 'announcements', 'schedule', 'admin'

  const headers = useMemo(
    () => ({ Authorization: "Bearer " + sess.token }),
    [sess.token]
  );
  const socket = useMemo(() => io(API, { autoConnect: true }), []);

  useEffect(() => {
    axios
      .get(`${API}/api/buses`, { headers })
      .then((r) => {
        setBuses(r.data);
        const b = r.data.find((x) => x.id === selected);
        if (b) {
          setTrip(b.status || "active");
          setLocation(b.lastLocation);
          if (b.waypoints && b.waypoints.length > 0) {
            setSelectedStop(b.waypoints[3] || b.waypoints[0]);
          }
        }
      })
      .catch(() => setNotice("Backend connection unavailable."));

    return () => socket.disconnect();
  }, [headers, selected, socket]);

  useEffect(() => {
    socket.emit("bus:join", selected);
    socket.on("location:update", (x) => {
      if (x.busId === selected) setLocation(x);
    });
    socket.on("trip:status", (x) => {
      if (x.busId === selected) setTrip(x.status);
    });
    return () => {
      socket.off("location:update");
      socket.off("trip:status");
    };
  }, [selected, socket]);

  const bus = buses.find((x) => x.id === selected) || buses[0];

  // Dedicated Driver Experience
  if (sess.user.role === "driver") {
    return (
      <DriverDashboard
        sess={sess}
        logout={logout}
        buses={buses}
        timeMode={timeMode}
        setTimeMode={setTimeMode}
        socket={socket}
      />
    );
  }

  // Dedicated Transport Command Admin Experience
  if (sess.user.role === "admin") {
    return (
      <AdminDashboard
        sess={sess}
        logout={logout}
        buses={buses}
        timeMode={timeMode}
        setTimeMode={setTimeMode}
        socket={socket}
      />
    );
  }

  const handleBusSwitch = (busId) => {
    setSelected(busId);
    const b = buses.find((x) => x.id === busId);
    if (b && b.waypoints) {
      setSelectedStop(b.waypoints[2] || b.waypoints[0]);
    }
  };

  const handleTrackBusFromOtherView = (busId) => {
    handleBusSwitch(busId);
    setActiveTab("tracking");
  };

  const startTrip = async () => {
    try {
      await axios.post(`${API}/api/trips/start`, {}, { headers });
      setTrip("active");
    } catch (e) {
      setNotice(e.response?.data?.message || "Unable to start trip");
    }
  };

  const stopTrip = async () => {
    try {
      await axios.post(`${API}/api/trips/stop`, {}, { headers });
      setTrip("inactive");
    } catch (e) {
      setNotice("Unable to stop trip");
    }
  };

  return (
    <div className={`app-container ${timeMode}`}>
      {/* Animated Ambient Background (Aurora Mesh Orbs, Cyber Grid & Laser Radar) */}
      <AmbientBackground timeMode={timeMode} />

      {/* Left Sidebar Navigation */}
      <aside className="sidebar-nav">
        {/* Perfectly Fitted Official KIT Coimbatore Logo */}
        <div className="sidebar-brand-box">
          <div className="brand-logo-container">
            <div className="brand-logo-glow" />
            <img
              src={kitLogo}
              alt="Kalaignar Karunanidhi Institute of Technology Emblem"
              className="brand-logo-img"
            />
          </div>
          <div className="brand-titles">
            <h2>KIT COIMBATORE</h2>
            <p>Autonomous • NAAC 'A'</p>
          </div>
        </div>

        {/* User Profile Card */}
        <div className="user-profile-badge">
          <div className="user-avatar-circle">
            {sess.user.name[0]?.toUpperCase() || "U"}
          </div>
          <div className="user-profile-info">
            <b>{sess.user.name}</b>
            <span className={`role-tag ${sess.user.role}`}>
              {sess.user.role.toUpperCase()}
            </span>
          </div>
        </div>

        {/* Sidebar Nav Links with Live Switching */}
        <nav className="nav-menu">
          <button
            className={`nav-item ${activeTab === "tracking" ? "active" : ""}`}
            onClick={() => setActiveTab("tracking")}
          >
            <span className="nav-icon">🛰️</span>
            <span>Live GPS Map</span>
          </button>
          <button
            className={`nav-item ${activeTab === "routes" ? "active" : ""}`}
            onClick={() => setActiveTab("routes")}
          >
            <span className="nav-icon">🗺️</span>
            <span>Coimbatore Routes</span>
          </button>
          <button
            className={`nav-item ${activeTab === "announcements" ? "active" : ""}`}
            onClick={() => setActiveTab("announcements")}
          >
            <span className="nav-icon">📢</span>
            <span>Transit Advisory</span>
          </button>
          <button
            className={`nav-item ${activeTab === "schedule" ? "active" : ""}`}
            onClick={() => setActiveTab("schedule")}
          >
            <span className="nav-icon">⏰</span>
            <span>Bus Timetable</span>
          </button>
          <button
            className="nav-item student-message-nav-btn"
            onClick={() => setIsMsgModalOpen(true)}
          >
            <span className="nav-icon">💬</span>
            <span>Message Admin</span>
          </button>
          {sess.user.role === "admin" && (
            <button
              className={`nav-item ${activeTab === "admin" ? "active" : ""}`}
              onClick={() => setActiveTab("admin")}
            >
              <span className="nav-icon">🛡️</span>
              <span>Fleet Control</span>
            </button>
          )}
        </nav>

        {/* Quick Emergency SOS Trigger */}
        <div className="sidebar-emergency-card">
          <div className="sos-pill-label">24/7 HELPLINE</div>
          <button
            className="sidebar-sos-btn"
            onClick={() => setIsSosOpen(true)}
          >
            <span>🚨</span> Emergency SOS
          </button>
        </div>

        {/* Sign Out Button */}
        <button className="sidebar-logout-btn" onClick={logout}>
          <span>🚪</span> Sign Out
        </button>
      </aside>

      {/* Main Content Scrollable Workspace */}
      <main className="main-content-scroll">
        {/* Top Header Bar */}
        <header className="dashboard-top-header">
          <div className="header-left">
            <div className="institution-subtitle">
              KALAIGNARKARUNANIDHI INSTITUTE OF TECHNOLOGY
            </div>
            <h1>
              Welcome, {sess.user.name.split(" ")[0]}!
            </h1>
          </div>

          <div className="header-actions">
            {/* Live Clock & Coimbatore Weather Cluster */}
            <LiveHeaderTimeWeather />

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

            {/* Live Status Pill */}
            <div className="status-live-chip">
              <span className={`status-dot ${trip === "active" ? "active" : ""}`} />
              <span>{trip === "active" ? "GPS STREAMING LIVE" : "STANDBY"}</span>
            </div>

            {/* Top Message Admin Button */}
            <button
              className="top-msg-trigger-btn"
              onClick={() => setIsMsgModalOpen(true)}
            >
              💬 Message Admin
            </button>

            {/* Top SOS Button */}
            <button
              className="top-sos-trigger-btn"
              onClick={() => setIsSosOpen(true)}
            >
              🚨 SOS
            </button>
          </div>
        </header>

        {notice && (
          <div className="notice-banner">
            <span>ℹ️</span> {notice}
          </div>
        )}

        {/* TAB 1: LIVE GPS TRACKING & MAP */}
        {activeTab === "tracking" && (
          <div className="tab-pane-fade-in">
            {/* Route Selector Horizontal Tabs */}
            <div className="route-selector-scroll">
              <div className="route-tabs-label">🚌 COIMBATORE FLEET:</div>
              <div className="route-tabs-list">
                {buses.map((b) => (
                  <button
                    key={b.id}
                    className={`route-tab-pill ${selected === b.id ? "active" : ""}`}
                    onClick={() => handleBusSwitch(b.id)}
                  >
                    <span className="route-num-badge">{b.number}</span>
                    <span className="route-name-text">{b.name}</span>
                    <span className="route-status-indicator" />
                  </button>
                ))}
              </div>
            </div>

            {/* Student Telemetry Widgets (Speedometer, ETA Countdown, Occupancy, Driver) */}
            <StudentTelemetryWidget
              bus={bus}
              location={location}
              selectedStop={selectedStop}
              onSelectStop={setSelectedStop}
            />

            {/* Main Grid: Interactive Coimbatore Map & Route Progression Timeline */}
            <section className="transit-dashboard-grid">
              {/* Map Section */}
              <div className="transit-map-panel">
                <div className="panel-header-row">
                  <div>
                    <h2>Coimbatore Transit Radar Feed</h2>
                    <p className="panel-desc">
                      Tracking <b>{bus?.name}</b> towards <b>Kalaignar Karunanidhi Institute of Technology Campus</b>
                    </p>
                  </div>
                  <div className="map-legend-items">
                    <span className="legend-item">
                      <span className="legend-dot bus" /> Bus Live
                    </span>
                    <span className="legend-item">
                      <span className="legend-dot stop" /> Stops
                    </span>
                    <span className="legend-item">
                      <span className="legend-dot kit" /> KIT Campus
                    </span>
                  </div>
                </div>

                <CoimbatoreTransitMap
                  bus={bus}
                  location={location}
                  selectedStop={selectedStop}
                  onSelectStop={setSelectedStop}
                  timeMode={timeMode}
                />
              </div>

              {/* Right Side: Route Progression Timeline & Stop Schedule */}
              <div className="transit-timeline-panel">
                <div className="panel-header-row">
                  <h3>Route Stop Progression</h3>
                  <span className="total-stops-badge">
                    {bus?.waypoints?.length || 0} Stops
                  </span>
                </div>

                <p className="timeline-helper-text">
                  Click any stop to view ETA and set as your boarding location:
                </p>

                <div className="timeline-stops-container">
                  {(bus?.waypoints || []).map((wp, idx) => {
                    const isSelected = selectedStop?.name === wp.name;
                    const isLast = idx === (bus?.waypoints?.length || 1) - 1;
                    const isPassed =
                      location?.currentStopIndex !== undefined &&
                      idx < location.currentStopIndex;
                    const isCurrent =
                      location?.currentStopIndex !== undefined &&
                      idx === location.currentStopIndex;

                    return (
                      <div
                        key={wp.name}
                        className={`timeline-stop-item ${
                          isSelected ? "selected" : ""
                        } ${isPassed ? "passed" : ""} ${
                          isCurrent ? "current" : ""
                        } ${isLast ? "destination" : ""}`}
                        onClick={() => setSelectedStop(wp)}
                      >
                        <div className="stop-marker-column">
                          <div className="stop-node-circle">
                            {isLast ? "🏫" : isPassed ? "✓" : idx + 1}
                          </div>
                          {!isLast && <div className="stop-connecting-line" />}
                        </div>

                        <div className="stop-info-content">
                          <div className="stop-title-row">
                            <b>{wp.name}</b>
                            <span className="stop-scheduled-time">{wp.time}</span>
                          </div>
                          <div className="stop-sub-row">
                            {isLast ? (
                              <span className="destination-tag">
                                ⭐ Final Destination (KIT Campus)
                              </span>
                            ) : (
                              <span>ETA: {wp.etaMin} mins</span>
                            )}
                            {isSelected && (
                              <span className="selected-tag">● My Boarding Stop</span>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Driver Controls if logged in as Driver */}
                {sess.user.role === "driver" && (
                  <div className="driver-action-container">
                    <h4>Driver Broadcast Controls</h4>
                    <DriverControls
                      busId={sess.user.busId}
                      socket={socket}
                      trip={trip}
                      startTrip={startTrip}
                      stopTrip={stopTrip}
                    />
                  </div>
                )}
              </div>
            </section>
          </div>
        )}

        {/* TAB 2: COIMBATORE ROUTES EXPLORER */}
        {activeTab === "routes" && (
          <div className="tab-pane-fade-in">
            <RoutesExplorerView
              buses={buses}
              onTrackBus={handleTrackBusFromOtherView}
              timeMode={timeMode}
            />
          </div>
        )}

        {/* TAB 3: CAMPUS ADVISORY & TRAFFIC BULLETIN */}
        {activeTab === "announcements" && (
          <div className="tab-pane-fade-in">
            <TransitAdvisoryView
              timeMode={timeMode}
              token={sess.token}
              user={sess.user}
            />
          </div>
        )}

        {/* TAB 4: BUS MASTER TIMETABLE */}
        {activeTab === "schedule" && (
          <div className="tab-pane-fade-in">
            <BusScheduleView
              buses={buses}
              onTrackBus={handleTrackBusFromOtherView}
              timeMode={timeMode}
            />
          </div>
        )}

        {/* TAB 5: ADMIN FLEET OPERATIONS */}
        {activeTab === "admin" && (
          <div className="tab-pane-fade-in">
            <AdminPanel buses={buses} onTrackBus={handleTrackBusFromOtherView} />
          </div>
        )}
      </main>

      {/* Emergency SOS Modal */}
      <SosModal
        isOpen={isSosOpen}
        onClose={() => setIsSosOpen(false)}
        bus={bus}
        user={sess.user}
        token={sess.token}
      />

      {/* Student to Admin Direct Message Modal */}
      <StudentMessageModal
        isOpen={isMsgModalOpen}
        onClose={() => setIsMsgModalOpen(false)}
        user={sess.user}
        token={sess.token}
        buses={buses}
        currentBusId={selected}
      />
    </div>
  );
}

function DriverControls({ busId, socket, trip, startTrip, stopTrip }) {
  const watch = useRef(null);
  const [gps, setGps] = useState("Not sharing");
  const [err, setErr] = useState("");

  function begin() {
    if (!navigator.geolocation) {
      setErr("This browser does not support geolocation.");
      return;
    }
    startTrip();
    setErr("");
    watch.current = navigator.geolocation.watchPosition(
      (p) => {
        const x = {
          busId,
          lat: p.coords.latitude,
          lng: p.coords.longitude,
          accuracy: p.coords.accuracy,
          speed: p.coords.speed,
          heading: p.coords.heading,
        };
        socket.emit("location:update", x);
        setGps("Broadcasting live GPS");
      },
      (e) => setErr(e.message),
      { enableHighAccuracy: true, maximumAge: 5000, timeout: 15000 }
    );
  }

  function end() {
    if (watch.current !== null) navigator.geolocation.clearWatch(watch.current);
    watch.current = null;
    setGps("Not sharing");
    stopTrip();
  }

  return (
    <div className="driver-telemetry-box">
      <div className={gps.includes("Broadcasting") ? "gps-pill good" : "gps-pill"}>
        ● {gps}
      </div>
      {err && <div className="notice-banner">{err}</div>}
      {trip === "active" ? (
        <button className="btn-stop-trip" onClick={end}>
          Stop Trip & End Broadcast
        </button>
      ) : (
        <button className="btn-start-trip" onClick={begin}>
          Start Trip & Broadcast GPS
        </button>
      )}
    </div>
  );
}

function AdminPanel({ buses, onTrackBus }) {
  return (
    <section className="admin-fleet-panel">
      <div className="admin-header-row">
        <div>
          <h2>KIT Coimbatore Fleet Operations Hub</h2>
          <p>Real-time vehicle telemetry, driver allocation, and maintenance status</p>
        </div>
        <div className="admin-stats-badge">
          <b>{buses.length} Vehicles Active</b>
        </div>
      </div>

      <div className="fleet-table-container">
        <table className="fleet-table">
          <thead>
            <tr>
              <th>Bus #</th>
              <th>Route Name</th>
              <th>Driver & Phone</th>
              <th>Plate No.</th>
              <th>Capacity</th>
              <th>GPS Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {buses.map((b) => (
              <tr key={b.id}>
                <td>
                  <span className="bus-number-chip">{b.number}</span>
                </td>
                <td>
                  <b>{b.name}</b>
                  <small className="stops-count-sub">
                    {b.waypoints?.length || 0} Stops
                  </small>
                </td>
                <td>
                  <b>{b.driver?.name || "Assigned Driver"}</b>
                  <small>{b.driver?.phone}</small>
                </td>
                <td>
                  <span className="plate-badge">{b.driver?.plateNumber || "TN 38 BK 2024"}</span>
                </td>
                <td>
                  {b.occupancy}/{b.capacity} Seats ({b.capacity - b.occupancy} free)
                </td>
                <td>
                  <span className={`status-pill ${b.status || "active"}`}>
                    ● {b.status === "active" ? "Active (Broadcasting)" : "Standby"}
                  </span>
                </td>
                <td>
                  <button
                    className="table-track-btn"
                    onClick={() => onTrackBus && onTrackBus(b.id)}
                  >
                    🛰️ Track
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

createRoot(document.getElementById("root")).render(<App />);