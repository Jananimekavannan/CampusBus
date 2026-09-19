import React, { useState } from "react";

export default function RoutesExplorerView({
  buses,
  onTrackBus,
  timeMode = "night",
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [expandedBusId, setExpandedBusId] = useState(null);

  const filteredBuses = buses.filter((b) => {
    const matchesSearch =
      b.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.route.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.waypoints.some((w) =>
        w.name.toLowerCase().includes(searchTerm.toLowerCase())
      );

    if (selectedFilter === "all") return matchesSearch;
    if (selectedFilter === "central")
      return matchesSearch && (b.id === "bus12" || b.id === "bus3");
    if (selectedFilter === "north")
      return matchesSearch && (b.id === "bus8" || b.id === "bus15");
    if (selectedFilter === "south")
      return matchesSearch && b.id === "bus21";
    if (selectedFilter === "east")
      return matchesSearch && (b.id === "bus5" || b.id === "bus18");

    return matchesSearch;
  });

  return (
    <div className="routes-explorer-page">
      {/* Header Banner */}
      <div className="routes-header-banner">
        <div className="routes-header-info">
          <span className="routes-badge-tag">COIMBATORE TRANSIT NETWORK</span>
          <h2>KIT College Bus Route Directory & Stops</h2>
          <p>
            Explore all 7 high-frequency transit corridors connecting every hub
            near Coimbatore directly to <b>Kalaignar Karunanidhi Institute of Technology (Kannampalayam Campus)</b>.
          </p>
        </div>
        <div className="routes-stats-pill">
          <div className="stat-box">
            <b>{buses.length}</b>
            <small>Active Routes</small>
          </div>
          <div className="stat-box">
            <b>58+</b>
            <small>Boarding Stops</small>
          </div>
          <div className="stat-box">
            <b>100%</b>
            <small>GPS Monitored</small>
          </div>
        </div>
      </div>

      {/* Search & Zone Filter Toolbar */}
      <div className="routes-toolbar">
        <div className="routes-search-input-wrap">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            placeholder="Search stop name, locality (e.g. Peelamedu, Singanallur, Pollachi, Sulur, Karamadai)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {searchTerm && (
            <button
              className="search-clear-btn"
              onClick={() => setSearchTerm("")}
            >
              ✕
            </button>
          )}
        </div>

        <div className="routes-filter-chips">
          <button
            className={`filter-chip ${selectedFilter === "all" ? "active" : ""}`}
            onClick={() => setSelectedFilter("all")}
          >
            All Corridors ({buses.length})
          </button>
          <button
            className={`filter-chip ${selectedFilter === "central" ? "active" : ""}`}
            onClick={() => setSelectedFilter("central")}
          >
            Central & Gandhipuram
          </button>
          <button
            className={`filter-chip ${selectedFilter === "north" ? "active" : ""}`}
            onClick={() => setSelectedFilter("north")}
          >
            North (Mtp & Saravanampatti)
          </button>
          <button
            className={`filter-chip ${selectedFilter === "south" ? "active" : ""}`}
            onClick={() => setSelectedFilter("south")}
          >
            South (Pollachi & Eachanari)
          </button>
          <button
            className={`filter-chip ${selectedFilter === "east" ? "active" : ""}`}
            onClick={() => setSelectedFilter("east")}
          >
            East (Tirupur, Sulur & Annur)
          </button>
        </div>
      </div>

      {/* Route Cards Grid */}
      <div className="routes-cards-grid">
        {filteredBuses.map((b) => {
          const isExpanded = expandedBusId === b.id;
          const originStop = b.waypoints[0]?.name || "Origin";
          const totalStops = b.waypoints.length;
          const departureTime = b.waypoints[0]?.time || "07:30 AM";
          const arrivalTime = b.waypoints[totalStops - 1]?.time || "08:20 AM";

          return (
            <div key={b.id} className="route-detail-card">
              <div className="route-card-top">
                <div className="route-card-number-badge">
                  <span>BUS</span>
                  <b>{b.number}</b>
                </div>

                <div className="route-card-title-group">
                  <h3>{b.name}</h3>
                  <p className="route-path-summary">
                    📍 <b>{originStop}</b> ➔ <b>KIT College Campus</b>
                  </p>
                </div>

                <button
                  className="track-live-btn"
                  onClick={() => onTrackBus(b.id)}
                  title="Track this bus live on map"
                >
                  <span>🛰️</span> Track Live GPS
                </button>
              </div>

              {/* Transit Highlights Row */}
              <div className="route-meta-highlights">
                <div className="meta-highlight-item">
                  <span className="icon">🕒</span>
                  <div>
                    <small>Morning Departure</small>
                    <b>{departureTime}</b>
                  </div>
                </div>
                <div className="meta-highlight-item">
                  <span className="icon">🏫</span>
                  <div>
                    <small>KIT Campus Arrival</small>
                    <b>{arrivalTime}</b>
                  </div>
                </div>
                <div className="meta-highlight-item">
                  <span className="icon">📍</span>
                  <div>
                    <small>Total Stops</small>
                    <b>{totalStops} Coimbatore Stops</b>
                  </div>
                </div>
                <div className="meta-highlight-item">
                  <span className="icon">💺</span>
                  <div>
                    <small>Seating Load</small>
                    <b>
                      {b.occupancy}/{b.capacity} ({b.capacity - b.occupancy} free)
                    </b>
                  </div>
                </div>
              </div>

              {/* Driver and Vehicle Meta */}
              <div className="route-driver-strip">
                <div className="driver-mini-info">
                  <span className="driver-avatar-mini">👨‍✈️</span>
                  <div>
                    <b>{b.driver?.name || "Assigned Driver"}</b>
                    <small>
                      Plate: {b.driver?.plateNumber || "TN 38 BK 2024"} • Exp:{" "}
                      {b.driver?.experience || "10+ yrs"} • ⭐{" "}
                      {b.driver?.rating || 4.9}
                    </small>
                  </div>
                </div>
                <a
                  href={`tel:${b.driver?.phone || "+919842188412"}`}
                  className="driver-phone-btn"
                >
                  📞 {b.driver?.phone || "Call Driver"}
                </a>
              </div>

              {/* Expandable Stops Sequence */}
              <div className="route-stops-expandable">
                <button
                  className="toggle-stops-btn"
                  onClick={() =>
                    setExpandedBusId(isExpanded ? null : b.id)
                  }
                >
                  <span>{isExpanded ? "▲ Hide Stop Schedule" : "▼ View All " + totalStops + " Boarding Stops & Timings"}</span>
                </button>

                {isExpanded && (
                  <div className="stops-sequence-expanded-list">
                    {b.waypoints.map((w, idx) => (
                      <div key={w.name} className="stop-sequence-row">
                        <div className="stop-step-dot">
                          {idx === totalStops - 1 ? "🏫" : idx + 1}
                        </div>
                        <div className="stop-step-name">
                          <b>{w.name}</b>
                          {idx === totalStops - 1 && (
                            <span className="dest-tag">KIT CAMPUS (DESTINATION)</span>
                          )}
                        </div>
                        <div className="stop-step-time">
                          <span>🕒 {w.time}</span>
                          <small>ETA: {w.etaMin}m</small>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {filteredBuses.length === 0 && (
          <div className="no-routes-found-box">
            <div className="no-routes-icon">🔍</div>
            <h3>No routes match "{searchTerm}"</h3>
            <p>Try searching for a different locality or clear the search filter.</p>
            <button
              className="clear-filters-btn"
              onClick={() => {
                setSearchTerm("");
                setSelectedFilter("all");
              }}
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
