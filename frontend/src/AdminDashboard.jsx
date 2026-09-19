import React, { useState, useEffect } from "react";
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

  const headers = { Authorization: "Bearer " + sess.token };

  // Fetch initial messages from API
  useEffect(() => {
    axios
      .get(`${API}/api/admin/messages`, { headers })
      .then((r) => setMessages(r.data))
      .catch((e) => console.warn("Could not load messages:", e.message));

    // Listen for real-time incoming messages from students & drivers
    socket.on("admin:message", (newMsg) => {
      setMessages((prev) => [newMsg, ...prev]);
      setNotice(`New ${newMsg.category?.toUpperCase()} message received from ${newMsg.senderName}!`);
    });

    socket.on("admin:sos", (sosAlert) => {
      setNotice(`🚨 URGENT SOS ALERT from ${sosAlert.studentName} on Bus ${sosAlert.busId}!`);
    });

    return () => {
      socket.off("admin:message");
      socket.off("admin:sos");
    };
  }, [socket, headers]);

  // Mark message as resolved
  const handleResolveMessage = async (msgId) => {
    try {
      await axios.patch(`${API}/api/admin/messages/${msgId}/resolve`, {}, { headers });
      setMessages((prev) =>
        prev.map((m) => (m.id === msgId ? { ...m, status: "resolved" } : m))
      );
      setNotice("Message marked as Resolved.");
    } catch (e) {
      console.error(e);
    }
  };

  // Delete / Dismiss message
  const handleDeleteMessage = async (msgId) => {
    try {
      await axios.delete(`${API}/api/admin/messages/${msgId}`, { headers });
      setMessages((prev) => prev.filter((m) => m.id !== msgId));
      setNotice("Message dismissed.");
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
      setNotice("Official Announcement broadcasted to all Student and Driver portals!");
      setTimeout(() => {
        setBroadcastTitle("");
        setBroadcastDesc("");
        setBroadcastSent(false);
      }, 3500);
    } catch (e) {
      setNotice(e.response?.data?.message || "Failed to publish broadcast.");
    }
  };

  // Filter messages
  const filteredMessages = messages.filter((m) => {
    const matchesSearch =
      m.senderName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.busId.toLowerCase().includes(searchTerm.toLowerCase());

    if (inboxFilter === "all") return matchesSearch;
    if (inboxFilter === "sos") return matchesSearch && m.category === "sos";
    if (inboxFilter === "traffic")
      return (
        matchesSearch &&
        (m.category === "traffic" || m.category === "breakdown")
      );
    if (inboxFilter === "query")
      return matchesSearch && (m.category === "query" || m.senderType === "student");

    return matchesSearch;
  });

  const unreadCount = messages.filter((m) => m.status === "unread").length;
  const selectedBus = buses.find((b) => b.id === selectedBusId) || buses[0];

  return (
    <div className={`app-container admin-theme ${timeMode}`}>
      {/* Admin Left Sidebar Navigation */}
      <aside className="sidebar-nav admin-sidebar">
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
            <p>Fleet Transport Control Room</p>
          </div>
        </div>

        {/* Admin Profile Badge */}
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

        {/* Fleet Status Summary Pill */}
        <div className="admin-fleet-quick-summary">
          <div className="summary-row">
            <small>Active Fleet</small>
            <b>{buses.length} / {buses.length} Vehicles</b>
          </div>
          <div className="summary-row">
            <small>Total Capacity</small>
            <b>364 Seats</b>
          </div>
          <div className="summary-row">
            <small>GPS Network</small>
            <span className="gps-live-tag">● 100% Online</span>
          </div>
        </div>

        <button className="sidebar-logout-btn" onClick={logout}>
          <span>🚪</span> Sign Out
        </button>
      </aside>

      {/* Main Admin Content Area */}
      <main className="main-content-scroll admin-main">
        {/* Top Header */}
        <header className="dashboard-top-header admin-header">
          <div>
            <span className="admin-eyebrow">
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
              <span>RADAR COMMAND ACTIVE</span>
            </div>
          </div>
        </header>

        {notice && (
          <div className="notice-banner admin-notice-banner">
            <span>ℹ️</span> {notice}
          </div>
        )}

        {/* TAB 1: LIVE INBOX & DISPATCH MESSAGES */}
        {activeTab === "inbox" && (
          <div className="tab-pane-fade-in admin-inbox-section">
            {/* Inbox Header & Summary */}
            <div className="inbox-header-hero">
              <div>
                <span className="inbox-badge-tag">REAL-TIME DISPATCH DISK</span>
                <h2>Driver & Student Live Communications Inbox</h2>
                <p>
                  Receive real-time Emergency SOS alerts, driver road incident
                  reports, traffic delays, and student transit inquiries.
                </p>
              </div>

              <div className="inbox-stats-cluster">
                <div className="inbox-stat-item">
                  <b>{messages.length}</b>
                  <small>Total Alerts</small>
                </div>
                <div className="inbox-stat-item unread">
                  <b>{unreadCount}</b>
                  <small>Action Required</small>
                </div>
                <div className="inbox-stat-item resolved">
                  <b>{messages.length - unreadCount}</b>
                  <small>Resolved</small>
                </div>
              </div>
            </div>

            {/* Filter & Search Toolbar */}
            <div className="inbox-toolbar">
              <div className="inbox-search-wrap">
                <span>🔍</span>
                <input
                  type="text"
                  placeholder="Search sender, student name, driver, bus #, or message text..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                {searchTerm && (
                  <button
                    className="clear-search-btn"
                    onClick={() => setSearchTerm("")}
                  >
                    ✕
                  </button>
                )}
              </div>

              <div className="inbox-filter-pills">
                <button
                  className={`filter-btn ${inboxFilter === "all" ? "active" : ""}`}
                  onClick={() => setInboxFilter("all")}
                >
                  All Messages ({messages.length})
                </button>
                <button
                  className={`filter-btn sos ${inboxFilter === "sos" ? "active" : ""}`}
                  onClick={() => setInboxFilter("sos")}
                >
                  🚨 Student SOS Alerts
                </button>
                <button
                  className={`filter-btn traffic ${inboxFilter === "traffic" ? "active" : ""}`}
                  onClick={() => setInboxFilter("traffic")}
                >
                  ⚠️ Driver Road Incidents
                </button>
                <button
                  className={`filter-btn query ${inboxFilter === "query" ? "active" : ""}`}
                  onClick={() => setInboxFilter("query")}
                >
                  💬 Student Queries
                </button>
              </div>
            </div>

            {/* Message Cards List */}
            <div className="inbox-messages-list">
              {filteredMessages.map((msg) => {
                const isSos = msg.category === "sos";
                const isTraffic = msg.category === "traffic" || msg.category === "breakdown";
                const isUnread = msg.status === "unread";

                return (
                  <div
                    key={msg.id}
                    className={`inbox-message-card ${
                      isSos ? "sos-card" : isTraffic ? "traffic-card" : "query-card"
                    } ${isUnread ? "unread" : "resolved"}`}
                  >
                    <div className="msg-card-sidebar">
                      <div className="msg-sender-avatar">
                        {msg.senderType === "driver" ? "👨‍✈️" : "🎓"}
                      </div>
                      <span className={`msg-role-pill ${msg.senderType}`}>
                        {msg.senderType?.toUpperCase()}
                      </span>
                    </div>

                    <div className="msg-card-content">
                      <div className="msg-card-header">
                        <div className="msg-title-group">
                          <h4>{msg.title}</h4>
                          <div className="msg-meta-row">
                            <span className="msg-sender-name">
                              From: <b>{msg.senderName}</b>
                            </span>
                            <span className="msg-bus-tag">
                              🚍 {msg.busId?.toUpperCase()}
                            </span>
                            <span className="msg-timestamp">
                              🕒 {new Date(msg.time).toLocaleTimeString()}
                            </span>
                          </div>
                        </div>

                        <div className="msg-status-badge-wrap">
                          {isUnread ? (
                            <span className="msg-status-pill unread">
                              ● Action Required
                            </span>
                          ) : (
                            <span className="msg-status-pill resolved">
                              ✓ Resolved
                            </span>
                          )}
                        </div>
                      </div>

                      <p className="msg-body-text">{msg.content}</p>

                      <div className="msg-action-footer">
                        {isUnread ? (
                          <button
                            className="btn-mark-resolve"
                            onClick={() => handleResolveMessage(msg.id)}
                          >
                            ✓ Mark as Resolved
                          </button>
                        ) : (
                          <span className="resolved-note">
                            ✓ Handled by Transport Dispatch
                          </span>
                        )}

                        {isSos && (
                          <a
                            href="tel:+914222367890"
                            className="btn-dispatch-security"
                          >
                            🚨 Call Main Security Desk
                          </a>
                        )}

                        <button
                          className="btn-dismiss-msg"
                          onClick={() => handleDeleteMessage(msg.id)}
                          title="Dismiss message"
                        >
                          🗑️ Dismiss
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}

              {filteredMessages.length === 0 && (
                <div className="inbox-empty-state">
                  <div className="empty-icon">📭</div>
                  <h3>No messages in this filter</h3>
                  <p>All driver incident reports and student queries are up to date.</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 2: FLEET OPERATIONS RADAR */}
        {activeTab === "fleet" && (
          <div className="tab-pane-fade-in admin-fleet-section">
            <div className="fleet-hero-header">
              <h2>KIT Coimbatore Fleet Radar & Live Status</h2>
              <p>Multi-vehicle telemetry, real-time cruising coordinates, and route load</p>
            </div>

            {/* Quick Bus Selector Bar */}
            <div className="admin-bus-selector-bar">
              {buses.map((b) => (
                <button
                  key={b.id}
                  className={`admin-bus-chip ${selectedBusId === b.id ? "active" : ""}`}
                  onClick={() => setSelectedBusId(b.id)}
                >
                  <span className="chip-num">{b.number}</span>
                  <span className="chip-name">{b.name}</span>
                  <span className="chip-load">
                    {b.occupancy}/{b.capacity} Seats
                  </span>
                </button>
              ))}
            </div>

            {/* Fleet Operations Grid */}
            <div className="admin-fleet-grid">
              <div className="admin-map-wrap">
                <div className="admin-map-head">
                  <h3>🛰️ Real-Time Map • {selectedBus?.name}</h3>
                  <span>{selectedBus?.waypoints?.length || 0} Coimbatore Stops</span>
                </div>
                <CoimbatoreTransitMap
                  bus={selectedBus}
                  location={selectedBus?.lastLocation}
                  timeMode={timeMode}
                />
              </div>

              <div className="admin-bus-telemetry-card">
                <h3>Vehicle Telemetry Dossier</h3>
                <div className="dossier-rows">
                  <div className="dossier-row">
                    <span>Route Corridor</span>
                    <b>{selectedBus?.route}</b>
                  </div>
                  <div className="dossier-row">
                    <span>Assigned Driver</span>
                    <b>{selectedBus?.driver?.name}</b>
                  </div>
                  <div className="dossier-row">
                    <span>Driver Contact</span>
                    <a href={`tel:${selectedBus?.driver?.phone}`}>
                      {selectedBus?.driver?.phone}
                    </a>
                  </div>
                  <div className="dossier-row">
                    <span>Plate Number</span>
                    <b className="mono">{selectedBus?.driver?.plateNumber}</b>
                  </div>
                  <div className="dossier-row">
                    <span>Seating Load</span>
                    <b>
                      {selectedBus?.occupancy} / {selectedBus?.capacity} (
                      {selectedBus?.capacity - selectedBus?.occupancy} available)
                    </b>
                  </div>
                  <div className="dossier-row">
                    <span>GPS Signal</span>
                    <b className="good">Active Dual-Band GPS</b>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: DRIVERS & VEHICLE REGISTRY */}
        {activeTab === "drivers" && (
          <div className="tab-pane-fade-in admin-drivers-section">
            <div className="drivers-registry-header">
              <h2>KIT Campus Driver & Fleet Registry</h2>
              <p>Certified college bus drivers, driver ratings, and vehicle records</p>
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
                        <b>{b.driver?.name}</b>
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
                        <span className="rating-pill">⭐ {b.driver?.rating || 4.9}</span>
                      </td>
                      <td>
                        <button
                          className="table-track-btn"
                          onClick={() => {
                            setSelectedBusId(b.id);
                            setActiveTab("fleet");
                          }}
                        >
                          🛰️ Track Bus
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
            <div className="broadcast-hero-header">
              <h2>Official Fleet Notification Broadcast Center</h2>
              <p>
                Publish instant circulars and traffic advisories to all student
                portals and driver handsets in real-time.
              </p>
            </div>

            {broadcastSent && (
              <div className="broadcast-success-toast">
                <span>✓</span>
                <h4>Announcement Broadcasted Live!</h4>
                <p>All active student sessions and driver devices have received the update.</p>
              </div>
            )}

            <div className="broadcast-form-card">
              <form onSubmit={handlePublishBroadcast} className="admin-broadcast-form">
                <div className="form-row-group">
                  <label>Announcement Category</label>
                  <select
                    value={broadcastType}
                    onChange={(e) => setBroadcastType(e.target.value)}
                  >
                    <option value="info">📢 General Advisory / Transport Notice</option>
                    <option value="traffic">🚦 Live Traffic / Route Diversion</option>
                    <option value="weather">☀️ Weather & Transit Condition</option>
                    <option value="emergency">🚨 High-Priority Emergency Circular</option>
                  </select>
                </div>

                <div className="form-row-group">
                  <label>Announcement Title</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Special Return Buses for Semester Lab Sessions"
                    value={broadcastTitle}
                    onChange={(e) => setBroadcastTitle(e.target.value)}
                  />
                </div>

                <div className="form-row-group">
                  <label>Detailed Announcement Text</label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Write detailed instructions, departure bays, or timing changes..."
                    value={broadcastDesc}
                    onChange={(e) => setBroadcastDesc(e.target.value)}
                  />
                </div>

                <button type="submit" className="submit-broadcast-btn">
                  🚀 Publish Broadcast to All Portals
                </button>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
