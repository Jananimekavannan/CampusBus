import React, { useState } from "react";

export default function TransitAdvisoryView({ timeMode = "night" }) {
  const [feedbackCategory, setFeedbackCategory] = useState("general");
  const [feedbackMsg, setFeedbackMsg] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!feedbackMsg.trim()) return;
    setSubmitted(true);
    setTimeout(() => {
      setFeedbackMsg("");
      setSubmitted(false);
    }, 4000);
  };

  const trafficAlerts = [
    {
      id: "t1",
      location: "Trichy Road • Singanallur Junction",
      status: "Smooth Flow",
      delay: "0 mins",
      type: "good",
      desc: "Flyover traffic moving freely towards Ondipudur & KIT Kannampalayam.",
      time: "Updated 3 mins ago",
    },
    {
      id: "t2",
      location: "Avinashi Road • Peelamedu / PSG Tech",
      status: "Moderate Congestion",
      delay: "+5 mins",
      type: "warn",
      desc: "Morning peak metro construction slow-moving near Hope College junction.",
      time: "Updated 7 mins ago",
    },
    {
      id: "t3",
      location: "Pollachi Road • Eachanari Temple Signal",
      status: "Clear",
      delay: "0 mins",
      type: "good",
      desc: "Highway lane clear, Bus 21 cruising on schedule towards Sundarapuram.",
      time: "Updated 10 mins ago",
    },
    {
      id: "t4",
      location: "Mettupalayam Road • Thudiyalur Bypass",
      status: "Clear",
      delay: "0 mins",
      type: "good",
      desc: "Normal traffic flow towards Saibaba Colony & Gandhipuram.",
      time: "Updated 15 mins ago",
    },
  ];

  const circulars = [
    {
      id: "c1",
      title: "Special Evening Return Buses for Semester Lab Sessions",
      date: "19 Sep 2026",
      badge: "CIRCULAR",
      desc: "In addition to regular 04:30 PM departures, special buses will depart from the KIT Main Campus Bus Bay at 05:45 PM for Gandhipuram and Pollachi lines.",
    },
    {
      id: "c2",
      title: "Mandatory Student RFID Bus Pass Tap-In Policy",
      date: "17 Sep 2026",
      badge: "NOTICE",
      desc: "All students are requested to tap their smart ID card on the onboard RFID scanner upon boarding to ensure automated parent notification & attendance logging.",
    },
    {
      id: "c3",
      title: "Monsoon Preparedness & High-Precision GPS Sync",
      date: "15 Sep 2026",
      badge: "TRANSPORT DEPT",
      desc: "All KIT fleet vehicles have undergone routine maintenance and real-time dual-band GPS telemetry calibration for high-precision live tracking.",
    },
  ];

  return (
    <div className="transit-advisory-page">
      {/* Header */}
      <div className="advisory-header-banner">
        <div>
          <span className="advisory-badge-tag">KIT TRANSPORT HEADQUARTERS</span>
          <h2>Campus Transit Bulletins & Traffic Advisory</h2>
          <p>
            Real-time traffic telemetry along major Coimbatore transit corridors,
            weather conditions at Kannampalayam, and official transport advisories.
          </p>
        </div>
        <div className="campus-weather-box">
          <div className="weather-sun-icon">☀️</div>
          <div>
            <b>28°C • Sunny</b>
            <small>KIT Campus, Kannampalayam</small>
            <div className="weather-sub-metrics">
              <span>💧 Humidity: 62%</span>
              <span>💨 Wind: 12 km/h</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Advisory Content Grid */}
      <div className="advisory-content-grid">
        {/* Left Column: Real-Time Traffic Feed */}
        <div className="advisory-left-column">
          <div className="advisory-panel traffic-feed-panel">
            <div className="panel-title-row">
              <h3>🚦 Live Coimbatore Corridor Traffic Status</h3>
              <span className="traffic-pulse-badge">● LIVE RADAR</span>
            </div>

            <div className="traffic-alerts-list">
              {trafficAlerts.map((t) => (
                <div key={t.id} className={`traffic-alert-card ${t.type}`}>
                  <div className="traffic-alert-top">
                    <b>{t.location}</b>
                    <span className={`traffic-delay-pill ${t.type}`}>
                      {t.status} ({t.delay})
                    </span>
                  </div>
                  <p>{t.desc}</p>
                  <small>{t.time}</small>
                </div>
              ))}
            </div>
          </div>

          {/* Official Transport Circulars */}
          <div className="advisory-panel circulars-panel">
            <div className="panel-title-row">
              <h3>📢 Official Transport Department Circulars</h3>
            </div>

            <div className="circulars-list">
              {circulars.map((c) => (
                <div key={c.id} className="circular-item">
                  <div className="circular-top">
                    <span className="circular-badge">{c.badge}</span>
                    <span className="circular-date">{c.date}</span>
                  </div>
                  <h4>{c.title}</h4>
                  <p>{c.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Helpdesk Directory & Student Query Form */}
        <div className="advisory-right-column">
          {/* Helpdesk Directory */}
          <div className="advisory-panel helpdesk-panel">
            <h3>📞 24x7 Transport Helpline Directory</h3>
            <p className="helpdesk-sub">
              For any transit assistance, route inquiries, or lost property:
            </p>

            <div className="helpdesk-cards-list">
              <div className="helpdesk-contact-card">
                <div className="contact-icon">👮</div>
                <div className="contact-info">
                  <b>KIT Campus Security Control</b>
                  <small>Main Gate Security Desk (24/7)</small>
                  <a href="tel:+914222367890">0422-2367890</a>
                </div>
              </div>

              <div className="helpdesk-contact-card">
                <div className="contact-icon">🚍</div>
                <div className="contact-info">
                  <b>KIT Transport Officer</b>
                  <small>Mr. R. Shanmugam (Transport Incharge)</small>
                  <a href="tel:+919442212345">+91 94422 12345</a>
                </div>
              </div>

              <div className="helpdesk-contact-card">
                <div className="contact-icon">🚑</div>
                <div className="contact-info">
                  <b>KIT Campus Health & Ambulance</b>
                  <small>Campus Medical Center</small>
                  <a href="tel:+914222611111">0422-2611111 / 108</a>
                </div>
              </div>
            </div>
          </div>

          {/* Student Feedback & Route Request Form */}
          <div className="advisory-panel feedback-form-panel">
            <h3>💬 Student Transit Query & Feedback</h3>
            <p className="helpdesk-sub">
              Submit stop requests, feedback on bus timing, or lost & found
              inquiries directly to the transport cell:
            </p>

            {submitted ? (
              <div className="feedback-success-msg">
                <span>✓</span>
                <h4>Feedback Submitted Successfully!</h4>
                <p>
                  Your inquiry has been logged with the KIT Transport Cell. A
                  coordinator will review it shortly.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="advisory-feedback-form">
                <div className="form-group">
                  <label>Category</label>
                  <select
                    value={feedbackCategory}
                    onChange={(e) => setFeedbackCategory(e.target.value)}
                  >
                    <option value="general">General Feedback</option>
                    <option value="stop_request">New Stop / Pickup Request</option>
                    <option value="timing">Bus Timing / Delay Report</option>
                    <option value="lost_found">Lost & Found in Bus</option>
                    <option value="driver">Driver / Vehicle Commendation</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Message / Details</label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Provide route number, stop name, or details..."
                    value={feedbackMsg}
                    onChange={(e) => setFeedbackMsg(e.target.value)}
                  />
                </div>

                <button type="submit" className="submit-feedback-btn">
                  Submit to Transport Cell
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
