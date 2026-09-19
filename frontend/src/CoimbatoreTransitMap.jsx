import React, { useEffect } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
  useMap,
} from "react-leaflet";
import L from "leaflet";
import kitLogo from "./assets/kit-logo.png";

// KIT College Campus coordinates
const KIT_CAMPUS_COORD = [10.9922, 77.0864];

// Custom Animated Bus DivIcon with dynamic heading and glowing aura
function createBusIcon(heading = 0, busNumber = "12") {
  return L.divIcon({
    className: "custom-leaflet-bus-icon",
    html: `
      <div class="map-bus-marker-container">
        <div class="map-bus-radar-pulse"></div>
        <div class="map-bus-body" style="transform: rotate(${heading}deg)">
          <div class="map-bus-roof">
            <span class="map-bus-badge">${busNumber}</span>
          </div>
          <div class="map-bus-windshield"></div>
          <div class="map-bus-headlights"></div>
        </div>
      </div>
    `,
    iconSize: [48, 48],
    iconAnchor: [24, 24],
    popupAnchor: [0, -26],
  });
}

// Custom Stop Pin Icon
function createStopIcon(idx, isSelected = false, isPassed = false) {
  return L.divIcon({
    className: "custom-leaflet-stop-icon",
    html: `
      <div class="map-stop-pin ${isSelected ? "selected" : ""} ${
      isPassed ? "passed" : ""
    }">
        <div class="map-stop-dot">${idx + 1}</div>
      </div>
    `,
    iconSize: [28, 28],
    iconAnchor: [14, 14],
    popupAnchor: [0, -16],
  });
}

// KIT College Destination Pin Icon (Sleek & Compact)
const kitDestinationIcon = L.divIcon({
  className: "custom-leaflet-kit-icon",
  html: `
    <div class="map-kit-destination-pin">
      <div class="map-kit-crest-small">
        <span class="kit-pin-icon">🏫</span>
      </div>
      <div class="map-kit-tag-small">KIT Campus</div>
    </div>
  `,
  iconSize: [28, 28],
  iconAnchor: [14, 14],
  popupAnchor: [0, -18],
});

// Map Controller for Smooth Flying and View Centering
function MapController({ targetPos, zoomLevel }) {
  const map = useMap();
  useEffect(() => {
    if (targetPos && targetPos.length === 2) {
      map.flyTo(targetPos, zoomLevel || 14, { duration: 1.2 });
    }
  }, [targetPos, zoomLevel, map]);
  return null;
}

