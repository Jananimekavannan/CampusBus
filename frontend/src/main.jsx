import React, { useEffect, useMemo, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import { io } from "socket.io-client";
import axios from "axios";
import SplashScreen from "./SplashScreen";
import RevolvingBusRoad from "./RevolvingBusRoad";
import kitLogo from "./assets/kit-logo.png";
import "./styles.css";
import "leaflet/dist/leaflet.css";

const API = import.meta.env.VITE_API_URL || "http://localhost:5000";

const busIcon = L.divIcon({
  className: "bus-pin",
  html: "<div>🚌</div>",
  iconSize: [42, 42],
  iconAnchor: [21, 21],
});

function MapFly({ pos }) {
  const map = useMap();
  useEffect(() => {
    if (pos) map.flyTo([pos.lat, pos.lng], 16, { duration: 1 });
  }, [pos]);
  return null;
}

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

function Login({ onLogin }) {
  const [activeRole, setActiveRole] = useState("student");
  const [email, setEmail] = useState("student@campusbus.local");
  const [password, setPassword] = useState("Student123!");
  const [showPassword, setShowPassword] = useState(false);
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);
  const [timeMode, setTimeMode] = useState("night");

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
      {/* 1. Revolving Road & Revolving KIT Bus encircling the login box */}
      <RevolvingBusRoad timeMode={timeMode} />

      {/* 2. Top Bar: Day / Night Switcher */}
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

      {/* 3. Center Hero: Centered KIT Logo & Login Card */}
      <div className="login-center-wrapper">
        {/* Centered Circular KIT Coimbatore Logo */}
        <div className="kit-logo-center-badge">
          <div className="kit-logo-halo" />
          <div className="kit-logo-spin-ring" />
          <div className="kit-logo-img-wrap">
            <img src={kitLogo} alt="KIT Coimbatore Logo" />
          </div>
        </div>

        {/* Clean Glassmorphic Login Card */}
        <div className="login-card">
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

  if (!sess) return <Login onLogin={login} />;
  return <Dashboard sess={sess} logout={logout} />;
}

