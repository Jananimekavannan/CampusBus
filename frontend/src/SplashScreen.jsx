import React, { useEffect, useState } from "react";
import kitLogo from "./assets/kit-logo.png";

/**
 * KITBusMiss Cinematic Splash Loader Screen:
 * - Sunny Blue Sky with drifting puffy clouds & horizon landscape
 * - Clean animated KIT college bus driving on road from Left to Right
 * - Centered KIT Coimbatore logo & KITBusMiss title
 * - Clean "Loading..." progress indicator
 * - No skip button
 */
export default function SplashScreen({ onFinish }) {
  const [progress, setProgress] = useState(0);

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
    }, 45); // ~2.2s total smooth load

    return () => clearInterval(interval);
  }, [onFinish]);

  return (
    <div className="splash-screen">
      {/* 1. Sunny Blue Sky with Animated Clouds & Distant Green Landscape */}
      <div className="splash-sky">
        <div className="splash-sun" />
        {/* Floating Animated Clouds */}
        <div className="cloud cloud-1" />
        <div className="cloud cloud-2" />
        <div className="cloud cloud-3" />
        <div className="cloud cloud-4" />
        <div className="cloud cloud-5" />

        {/* Distant Hills / Trees Silhouette */}
        <div className="splash-horizon-landscape" />
      </div>

      {/* 2. Centered Branding: KIT Logo & KITBusMiss */}
      <div className="splash-center-content">
        <div className="splash-logo-wrap">
          <div className="splash-logo-halo" />
          <div className="splash-logo-ring" />
          <img src={kitLogo} alt="KIT Coimbatore Logo" className="splash-logo-img" />
        </div>

        <div className="splash-text-group">
          <span className="splash-institution-tag">KALAIGNAR KARUNANIDHI INSTITUTE OF TECHNOLOGY</span>
          <h1 className="splash-title">
            KIT<span>BusMiss</span>
          </h1>
          <p className="splash-subtitle">
            Smart Campus Real-Time Fleet Tracking & Intelligence Portal
          </p>
        </div>

        {/* 3. Clean Loading Progress Indicator */}
        <div className="splash-loading-box">
          <div className="splash-progress-track">
            <div
              className="splash-progress-bar"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="splash-loading-status">
            <span>Loading...</span>
            <b>{progress}%</b>
          </div>
        </div>
      </div>

      {/* 4. Full-Width Road at Bottom with Bus Moving Left to Right */}
      <div className="splash-road-container">
        {/* Road Surface & Markings */}
        <div className="splash-highway">
          <div className="splash-kerb-top" />
          <div className="splash-center-stripes" />
          <div className="splash-kerb-bottom" />
        </div>

        {/* Animated KIT College Bus driving from Left to Right */}
        <div
          className="splash-bus-traveler"
          style={{
            left: `calc(${progress}% * 1.15 - 120px)`,
          }}
        >
          {/* Detailed SVG Side-View KIT Bus */}
          <div className="kit-bus-svg-wrapper">
            <svg
              viewBox="0 0 280 120"
              className="kit-bus-svg"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Drop Shadow */}
              <ellipse cx="140" cy="112" rx="125" ry="7" fill="rgba(0,0,0,0.35)" />

              {/* Bus Main Chassis Body */}
              <rect
                x="15"
                y="20"
                width="240"
                height="75"
                rx="14"
                fill="#FBBF24"
                stroke="#B45309"
                strokeWidth="3"
              />

              {/* Roof AC Unit */}
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

              {/* KIT Red Livery Stripe */}
              <rect x="15" y="70" width="240" height="12" fill="#C01823" />
              <rect x="15" y="44" width="240" height="3" fill="#1E3A8A" />

              {/* Destination Header Banner */}
              <rect x="190" y="24" width="55" height="14" rx="3" fill="#0F172A" />
              <text x="217" y="34" fill="#38BDF8" fontSize="8" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">
                KIT CAMPUS
              </text>

              {/* Side Banner "KIT COIMBATORE" */}
              <text x="125" y="80" fill="#FFFFFF" fontSize="9.5" fontWeight="900" letterSpacing="1" textAnchor="middle" fontFamily="sans-serif">
                KIT COIMBATORE • CAMPUS TRANSIT
              </text>

              {/* Windows */}
              {/* Driver / Front Windshield Window */}
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

              {/* Window Glare reflections */}
              <line x1="48" y1="42" x2="68" y2="60" stroke="rgba(255,255,255,0.4)" strokeWidth="2" />
              <line x1="90" y1="42" x2="110" y2="60" stroke="rgba(255,255,255,0.4)" strokeWidth="2" />
              <line x1="132" y1="42" x2="152" y2="60" stroke="rgba(255,255,255,0.4)" strokeWidth="2" />
              <line x1="174" y1="42" x2="194" y2="60" stroke="rgba(255,255,255,0.4)" strokeWidth="2" />

              {/* Front Headlight (Right Side) */}
              <path d="M 252 74 L 257 76 L 257 84 L 252 86 Z" fill="#FEF08A" />
              {/* Headlight Glow */}
              <polygon points="257,75 285,65 285,95 257,85" fill="rgba(254, 240, 138, 0.45)" />

              {/* Rear Taillight (Left Side) */}
              <rect x="13" y="74" width="4" height="12" rx="2" fill="#EF4444" />

              {/* Wheel Arches */}
              <circle cx="68" cy="95" r="19" fill="#1E293B" />
              <circle cx="205" cy="95" r="19" fill="#1E293B" />

              {/* Back Wheel */}
              <g className="bus-spinning-wheel" style={{ transformOrigin: "68px 95px" }}>
                <circle cx="68" cy="95" r="16" fill="#0F172A" stroke="#475569" strokeWidth="3" />
                <circle cx="68" cy="95" r="7" fill="#E2E8F0" />
                <circle cx="68" cy="95" r="3" fill="#1E293B" />
                <line x1="68" y1="82" x2="68" y2="108" stroke="#94A3B8" strokeWidth="2" />
                <line x1="55" y1="95" x2="81" y2="95" stroke="#94A3B8" strokeWidth="2" />
              </g>

              {/* Front Wheel */}
              <g className="bus-spinning-wheel" style={{ transformOrigin: "205px 95px" }}>
                <circle cx="205" cy="95" r="16" fill="#0F172A" stroke="#475569" strokeWidth="3" />
                <circle cx="205" cy="95" r="7" fill="#E2E8F0" />
                <circle cx="205" cy="95" r="3" fill="#1E293B" />
                <line x1="205" y1="82" x2="205" y2="108" stroke="#94A3B8" strokeWidth="2" />
                <line x1="192" y1="95" x2="218" y2="95" stroke="#94A3B8" strokeWidth="2" />
              </g>

              {/* Door & Handles */}
              <rect x="208" y="40" width="2" height="42" fill="#475569" />
              <rect x="17" y="65" width="4" height="2" fill="#334155" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}
