import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import CoimbatoreTransitMap from "./CoimbatoreTransitMap";
import kitLogo from "./assets/kit-logo.png";

const API = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function AdminDashboard({
  sess,
  logout,
  buses,
  timeMode,
  setTimeMode,
  socket,
}) {
  const [activeTab, setActiveTab] = useState("inbox"); // 'inbox', 'fleet', 'drivers', 'broadcast'
  const [messages, setMessages] = useState([]);
  const [inboxFilter, setInboxFilter] = useState("all"); // 'all', 'sos', 'traffic', 'query'
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedBusId, setSelectedBusId] = useState("bus12");
  const [broadcastTitle, setBroadcastTitle] = useState("");
  const [broadcastDesc, setBroadcastDesc] = useState("");
  const [broadcastType, setBroadcastType] = useState("info");
  const [broadcastSent, setBroadcastSent] = useState(false);
  const [notice, setNotice] = useState("");

  const headers = useMemo(
    () => ({ Authorization: "Bearer " + sess.token }),
    [sess.token]
  );

  // Fetch messages from API
  const fetchMessages = async () => {
    try {
      const r = await axios.get(`${API}/api/admin/messages`, { headers });
      setMessages(r.data);
    } catch (e) {
      console.warn("Could not load messages:", e.message);
    }
  };

  useEffect(() => {
    fetchMessages();
    const interval = setInterval(fetchMessages, 3000);

    const handleMessage = (newMsg) => {
      setMessages((prev) => {
        if (prev.some((m) => m.id === newMsg.id)) return prev;
        return [newMsg, ...prev];
      });
      setNotice(
        `🚨 New ${newMsg.category?.toUpperCase() || "MESSAGE"} from ${newMsg.senderName} (${newMsg.busId?.toUpperCase() || "KIT FLEET"})`
      );
    };

    const handleSos = (sosAlert) => {
      setNotice(
        `🚨 URGENT SOS ALERT: ${sosAlert.studentName} on Bus ${sosAlert.busId}!`
      );
      fetchMessages();
    };

    socket.on("admin:message", handleMessage);
    socket.on("admin:sos", handleSos);

    return () => {
      clearInterval(interval);
      socket.off("admin:message", handleMessage);
      socket.off("admin:sos", handleSos);
    };
  }, [socket, headers]);

  // Mark message as resolved
  const handleResolveMessage = async (msgId) => {
    try {
      await axios.patch(`${API}/api/admin/messages/${msgId}/resolve`, {}, { headers });
      setMessages((prev) =>
        prev.map((m) => (m.id === msgId ? { ...m, status: "resolved" } : m))
      );
      setNotice("Alert marked as Handled & Resolved.");
      setTimeout(() => setNotice(""), 4000);
    } catch (e) {
      console.error(e);
    }
  };

  // Delete / Dismiss message
  const handleDeleteMessage = async (msgId) => {
    try {
      await axios.delete(`${API}/api/admin/messages/${msgId}`, { headers });
      setMessages((prev) => prev.filter((m) => m.id !== msgId));
      setNotice("Alert dismissed from queue.");
      setTimeout(() => setNotice(""), 3000);
    } catch (e) {
      console.error(e);
    }
  };

  // Broadcast announcement
  const handlePublishBroadcast = async (e) => {
    e.preventDefault();
    if (!broadcastTitle.trim() || !broadcastDesc.trim()) return;

    try {
      await axios.post(
        `${API}/api/admin/broadcast`,
        {
          title: broadcastTitle,
          desc: broadcastDesc,
          type: broadcastType,
        },
        { headers }
      );
      setBroadcastSent(true);
      setNotice("Official Announcement broadcasted to all student and driver portals!");
      setTimeout(() => {
        setBroadcastTitle("");
        setBroadcastDesc("");
        setBroadcastSent(false);
        setNotice("");
      }, 4000);
    } catch (e) {
      setNotice(e.response?.data?.message || "Failed to publish broadcast.");
    }
  };

  // Filter messages
  const filteredMessages = messages.filter((m) => {
    const sName = (m.senderName || "").toLowerCase();
    const sTitle = (m.title || "").toLowerCase();
    const sContent = (m.content || "").toLowerCase();
    const sBus = (m.busId || "").toLowerCase();
    const q = (searchTerm || "").toLowerCase().trim();

    const matchesSearch =
      !q ||
      sName.includes(q) ||
      sTitle.includes(q) ||
      sContent.includes(q) ||
      sBus.includes(q);

    if (inboxFilter === "all") return matchesSearch;
    if (inboxFilter === "sos") return matchesSearch && (m.category === "sos" || m.category === "emergency");
    if (inboxFilter === "traffic")
      return (
        matchesSearch &&
        (m.category === "traffic" || m.category === "breakdown" || m.senderType === "driver")
      );
    if (inboxFilter === "query")
      return (
        matchesSearch &&
        (m.category === "query" || m.senderType === "student")
      );

    return matchesSearch;
  });

  const unreadCount = messages.filter((m) => m.status === "unread").length;
  const sosCount = messages.filter(
    (m) => (m.category === "sos" || m.category === "emergency") && m.status === "unread"
  ).length;
  const trafficCount = messages.filter(
    (m) =>
      (m.category === "traffic" || m.category === "breakdown" || m.senderType === "driver") &&
      m.status === "unread"
  ).length;
  const queryCount = messages.filter(
    (m) => (m.category === "query" || m.senderType === "student") && m.status === "unread"
  ).length;

  const selectedBus = buses.find((b) => b.id === selectedBusId) || buses[0];

  return (
    <div className={`app-container admin-theme ${timeMode}`}>
      {/* Admin Left Sidebar Navigation */}
      <aside className="sidebar-nav admin-sidebar">
        {/* Official KIT Logo Emblem & Branding */}
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
            <p>Transport Command Center</p>
          </div>
        </div>

        {/* Admin User Profile Badge */}
        <div className="user-profile-badge admin-badge">
          <div className="user-avatar-circle admin-avatar">🛡️</div>
          <div className="user-profile-info">
            <b>{sess.user.name}</b>
            <span className="role-tag admin">TRANSPORT ADMIN</span>
          </div>
        </div>

        {/* Admin Navigation Tabs */}
        <nav className="nav-menu">
          <button
            className={`nav-item ${activeTab === "inbox" ? "active" : ""}`}
            onClick={() => setActiveTab("inbox")}
          >
            <span className="nav-icon">📥</span>
            <span>Live Inbox</span>
            {unreadCount > 0 && (
              <span className="inbox-unread-badge">{unreadCount}</span>
            )}
          </button>
          <button
            className={`nav-item ${activeTab === "fleet" ? "active" : ""}`}
            onClick={() => setActiveTab("fleet")}
          >
            <span className="nav-icon">🚍</span>
            <span>Fleet Operations</span>
          </button>
          <button
            className={`nav-item ${activeTab === "drivers" ? "active" : ""}`}
            onClick={() => setActiveTab("drivers")}
          >
            <span className="nav-icon">👨‍✈️</span>
            <span>Drivers & Registry</span>
          </button>
          <button
            className={`nav-item ${activeTab === "broadcast" ? "active" : ""}`}
            onClick={() => setActiveTab("broadcast")}
          >
            <span className="nav-icon">📢</span>
            <span>Broadcast Center</span>
          </button>
        </nav>

        {/* Fleet Quick Status Card */}
        <div className="admin-fleet-quick-summary">
          <div className="summary-title-row">
            <span className="pulse-dot" />
            <span>FLEET STATUS LIVE</span>
          </div>
          <div className="summary-row">
            <small>Active Vehicles</small>
            <b>{buses.length} / {buses.length} Online</b>
          </div>
          <div className="summary-row">
            <small>Total Capacity</small>
            <b>364 Seats</b>
          </div>
          <div className="summary-row">
            <small>GPS Geofence</small>
            <span className="gps-live-tag">Coimbatore Zone</span>
          </div>
        </div>

        {/* Emergency Quick Dispatch & Sign Out */}
        <div className="sidebar-emergency-card">
          <div className="sos-pill-label">CAMPUS SECURITY DESK</div>
          <a href="tel:+914222367890" className="sidebar-sos-btn">
            <span>🚨</span> Control Room Hotline
          </a>
        </div>

        <button className="sidebar-logout-btn" onClick={logout}>
          <span>🚪</span> Sign Out Admin
        </button>
      </aside>

      {/* Main Admin Content Area */}
      <main className="main-content-scroll admin-main">
        {/* Top Header */}
        <header className="dashboard-top-header admin-header">
          <div>
            <span className="institution-subtitle admin-eyebrow">
              KALAIGNARKARUNANIDHI INSTITUTE OF TECHNOLOGY • TRANSPORT DIVISION
            </span>
            <h1>Central Fleet Intelligence Command</h1>
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

            {/* Live Operations Indicator */}
            <div className="status-live-chip admin-chip">
              <span className="status-dot active" />
              <span>RADAR LIVE • 100% ONLINE</span>
            </div>
          </div>
        </header>

        {/* Floating Notice Banner */}
        {notice && (
          <div className="notice-banner admin-notice-banner">
            <span>🔔</span> <span>{notice}</span>
          </div>
        )}

        {/* Command HUD Metric Cards */}
        <section className="admin-kpi-metrics-grid">
          <div className="admin-kpi-card fleet-kpi">
            <div className="kpi-icon-wrap">🚍</div>
            <div className="kpi-details">
              <small>ACTIVE FLEET DEPLOYED</small>
              <b>{buses.length} Vehicles</b>
              <span>100% Dual-Band GPS Online</span>
            </div>
          </div>

          <div className={`admin-kpi-card sos-kpi ${sosCount > 0 ? "alert-glow" : ""}`}>
            <div className="kpi-icon-wrap sos-icon">🚨</div>
            <div className="kpi-details">
              <small>ACTIVE SOS BROADCASTS</small>
              <b className={sosCount > 0 ? "text-danger" : ""}>{sosCount} Urgent</b>
              <span>{sosCount === 0 ? "All Clear & Safe" : "Immediate Response Required"}</span>
            </div>
          </div>

          <div className="admin-kpi-card driver-kpi">
            <div className="kpi-icon-wrap traffic-icon">⚠️</div>
            <div className="kpi-details">
              <small>DRIVER ROAD ADVISORIES</small>
              <b>{trafficCount} Reported</b>
              <span>Traffic Delays & Mechanical</span>
            </div>
          </div>

          <div className="admin-kpi-card query-kpi">
            <div className="kpi-icon-wrap student-icon">💬</div>
            <div className="kpi-details">
              <small>STUDENT INQUIRIES</small>
              <b>{queryCount} Pending</b>
              <span>Pickup & Stop Inquiries</span>
            </div>
          </div>
        </section>

        {/* TAB 1: LIVE INBOX & DISPATCH MESSAGES */}
        {activeTab === "inbox" && (
          <div className="tab-pane-fade-in admin-inbox-section">
            {/* Inbox Header Hero */}
            <div className="inbox-header-hero">
              <div className="inbox-header-left">
                <span className="inbox-badge-tag">REAL-TIME DISPATCH DESK</span>
                <h2>Driver & Student Live Communications Inbox</h2>
                <p>
                  Centralized dispatch queue receiving student Emergency SOS alerts, driver road incident
                  reports, mechanical updates, and student transit requests.
                </p>
              </div>

              <div className="inbox-stats-cluster">
                <div className="inbox-stat-chip">
                  <span className="chip-num">{messages.length}</span>
                  <span className="chip-lbl">Total Alerts</span>
                </div>
                <div className="inbox-stat-chip sos">
                  <span className="chip-num">{unreadCount}</span>
                  <span className="chip-lbl">Action Req.</span>
                </div>
                <div className="inbox-stat-chip resolved">
                  <span className="chip-num">{messages.length - unreadCount}</span>
                  <span className="chip-lbl">Resolved</span>
                </div>
              </div>
            </div>

            {/* Filter & Search Toolbar */}
            <div className="inbox-toolbar">
              <div className="inbox-filter-pills">
                <button
                  className={`inbox-filter-btn ${inboxFilter === "all" ? "active" : ""}`}
                  onClick={() => setInboxFilter("all")}
                >
                  All Messages ({messages.length})
                </button>
                <button
                  className={`inbox-filter-btn ${inboxFilter === "sos" ? "active" : ""}`}
                  onClick={() => setInboxFilter("sos")}
                >
                  🚨 Student SOS ({messages.filter((m) => m.category === "sos").length})
                </button>
                <button
                  className={`inbox-filter-btn ${inboxFilter === "traffic" ? "active" : ""}`}
                  onClick={() => setInboxFilter("traffic")}
                >
                  ⚠️ Driver Incidents ({messages.filter((m) => m.category === "traffic" || m.category === "breakdown").length})
                </button>
                <button
                  className={`inbox-filter-btn ${inboxFilter === "query" ? "active" : ""}`}
                  onClick={() => setInboxFilter("query")}
                >
                  💬 Student Queries ({messages.filter((m) => m.category === "query" || m.senderType === "student").length})
                </button>
              </div>

              <div className="inbox-search-box">
                <input
                  type="text"
                  placeholder="🔍 Search alerts, driver, student, bus..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            {/* Message Cards Stream */}
            <div className="inbox-messages-stream">
              {filteredMessages.map((msg) => {
                const isSos = msg.category === "sos";
                const isTraffic = msg.category === "traffic" || msg.category === "breakdown";
                const isUnread = msg.status === "unread";

                return (
                  <div
                    key={msg.id}
                    className={`inbox-msg-card ${
                      isSos
                        ? "sos-alert-card"
                        : isTraffic
                        ? "driver-incident-card"
                        : "student-query-card"
                    }`}
                  >
                    <div className="inbox-msg-header">
                      <div className="inbox-sender-meta">
                        <div className="inbox-sender-avatar">
                          {msg.senderType === "driver" ? "👨‍✈️" : isSos ? "🚨" : "🎓"}
                        </div>
                        <div className="inbox-sender-details">
                          <div className="sender-headline">
                            <b>{msg.senderName}</b>
                            <span className={`inbox-sender-role ${msg.senderType}`}>
                              {msg.senderType?.toUpperCase()}
                            </span>
                            <span className="msg-bus-badge">
                              🚍 {msg.busId?.toUpperCase()}
                            </span>
                          </div>
                          <span className="inbox-sender-sub">
                            Category: {msg.category?.toUpperCase()} • Alert ID: {msg.id}
                          </span>
                        </div>
                      </div>

                      <div className="inbox-header-badges">
                        <span className={`inbox-status-pill ${isUnread ? "new" : "resolved"}`}>
                          {isUnread ? "● Action Required" : "✓ Resolved"}
                        </span>
                        <span className="inbox-time-text">
                          🕒 {new Date(msg.time).toLocaleTimeString()}
                        </span>
                      </div>
                    </div>

                    <div className="inbox-msg-body">
                      <h4>{msg.title}</h4>
                      <p>{msg.content}</p>
                    </div>

                    <div className="inbox-msg-footer">
                      {isSos && (
                        <a
                          href="tel:+914222367890"
                          className="inbox-action-btn btn-call-security"
                        >
                          🚨 Call Campus Security Hotline
                        </a>
                      )}

                      {isUnread ? (
                        <button
                          className="inbox-action-btn btn-resolve"
                          onClick={() => handleResolveMessage(msg.id)}
                        >
                          ✓ Mark Resolved
                        </button>
                      ) : (
                        <span className="inbox-action-btn btn-resolved-state">
                          ✓ Handled by Dispatch
                        </span>
                      )}

                      <button
                        className="inbox-action-btn btn-dismiss"
                        onClick={() => handleDeleteMessage(msg.id)}
                        title="Dismiss alert"
                      >
                        🗑️ Dismiss
                      </button>
                    </div>
                  </div>
                );
              })}

              {filteredMessages.length === 0 && (
                <div className="inbox-empty-state">
                  <div className="inbox-empty-icon">📭</div>
                  <h3>No alerts found in this queue</h3>
                  <p>All emergency SOS broadcasts and driver road incidents are up to date.</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 2: FLEET OPERATIONS RADAR */}
        {activeTab === "fleet" && (
          <div className="tab-pane-fade-in admin-fleet-section">
            <div className="admin-section-hero">
              <div>
                <span className="routes-badge-tag">CENTRAL FLEET OPERATIONS</span>
                <h2>KIT Coimbatore Fleet Radar & Live Status</h2>
                <p>Multi-vehicle telemetry, real-time cruising coordinates, and passenger load</p>
              </div>
            </div>

            {/* Quick Bus Selector Horizontal Bar */}
            <div className="admin-bus-selector-bar">
              {buses.map((b) => (
                <button
                  key={b.id}
                  className={`admin-bus-chip ${selectedBusId === b.id ? "active" : ""}`}
                  onClick={() => setSelectedBusId(b.id)}
                >
                  <span className="chip-bus-num">{b.number}</span>
                  <div className="chip-text-wrap">
                    <span className="chip-name">{b.name}</span>
                    <span className="chip-load">
                      {b.occupancy}/{b.capacity} Seats ({b.capacity - b.occupancy} Free)
                    </span>
                  </div>
                </button>
              ))}
            </div>

            {/* Fleet Operations Grid: Map on Left, Dossier on Right */}
            <div className="admin-fleet-operations-layout">
              <div className="admin-map-panel-card">
                <div className="panel-header-row">
                  <div>
                    <h3>🛰️ Radar Tracking • {selectedBus?.name}</h3>
                    <p className="panel-desc">
                      Corridor: <b>{selectedBus?.route}</b> ➔ KIT Kannampalayam Campus
                    </p>
                  </div>
                  <span className="total-stops-badge">
                    {selectedBus?.waypoints?.length || 0} Stops
                  </span>
                </div>

                <div className="admin-map-container-wrap">
                  <CoimbatoreTransitMap
                    bus={selectedBus}
                    location={selectedBus?.lastLocation}
                    timeMode={timeMode}
                  />
                </div>
              </div>

              <div className="admin-dossier-panel-card">
                <h3>Vehicle Telemetry Dossier</h3>
                <div className="dossier-items-list">
                  <div className="dossier-item">
                    <span>Route Corridor</span>
                    <b>{selectedBus?.route}</b>
                  </div>
                  <div className="dossier-item">
                    <span>Assigned Driver</span>
                    <b>{selectedBus?.driver?.name}</b>
                  </div>
                  <div className="dossier-item">
                    <span>Driver Phone</span>
                    <a href={`tel:${selectedBus?.driver?.phone}`} className="phone-dossier-link">
                      📞 {selectedBus?.driver?.phone}
                    </a>
                  </div>
                  <div className="dossier-item">
                    <span>License Plate</span>
                    <b className="plate-badge">{selectedBus?.driver?.plateNumber}</b>
                  </div>
                  <div className="dossier-item">
                    <span>Current Capacity</span>
                    <b>
                      {selectedBus?.occupancy} / {selectedBus?.capacity} Seats
                    </b>
                  </div>
                  <div className="dossier-item">
                    <span>GPS Telemetry</span>
                    <b className="gps-good">● Active Dual-Band GPS</b>
                  </div>
                  <div className="dossier-item">
                    <span>Target Destination</span>
                    <b>KIT Kannampalayam (08:20 AM)</b>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: DRIVERS & VEHICLE REGISTRY */}
        {activeTab === "drivers" && (
          <div className="tab-pane-fade-in admin-drivers-section">
            <div className="admin-section-hero">
              <div>
                <span className="routes-badge-tag">TRANSPORT PERSONNEL ROSTER</span>
                <h2>KIT Campus Certified Drivers & Vehicle Registry</h2>
                <p>Active driver roster, contact records, vehicle plate assignments, and safety ratings</p>
              </div>
            </div>

            <div className="registry-table-card">
              <table className="admin-registry-table">
                <thead>
                  <tr>
                    <th>Bus #</th>
                    <th>Driver Name</th>
                    <th>Phone Contact</th>
                    <th>Vehicle Plate</th>
                    <th>Experience</th>
                    <th>Driver Rating</th>
                    <th>Operational Action</th>
                  </tr>
                </thead>
                <tbody>
                  {buses.map((b) => (
                    <tr key={b.id}>
                      <td>
                        <span className="bus-number-chip">{b.number}</span>
                      </td>
                      <td>
                        <div className="driver-name-meta">
                          <b>{b.driver?.name}</b>
                          <small>{b.name}</small>
                        </div>
                      </td>
                      <td>
                        <a href={`tel:${b.driver?.phone}`} className="phone-link">
                          📞 {b.driver?.phone}
                        </a>
                      </td>
                      <td>
                        <span className="plate-badge">{b.driver?.plateNumber}</span>
                      </td>
                      <td>{b.driver?.experience || "10+ yrs"}</td>
                      <td>
                        <span className="driver-rating-pill">⭐ {b.driver?.rating || 4.9}</span>
                      </td>
                      <td>
                        <button
                          className="table-track-btn"
                          onClick={() => {
                            setSelectedBusId(b.id);
                            setActiveTab("fleet");
                          }}
                        >
                          🛰️ Track Bus on Map
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 4: BROADCAST ANNOUNCEMENT CENTER */}
        {activeTab === "broadcast" && (
          <div className="tab-pane-fade-in admin-broadcast-section">
            <div className="admin-section-hero">
              <div>
                <span className="routes-badge-tag">CAMPUS-WIDE COMMUNICATIONS</span>
                <h2>Official Fleet Notification Broadcast Center</h2>
                <p>
                  Publish official transit circulars, route diversions, and weather warnings
                  directly to all Student and Driver portals in real-time.
                </p>
              </div>
            </div>

            {broadcastSent && (
              <div className="broadcast-success-banner">
                <span>✓ Announcement broadcasted successfully to all Student and Driver portals!</span>
              </div>
            )}

            <div className="broadcast-form-card">
              <form onSubmit={handlePublishBroadcast} className="admin-broadcast-form">
                <div className="form-group">
                  <label>Announcement Category</label>
                  <div className="broadcast-type-selector">
                    <button
                      type="button"
                      className={`broadcast-type-pill ${broadcastType === "info" ? "active" : ""}`}
                      onClick={() => setBroadcastType("info")}
                    >
                      📢 General Notice
                    </button>
                    <button
                      type="button"
                      className={`broadcast-type-pill ${broadcastType === "traffic" ? "active" : ""}`}
                      onClick={() => setBroadcastType("traffic")}
                    >
                      🚦 Route Diversion
                    </button>
                    <button
                      type="button"
                      className={`broadcast-type-pill ${broadcastType === "weather" ? "active" : ""}`}
                      onClick={() => setBroadcastType("weather")}
                    >
                      🌧️ Weather Alert
                    </button>
                    <button
                      type="button"
                      className={`broadcast-type-pill ${broadcastType === "emergency" ? "active" : ""}`}
                      onClick={() => setBroadcastType("emergency")}
                    >
                      🚨 High-Priority Circular
                    </button>
                  </div>
                </div>

                <div className="form-group">
                  <label>Announcement Headline</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Special Return Buses for Semester Lab Sessions"
                    value={broadcastTitle}
                    onChange={(e) => setBroadcastTitle(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label>Announcement Details & Instructions</label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Write departure bays, updated timings, or boarding instructions..."
                    value={broadcastDesc}
                    onChange={(e) => setBroadcastDesc(e.target.value)}
                  />
                </div>

                <button type="submit" className="broadcast-submit-btn">
                  🚀 Publish Instant Broadcast to All Portals
                </button>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
