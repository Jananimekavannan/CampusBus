import React from "react";

export default function StudentTelemetryWidget({
  bus,
  location,
  selectedStop,
  onSelectStop,
}) {
  const currentSpeed = location?.speed || 0;
  const speedRatio = Math.min(1, currentSpeed / 80);
  const needleDeg = -90 + speedRatio * 180; // from -90deg (0 km/h) to +90deg (80 km/h)

  // Calculate ETA to selected stop or next stop
  const waypoints = bus?.waypoints || [];
  const targetStop =
    selectedStop ||
    waypoints.find((w) => w.name === location?.nextStop) ||
    waypoints[waypoints.length - 1];

  const occupancyRatio = bus ? (bus.occupancy / bus.capacity) * 100 : 0;
  const availableSeats = bus ? bus.capacity - bus.occupancy : 0;

  return (
    <div className="telemetry-widgets-grid">
      {/* 1. Live Speedometer Gauge Card */}
      <div className="telemetry-card speedometer-card">
        <div className="card-top-header">
          <div className="card-icon-tag">🏎️</div>
          <div>
            <h4>Live Cruising Speed</h4>
            <p>Real-time OBD-II / GPS telemetry</p>
          </div>
          <span className="live-pill-tag">
            <span className="pulse-dot" /> LIVE
          </span>
        </div>

        <div className="gauge-visual-wrap">
          <svg className="speed-gauge-svg" viewBox="0 0 200 120">
            {/* Background Arc */}
            <path
              d="M 20 100 A 80 80 0 0 1 180 100"
              fill="none"
              stroke="rgba(255, 255, 255, 0.1)"
              strokeWidth="14"
              strokeLinecap="round"
            />
            {/* Speed Color Arc */}
            <path
              d="M 20 100 A 80 80 0 0 1 180 100"
              fill="none"
              stroke="url(#speedGrad)"
              strokeWidth="14"
              strokeDasharray="251.2"
              strokeDashoffset={251.2 * (1 - speedRatio)}
              strokeLinecap="round"
              className="gauge-progress-arc"
            />
            <defs>
              <linearGradient id="speedGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#38bdf8" />
                <stop offset="60%" stopColor="#10b981" />
                <stop offset="90%" stopColor="#f59e0b" />
                <stop offset="100%" stopColor="#ef4444" />
              </linearGradient>
            </defs>
            {/* Gauge Needle */}
            <g
              transform={`rotate(${needleDeg}, 100, 100)`}
              className="gauge-needle-group"
            >
              <line
                x1="100"
                y1="100"
                x2="100"
                y2="30"
                stroke="#ffffff"
                strokeWidth="3.5"
                strokeLinecap="round"
              />
              <circle cx="100" cy="100" r="7" fill="#c01823" />
              <circle cx="100" cy="100" r="3" fill="#ffffff" />
            </g>
          </svg>

          <div className="gauge-value-display">
            <span className="gauge-number">{currentSpeed}</span>
            <span className="gauge-unit">km/h</span>
          </div>
        </div>

        <div className="gauge-footer-meta">
          <div>
            <small>Heading</small>
            <b>{location?.heading ? `${location.heading}°` : "105° ESE"}</b>
          </div>
          <div>
            <small>GPS Accuracy</small>
            <b>±{Math.round(location?.accuracy || 4)}m</b>
          </div>
          <div>
            <small>Transit Mode</small>
            <b className="mode-highlight">Cruising</b>
          </div>
        </div>
      </div>

      {/* 2. Dynamic ETA & My Boarding Stop Card */}
      <div className="telemetry-card eta-card">
        <div className="card-top-header">
          <div className="card-icon-tag">⏱️</div>
          <div>
            <h4>Boarding ETA & Distance</h4>
            <p>Calculated for your designated stop</p>
          </div>
        </div>

        <div className="stop-selector-dropdown-wrap">
          <label>🎯 Your Boarding Stop:</label>
          <select
            value={targetStop?.name || ""}
            onChange={(e) => {
              const s = waypoints.find((w) => w.name === e.target.value);
              if (s && onSelectStop) onSelectStop(s);
            }}
          >
            {waypoints.map((w, idx) => (
              <option key={w.name} value={w.name}>
                {idx + 1}. {w.name} ({w.time})
              </option>
            ))}
          </select>
        </div>

        <div className="eta-highlight-box">
          <div className="eta-timer-wrap">
            <span className="eta-big-number">
              {targetStop?.etaMin !== undefined ? targetStop.etaMin : 8}
            </span>
            <span className="eta-mins-label">MINS</span>
          </div>
          <div className="eta-details-col">
            <div className="eta-detail-item">
              <span>Next Stop</span>
              <b>{location?.nextStop || waypoints[1]?.name || "Upcoming"}</b>
            </div>
            <div className="eta-detail-item">
              <span>Scheduled Arrival</span>
              <b>{targetStop?.time || "08:10 AM"}</b>
            </div>
          </div>
        </div>

        <div className="eta-progress-track">
          <div
            className="eta-progress-bar"
            style={{
              width: `${Math.max(
                10,
                100 - (targetStop?.etaMin || 10) * 2.5
              )}%`,
            }}
          />
        </div>
      </div>

      {/* 3. Bus Capacity & Driver Info Card */}
      <div className="telemetry-card capacity-card">
        <div className="card-top-header">
          <div className="card-icon-tag">💺</div>
          <div>
            <h4>Bus Occupancy & Driver</h4>
            <p>Real-time RFID pass & seating load</p>
          </div>
        </div>

        <div className="capacity-bar-container">
          <div className="capacity-stat-row">
            <span>
              Occupancy: <b>{bus?.occupancy || 34} / {bus?.capacity || 52}</b>
            </span>
            <span className="seats-free-badge">
              {availableSeats} seats available
            </span>
          </div>
          <div className="capacity-progress-rail">
            <div
              className={`capacity-fill ${
                occupancyRatio > 85
                  ? "full"
                  : occupancyRatio > 60
                  ? "medium"
                  : "low"
              }`}
              style={{ width: `${occupancyRatio}%` }}
            />
          </div>
        </div>

        <div className="driver-profile-widget">
          <div className="driver-avatar-circle">
            <span>👨‍✈️</span>
          </div>
          <div className="driver-info-body">
            <div className="driver-name-row">
              <b>{bus?.driver?.name || "Kumarasamy S."}</b>
              <span className="driver-rating-pill">
                ⭐ {bus?.driver?.rating || 4.9}
              </span>
            </div>
            <div className="driver-meta-sub">
              <span>Plate: <b>{bus?.driver?.plateNumber || "TN 38 BK 1212"}</b></span>
              <span>Exp: {bus?.driver?.experience || "12 yrs"}</span>
            </div>
          </div>
          <a
            href={`tel:${bus?.driver?.phone || "+919842188412"}`}
            className="call-driver-btn"
            title="Contact Driver"
          >
            📞 Call
          </a>
        </div>
      </div>
    </div>
  );
}
