import React, { useState, useEffect } from "react";

export default function LiveHeaderTimeWeather() {
  const [timeStr, setTimeStr] = useState(() =>
    new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    })
  );

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeStr(
        new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        })
      );
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="header-live-time-weather-cluster">
      <div className="live-clock-pill" title="Live Coimbatore Standard Time">
        <span className="clock-icon">🕒</span>
        <span className="clock-val">{timeStr}</span>
      </div>
      <div className="live-weather-pill" title="KIT Coimbatore Weather: 28°C Clear Skies">
        <span className="weather-icon">🌤️</span>
        <span className="weather-val">28°C CBE</span>
      </div>
    </div>
  );
}
