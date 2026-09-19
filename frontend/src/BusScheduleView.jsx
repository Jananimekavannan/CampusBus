import React, { useState } from "react";

export default function BusScheduleView({ buses, onTrackBus, timeMode = "night" }) {
  const [scheduleType, setScheduleType] = useState("morning"); // 'morning', 'evening', 'exam'

  return (
    <div className="bus-schedule-page">
      {/* Header Banner */}
      <div className="schedule-header-banner">
        <div>
          <span className="schedule-badge-tag">OFFICIAL TIMETABLE 2026</span>
          <h2>KIT College Master Bus Transit Timetable</h2>
          <p>
            Scheduled departure and arrival timings across all Coimbatore routes
            for Regular Working Days and Special Lab Sessions.
          </p>
        </div>

        {/* Schedule Type Toggle */}
        <div className="schedule-tabs-pill">
          <button
            className={`schedule-tab-btn ${scheduleType === "morning" ? "active" : ""}`}
            onClick={() => setScheduleType("morning")}
          >
            ☀️ Morning Pickup
          </button>
          <button
            className={`schedule-tab-btn ${scheduleType === "evening" ? "active" : ""}`}
            onClick={() => setScheduleType("evening")}
          >
            🌙 Evening Return
          </button>
          <button
            className={`schedule-tab-btn ${scheduleType === "exam" ? "active" : ""}`}
            onClick={() => setScheduleType("exam")}
          >
            📝 Exam / Saturday
          </button>
        </div>
      </div>

      {/* Schedule Table Container */}
      <div className="schedule-table-card">
        <div className="table-header-strip">
          <h3>
            {scheduleType === "morning"
              ? "☀️ Morning College Inbound Schedule (Arrival at KIT Campus: ~08:20 AM)"
              : scheduleType === "evening"
              ? "🌙 Evening Outbound Schedule (Departure from KIT Bus Bay: 04:30 PM & 05:45 PM)"
              : "📝 Saturday & Examination Special Schedule"}
          </h3>
          <span className="live-status-pill">● Regular Service Active</span>
        </div>

        <div className="schedule-table-wrapper">
          <table className="master-schedule-table">
            <thead>
              <tr>
                <th>Bus #</th>
                <th>Route Corridor</th>
                <th>Origin / Key Boarding Points</th>
                <th>
                  {scheduleType === "morning"
                    ? "Start Time"
                    : scheduleType === "evening"
                    ? "Campus Dep."
                    : "Exam Start"}
                </th>
                <th>
                  {scheduleType === "morning"
                    ? "KIT Arrival"
                    : scheduleType === "evening"
                    ? "Final Dest."
                    : "Exam Arrival"}
                </th>
                <th>Driver & Contact</th>
                <th>Live Action</th>
              </tr>
            </thead>
            <tbody>
              {buses.map((b) => {
                const origin = b.waypoints[0]?.name || "Origin";
                const totalStops = b.waypoints.length;
                const startTime = b.waypoints[0]?.time || "07:30 AM";
                const arrivalTime = b.waypoints[totalStops - 1]?.time || "08:20 AM";

                return (
                  <tr key={b.id}>
                    <td>
                      <span className="bus-number-chip">{b.number}</span>
                    </td>
                    <td>
                      <b className="route-name-title">{b.name}</b>
                      <small className="stops-count-sub">
                        {totalStops} Coimbatore Stops
                      </small>
                    </td>
                    <td>
                      <div className="stops-inline-preview">
                        <span>{origin}</span> ➔{" "}
                        <span>{b.waypoints[Math.floor(totalStops / 2)]?.name}</span>{" "}
                        ➔ <span>KIT College</span>
                      </div>
                    </td>
                    <td>
                      <b className="time-highlight">
                        {scheduleType === "morning"
                          ? startTime
                          : scheduleType === "evening"
                          ? "04:30 PM"
                          : "08:15 AM"}
                      </b>
                    </td>
                    <td>
                      <b className="time-highlight arrival">
                        {scheduleType === "morning"
                          ? arrivalTime
                          : scheduleType === "evening"
                          ? "05:35 PM"
                          : "09:00 AM"}
                      </b>
                    </td>
                    <td>
                      <div className="driver-table-cell">
                        <b>{b.driver?.name}</b>
                        <small>{b.driver?.phone}</small>
                      </div>
                    </td>
                    <td>
                      <button
                        className="table-track-btn"
                        onClick={() => onTrackBus(b.id)}
                      >
                        🛰️ Track Live
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