function Dashboard({ sess, logout }) {
  const [buses, setBuses] = useState([]);
  const [selected, setSelected] = useState(sess.user.busId || "bus12");
  const [location, setLocation] = useState(null);
  const [trip, setTrip] = useState("inactive");
  const [notice, setNotice] = useState("");

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
          setTrip(b.status);
          setLocation(b.lastLocation);
        }
      })
      .catch(() => setNotice("Backend connection unavailable."));

    return () => socket.disconnect();
  }, [headers, selected, socket]);

  useEffect(() => {
    socket.emit("bus:join", selected);
    socket.on("location:update", (x) => setLocation(x));
    socket.on("trip:status", (x) => {
      if (x.busId === selected) setTrip(x.status);
    });
    return () => {
      socket.off("location:update");
      socket.off("trip:status");
    };
  }, [selected, socket]);

  const bus = buses.find((x) => x.id === selected) || buses[0];
  const defaultPos = { lat: 10.9381, lng: 76.9922 }; // KIT Coimbatore coordinates
  const pos = location || defaultPos;

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
    <div className="app">
      <aside>
        <div className="brand">
          <div className="brand-logo-wrap">
            <img src={kitLogo} alt="KIT Logo" />
          </div>
          <div className="brand-text">
            <h2>KITBusMiss</h2>
            <p>COIMBATORE</p>
          </div>
        </div>

        <div className="profile">
          <div className="avatar">{sess.user.name[0]}</div>
          <div>
            <b>{sess.user.name}</b>
            <small>{sess.user.role.toUpperCase()}</small>
          </div>
        </div>

        <nav>
          <a className="active">
            <span>📊</span> Overview
          </a>
          <a>
            <span>🛰️</span> Live tracking
          </a>
          <a>
            <span>📍</span> Routes & stops
          </a>
          <a>
            <span>⏳</span> Trip history
          </a>
          {sess.user.role === "admin" && (
            <a>
              <span>🚍</span> Fleet management
            </a>
          )}
        </nav>

        <button className="logout" onClick={logout}>
          Sign out
        </button>
      </aside>

      <main>
        <header>
          <div>
            <p className="eyebrow">KIT TRANSPORT OPERATIONS</p>
            <h1>Welcome, {sess.user.name.split(" ")[0]}.</h1>
          </div>
          <div className="live">
            <span className={trip === "active" ? "dot on" : "dot"} />
            {trip === "active" ? "LIVE GPS STREAMING" : "FLEET READY"}
          </div>
        </header>

        {notice && <div className="notice">{notice}</div>}

        <section className="metrics">
          <Metric
            label="Assigned Bus"
            value={bus?.name || "Loading"}
            icon="🚌"
          />
          <Metric
            label="Trip Status"
            value={trip === "active" ? "On Route" : "Inactive"}
            icon={trip === "active" ? "🟢" : "⚪"}
          />
          <Metric
            label="GPS Connection"
            value={location ? "Broadcasting" : "Standby"}
            icon="📡"
          />
          <Metric
            label="Last Telemetry"
            value={
              location
                ? new Date(location.updatedAt).toLocaleTimeString()
                : "—"
            }
            icon="⏱️"
          />
        </section>

        <section className="content-grid">
          <div className="map-panel">
            <div className="panel-head">
              <div>
                <h2>Live Vehicle Telemetry</h2>
                <p>{bus?.route || "Loading route details..."}</p>
              </div>
              <select
                value={selected}
                onChange={(e) => setSelected(e.target.value)}
              >
                {buses.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.name} ({b.route})
                  </option>
                ))}
              </select>
            </div>

            <div className="map-wrap">
              <MapContainer
                center={[pos.lat, pos.lng]}
                zoom={14}
                scrollWheelZoom
                style={{ height: "100%", width: "100%" }}
              >
                <TileLayer
                  attribution="© OpenStreetMap contributors"
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <MapFly pos={pos} />
                {location && (
                  <Marker position={[pos.lat, pos.lng]} icon={busIcon}>
                    <Popup>
                      <b>{bus?.name}</b>
                      <br />
                      KIT Live GPS Location
                      <br />
                      Accuracy: {Math.round(location.accuracy || 0)} m
                    </Popup>
                  </Marker>
                )}
              </MapContainer>
              {!location && (
                <div className="map-empty">
                  Waiting for driver's live GPS broadcast…
                </div>
              )}
            </div>

            <div className="location-bar">
              <span>
                Latitude <b>{location ? pos.lat.toFixed(6) : "10.938100"}</b>
              </span>
              <span>
                Longitude <b>{location ? pos.lng.toFixed(6) : "76.992200"}</b>
              </span>
              <span>
                Accuracy{" "}
                <b>
                  {location
                    ? `${Math.round(location.accuracy || 0)} m`
                    : "Calibrated"}
                </b>
              </span>
            </div>
          </div>

          <div className="side-panels">
            <div className="panel route">
              <h2>Route Stops & Waypoints</h2>
              <div className="route-line">
                {(bus?.stops || []).map((s, i) => (
                  <div className={i === 0 ? "done" : ""} key={s}>
                    <span>{i + 1}</span>
                    <p>{s}</p>
                  </div>
                ))}
              </div>
            </div>

            {sess.user.role === "driver" ? (
              <DriverControls
                busId={sess.user.busId}
                socket={socket}
                trip={trip}
                startTrip={startTrip}
                stopTrip={stopTrip}
              />
            ) : (
              <div className="panel">
                <h2>Campus Transit Info</h2>
                <p className="muted">
                  The live GPS marker syncs in real-time when the assigned KIT
                  driver starts the trip and broadcasts geolocation telemetry.
                </p>
                <div className="info">
                  <span>Network Sync</span>
                  <b>Real-time Socket.IO</b>
                </div>
                <div className="info">
                  <span>Campus Institution</span>
                  <b>KIT Coimbatore</b>
                </div>
                <div className="info">
                  <span>Cartography</span>
                  <b>OpenStreetMap Live</b>
                </div>
              </div>
            )}
          </div>
        </section>

        {sess.user.role === "admin" && <Admin buses={buses} />}
      </main>
    </div>
  );
}

function Metric({ label, value, icon }) {
  return (
    <div className="metric">
      <div className="metric-icon">{icon}</div>
      <div>
        <small>{label}</small>
        <h3>{value}</h3>
      </div>
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
    <div className="panel driver">
      <h2>Driver Telemetry Control</h2>
      <p className="muted">
        Broadcast live GPS coordinates from the vehicle driver handset.
      </p>
      <div className={gps.includes("Broadcasting") ? "gps good" : "gps"}>
        ● {gps}
      </div>
      {err && <div className="notice">{err}</div>}
      {trip === "active" ? (
        <button className="danger-btn" onClick={end}>
          Stop Trip & End Broadcast
        </button>
      ) : (
        <button className="primary-btn" onClick={begin}>
          Start Trip & Broadcast GPS
        </button>
      )}
      <small>For real device testing over WiFi/LAN, host on HTTPS.</small>
    </div>
  );
}

function Admin({ buses }) {
  return (
    <section className="admin-section">
      <h2>KIT Fleet Operations Overview</h2>
      <div className="fleet">
        {buses.map((b) => (
          <div className="fleet-row" key={b.id}>
            <b>{b.name}</b>
            <span>{b.route}</span>
            <span className={b.status === "active" ? "status active" : "status"}>
              {b.status}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}

createRoot(document.getElementById("root")).render(<App />);