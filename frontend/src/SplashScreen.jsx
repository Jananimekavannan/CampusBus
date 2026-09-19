import React, { useEffect, useState } from "react";
import kitLogo from "./assets/kit-logo.png";

/**
 * SplashScreen - "KITBusMiss" Animated Intro Loader
 * Plays at initial launch before the login page:
 * - Shows "KITBusMiss" title with glowing branding
 * - Animated KIT bus running on an endless animated road
 * - Smooth progress bar with live status text
 * - Auto-transitions into Login Page when complete
 */
export default function SplashScreen({ onFinish }) {
  const [progress, setProgress] = useState(0);
  const [statusText, setStatusText] = useState("Initializing KIT Fleet Systems...");

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => onFinish(), 400);
          return 100;
        }
        const next = prev + 2;
        if (next === 30) setStatusText("Calibrating Real-Time GPS Feeds...");
        if (next === 65) setStatusText("Loading KIT Coimbatore Roadways...");
        if (next === 90) setStatusText("Fleet Online. Launching Portal...");
        return next;
      });
    }, 35);

    return () => clearInterval(interval);
  }, [onFinish]);

  return (
    <div className="splash-screen">
      <div className="splash-content">
        {/* Centered KIT Coimbatore Logo Badge */}
        <div className="splash-logo-wrap">
          <div className="splash-logo-glow" />
          <div className="splash-logo-ring" />
          <img src={kitLogo} alt="KIT Logo" className="splash-logo-img" />
        </div>

        {/* Title: KITBusMiss */}
        <div className="splash-text-group">
          <span className="splash-badge">KALAIGNAR KARUNANIDHI INSTITUTE OF TECHNOLOGY</span>
          <h1 className="splash-title">
            KIT<span>BusMiss</span>
          </h1>
          <p className="splash-subtitle">
            Smart Campus Real-Time Transport Intelligence & Fleet Tracking
          </p>
        </div>

        {/* Animated Bus Running on Road Animation */}
        <div className="splash-bus-scene">
          <div className="splash-road">
            {/* Animated Road Lines */}
            <div className="splash-road-stripes" />

            {/* Side-view Animated KIT Bus */}
            <div className="splash-bus">
              <div className="splash-bus-body">
                <div className="splash-bus-roof-ac" />
                <div className="splash-bus-banner">KIT COIMBATORE</div>
                <div className="splash-bus-windows">
                  <div className="splash-window" />
                  <div className="splash-window" />
                  <div className="splash-window" />
                  <div className="splash-window front-window" />
                </div>
                <div className="splash-bus-stripe" />
                <div className="splash-bus-headlight" />
                <div className="splash-bus-taillight" />
              </div>
              {/* Spinning Wheels */}
              <div className="splash-wheel front-wheel">
                <div className="wheel-rim" />
              </div>
              <div className="splash-wheel back-wheel">
                <div className="wheel-rim" />
              </div>
              {/* Exhaust Smoke Puffs */}
              <div className="smoke-puff p1" />
              <div className="smoke-puff p2" />
            </div>
          </div>
        </div>

        {/* Progress Bar & Status */}
        <div className="splash-progress-wrap">
          <div className="splash-progress-bar">
            <div
              className="splash-progress-fill"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="splash-progress-info">
            <span>{statusText}</span>
            <b>{progress}%</b>
          </div>
        </div>

        <button type="button" className="splash-skip-btn" onClick={onFinish}>
          Skip Intro ➔
        </button>
      </div>
    </div>
  );
}
