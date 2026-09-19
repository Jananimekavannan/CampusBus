import React, { useEffect, useRef } from "react";

/**
 * RevolvingBusRoad - High-Tech Multi-Bus Campus Fleet Radar Canvas
 * Advanced multi-layered transit canvas:
 * - 3 Active KIT College Buses (Bus 12 Cyber Gold, Bus 07 Electric Cyan, Bus 03 Neon Violet)
 * - Dynamic volumetric headlight cones, glowing cabin passenger lights, turn indicators, and brake lights
 * - Multi-node Cyber Particle Constellation with real-time distance proximity triangulation lines
 * - Expanding Concentric Sonar Rings & 360° Radar Sweep
 * - Coimbatore Transit Landmark Badges (Gandhipuram, Peelamedu, Singanallur, Sulur, KIT Campus Central)
 * - Interactive mouse parallax reaction
 */
export default function RevolvingBusRoad({ timeMode = "night" }) {
  const canvasRef = useRef(null);
  const mouseRef = useRef({ x: window.innerWidth / 2, y: window.innerHeight / 2, targetX: 0, targetY: 0 });

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

    const handleMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      mouseRef.current.x = x;
      mouseRef.current.y = y;
      mouseRef.current.targetX = (x - width / 2) * 0.04;
      mouseRef.current.targetY = (y - height / 2) * 0.04;
    };

    window.addEventListener("resize", handleResize);
    window.addEventListener("mousemove", handleMouseMove);

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
          particle: "rgba(37, 99, 235, 0.25)",
          particleLine: "rgba(37, 99, 235, 0.12)",
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
          particle: "rgba(56, 189, 248, 0.4)",
          particleLine: "rgba(56, 189, 248, 0.15)",
          sonarRing: "rgba(56, 189, 248, 0.2)",
        };

    // 1. Initialize Cyber Constellation Particles
    const particleCount = isDay ? 35 : 65;
    const particles = [];
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.45,
        vy: (Math.random() - 0.5) * 0.45,
        size: Math.random() * 2.2 + 1,
        alpha: Math.random() * 0.6 + 0.2,
      });
    }

    // 2. Construct racetrack path points around the center
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

    // 3. Multiple KIT Fleet Buses on the road
    const fleet = [
      {
        name: "BUS 12",
        color: "#fbbf24",
        stroke: "#b45309",
        stripe: "#b91c1c",
        offset: 0,
        speed: 0.58,
        route: "12 • GANDHIPURAM EXP",
        headlightHue: "rgba(254, 240, 138, 0.8)",
      },
      {
        name: "BUS 07",
        color: "#0284c7",
        stroke: "#0369a1",
        stripe: "#f59e0b",
        offset: 120,
        speed: 0.58,
        route: "07 • SARAVANAMPATTI",
        headlightHue: "rgba(56, 189, 248, 0.8)",
      },
      {
        name: "BUS 03",
        color: "#8b5cf6",
        stroke: "#6d28d9",
        stripe: "#ec4899",
        offset: 240,
        speed: 0.58,
        route: "03 • RS PURAM LINE",
        headlightHue: "rgba(216, 180, 254, 0.8)",
      },
    ];

    let radarAngle = 0;
    let sonarRadius = 0;

    function render(currentTime) {
      ctx.clearRect(0, 0, width, height);

      // Smooth parallax offset from mouse
      const px = mouseRef.current.targetX || 0;
      const py = mouseRef.current.targetY || 0;
      const cx = width / 2 + px;
      const cy = height / 2 + py;

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
          if (dist < 95) {
            ctx.strokeStyle = theme.particleLine;
            ctx.lineWidth = 0.8 * (1 - dist / 95);
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        }
      }

      // Card bounding dimensions + surrounding road offset
      const isMobile = width < 640;
      const cardW = isMobile ? Math.min(width - 40, 360) : 460;
      const cardH = isMobile ? 600 : 560;

      const roadMargin = isMobile ? 55 : 92;
      const roadW = cardW + roadMargin * 2;
      const roadH = cardH + roadMargin * 2;
      const cornerRadius = isMobile ? 45 : 72;
      const asphaltWidth = isMobile ? 52 : 70;

      // 3. Expanding Concentric Sonar Wave Rings
      sonarRadius = (sonarRadius + 0.8) % (roadW * 0.75);
      const sonarAlpha = Math.max(0, 1 - sonarRadius / (roadW * 0.75));
      ctx.strokeStyle = theme.sonarRing;
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(cx, cy, sonarRadius, 0, Math.PI * 2);
      ctx.stroke();

      // Second Sonar Ring
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

      // 5. Draw Continuous High-Tech Asphalt Highway
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

      // 6. Coimbatore Transit Route Waypoints along the Circuit
      const waypoints = [
        { name: "📍 Peelamedu Hub", x: cx - roadW / 2, y: cy - roadH / 2 + 60, dist: "3.2km" },
        { name: "📍 Hope College", x: cx + roadW / 2, y: cy - roadH / 2 + 60, dist: "5.8km" },
        { name: "📍 Singanallur", x: cx + roadW / 2, y: cy + roadH / 2 - 60, dist: "8.4km" },
        { name: "📍 Sulur RTO", x: cx - roadW / 2, y: cy + roadH / 2 - 60, dist: "11.1km" },
        { name: "🏫 KIT Campus Central", x: cx, y: cy - roadH / 2 - 28, isKit: true, dist: "Terminal" },
      ];

      waypoints.forEach((wp) => {
        // Glowing Stop Ring
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

        // Waypoint Label & Subtext
        ctx.fillStyle = wp.isKit ? "#fca5a5" : "#93c5fd";
        ctx.font = wp.isKit ? "bold 11px sans-serif" : "bold 9.5px sans-serif";
        ctx.textAlign = "center";
        ctx.fillText(wp.name, wp.x, wp.y - 14);

        ctx.fillStyle = "rgba(255, 255, 255, 0.6)";
        ctx.font = "8px monospace";
        ctx.fillText(wp.dist, wp.x, wp.y + 16);
      });

      // 7. Generate Spline Path & Render Active KIT Fleet Buses
      const spline = buildRacetrackPoints(cx, cy, roadW, roadH, cornerRadius, 360);

      fleet.forEach((busData) => {
        busData.offset = (busData.offset + busData.speed) % spline.length;
        const curIdx = Math.floor(busData.offset);
        const nextIdx = (curIdx + 4) % spline.length;
        const cur = spline[curIdx];
        const next = spline[nextIdx];
        const angle = Math.atan2(next.y - cur.y, next.x - cur.x);

        const busLen = isMobile ? 46 : 56;
        const busW = isMobile ? 18 : 23;

        ctx.save();
        ctx.translate(cur.x, cur.y);
        ctx.rotate(angle);

        // Dynamic Underglow Shadow
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
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, [timeMode]);

  return (
    <div className={`revolving-road-container ${timeMode}`}>
      <canvas ref={canvasRef} className="revolving-road-canvas" />
    </div>
  );
}
