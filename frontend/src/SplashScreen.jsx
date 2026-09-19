import React, { useEffect, useState } from "react";
import kitLogo from "./assets/kit-logo.png";

/**
 * SplashScreen - "KITBusMiss"
 * Realistic & Cinematic Intro Loader:
 * - Cinematic blue sky with sunny flare, moving layered volumetric clouds, and green landscape
 * - Photorealistic 3D-shaded KIT College Bus driving smoothly from Left to Right across asphalt highway
 * - Spinning alloy wheels with rubber tires, interior cabin glow, headlights, and exhaust effects
 * - Centered glowing KIT Coimbatore logo badge and modern "Loading..." progress telemetry
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
    }, 40); // ~2s smooth cinematic load

    return () => clearInterval(interval);
  }, [onFinish]);

  return (
    <div className="splash-screen">
      {/* 1. Cinematic Sky Background with Sun & Volumetric Clouds */}
      <div className="splash-sky">
        <div className="splash-sun-glow" />
        <div className="splash-sun-core" />

        {/* Multi-layered Realistic Drifting Clouds */}
        <div className="cloud-layer layer-back">
          <div className="real-cloud rc-1" />
          <div className="real-cloud rc-2" />
        </div>
        <div className="cloud-layer layer-mid">
          <div className="real-cloud rc-3" />
          <div className="real-cloud rc-4" />
        </div>
        <div className="cloud-layer layer-front">
          <div className="real-cloud rc-5" />
        </div>

        {/* Distant Mountains & Palm Tree Canopy Horizon */}
        <div className="splash-horizon">
          <div className="mountain-silhouette m-1" />
          <div className="mountain-silhouette m-2" />
          <div className="trees-silhouette" />
        </div>
      </div>

      {/* 2. Centered Glassmorphic Branding & Loading Card */}
      <div className="splash-center-content">
        <div className="splash-logo-wrap">
          <div className="splash-logo-halo" />
          <div className="splash-logo-ring" />
          <div className="splash-logo-core">
            <img src={kitLogo} alt="KIT Coimbatore Logo" className="splash-logo-img" />
          </div>
        </div>

        <div className="splash-text-group">
          <span className="splash-institution-tag">KALAIGNAR KARUNANIDHI INSTITUTE OF TECHNOLOGY</span>
          <h1 className="splash-title">
            KIT<span>BusMiss</span>
          </h1>
          <p className="splash-subtitle">
            Smart Campus Real-Time Fleet Telemetry & GPS Intelligence
          </p>
        </div>

        {/* 3. Modern Loading Progress Indicator */}
        <div className="splash-loading-box">
          <div className="splash-progress-track">
            <div
              className="splash-progress-bar"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="splash-loading-status">
            <span>Connecting Fleet Telemetry...</span>
            <b>{progress}%</b>
          </div>
        </div>
      </div>

      {/* 4. Realistic Asphalt Highway with Animated Moving Bus */}
      <div className="splash-road-container">
        <div className="road-guardrail" />
        <div className="splash-highway">
          <div className="splash-kerb-top" />
          <div className="splash-lane-divider" />
          <div className="splash-center-stripes" />
          <div className="splash-kerb-bottom" />
        </div>

        {/* Realistic 3D-Shaded KIT Bus Driving Left to Right */}
        <div
          className="splash-bus-traveler"
          style={{
            left: `calc(${progress}% * 1.18 - 140px)`,
          }}
        >
          <div className="kit-bus-real-wrapper">
            <svg
              viewBox="0 0 320 130"
              className="kit-bus-real-svg"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                {/* 3D Metallic Yellow Body Gradient */}
                <linearGradient id="busBodyGrad" x1="0" y1="20" x2="0" y2="100" gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stopColor="#FDE047" />
                  <stop offset="20%" stopColor="#FBBF24" />
                  <stop offset="60%" stopColor="#F59E0B" />
                  <stop offset="100%" stopColor="#D97706" />
                </linearGradient>

                {/* Crimson Red Stripe Gradient */}
                <linearGradient id="busRedGrad" x1="0" y1="75" x2="0" y2="90" gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stopColor="#DC2626" />
                  <stop offset="50%" stopColor="#B91C1C" />
                  <stop offset="100%" stopColor="#7F1D1D" />
                </linearGradient>

                {/* Tinted Glass Gradient */}
                <linearGradient id="glassGrad" x1="0" y1="35" x2="0" y2="70" gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stopColor="#1E293B" />
                  <stop offset="40%" stopColor="#0F172A" />
                  <stop offset="100%" stopColor="#020617" />
                </linearGradient>

                {/* Wheel Tire Gradient */}
                <radialGradient id="tireGrad" cx="50%" cy="50%" r="50%">
                  <stop offset="60%" stopColor="#0F172A" />
                  <stop offset="85%" stopColor="#1E293B" />
                  <stop offset="100%" stopColor="#334155" />
                </radialGradient>

                {/* Alloy Rim Metallic Gradient */}
                <linearGradient id="rimGrad" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#F8FAFC" />
                  <stop offset="50%" stopColor="#94A3B8" />
                  <stop offset="100%" stopColor="#475569" />
                </linearGradient>

                {/* Forward Headlight Beam Cone */}
                <linearGradient id="headlightBeam" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="rgba(254, 240, 138, 0.85)" />
                  <stop offset="50%" stopColor="rgba(253, 224, 71, 0.35)" />
                  <stop offset="100%" stopColor="rgba(253, 224, 71, 0)" />
                </linearGradient>
              </defs>

              {/* Dynamic Ground Contact Shadow */}
              <ellipse cx="155" cy="120" rx="145" ry="8" fill="rgba(0,0,0,0.5)" filter="blur(3px)" />

              {/* Headlight Illumination Beam on Road */}
              <polygon points="288,86 320,70 320,115 288,98" fill="url(#headlightBeam)" />

              {/* Bus Aerodynamic Main Chassis */}
              <path
                d="M 20 28 C 20 22 25 18 32 18 L 260 18 C 280 18 290 28 290 48 L 290 92 C 290 98 285 102 278 102 L 28 102 C 23 102 20 98 20 92 Z"
                fill="url(#busBodyGrad)"
                stroke="#B45309"
                strokeWidth="2.5"
              />

              {/* Roof AC Aerodynamic Unit */}
              <path
                d="M 90 10 L 190 10 C 196 10 200 13 200 18 L 80 18 C 80 13 84 10 90 10 Z"
                fill="#FFFFFF"
                stroke="#CBD5E1"
                strokeWidth="1.5"
              />
              <line x1="110" y1="12" x2="110" y2="16" stroke="#94A3B8" strokeWidth="2" />
              <line x1="130" y1="12" x2="130" y2="16" stroke="#94A3B8" strokeWidth="2" />
              <line x1="150" y1="12" x2="150" y2="16" stroke="#94A3B8" strokeWidth="2" />
              <line x1="170" y1="12" x2="170" y2="16" stroke="#94A3B8" strokeWidth="2" />

              {/* Roof Top Specular Highlight Line */}
              <line x1="32" y1="20" x2="260" y2="20" stroke="rgba(255,255,255,0.7)" strokeWidth="2" />

              {/* Top Blue Accent Stripe */}
              <rect x="20" y="44" width="270" height="4" fill="#1E3A8A" />

              {/* Lower Crimson Red Metallic Stripe */}
              <path
                d="M 20 74 L 290 74 L 290 88 L 20 88 Z"
                fill="url(#busRedGrad)"
              />

              {/* Destination LED Display */}
              <rect x="215" y="24" width="62" height="15" rx="3" fill="#020617" stroke="#334155" strokeWidth="1" />
              <text x="246" y="35" fill="#38BDF8" fontSize="8.5" fontWeight="900" textAnchor="middle" fontFamily="monospace">
                KIT EXPRESS
              </text>

              {/* Side Branding: "KIT COIMBATORE" */}
              <text x="145" y="84" fill="#FFFFFF" fontSize="10.5" fontWeight="900" letterSpacing="1.2" textAnchor="middle" fontFamily="sans-serif">
                KIT COIMBATORE • CAMPUS BUS
              </text>

              {/* Tinted Panoramic Windows & Frames */}
              {/* Front Windshield Curved Glass */}
              <path
                d="M 235 38 L 278 40 C 284 42 286 48 286 56 L 286 68 L 235 68 Z"
                fill="url(#glassGrad)"
                stroke="#1E293B"
                strokeWidth="2"
              />
              {/* Passenger Panoramic Windows */}
              <rect x="185" y="38" width="44" height="30" rx="3" fill="url(#glassGrad)" stroke="#1E293B" strokeWidth="2" />
              <rect x="135" y="38" width="44" height="30" rx="3" fill="url(#glassGrad)" stroke="#1E293B" strokeWidth="2" />
              <rect x="85" y="38" width="44" height="30" rx="3" fill="url(#glassGrad)" stroke="#1E293B" strokeWidth="2" />
              <rect x="35" y="38" width="44" height="30" rx="3" fill="url(#glassGrad)" stroke="#1E293B" strokeWidth="2" />

              {/* Glass Sun Glare Reflection Streaks */}
              <line x1="42" y1="42" x2="68" y2="64" stroke="rgba(255,255,255,0.35)" strokeWidth="2.5" />
              <line x1="92" y1="42" x2="118" y2="64" stroke="rgba(255,255,255,0.35)" strokeWidth="2.5" />
              <line x1="142" y1="42" x2="168" y2="64" stroke="rgba(255,255,255,0.35)" strokeWidth="2.5" />
              <line x1="192" y1="42" x2="218" y2="64" stroke="rgba(255,255,255,0.35)" strokeWidth="2.5" />
              <line x1="242" y1="42" x2="268" y2="64" stroke="rgba(255,255,255,0.35)" strokeWidth="2.5" />

              {/* Front Chrome LED Headlight */}
              <path d="M 285 75 C 288 75 290 77 290 80 L 290 88 C 290 90 288 92 285 92 Z" fill="#FEF08A" stroke="#E2E8F0" strokeWidth="1" />
              <circle cx="287" cy="83" r="4" fill="#FFFFFF" />

              {/* Rear LED Taillight */}
              <rect x="18" y="76" width="4" height="14" rx="2" fill="#EF4444" />
              <circle cx="20" cy="83" r="2.5" fill="#FF8888" />

              {/* Aerodynamic Side Mirrors */}
              <path d="M 276 46 L 296 42 L 296 52 L 276 50 Z" fill="#0F172A" stroke="#475569" strokeWidth="1" />
              <ellipse cx="295" cy="47" rx="2" ry="4" fill="#E2E8F0" />

              {/* Wheel Arches with Inner Shadow */}
              <circle cx="75" cy="102" r="22" fill="#090E17" />
              <circle cx="235" cy="102" r="22" fill="#090E17" />

              {/* Back Realistic Rotating Alloy Wheel */}
              <g className="bus-spinning-wheel" style={{ transformOrigin: "75px 102px" }}>
                <circle cx="75" cy="102" r="19" fill="url(#tireGrad)" stroke="#334155" strokeWidth="2.5" />
                <circle cx="75" cy="102" r="10" fill="url(#rimGrad)" />
                <circle cx="75" cy="102" r="4" fill="#0F172A" />
                {/* 6 Alloy Wheel Spokes */}
                <line x1="75" y1="88" x2="75" y2="116" stroke="#CBD5E1" strokeWidth="2" />
                <line x1="63" y1="95" x2="87" y2="109" stroke="#CBD5E1" strokeWidth="2" />
                <line x1="63" y1="109" x2="87" y2="95" stroke="#CBD5E1" strokeWidth="2" />
              </g>

              {/* Front Realistic Rotating Alloy Wheel */}
              <g className="bus-spinning-wheel" style={{ transformOrigin: "235px 102px" }}>
                <circle cx="235" cy="102" r="19" fill="url(#tireGrad)" stroke="#334155" strokeWidth="2.5" />
                <circle cx="235" cy="102" r="10" fill="url(#rimGrad)" />
                <circle cx="235" cy="102" r="4" fill="#0F172A" />
                {/* 6 Alloy Wheel Spokes */}
                <line x1="235" y1="88" x2="235" y2="116" stroke="#CBD5E1" strokeWidth="2" />
                <line x1="223" y1="95" x2="247" y2="109" stroke="#CBD5E1" strokeWidth="2" />
                <line x1="223" y1="109" x2="247" y2="95" stroke="#CBD5E1" strokeWidth="2" />
              </g>

              {/* Passenger Boarding Door & Handle */}
              <line x1="230" y1="40" x2="230" y2="98" stroke="#334155" strokeWidth="1.5" />
              <rect x="232" y="70" width="2" height="6" rx="1" fill="#FFFFFF" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}
