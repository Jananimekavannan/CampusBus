import React, { useEffect, useRef } from "react";

/**
 * RevolvingBusRoad - High-Tech Multi-Bus Campus Fleet Radar Canvas
 * Renders multiple active KIT College Buses revolving around the central command card:
 * - Real KIT Buses (Bus 12, Bus 07, Bus 03) driving in coordinated formation
 * - Dynamic LED Headlight projection beams, brake lights, and GPS beacon rings
 * - Real Coimbatore Transit stop nodes along the track (Peelamedu, Singanallur, Hope College, KIT Campus)
 * - High-tech radar scan lines & glowing road edge reflectors
 * - Supports Day ☀️ and Night 🌙 modes
 */
export default function RevolvingBusRoad({ timeMode = "night" }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    let animationFrameId;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", handleResize);

    const isDay = timeMode === "day";

    // Theme color palette
    const theme = isDay
      ? {
          bg: "#f8fafc",
          lawn: "#e2e8f0",
          road: "#1e293b",
          roadBorder: "#0284c7",
          roadLine: "#eab308",
          laneLine: "rgba(255, 255, 255, 0.75)",
          waypointBg: "#2563eb",
          waypointText: "#ffffff",
          gridLine: "rgba(15, 23, 42, 0.04)",
          radarSweep: "rgba(37, 99, 235, 0.08)",
        }
      : {
          bg: "#090e17",
          lawn: "#0b121e",
          road: "#0f172a",
          roadBorder: "#1e3a8a",
          roadLine: "rgba(250, 204, 21, 0.85)",
          laneLine: "rgba(255, 255, 255, 0.35)",
          waypointBg: "#0284c7",
          waypointText: "#ffffff",
          gridLine: "rgba(255, 255, 255, 0.03)",
          radarSweep: "rgba(56, 189, 248, 0.08)",
        };

    // Construct racetrack path points around the center
    function buildRacetrackPoints(cx, cy, rw, rh, cornerRadius, segments = 360) {
      const pts = [];
      const hw = rw / 2;
      const hh = rh / 2;
      const cr = cornerRadius;

      for (let i = 0; i < segments; i++) {
        const u = (i / segments) * 4;
        let x, y;
        if (u < 1) {
          // Top edge (left to right)
          const f = u;
          x = cx - hw + cr + f * (rw - 2 * cr);
          y = cy - hh;
          if (f > 0.85) {
            const angle = -Math.PI / 2 + ((f - 0.85) / 0.15) * (Math.PI / 2);
            x = cx + hw - cr + Math.cos(angle) * cr;
            y = cy - hh + cr + Math.sin(angle) * cr;
          }
        } else if (u < 2) {
          // Right edge (top to bottom)
          const f = u - 1;
          x = cx + hw;
          y = cy - hh + cr + f * (rh - 2 * cr);
          if (f > 0.85) {
            const angle = 0 + ((f - 0.85) / 0.15) * (Math.PI / 2);
            x = cx + hw - cr + Math.cos(angle) * cr;
            y = cy + hh - cr + Math.sin(angle) * cr;
          }
        } else if (u < 3) {
          // Bottom edge (right to left)
          const f = u - 2;
          x = cx + hw - cr - f * (rw - 2 * cr);
          y = cy + hh;
          if (f > 0.85) {
            const angle = Math.PI / 2 + ((f - 0.85) / 0.15) * (Math.PI / 2);
            x = cx - hw + cr + Math.cos(angle) * cr;
            y = cy + hh - cr + Math.sin(angle) * cr;
          }
        } else {
          // Left edge (bottom to top)
          const f = u - 3;
          x = cx - hw;
          y = cy + hh - cr - f * (rh - 2 * cr);
          if (f > 0.85) {
            const angle = Math.PI + ((f - 0.85) / 0.15) * (Math.PI / 2);
            x = cx - hw + cr + Math.cos(angle) * cr;
            y = cy - hh + cr + Math.sin(angle) * cr;
          }
        }
        pts.push({ x, y });
      }
      return pts;
    }

    // Multiple KIT Fleet Buses on the road
    const fleet = [
      { name: "BUS 12", color: "#fbbf24", offset: 0, speed: 0.55, route: "Gandhipuram Express" },
      { name: "BUS 07", color: "#f59e0b", offset: 120, speed: 0.55, route: "Saravanampatti Line" },
      { name: "BUS 03", color: "#facc15", offset: 240, speed: 0.55, route: "RS Puram Line" },
    ];

    let radarAngle = 0;

    function render(currentTime) {
      ctx.clearRect(0, 0, width, height);

      const cx = width / 2;
      const cy = height / 2;

      // 1. Radar Coordinate Grid
      ctx.strokeStyle = theme.gridLine;
      ctx.lineWidth = 1;
      const gridSize = 50;
      for (let x = 0; x < width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // Card bounding dimensions + surrounding road offset
      const isMobile = width < 640;
      const cardW = isMobile ? Math.min(width - 40, 360) : 460;
      const cardH = isMobile ? 600 : 560;

      const roadMargin = isMobile ? 55 : 90;
      const roadW = cardW + roadMargin * 2;
      const roadH = cardH + roadMargin * 2;
      const cornerRadius = isMobile ? 45 : 70;
      const asphaltWidth = isMobile ? 52 : 68;

      // 2. 360-Degree Radar Sweep Cone from Center
      radarAngle += 0.012;
      ctx.save();
      ctx.translate(cx, cy);
      const sweepGrad = ctx.createRadialGradient(0, 0, 10, 0, 0, roadW * 0.7);
      sweepGrad.addColorStop(0, "rgba(56, 189, 248, 0.2)");
      sweepGrad.addColorStop(1, "rgba(56, 189, 248, 0)");
      ctx.fillStyle = sweepGrad;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.arc(0, 0, roadW * 0.7, radarAngle, radarAngle + 0.4);
      ctx.closePath();
      ctx.fill();
      ctx.restore();

      // 3. Draw Continuous High-Tech Asphalt Highway
      ctx.strokeStyle = theme.road;
      ctx.lineWidth = asphaltWidth;
      ctx.lineJoin = "round";
      ctx.lineCap = "round";
      ctx.beginPath();
      ctx.roundRect(cx - roadW / 2, cy - roadH / 2, roadW, roadH, cornerRadius);
      ctx.stroke();

      // Glowing Cyan Neon Curbs
      ctx.strokeStyle = theme.roadBorder;
      ctx.lineWidth = 2.5;
      ctx.shadowColor = "#0284c7";
      ctx.shadowBlur = 10;
      ctx.beginPath();
      ctx.roundRect(
        cx - (roadW + asphaltWidth) / 2,
        cy - (roadH + asphaltWidth) / 2,
        roadW + asphaltWidth,
        roadH + asphaltWidth,
        cornerRadius + asphaltWidth / 2
      );
      ctx.roundRect(
        cx - (roadW - asphaltWidth) / 2,
        cy - (roadH - asphaltWidth) / 2,
        roadW - asphaltWidth,
        roadH - asphaltWidth,
        Math.max(10, cornerRadius - asphaltWidth / 2)
      );
      ctx.stroke();
      ctx.shadowBlur = 0;

      // Double Yellow Center Line
      ctx.strokeStyle = theme.roadLine;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.roundRect(cx - roadW / 2, cy - roadH / 2, roadW, roadH, cornerRadius);
      ctx.stroke();

      // White Dashed Lane Dividers
      ctx.strokeStyle = theme.laneLine;
      ctx.lineWidth = 1.4;
      ctx.setLineDash([12, 16]);
      ctx.beginPath();
      ctx.roundRect(
        cx - (roadW + asphaltWidth * 0.48) / 2,
        cy - (roadH + asphaltWidth * 0.48) / 2,
        roadW + asphaltWidth * 0.48,
        roadH + asphaltWidth * 0.48,
        cornerRadius + 14
      );
      ctx.roundRect(
        cx - (roadW - asphaltWidth * 0.48) / 2,
        cy - (roadH - asphaltWidth * 0.48) / 2,
        roadW - asphaltWidth * 0.48,
        roadH - asphaltWidth * 0.48,
        Math.max(10, cornerRadius - 14)
      );
      ctx.stroke();
      ctx.setLineDash([]);

      // 4. Coimbatore Transit Route Waypoints along the Circuit
      const waypoints = [
        { name: "📍 Peelamedu Signal", x: cx - roadW / 2, y: cy - roadH / 2 + 60 },
        { name: "📍 Hope College", x: cx + roadW / 2, y: cy - roadH / 2 + 60 },
        { name: "📍 Singanallur", x: cx + roadW / 2, y: cy + roadH / 2 - 60 },
        { name: "📍 Sulur RTO", x: cx - roadW / 2, y: cy + roadH / 2 - 60 },
        { name: "🏫 KIT Kannampalayam", x: cx, y: cy - roadH / 2 - 25, isKit: true },
      ];

      waypoints.forEach((wp) => {
        // Glowing Stop Ring
        ctx.fillStyle = wp.isKit ? "#c01823" : theme.waypointBg;
        ctx.beginPath();
        ctx.arc(wp.x, wp.y, wp.isKit ? 9 : 6, 0, Math.PI * 2);
        ctx.fill();

        // Pulsing Ping
        const ping = (Math.sin(currentTime * 0.005) + 1) * 0.5;
        ctx.strokeStyle = wp.isKit ? "rgba(192, 24, 35, 0.6)" : "rgba(2, 132, 199, 0.6)";
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.arc(wp.x, wp.y, (wp.isKit ? 9 : 6) + ping * 8, 0, Math.PI * 2);
        ctx.stroke();

        // Waypoint Label
        ctx.fillStyle = wp.isKit ? "#fca5a5" : "#93c5fd";
        ctx.font = wp.isKit ? "bold 11px sans-serif" : "bold 9.5px sans-serif";
        ctx.textAlign = "center";
        ctx.fillText(wp.name, wp.x, wp.y - 12);
      });

      // 5. Generate Spline Path & Render Active KIT Fleet Buses
      const spline = buildRacetrackPoints(cx, cy, roadW, roadH, cornerRadius, 360);

      fleet.forEach((busData) => {
        busData.offset = (busData.offset + busData.speed) % spline.length;
        const curIdx = Math.floor(busData.offset);
        const nextIdx = (curIdx + 4) % spline.length;
        const cur = spline[curIdx];
        const next = spline[nextIdx];
        const angle = Math.atan2(next.y - cur.y, next.x - cur.x);

        const busLen = isMobile ? 44 : 54;
        const busW = isMobile ? 18 : 22;

        ctx.save();
        ctx.translate(cur.x, cur.y);
        ctx.rotate(angle);

        // Underglow Shadow
        ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
        ctx.beginPath();
        ctx.roundRect(-busLen / 2 + 4, -busW / 2 + 4, busLen, busW, 6);
        ctx.fill();

        // Headlight Beams (Night Mode)
        if (!isDay) {
          const lightCone = ctx.createRadialGradient(
            busLen / 2,
            0,
            2,
            busLen / 2 + 80,
            0,
            90
          );
          lightCone.addColorStop(0, "rgba(254, 240, 138, 0.75)");
          lightCone.addColorStop(0.5, "rgba(253, 224, 71, 0.28)");
          lightCone.addColorStop(1, "rgba(253, 224, 71, 0)");

          ctx.fillStyle = lightCone;
          ctx.beginPath();
          ctx.moveTo(busLen / 2, -busW / 2 + 2);
          ctx.lineTo(busLen / 2 + 90, -busW * 1.6);
          ctx.lineTo(busLen / 2 + 90, busW * 1.6);
          ctx.lineTo(busLen / 2, busW / 2 - 2);
          ctx.closePath();
          ctx.fill();

          // Tail Brake Light Glow (Red)
          const tailGlow = ctx.createRadialGradient(
            -busLen / 2 - 4,
            0,
            2,
            -busLen / 2 - 12,
            0,
            22
          );
          tailGlow.addColorStop(0, "rgba(239, 68, 68, 0.8)");
          tailGlow.addColorStop(1, "rgba(239, 68, 68, 0)");
          ctx.fillStyle = tailGlow;
          ctx.beginPath();
          ctx.arc(-busLen / 2 - 6, 0, 22, 0, Math.PI * 2);
          ctx.fill();
        }

        // Bus Chassis Body (Yellow)
        ctx.fillStyle = busData.color;
        ctx.beginPath();
        ctx.roundRect(-busLen / 2, -busW / 2, busLen, busW, 6);
        ctx.fill();
        ctx.strokeStyle = "#b45309";
        ctx.lineWidth = 1.4;
        ctx.stroke();

        // KIT Red Livery Stripe
        ctx.fillStyle = "#b91c1c";
        ctx.fillRect(-busLen / 2 + 6, -busW / 2, busLen - 12, 3);
        ctx.fillRect(-busLen / 2 + 6, busW / 2 - 3, busLen - 12, 3);

        // Windshield
        ctx.fillStyle = "#0f172a";
        ctx.beginPath();
        ctx.roundRect(busLen / 2 - 11, -busW / 2 + 3, 8, busW - 6, 2);
        ctx.fill();

        // Rear Window
        ctx.fillRect(-busLen / 2 + 3, -busW / 2 + 4, 4, busW - 8);

        // Roof AC Unit & GPS Antenna
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(-8, -busW / 2 + 4, 16, busW - 8);
        ctx.strokeStyle = "#cbd5e1";
        ctx.lineWidth = 0.8;
        ctx.strokeRect(-8, -busW / 2 + 4, 16, busW - 8);

        // Roof Badge (e.g. "BUS 12")
        ctx.fillStyle = "#1e3a8a";
        ctx.font = "bold 9px sans-serif";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(busData.name, 0, 0);

        // Front Headlights
        ctx.fillStyle = "#fef08a";
        ctx.fillRect(busLen / 2 - 2, -busW / 2 + 2, 2.5, 3);
        ctx.fillRect(busLen / 2 - 2, busW / 2 - 5, 2.5, 3);

        // Rear Brake Lights
        ctx.fillStyle = "#dc2626";
        ctx.fillRect(-busLen / 2, -busW / 2 + 2, 2.5, 3);
        ctx.fillRect(-busLen / 2, busW / 2 - 5, 2.5, 3);

        // Beacon Pulse Halo above Bus
        const busPulse = (Math.sin(currentTime * 0.007 + busData.offset) + 1) * 0.5;
        ctx.beginPath();
        ctx.arc(0, 0, 14 + busPulse * 6, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(56, 189, 248, ${0.45 - busPulse * 0.3})`;
        ctx.lineWidth = 1.5;
        ctx.stroke();

        ctx.restore();
      });

      animationFrameId = requestAnimationFrame(render);
    }

    animationFrameId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", handleResize);
    };
  }, [timeMode]);

  return (
    <div className={`revolving-road-container ${timeMode}`}>
      <canvas ref={canvasRef} className="revolving-road-canvas" />
    </div>
  );
}
