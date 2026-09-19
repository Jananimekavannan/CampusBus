import React, { useEffect, useRef } from "react";
import kitCampusImg from "./assets/kit-campus.png";

/**
 * CampusScene - Realistic KIT Coimbatore Campus Infrastructure & Road Network
 * - Features the actual KIT Coimbatore curved multi-storey building with its blue-glass cylindrical tower & red accents
 * - Precise road network with strict lane locking (buses stay strictly on asphalt roads)
 * - Calibrated realistic bus speeds (gentle cruising & smooth deceleration at the main porch)
 * - Manicured front lawns, flower beds, palm trees, and modern street lighting
 * - Day ☀️ and Night 🌙 lighting modes
 */
export default function AerialCampusMap({ timeMode = "day" }) {
  const canvasRef = useRef(null);
  const mouseRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });

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

    const handleMouseMove = (e) => {
      mouseRef.current.targetX = (e.clientX / width - 0.5) * 15;
      mouseRef.current.targetY = (e.clientY / height - 0.5) * 15;
    };
    window.addEventListener("mousemove", handleMouseMove);

    const isDay = timeMode === "day";

    // Theme colors
    const colors = isDay
      ? {
          grass: "#3e8e41",
          grassSub: "#2e7d32",
          lawnBorder: "#1e5e22",
          flowerbed: "#8bc34a",
          pavement: "#94a3b8",
          road: "#2d3748",
          roadBorder: "#4a5568",
          roadLine: "#facc15",
          laneLine: "rgba(255, 255, 255, 0.8)",
          crosswalk: "rgba(255, 255, 255, 0.9)",
          treeDark: "#1b5e20",
          treeLight: "#4caf50",
          treeShadow: "rgba(0, 0, 0, 0.18)",
          streetLamp: "rgba(255, 255, 255, 0)",
        }
      : {
          grass: "#0b1712",
          grassSub: "#07120e",
          lawnBorder: "#11261c",
          flowerbed: "#133322",
          pavement: "#141d2b",
          road: "#161f2e",
          roadBorder: "#27354a",
          roadLine: "rgba(250, 204, 21, 0.7)",
          laneLine: "rgba(255, 255, 255, 0.3)",
          crosswalk: "rgba(255, 255, 255, 0.45)",
          treeDark: "#081c12",
          treeLight: "#103822",
          treeShadow: "rgba(0, 0, 0, 0.55)",
          streetLamp: "rgba(255, 215, 120, 0.4)",
        };

    // Virtual Coordinate Space: 1600 x 900
    const baseW = 1600;
    const baseH = 900;

    // Helper: generate smooth spline points with Catmull-Rom
    function interpolatePath(points, segmentsPerCurve = 35) {
      const result = [];
      const len = points.length;
      for (let i = 0; i < len; i++) {
        const p0 = points[(i - 1 + len) % len];
        const p1 = points[i];
        const p2 = points[(i + 1) % len];
        const p3 = points[(i + 2) % len];

        for (let t = 0; t < 1; t += 1 / segmentsPerCurve) {
          const t2 = t * t;
          const t3 = t2 * t;

          const x =
            0.5 *
            (2 * p1.x +
              (-p0.x + p2.x) * t +
              (2 * p0.x - 5 * p1.x + 4 * p2.x - p3.x) * t2 +
              (-p0.x + 3 * p1.x - 3 * p2.x + p3.x) * t3);
          const y =
            0.5 *
            (2 * p1.y +
              (-p0.y + p2.y) * t +
              (2 * p0.y - 5 * p1.y + 4 * p2.y - p3.y) * t2 +
              (-p0.y + 3 * p1.y - 3 * p2.y + p3.y) * t3);

          result.push({ x, y, stop: p1.stop && t < 0.1 });
        }
      }
      return result;
    }

    // Road Waypoints:
    // Route 1: Main Campus Dual-Carriageway Boulevard (Eastbound -> Westbound closed loop)
    const route1Points = [
      { x: -50, y: 760 },
      { x: 400, y: 760 },
      { x: 800, y: 760 },
      { x: 1200, y: 760 },
      { x: 1650, y: 760 },
      { x: 1670, y: 790 },
      { x: 1650, y: 820 },
      { x: 1200, y: 820 },
      { x: 800, y: 820 },
      { x: 400, y: 820 },
      { x: -50, y: 820 },
      { x: -70, y: 790 },
    ];

    // Route 2: Grand Portico Driveway (Enters from East, drives up to the KIT Main Entrance Porch, stops, loops back)
    const route2Points = [
      { x: -50, y: 760 },
      { x: 320, y: 760 },
      { x: 460, y: 730 },
      { x: 580, y: 640 },
      { x: 740, y: 610, stop: true }, // KIT Main Portico Bus Stop
      { x: 920, y: 610 },
      { x: 1080, y: 640 },
      { x: 1200, y: 730 },
      { x: 1340, y: 760 },
      { x: 1650, y: 760 },
      { x: 1670, y: 790 },
      { x: 1650, y: 820 },
      { x: -50, y: 820 },
      { x: -70, y: 790 },
    ];

    // Route 3: West Campus & Central Roundabout Loop
    const route3Points = [
      { x: 1650, y: 820 },
      { x: 1250, y: 820 },
      { x: 1140, y: 790 },
      { x: 1050, y: 710 },
      { x: 950, y: 680 },
      { x: 850, y: 680, stop: true },
      { x: 750, y: 710 },
      { x: 650, y: 790 },
      { x: 500, y: 820 },
      { x: -50, y: 820 },
      { x: -70, y: 790 },
      { x: -50, y: 760 },
      { x: 1650, y: 760 },
      { x: 1670, y: 790 },
    ];

    const spline1 = interpolatePath(route1Points, 40);
    const spline2 = interpolatePath(route2Points, 40);
    const spline3 = interpolatePath(route3Points, 40);

    // Realistic calm bus speeds (0.35 - 0.45 px/frame for smooth, natural movement)
    const buses = [
      {
        id: "bus12",
        name: "KIT Bus #12",
        color: "#f59e0b",
        badge: "KIT-12",
        spline: spline2,
        index: 0,
        speed: 0.38,
        stopTimer: 0,
        width: 20,
        length: 50,
      },
      {
        id: "bus15",
        name: "KIT Bus #15",
        color: "#fbbf24",
        badge: "KIT-15",
        spline: spline1,
        index: Math.floor(spline1.length * 0.45),
        speed: 0.42,
        stopTimer: 0,
        width: 20,
        length: 50,
      },
      {
        id: "bus21",
        name: "KIT Bus #21",
        color: "#eab308",
        badge: "KIT-21",
        spline: spline3,
        index: Math.floor(spline3.length * 0.7),
        speed: 0.36,
        stopTimer: 0,
        width: 20,
        length: 50,
      },
    ];

    // Palm trees & garden flora matching the campus photo
    const trees = [
      // Left driveway gardens
      { x: 180, y: 690, r: 16 },
      { x: 230, y: 670, r: 14 },
      { x: 280, y: 650, r: 15 },
      { x: 340, y: 630, r: 16 },
      // Central manicured garden island trees
      { x: 620, y: 675, r: 13 },
      { x: 680, y: 685, r: 15 },
      { x: 740, y: 690, r: 14 },
      { x: 800, y: 690, r: 15 },
      { x: 860, y: 685, r: 14 },
      { x: 920, y: 675, r: 13 },
      // Right entrance trees
      { x: 1220, y: 650, r: 15 },
      { x: 1280, y: 670, r: 14 },
      { x: 1340, y: 690, r: 16 },
      { x: 1400, y: 710, r: 15 },
      // Boulevard street tree line
      { x: 100, y: 870, r: 18 },
      { x: 300, y: 870, r: 18 },
      { x: 500, y: 870, r: 18 },
      { x: 700, y: 870, r: 18 },
      { x: 900, y: 870, r: 18 },
      { x: 1100, y: 870, r: 18 },
      { x: 1300, y: 870, r: 18 },
      { x: 1500, y: 870, r: 18 },
    ];

    // Modern Street Lamps along the driveway and boulevard
    const streetLamps = [
      { x: 150, y: 730 },
      { x: 450, y: 730 },
      { x: 750, y: 730 },
      { x: 1050, y: 730 },
      { x: 1350, y: 730 },
      { x: 600, y: 580 },
      { x: 740, y: 580 },
      { x: 880, y: 580 },
      { x: 1020, y: 580 },
    ];

    function render(currentTime) {
      mouseRef.current.x +=
        (mouseRef.current.targetX - mouseRef.current.x) * 0.05;
      mouseRef.current.y +=
        (mouseRef.current.targetY - mouseRef.current.y) * 0.05;

      ctx.clearRect(0, 0, width, height);

      const scale = Math.max(width / baseW, height / baseH);
      const offsetX = (width - baseW * scale) / 2 + mouseRef.current.x;
      const offsetY = (height - baseH * scale) / 2 + mouseRef.current.y;

      ctx.save();
      ctx.translate(offsetX, offsetY);
      ctx.scale(scale, scale);

      // 1. Base Terrain (Campus Lawns)
      ctx.fillStyle = colors.grass;
      ctx.fillRect(-100, 480, baseW + 200, 450);

      // Manicured Geometric Front Lawns (matching KIT photo)
      ctx.fillStyle = colors.grassSub;
      ctx.beginPath();
      // Left flowerbed
      ctx.moveTo(350, 680);
      ctx.lineTo(540, 580);
      ctx.lineTo(600, 630);
      ctx.lineTo(400, 710);
      ctx.closePath();
      ctx.fill();
      ctx.strokeStyle = colors.lawnBorder;
      ctx.lineWidth = 2;
      ctx.stroke();

      // Right geometric lawn
      ctx.beginPath();
      ctx.moveTo(1000, 630);
      ctx.lineTo(1060, 580);
      ctx.lineTo(1250, 680);
      ctx.lineTo(1190, 710);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Central Garden Island
      ctx.fillStyle = colors.flowerbed;
      ctx.beginPath();
      ctx.roundRect(640, 650, 320, 65, 30);
      ctx.fill();
      ctx.strokeStyle = colors.lawnBorder;
      ctx.lineWidth = 2;
      ctx.stroke();

      // 2. Asphalt Road Networks
      // A. Grand Portico Loop Driveway
      ctx.strokeStyle = colors.road;
      ctx.lineWidth = 50;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";

      ctx.beginPath();
      ctx.moveTo(320, 760);
      ctx.quadraticCurveTo(500, 600, 740, 610);
      ctx.lineTo(920, 610);
      ctx.quadraticCurveTo(1160, 600, 1340, 760);
      ctx.stroke();

      // Portico Driveway Yellow Center Dash
      ctx.strokeStyle = colors.roadLine;
      ctx.lineWidth = 1.5;
      ctx.setLineDash([8, 12]);
      ctx.beginPath();
      ctx.moveTo(320, 760);
      ctx.quadraticCurveTo(500, 600, 740, 610);
      ctx.lineTo(920, 610);
      ctx.quadraticCurveTo(1160, 600, 1340, 760);
      ctx.stroke();
      ctx.setLineDash([]);

      // B. Main Dual-Carriageway Boulevard (East-West)
      ctx.strokeStyle = colors.road;
      ctx.lineWidth = 80;
      ctx.beginPath();
      ctx.moveTo(-100, 790);
      ctx.lineTo(baseW + 100, 790);
      ctx.stroke();

      // Double Solid Yellow Center Line on Boulevard
      ctx.strokeStyle = colors.roadLine;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(-100, 788);
      ctx.lineTo(baseW + 100, 788);
      ctx.moveTo(-100, 792);
      ctx.lineTo(baseW + 100, 792);
      ctx.stroke();

      // White Lane Divider Dashes
      ctx.strokeStyle = colors.laneLine;
      ctx.lineWidth = 1.5;
      ctx.setLineDash([14, 18]);
      ctx.beginPath();
      ctx.moveTo(-100, 760);
      ctx.lineTo(baseW + 100, 760);
      ctx.moveTo(-100, 820);
      ctx.lineTo(baseW + 100, 820);
      ctx.stroke();
      ctx.setLineDash([]);

      // Zebra Crossings at Main Entrance
      const drawCrosswalk = (cx, cy) => {
        ctx.fillStyle = colors.crosswalk;
        for (let i = 0; i < 7; i++) {
          ctx.fillRect(cx - 20 + i * 6, cy - 25, 3.5, 50);
        }
      };
      drawCrosswalk(740, 610);
      drawCrosswalk(830, 790);

      // Bus Stop Marking: "KIT MAIN ENTRANCE PORCH"
      ctx.fillStyle = isDay ? "rgba(234, 179, 8, 0.35)" : "rgba(250, 204, 21, 0.2)";
      ctx.strokeStyle = "#f59e0b";
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.roundRect(690, 575, 180, 24, 6);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = isDay ? "#78350f" : "#fbbf24";
      ctx.font = "bold 9px Inter, sans-serif";
      ctx.textAlign = "center";
      ctx.fillText("🚌 KIT MAIN PORCH TRANSIT BAY", 780, 590);

      // 3. Trees & Canopies
      trees.forEach((t) => {
        // Drop shadow
        ctx.fillStyle = colors.treeShadow;
        ctx.beginPath();
        ctx.arc(t.x + 3, t.y + 4, t.r * 1.1, 0, Math.PI * 2);
        ctx.fill();

        // Dark foliage
        ctx.fillStyle = colors.treeDark;
        ctx.beginPath();
        ctx.arc(t.x, t.y, t.r, 0, Math.PI * 2);
        ctx.fill();

        // Highlight
        ctx.fillStyle = colors.treeLight;
        ctx.beginPath();
        ctx.arc(t.x - t.r * 0.25, t.y - t.r * 0.25, t.r * 0.65, 0, Math.PI * 2);
        ctx.fill();
      });

      // 4. Street Lamps (Night illumination)
      if (!isDay) {
        streetLamps.forEach((lamp) => {
          const glow = ctx.createRadialGradient(
            lamp.x,
            lamp.y,
            2,
            lamp.x,
            lamp.y,
            42
          );
          glow.addColorStop(0, colors.streetLamp);
          glow.addColorStop(1, "rgba(255, 200, 100, 0)");
          ctx.fillStyle = glow;
          ctx.beginPath();
          ctx.arc(lamp.x, lamp.y, 42, 0, Math.PI * 2);
          ctx.fill();

          ctx.fillStyle = "#fef08a";
          ctx.beginPath();
          ctx.arc(lamp.x, lamp.y, 3, 0, Math.PI * 2);
          ctx.fill();
        });
      }

      // 5. Update & Render Animated KIT Buses (Strictly on Road Paths)
      buses.forEach((bus) => {
        const curIdx = Math.floor(bus.index);
        const curPoint = bus.spline[curIdx];

        // Smooth stop at the main entrance porch
        if (curPoint?.stop && bus.stopTimer <= 0 && Math.random() < 0.08) {
          bus.stopTimer = 90; // Pause for ~1.5s
        }

        if (bus.stopTimer > 0) {
          bus.stopTimer--;
        } else {
          bus.index = (bus.index + bus.speed) % bus.spline.length;
        }

        const nextIdx = (Math.floor(bus.index) + 3) % bus.spline.length;
        const nextPoint = bus.spline[nextIdx];
        const angle = Math.atan2(nextPoint.y - curPoint.y, nextPoint.x - curPoint.x);

        ctx.save();
        ctx.translate(curPoint.x, curPoint.y);
        ctx.rotate(angle);

        // Bus Drop Shadow
        ctx.fillStyle = "rgba(0, 0, 0, 0.45)";
        ctx.beginPath();
        ctx.roundRect(
          -bus.length / 2 + 3,
          -bus.width / 2 + 4,
          bus.length,
          bus.width,
          5
        );
        ctx.fill();

        // Forward Headlight Beams in Night Mode
        if (!isDay) {
          const lightCone = ctx.createRadialGradient(
            bus.length / 2,
            0,
            2,
            bus.length / 2 + 65,
            0,
            75
          );
          lightCone.addColorStop(0, "rgba(254, 240, 138, 0.65)");
          lightCone.addColorStop(0.5, "rgba(253, 224, 71, 0.25)");
          lightCone.addColorStop(1, "rgba(253, 224, 71, 0)");

          ctx.fillStyle = lightCone;
          ctx.beginPath();
          ctx.moveTo(bus.length / 2, -bus.width / 2 + 2);
          ctx.lineTo(bus.length / 2 + 75, -bus.width * 1.4);
          ctx.lineTo(bus.length / 2 + 75, bus.width * 1.4);
          ctx.lineTo(bus.length / 2, bus.width / 2 - 2);
          ctx.closePath();
          ctx.fill();

          // Tail Brake Light Glow
          const tailGlow = ctx.createRadialGradient(
            -bus.length / 2 - 4,
            0,
            2,
            -bus.length / 2 - 10,
            0,
            18
          );
          tailGlow.addColorStop(
            0,
            bus.stopTimer > 0 ? "rgba(239, 68, 68, 0.9)" : "rgba(239, 68, 68, 0.45)"
          );
          tailGlow.addColorStop(1, "rgba(239, 68, 68, 0)");
          ctx.fillStyle = tailGlow;
          ctx.beginPath();
          ctx.arc(-bus.length / 2 - 6, 0, 18, 0, Math.PI * 2);
          ctx.fill();
        }

        // Bus Main Chassis (College Yellow)
        ctx.fillStyle = bus.color;
        ctx.beginPath();
        ctx.roundRect(-bus.length / 2, -bus.width / 2, bus.length, bus.width, 5);
        ctx.fill();
        ctx.strokeStyle = "#b45309";
        ctx.lineWidth = 1.2;
        ctx.stroke();

        // KIT Red Stripe
        ctx.fillStyle = "#b91c1c";
        ctx.fillRect(-bus.length / 2 + 6, -bus.width / 2, bus.length - 12, 2.5);
        ctx.fillRect(-bus.length / 2 + 6, bus.width / 2 - 2.5, bus.length - 12, 2.5);

        // Windshield Glass
        ctx.fillStyle = "#0f172a";
        ctx.beginPath();
        ctx.roundRect(bus.length / 2 - 10, -bus.width / 2 + 3, 7, bus.width - 6, 2);
        ctx.fill();

        // Rear Window
        ctx.fillRect(-bus.length / 2 + 3, -bus.width / 2 + 4, 3, bus.width - 8);

        // Roof AC Unit
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(-8, -bus.width / 2 + 4, 16, bus.width - 8);
        ctx.strokeStyle = "#cbd5e1";
        ctx.lineWidth = 0.8;
        ctx.strokeRect(-8, -bus.width / 2 + 4, 16, bus.width - 8);

        // Roof Badge: "KIT"
        ctx.fillStyle = "#1e3a8a";
        ctx.font = "bold 8.5px Inter, sans-serif";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(bus.badge, 0, 0);

        // Front Headlight Dots
        ctx.fillStyle = "#fef08a";
        ctx.fillRect(bus.length / 2 - 2, -bus.width / 2 + 2, 2, 2.5);
        ctx.fillRect(bus.length / 2 - 2, bus.width / 2 - 4.5, 2, 2.5);

        // Rear Brake Light Dots
        ctx.fillStyle = bus.stopTimer > 0 ? "#ff0000" : "#dc2626";
        ctx.fillRect(-bus.length / 2, -bus.width / 2 + 2, 2, 2.5);
        ctx.fillRect(-bus.length / 2, bus.width / 2 - 4.5, 2, 2.5);

        ctx.restore();
      });

      ctx.restore();

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
    <div className={`campus-scene-container ${timeMode}`}>
      {/* 1. Sky & Atmosphere Layer */}
      <div className="campus-sky-backdrop" />

      {/* 2. Actual KIT Coimbatore Campus Building Backdrop */}
      <div className="campus-building-backdrop">
        <img
          src={kitCampusImg}
          alt="KIT Coimbatore Main Campus Building"
          className="campus-photo-img"
        />
        <div className="campus-building-lighting-filter" />
      </div>

      {/* 3. Live Canvas (Road network, geometric lawns, trees, animated KIT buses) */}
      <canvas ref={canvasRef} className="campus-road-canvas" />

      {/* 4. Vignette / Contrast Overlay */}
      <div className="campus-overlay-vignette" />
    </div>
  );
}
