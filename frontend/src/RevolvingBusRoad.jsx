import React, { useEffect, useRef } from "react";

/**
 * RevolvingBusRoad - High-Tech Multi-Bus Campus Fleet Radar Canvas
 * Flawlessly aligned around the login card:
 * - Dynamically measures the exact DOM `.login-card` position and dimensions
 * - Mathematically exact rounded-rectangle spline for 100% center-aligned road navigation
 * - 3 Active KIT College Buses (Bus 12 Cyber Gold, Bus 07 Electric Cyan, Bus 03 Neon Violet)
 * - Volumetric headlights, cabin lights, brake lights, and beacon pulse halos
 * - Concentric Sonar Waves & 360° Radar Sweep
 * - Real Coimbatore Transit stop waypoints symmetrically positioned along the circuit
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
          road: "#1e293b",
          roadBorder: "#0284c7",
          roadLine: "#eab308",
          laneLine: "rgba(255, 255, 255, 0.75)",
          waypointBg: "#2563eb",
          waypointText: "#ffffff",
          gridLine: "rgba(15, 23, 42, 0.04)",
          particle: "rgba(37, 99, 235, 0.22)",
          particleLine: "rgba(37, 99, 235, 0.1)",
          sonarRing: "rgba(37, 99, 235, 0.15)",
        }
      : {
          bg: "#090e17",
          road: "#0f172a",
          roadBorder: "#1e3a8a",
          roadLine: "rgba(250, 204, 21, 0.85)",
          laneLine: "rgba(255, 255, 255, 0.35)",
          waypointBg: "#0284c7",
          waypointText: "#ffffff",
          gridLine: "rgba(255, 255, 255, 0.035)",
          particle: "rgba(56, 189, 248, 0.35)",
          particleLine: "rgba(56, 189, 248, 0.12)",
          sonarRing: "rgba(56, 189, 248, 0.18)",
        };

    // 1. Initialize Cyber Constellation Particles
    const particleCount = isDay ? 30 : 55;
    const particles = [];
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        size: Math.random() * 2 + 1,
      });
    }

    // 2. Mathematically Exact Rounded Rectangle Spline Generator
    function buildExactRacetrackSpline(cx, cy, rw, rh, cr, numPoints = 400) {
      const hw = rw / 2;
      const hh = rh / 2;
      const r = Math.min(cr, hw, hh);

      const topLen = rw - 2 * r;
      const rightLen = rh - 2 * r;
      const cornerArc = (Math.PI / 2) * r;
      const totalPerimeter = 2 * topLen + 2 * rightLen + 4 * cornerArc;

      const pts = [];

      for (let i = 0; i < numPoints; i++) {
        let d = (i / numPoints) * totalPerimeter;
        let x, y;

        // Section 1: Top Straight (Left to Right)
        if (d < topLen) {
          x = cx - hw + r + d;
          y = cy - hh;
        }
        // Section 2: Top-Right Corner Arc
        else if (d < topLen + cornerArc) {
          const segD = d - topLen;
          const angle = -Math.PI / 2 + (segD / cornerArc) * (Math.PI / 2);
          x = cx + hw - r + Math.cos(angle) * r;
          y = cy - hh + r + Math.sin(angle) * r;
        }
        // Section 3: Right Straight (Top to Bottom)
        else if (d < topLen + cornerArc + rightLen) {
          const segD = d - (topLen + cornerArc);
          x = cx + hw;
          y = cy - hh + r + segD;
        }
        // Section 4: Bottom-Right Corner Arc
        else if (d < topLen + cornerArc + rightLen + cornerArc) {
          const segD = d - (topLen + cornerArc + rightLen);
          const angle = 0 + (segD / cornerArc) * (Math.PI / 2);
          x = cx + hw - r + Math.cos(angle) * r;
          y = cy + hh - r + Math.sin(angle) * r;
        }
        // Section 5: Bottom Straight (Right to Left)
        else if (d < topLen + cornerArc + rightLen + cornerArc + topLen) {
          const segD = d - (topLen + cornerArc + rightLen + cornerArc);
          x = cx + hw - r - segD;
          y = cy + hh;
        }
        // Section 6: Bottom-Left Corner Arc
        else if (d < topLen + cornerArc + rightLen + cornerArc + topLen + cornerArc) {
          const segD = d - (topLen + cornerArc + rightLen + cornerArc + topLen);
          const angle = Math.PI / 2 + (segD / cornerArc) * (Math.PI / 2);
          x = cx - hw + r + Math.cos(angle) * r;
          y = cy + hh - r + Math.sin(angle) * r;
        }
        // Section 7: Left Straight (Bottom to Top)
        else if (d < topLen + cornerArc + rightLen + cornerArc + topLen + cornerArc + rightLen) {
          const segD = d - (topLen + cornerArc + rightLen + cornerArc + topLen + cornerArc);
          x = cx - hw;
          y = cy + hh - r - segD;
        }
        // Section 8: Top-Left Corner Arc
        else {
          const segD = d - (topLen + cornerArc + rightLen + cornerArc + topLen + cornerArc + rightLen);
          const angle = Math.PI + (segD / cornerArc) * (Math.PI / 2);
          x = cx - hw + r + Math.cos(angle) * r;
          y = cy - hh + r + Math.sin(angle) * r;
        }

        pts.push({ x, y });
      }

      return pts;
    }

    // 3. Active KIT Fleet Buses
    const fleet = [
      {
        name: "BUS 12",
        color: "#fbbf24",
        stroke: "#b45309",
        stripe: "#b91c1c",
        offset: 0,
        speed: 0.65,
        route: "12 • GANDHIPURAM EXP",
        headlightHue: "rgba(254, 240, 138, 0.85)",
      },
      {
        name: "BUS 07",
        color: "#0284c7",
        stroke: "#0369a1",
        stripe: "#f59e0b",
        offset: 133,
        speed: 0.65,
        route: "07 • SARAVANAMPATTI",
        headlightHue: "rgba(56, 189, 248, 0.85)",
      },
      {
        name: "BUS 03",
        color: "#8b5cf6",
        stroke: "#6d28d9",
        stripe: "#ec4899",
        offset: 266,
        speed: 0.65,
        route: "03 • RS PURAM LINE",
        headlightHue: "rgba(216, 180, 254, 0.85)",
      },
    ];

    let radarAngle = 0;
    let sonarRadius = 0;

    function render(currentTime) {
      ctx.clearRect(0, 0, width, height);

      // Dynamically measure actual DOM Login Card position for flawless alignment
      const cardEl = document.querySelector(".login-card");
      const cardRect = cardEl ? cardEl.getBoundingClientRect() : null;

      const isMobile = width < 640;
      const cx = cardRect ? cardRect.left + cardRect.width / 2 : width / 2;
      const cy = cardRect ? cardRect.top + cardRect.height / 2 : height / 2;

      const cardW = cardRect ? cardRect.width : (isMobile ? Math.min(width - 40, 360) : 440);
      const cardH = cardRect ? cardRect.height : (isMobile ? 620 : 640);

      const roadMargin = isMobile ? 52 : 78;
      const roadW = cardW + roadMargin * 2;
      const roadH = cardH + roadMargin * 2;
      const cornerRadius = isMobile ? 48 : 68;
      const asphaltWidth = isMobile ? 48 : 64;

      // 1. Radar Coordinate Grid
      ctx.strokeStyle = theme.gridLine;
      ctx.lineWidth = 1;
      const gridSize = 48;
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

      // 2. Cyber Particle Constellation
      ctx.fillStyle = theme.particle;
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();

        // Connect nearby particles
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dist = Math.hypot(p.x - p2.x, p.y - p2.y);
          if (dist < 90) {
            ctx.strokeStyle = theme.particleLine;
            ctx.lineWidth = 0.8 * (1 - dist / 90);
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        }
      }

      // 3. Expanding Concentric Sonar Wave Rings
      sonarRadius = (sonarRadius + 0.8) % (roadW * 0.75);
      ctx.strokeStyle = theme.sonarRing;
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(cx, cy, sonarRadius, 0, Math.PI * 2);
      ctx.stroke();

      const sonar2 = (sonarRadius + roadW * 0.35) % (roadW * 0.75);
      ctx.beginPath();
      ctx.arc(cx, cy, sonar2, 0, Math.PI * 2);
      ctx.stroke();

      // 4. 360-Degree Sweeping Radar Cone
      radarAngle += 0.014;
      ctx.save();
      ctx.translate(cx, cy);
      const sweepGrad = ctx.createRadialGradient(0, 0, 10, 0, 0, roadW * 0.75);
      sweepGrad.addColorStop(0, "rgba(56, 189, 248, 0.22)");
      sweepGrad.addColorStop(1, "rgba(56, 189, 248, 0)");
      ctx.fillStyle = sweepGrad;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.arc(0, 0, roadW * 0.75, radarAngle, radarAngle + 0.45);
      ctx.closePath();
      ctx.fill();
      ctx.restore();

      // 5. Draw Continuous High-Tech Asphalt Highway around Login Card
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
      ctx.shadowBlur = 12;
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
      ctx.lineWidth = 2.2;
      ctx.beginPath();
      ctx.roundRect(cx - roadW / 2, cy - roadH / 2, roadW, roadH, cornerRadius);
      ctx.stroke();

      // White Dashed Lane Dividers
      ctx.strokeStyle = theme.laneLine;
      ctx.lineWidth = 1.5;
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

      // 6. Coimbatore Transit Route Waypoints symmetrically placed
      const waypoints = [
        { name: "📍 Peelamedu Hub", x: cx - roadW / 2, y: cy, dist: "3.2km" },
        { name: "📍 Singanallur", x: cx + roadW / 2, y: cy, dist: "8.4km" },
        { name: "📍 Sulur RTO", x: cx, y: cy + roadH / 2 + 18, dist: "11.1km" },
        { name: "🏫 KIT Campus Central", x: cx, y: cy - roadH / 2 - 20, isKit: true, dist: "Terminal" },
      ];

      waypoints.forEach((wp) => {
        ctx.fillStyle = wp.isKit ? "#c01823" : theme.waypointBg;
        ctx.beginPath();
        ctx.arc(wp.x, wp.y, wp.isKit ? 9 : 6.5, 0, Math.PI * 2);
        ctx.fill();

        // Pulsing Ping
        const ping = (Math.sin(currentTime * 0.005) + 1) * 0.5;
        ctx.strokeStyle = wp.isKit ? "rgba(192, 24, 35, 0.7)" : "rgba(2, 132, 199, 0.7)";
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.arc(wp.x, wp.y, (wp.isKit ? 9 : 6.5) + ping * 8, 0, Math.PI * 2);
        ctx.stroke();

        // Waypoint Label & Distance Subtext
        ctx.fillStyle = wp.isKit ? "#fca5a5" : "#93c5fd";
        ctx.font = wp.isKit ? "bold 11px sans-serif" : "bold 9.5px sans-serif";
        ctx.textAlign = "center";
        ctx.fillText(wp.name, wp.x, wp.y - 12);

        ctx.fillStyle = "rgba(255, 255, 255, 0.6)";
        ctx.font = "8px monospace";
        ctx.fillText(wp.dist, wp.x, wp.y + 16);
      });

      // 7. Render Buses Exactly on the Racetrack Spline
      const spline = buildExactRacetrackSpline(cx, cy, roadW, roadH, cornerRadius, 400);

      fleet.forEach((busData) => {
        busData.offset = (busData.offset + busData.speed) % spline.length;
        const curIdx = Math.floor(busData.offset);
        const nextIdx = (curIdx + 4) % spline.length;
        const cur = spline[curIdx];
        const next = spline[nextIdx];
        const angle = Math.atan2(next.y - cur.y, next.x - cur.x);

        const busLen = isMobile ? 44 : 52;
        const busW = isMobile ? 18 : 22;

        ctx.save();
        ctx.translate(cur.x, cur.y);
        ctx.rotate(angle);

        // Underglow Shadow
        ctx.fillStyle = "rgba(0, 0, 0, 0.6)";
        ctx.beginPath();
        ctx.roundRect(-busLen / 2 + 4, -busW / 2 + 4, busLen, busW, 6);
        ctx.fill();

        // Headlight Beams (Night Mode)
        if (!isDay) {
          const lightCone = ctx.createRadialGradient(
            busLen / 2,
            0,
            2,
            busLen / 2 + 85,
            0,
            95
          );
          lightCone.addColorStop(0, busData.headlightHue);
          lightCone.addColorStop(0.5, "rgba(253, 224, 71, 0.3)");
          lightCone.addColorStop(1, "rgba(253, 224, 71, 0)");

          ctx.fillStyle = lightCone;
          ctx.beginPath();
          ctx.moveTo(busLen / 2, -busW / 2 + 2);
          ctx.lineTo(busLen / 2 + 95, -busW * 1.7);
          ctx.lineTo(busLen / 2 + 95, busW * 1.7);
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
            24
          );
          tailGlow.addColorStop(0, "rgba(239, 68, 68, 0.85)");
          tailGlow.addColorStop(1, "rgba(239, 68, 68, 0)");
          ctx.fillStyle = tailGlow;
          ctx.beginPath();
          ctx.arc(-busLen / 2 - 6, 0, 24, 0, Math.PI * 2);
          ctx.fill();
        }

        // Bus Main Chassis Body
        ctx.fillStyle = busData.color;
        ctx.beginPath();
        ctx.roundRect(-busLen / 2, -busW / 2, busLen, busW, 6);
        ctx.fill();
        ctx.strokeStyle = busData.stroke;
        ctx.lineWidth = 1.4;
        ctx.stroke();

        // College Bus Livery Stripe
        ctx.fillStyle = busData.stripe;
        ctx.fillRect(-busLen / 2 + 6, -busW / 2, busLen - 12, 3);
        ctx.fillRect(-busLen / 2 + 6, busW / 2 - 3, busLen - 12, 3);

        // Front Windshield
        ctx.fillStyle = "#0f172a";
        ctx.beginPath();
        ctx.roundRect(busLen / 2 - 12, -busW / 2 + 3, 9, busW - 6, 2);
        ctx.fill();

        // Passenger Cabin Window Strip
        ctx.fillStyle = isDay ? "rgba(15, 23, 42, 0.85)" : "#38bdf8";
        ctx.fillRect(-busLen / 2 + 8, -busW / 2 + 4, busLen - 24, 2);
        ctx.fillRect(-busLen / 2 + 8, busW / 2 - 6, busLen - 24, 2);

        // Rear Window
        ctx.fillStyle = "#0f172a";
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

        // Front LED Headlights
        ctx.fillStyle = "#fef08a";
        ctx.fillRect(busLen / 2 - 2, -busW / 2 + 2, 2.5, 3);
        ctx.fillRect(busLen / 2 - 2, busW / 2 - 5, 2.5, 3);

        // Rear LED Brake Lights
        ctx.fillStyle = "#dc2626";
        ctx.fillRect(-busLen / 2, -busW / 2 + 2, 2.5, 3);
        ctx.fillRect(-busLen / 2, busW / 2 - 5, 2.5, 3);

        // Animated Beacon Pulse Halo above Bus
        const busPulse = (Math.sin(currentTime * 0.007 + busData.offset) + 1) * 0.5;
        ctx.beginPath();
        ctx.arc(0, 0, 15 + busPulse * 7, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(56, 189, 248, ${0.5 - busPulse * 0.35})`;
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