export default function CoimbatoreTransitMap({
  bus,
  location,
  selectedStop,
  onSelectStop,
  timeMode = "night",
}) {
  const waypoints = bus?.waypoints || [];
  const polylineCoords = waypoints.map((w) => [w.lat, w.lng]);

  const busPos = location
    ? [location.lat, location.lng]
    : waypoints[2]
    ? [waypoints[2].lat, waypoints[2].lng]
    : KIT_CAMPUS_COORD;

  const busHeading = location?.heading || 0;
  const busNumber = bus?.number || "12";

  // Map Tile URL based on Day/Night
  const tileUrl =
    timeMode === "day"
      ? "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      : "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png";

  return (
    <div className="coimbatore-transit-map-wrapper">
      {/* Map Floating HUD Overlay */}
      <div className="map-hud-top-bar">
        <div className="hud-route-badge">
          <span className="route-dot" />
          <b>{bus?.name || "KIT Route"}</b>
          <span className="hud-sep">•</span>
          <small>{bus?.waypoints?.length || 0} Coimbatore Stops</small>
        </div>
        <div className="hud-destination-pill">
          <span>🎯 Destination:</span>
          <b>Kalaignar Karunanidhi Institute of Technology (Kannampalayam)</b>
        </div>
      </div>

      <MapContainer
        center={busPos}
        zoom={13}
        scrollWheelZoom={true}
        className="leaflet-transit-canvas"
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url={tileUrl}
        />
        <MapController targetPos={busPos} zoomLevel={14} />

        {/* 1. Transit Route Polyline */}
        {polylineCoords.length > 1 && (
          <>
            <Polyline
              positions={polylineCoords}
              pathOptions={{
                color: "#1e3a8a",
                weight: 8,
                opacity: 0.5,
              }}
            />
            <Polyline
              positions={polylineCoords}
              pathOptions={{
                color: "#c01823",
                weight: 4,
                opacity: 0.9,
                dashArray: "8, 8",
              }}
            />
          </>
        )}

        {/* 2. Intermediate Coimbatore Bus Stops */}
        {waypoints.map((w, idx) => {
          const isSelected = selectedStop?.name === w.name;
          const isLast = idx === waypoints.length - 1;
          if (isLast) return null; // Last stop is rendered as KIT College Crest

          const isPassed =
            location?.currentStopIndex !== undefined &&
            idx < location.currentStopIndex;

          return (
            <Marker
              key={w.name}
              position={[w.lat, w.lng]}
              icon={createStopIcon(idx, isSelected, isPassed)}
            >
              <Popup className="custom-transit-popup">
                <div className="popup-stop-content">
                  <div className="popup-badge">Stop #{idx + 1}</div>
                  <h4>{w.name}</h4>
                  <p className="popup-time">
                    🕒 Scheduled: <b>{w.time}</b>
                  </p>
                  <p className="popup-eta">
                    ⏳ ETA from Bus: <b>{w.etaMin || 10} mins</b>
                  </p>
                  <button
                    className="popup-select-btn"
                    onClick={() => onSelectStop && onSelectStop(w)}
                  >
                    {isSelected ? "✓ My Selected Stop" : "🎯 Set as My Boarding Stop"}
                  </button>
                </div>
              </Popup>
            </Marker>
          );
        })}

        {/* 3. Destination: Kalaignar Karunanidhi Institute of Technology Crest */}
        <Marker position={KIT_CAMPUS_COORD} icon={kitDestinationIcon}>
          <Popup className="custom-transit-popup">
            <div className="popup-kit-content">
              <div className="popup-kit-badge">INSTITUTION DESTINATION</div>
              <h4>Kalaignar Karunanidhi Institute of Technology</h4>
              <p className="popup-kit-sub">Autonomous • NAAC 'A' Grade</p>
              <p className="popup-kit-address">
                📍 Kannampalayam Post, Trichy Road, Coimbatore - 641402
              </p>
              <div className="popup-kit-status">
                <span>🚍 Fleet Terminal:</span> <b>Active & Ready</b>
              </div>
            </div>
          </Popup>
        </Marker>

        {/* 4. Live Moving KIT Bus Marker */}
        <Marker position={busPos} icon={createBusIcon(busHeading, busNumber)}>
          <Popup className="custom-transit-popup">
            <div className="popup-bus-content">
              <div className="popup-bus-header">
                <span className="live-pill">● LIVE GPS</span>
                <h4>{bus?.name}</h4>
              </div>
              <div className="popup-bus-row">
                <span>Driver:</span>
                <b>{bus?.driver?.name}</b>
              </div>
              <div className="popup-bus-row">
                <span>Speed:</span>
                <b>{location?.speed || 38} km/h</b>
              </div>
              <div className="popup-bus-row">
                <span>Next Stop:</span>
                <b>{location?.nextStop || "KIT College Campus"}</b>
              </div>
              <div className="popup-bus-row">
                <span>Occupancy:</span>
                <b>
                  {bus?.occupancy}/{bus?.capacity} Seats
                </b>
              </div>
            </div>
          </Popup>
        </Marker>
      </MapContainer>

      {/* Map Bottom Quick Action Buttons */}
      <div className="map-quick-toolbar">
        <button
          className="map-tool-btn"
          onClick={() => {
            const map = document.querySelector(".leaflet-container")?._leaflet_map;
            if (map) map.flyTo(busPos, 15, { duration: 1 });
          }}
          title="Center on My Bus"
        >
          🎯 Focus Bus
        </button>
        <button
          className="map-tool-btn"
          onClick={() => {
            const map = document.querySelector(".leaflet-container")?._leaflet_map;
            if (map) map.flyTo(KIT_CAMPUS_COORD, 15, { duration: 1 });
          }}
          title="Center on KIT College Campus"
        >
          🏫 KIT Campus
        </button>
      </div>
    </div>
  );
}
