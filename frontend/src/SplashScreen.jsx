import React, { useEffect, useState } from "react";
import kitLogo from "./assets/kit-logo.png";

/**
 * KITBusMiss - High-Tech College Bus Fleet Intelligence Splash Screen
 * Themed 100% around real-time KIT College Bus GPS Telemetry & Transit Radar:
 * - Cyber GPS radar grid with orbital tracking satellites & telemetry coordinates
 * - Coimbatore Transit Corridor Waypoint nodes (Gandhipuram ➔ Peelamedu ➔ KIT Campus)
 * - Sleek Side-View KIT College Bus with LED destination board, headlight beams, and underglow
 * - Futuristic glassmorphic HUD center card with rotating radar rings around KIT logo
 * - Live real-time subsystem initialization status
 */
export default function SplashScreen({ onFinish }) {
  const [progress, setProgress] = useState(0);

  // Dynamic real-time subsystem loading telemetry
  const getStatusText = (p) => {
    if (p < 20) return "🛰️ Calibrating GPS Dual-Band Satellites (10.9922°N, 77.0864°E)...";
    if (p < 40) return "🗺️ Mapping 7 Coimbatore Transit Corridors & 38 Stops...";
    if (p < 65) return "🚍 Linking Active KIT College Fleet Telemetry & Speed Sensors...";
    if (p < 85) return "⚡ Synchronizing Real-Time Student & Driver WebSockets...";
    if (p < 98) return "🛡️ Authenticating Central Fleet Command Network...";
    return "✓ KIT Transit Radar Online! Launching Portal...";
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => onFinish(), 350);
          return 100;
        }
        return prev + 2;
      });
    }, 45); // ~2.2s smooth load

    return () => clearInterval(interval);
  }, [onFinish]);

  return (
    <div className="splash-screen tech-splash">
      {/* 1. High-Tech Cyber Radar Background with Orbital Satellites & Waypoints */}
      <div className="splash-tech-bg">
        {/* Radar Matrix Coordinate Grid */}
        <div className="splash-radar-grid" />

        {/* Orbiting GPS Satellites */}
        <div className="splash-gps-satellite sat-1">
          <div className="sat-icon">🛰️</div>
          <span className="sat-label">KIT-GPS-SAT-01</span>
          <div className="sat-ping-ring" />
        </div>

        <div className="splash-gps-satellite sat-2">
          <div className="sat-icon">🛰️</div>
          <span className="sat-label">COIMBATORE-GEO-02</span>
          <div className="sat-ping-ring" />
        </div>

        {/* Floating Coimbatore Transit Waypoint Constellation */}
        <div className="splash-waypoints-strip">
          <div className="wp-node wp-1">
            <span className="wp-dot" />
            <span className="wp-text">Gandhipuram</span>
          </div>
          <div className="wp-line" />
          <div className="wp-node wp-2">
            <span className="wp-dot" />
            <span className="wp-text">Peelamedu</span>
          </div>
          <div className="wp-line" />
          <div className="wp-node wp-3">
            <span className="wp-dot" />
            <span className="wp-text">Singanallur</span>
          </div>
          <div className="wp-line" />
          <div className="wp-node wp-4">
            <span className="wp-dot" />
            <span className="wp-text">Sulur</span>
          </div>
          <div className="wp-line" />
          <div className="wp-node wp-5 active-kit">
            <span className="wp-dot kit-dot" />
            <span className="wp-text">KIT Campus</span>
          </div>
        </div>

        {/* Ambient Glowing Aurora Mesh Orbs */}
        <div className="splash-glow-orb orb-left" />
        <div className="splash-glow-orb orb-right" />
      </div>

      {/* 2. Centered Branding: High-Tech Glassmorphic HUD Card */}
      <div className="splash-center-content tech-card">
        {/* Telemetry Corner Tags */}
        <div className="splash-card-hud-strip">
          <span className="hud-tag">
            <span className="hud-pulse-dot" /> 5G DUAL-BAND GPS
          </span>
          <span className="hud-tag">ZONE: COIMBATORE METRO</span>
          <span className="hud-tag">FLEET: 7 ONLINE</span>
        </div>

        {/* KIT Coimbatore Logo with Rotating Radar Compass Rings */}
        <div className="splash-logo-wrap tech-logo">
          <div className="splash-radar-sweep-ring" />
          <div className="splash-outer-hud-ring" />
          <div className="splash-logo-halo" />
          <img src={kitLogo} alt="KIT Coimbatore Logo" className="splash-logo-img" />
        </div>

        <div className="splash-text-group">
          <span className="splash-institution-tag">
            KALAIGNARKARUNANIDHI INSTITUTE OF TECHNOLOGY
          </span>
          <h1 className="splash-title tech-title">
            KIT<span>BusMiss</span>
          </h1>
          <p className="splash-subtitle">
            Autonomous • NAAC 'A' • Real-Time Campus Fleet Intelligence
          </p>
        </div>

        {/* 3. Cyber Loading Progress Bar & Subsystem Telemetry */}
        <div className="splash-loading-box">
          <div className="splash-progress-track tech-track">
            <div
              className="splash-progress-bar tech-bar"
              style={{ width: `${progress}%` }}
            >
              <div className="splash-progress-glow-tip" />
            </div>
          </div>
          <div className="splash-loading-status">
            <span className="splash-status-phrase">{getStatusText(progress)}</span>
            <b className="splash-percent-num">{progress}%</b>
          </div>
        </div>
      </div>

      {/* 4. High-Tech Transit Highway with Speeding KIT College Bus */}
      <div className="splash-road-container tech-road-container">
        {/* Road Surface & Neon Rail Markings */}
        <div className="splash-highway tech-highway">
          <div className="splash-neon-rail top-rail" />
          <div className="splash-center-stripes tech-stripes" />
          <div className="splash-neon-rail bottom-rail" />
        </div>

        {/* Animated KIT College Bus driving from Left to Right */}
        <div
          className="splash-bus-traveler"
          style={{
            left: `calc(${progress}% * 1.15 - 130px)`,
          }}
        >
          {/* Detailed High-Tech Side-View KIT College Bus */}
          <div className="kit-bus-svg-wrapper bus-bouncing-chassis">
            <svg
              viewBox="0 0 280 120"
              className="kit-bus-svg"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Cyan Underglow Neon Shadow */}
              <ellipse cx="140" cy="112" rx="120" ry="8" fill="rgba(37,99,235,0.55)" filter="blur(4px)" />
              <ellipse cx="140" cy="112" rx="110" ry="5" fill="rgba(250,204,21,0.4)" filter="blur(3px)" />

              {/* Bus Main Chassis Body */}
              <rect
                x="15"
                y="20"
                width="240"
                height="75"
                rx="14"
                fill="#F59E0B"
                stroke="#B45309"
                strokeWidth="3"
              />

              {/* Roof AC Unit & Dual-Band GPS Beacon Antenna */}
              <rect
                x="80"
                y="10"
                width="80"
                height="12"
                rx="5"
                fill="#FFFFFF"
                stroke="#CBD5E1"
                strokeWidth="2"
              />
              <line x1="100" y1="13" x2="100" y2="19" stroke="#94A3B8" strokeWidth="2" />
              <line x1="120" y1="13" x2="120" y2="19" stroke="#94A3B8" strokeWidth="2" />
              <line x1="140" y1="13" x2="140" y2="19" stroke="#94A3B8" strokeWidth="2" />

              {/* GPS Antenna on Roof */}
              <circle cx="210" cy="14" r="5" fill="#38BDF8" />
              <line x1="210" y1="14" x2="210" y2="20" stroke="#0284C7" strokeWidth="3" />
              <circle cx="210" cy="14" r="9" fill="none" stroke="#38BDF8" strokeWidth="1.5" opacity="0.7" />

              {/* KIT Crimson & Navy Livery Stripes */}
              <rect x="15" y="70" width="240" height="12" fill="#C01823" />
              <rect x="15" y="44" width="240" height="3" fill="#1E3A8A" />

              {/* LED Electronic Route Board */}
              <rect x="180" y="24" width="65" height="14" rx="3" fill="#090E17" stroke="#38BDF8" strokeWidth="1" />
              <text
                x="212"
                y="34"
                fill="#38BDF8"
                fontSize="7.5"
                fontWeight="900"
                textAnchor="middle"
                fontFamily="sans-serif"
                letterSpacing="0.5"
              >
                12 • KIT CAMPUS
              </text>

              {/* Side Branding "KIT COIMBATORE • CAMPUS TRANSIT" */}
              <text
                x="125"
                y="79.5"
                fill="#FFFFFF"
                fontSize="9.5"
                fontWeight="900"
                letterSpacing="1.2"
                textAnchor="middle"
                fontFamily="sans-serif"
              >
                KALAIGNARKARUNANIDHI INST OF TECH
              </text>

              {/* Windows with Tinted Glass & Reflective Glare */}
              {/* Driver Front Windshield */}
              <path
                d="M 210 38 L 245 42 L 245 64 L 210 64 Z"
                fill="#0F172A"
                stroke="#334155"
                strokeWidth="2"
              />
              {/* Passenger Windows */}
              <rect x="168" y="38" width="36" height="26" rx="3" fill="#0F172A" stroke="#334155" strokeWidth="2" />
              <rect x="126" y="38" width="36" height="26" rx="3" fill="#0F172A" stroke="#334155" strokeWidth="2" />
              <rect x="84" y="38" width="36" height="26" rx="3" fill="#0F172A" stroke="#334155" strokeWidth="2" />
              <rect x="42" y="38" width="36" height="26" rx="3" fill="#0F172A" stroke="#334155" strokeWidth="2" />
              <rect x="22" y="38" width="16" height="26" rx="3" fill="#0F172A" stroke="#334155" strokeWidth="2" />

              {/* Glass Glare Slanted Lines */}
              <line x1="48" y1="42" x2="68" y2="60" stroke="rgba(255,255,255,0.4)" strokeWidth="2" />
              <line x1="90" y1="42" x2="110" y2="60" stroke="rgba(255,255,255,0.4)" strokeWidth="2" />
              <line x1="132" y1="42" x2="152" y2="60" stroke="rgba(255,255,255,0.4)" strokeWidth="2" />
              <line x1="174" y1="42" x2="194" y2="60" stroke="rgba(255,255,255,0.4)" strokeWidth="2" />

              {/* High-Intensity LED Headlight Projection */}
              <path d="M 252 74 L 257 76 L 257 84 L 252 86 Z" fill="#FEF08A" />
              <polygon
                points="257,75 295,55 295,105 257,85"
                fill="url(#headlightBeamGrad)"
              />

              {/* Rear LED Brake Light */}
              <rect x="13" y="74" width="4" height="12" rx="2" fill="#EF4444" />
              <polygon
                points="13,74 -20,65 -20,95 13,86"
                fill="rgba(239, 68, 68, 0.25)"
              />

              {/* Wheel Arches */}
              <circle cx="68" cy="95" r="19" fill="#0F172A" />
              <circle cx="205" cy="95" r="19" fill="#0F172A" />

              {/* Back Wheel with Alloy Rims */}
              <g className="bus-spinning-wheel" style={{ transformOrigin: "68px 95px" }}>
                <circle cx="68" cy="95" r="16" fill="#1E293B" stroke="#64748B" strokeWidth="3" />
                <circle cx="68" cy="95" r="7" fill="#E2E8F0" />
                <circle cx="68" cy="95" r="3" fill="#C01823" />
                <line x1="68" y1="82" x2="68" y2="108" stroke="#94A3B8" strokeWidth="2" />
                <line x1="55" y1="95" x2="81" y2="95" stroke="#94A3B8" strokeWidth="2" />
              </g>

              {/* Front Wheel with Alloy Rims */}
              <g className="bus-spinning-wheel" style={{ transformOrigin: "205px 95px" }}>
                <circle cx="205" cy="95" r="16" fill="#1E293B" stroke="#64748B" strokeWidth="3" />
                <circle cx="205" cy="95" r="7" fill="#E2E8F0" />
                <circle cx="205" cy="95" r="3" fill="#C01823" />
                <line x1="205" y1="82" x2="205" y2="108" stroke="#94A3B8" strokeWidth="2" />
                <line x1="192" y1="95" x2="218" y2="95" stroke="#94A3B8" strokeWidth="2" />
              </g>

              {/* Bus Door */}
              <rect x="208" y="40" width="2" height="42" fill="#334155" />

              <defs>
                <linearGradient id="headlightBeamGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="rgba(254, 240, 138, 0.75)" />
                  <stop offset="60%" stopColor="rgba(253, 224, 71, 0.3)" />
                  <stop offset="100%" stopColor="rgba(253, 224, 71, 0)" />
                </linearGradient>
              </defs>
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}
