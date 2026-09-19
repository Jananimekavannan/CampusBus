import React, { useEffect, useRef } from "react";

/**
 * AerialCampusMap - High-Performance Canvas Component
 * Renders a living bird's-eye view of KIT Coimbatore Campus:
 * - Asphalt road networks, double yellow lines, lane dividers, zebra crosswalks
 * - Roundabouts with fountain island & floral landscape
 * - Academic blocks, tech parks, solar roofs, library, sports stadium
 * - Canopy trees with soft shadows and foliage texture
 * - Animated KIT Buses (yellow/red livery, "KIT" roof branding, glowing headlights, brake lights, bus stops)
 * - Animated campus traffic (cars, buggies)
 * - Smooth Day ☀️ and Night 🌙 lighting modes
 */
export default function AerialCampusMap({ timeMode = "night" }) {
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
      mouseRef.current.targetX = (e.clientX / width - 0.5) * 30;
      mouseRef.current.targetY = (e.clientY / height - 0.5) * 30;
    };
    window.addEventListener("mousemove", handleMouseMove);

    // Color palettes for Day and Night lighting modes
    const theme =
      timeMode === "day"
        ? {
            grass: "#3b7a42",
            grassSub: "#316937",
            pavement: "#94a3b8",
            road: "#334155",
            roadBorder: "#475569",
            roadLine: "#eab308",
            laneLine: "rgba(255, 255, 255, 0.85)",
            crosswalk: "rgba(255, 255, 255, 0.95)",
            buildingFill: "#e2e8f0",
            buildingRoof: "#f1f5f9",
            buildingBorder: "#cbd5e1",
            buildingText: "#1e293b",
            treeDark: "#1b5e20",
            treeLight: "#4caf50",
            treeShadow: "rgba(0,0,0,0.22)",
            ambientLight: "rgba(255, 255, 255, 0)",
            headlight: "rgba(255, 255, 220, 0.25)",
            streetLamp: "rgba(255, 240, 180, 0.05)",
            isDay: true,
          }
        : {
            grass: "#0b1512",
            grassSub: "#08100e",
            pavement: "#131b26",
            road: "#18202c",
            roadBorder: "#2a3649",
            roadLine: "rgba(255, 215, 0, 0.65)",
            laneLine: "rgba(255, 255, 255, 0.25)",
            crosswalk: "rgba(255, 255, 255, 0.4)",
            buildingFill: "#15202e",
            buildingRoof: "#1e2c3f",
            buildingBorder: "#2c3e55",
            buildingText: "rgba(255, 255, 255, 0.75)",
            treeDark: "#092415",
            treeLight: "#103d24",
            treeShadow: "rgba(0,0,0,0.6)",
            ambientLight: "rgba(5, 10, 20, 0.55)",
            headlight: "rgba(255, 250, 200, 0.65)",
            streetLamp: "rgba(255, 220, 120, 0.35)",
            isDay: false,
          };

    // Normalized map coordinate space
    const baseW = 1400;
    const baseH = 900;

    // Helper: generate smooth spline waypoints
    function interpolatePath(points, segmentsPerCurve = 25) {
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

    // Waypoints for Route 1: Campus Perimeter Outer Loop (Bus 12)
    const route1Points = [
      { x: 140, y: 160 },
      { x: 700, y: 160, stop: true },
      { x: 1260, y: 160 },
      { x: 1260, y: 450 },
      { x: 1260, y: 740 },
      { x: 700, y: 740, stop: true },
      { x: 140, y: 740 },
      { x: 140, y: 450 },
    ];

    // Waypoints for Route 2: Central Avenue & Roundabout Loop (Bus 15)
    const route2Points = [
      { x: 140, y: 450 },
      { x: 520, y: 450 },
      { x: 620, y: 380 },
      { x: 700, y: 350 },
      { x: 780, y: 380 },
      { x: 820, y: 450 },
      { x: 1100, y: 450, stop: true },
      { x: 1260, y: 450 },
      { x: 1100, y: 450 },
      { x: 820, y: 450 },
      { x: 780, y: 520 },
      { x: 700, y: 550 },
      { x: 620, y: 520 },
      { x: 520, y: 450 },
    ];

    // Waypoints for Route 3: Academic Spine & Hostels (Bus 21)
    const route3Points = [
      { x: 700, y: 160 },
      { x: 700, y: 350 },
      { x: 780, y: 420 },
      { x: 820, y: 450 },
      { x: 780, y: 520 },
      { x: 700, y: 550 },
      { x: 700, y: 740, stop: true },
      { x: 450, y: 740 },
      { x: 140, y: 600 },
      { x: 140, y: 300 },
      { x: 450, y: 160, stop: true },
    ];

    // Waypoints for Route 4: Campus Express Shuttle (KIT-07)
    const route4Points = [
      { x: 350, y: 280 },
      { x: 580, y: 280 },
      { x: 650, y: 380 },
      { x: 750, y: 380 },
      { x: 850, y: 280, stop: true },
      { x: 1050, y: 280 },
      { x: 1050, y: 620 },
      { x: 850, y: 620 },
      { x: 750, y: 520 },
      { x: 650, y: 520 },
      { x: 350, y: 620, stop: true },
    ];

    const spline1 = interpolatePath(route1Points, 35);
    const spline2 = interpolatePath(route2Points, 30);
    const spline3 = interpolatePath(route3Points, 30);
    const spline4 = interpolatePath(route4Points, 28);

    // Buses
    const buses = [
      {
        id: "bus12",
        name: "KIT Bus #12",
        route: "Gandhipuram ⇄ KIT Campus",
        color: "#fbbf24",
        badge: "KIT-12",
        spline: spline1,
        index: 0,
        speed: 1.1,
        stopTimer: 0,
        width: 22,
        length: 54,
      },
      {
        id: "bus15",
        name: "KIT Bus #15",
        route: "Saravanampatti ⇄ KIT Tech Park",
        color: "#f59e0b",
        badge: "KIT-15",
        spline: spline2,
        index: Math.floor(spline2.length * 0.4),
        speed: 0.95,
        stopTimer: 0,
        width: 22,
        length: 52,
      },
      {
        id: "bus21",
        name: "KIT Bus #21",
        route: "Pollachi Express ⇄ Central Bay",
        color: "#eab308",
        badge: "KIT-21",
        spline: spline3,
        index: Math.floor(spline3.length * 0.7),
        speed: 1.05,
        stopTimer: 0,
        width: 22,
        length: 54,
      },
      {
        id: "bus07",
        name: "KIT Shuttle #07",
        route: "Internal Campus Express",
        color: "#38bdf8",
        badge: "KIT-07",
        spline: spline4,
        index: Math.floor(spline4.length * 0.2),
        speed: 1.25,
        stopTimer: 0,
        width: 18,
        length: 42,
      },
    ];

    // Cars & small traffic
    const cars = [
      {
        spline: spline1,
        index: Math.floor(spline1.length * 0.6),
        speed: 1.6,
        color: "#f8fafc",
        width: 14,
        length: 28,
      },
      {
        spline: spline2,
        index: Math.floor(spline2.length * 0.8),
        speed: 1.4,
        color: "#ef4444",
        width: 13,
        length: 26,
      },
      {
        spline: spline3,
        index: Math.floor(spline3.length * 0.25),
        speed: 1.5,
        color: "#3b82f6",
        width: 14,
        length: 28,
      },
    ];

    // Procedural Campus Buildings
    const buildings = [
      {
        x: 240,
        y: 220,
        w: 180,
        h: 120,
        label: "KIT MAIN ADMINISTRATIVE BLOCK",
        hasSolar: true,
        hasHelipad: false,
      },
      {
        x: 880,
        y: 220,
        w: 220,
        h: 120,
        label: "KIT TECH PARK & INNOVATION LABS",
        hasSolar: true,
        hasHelipad: true,
      },
      {
        x: 240,
        y: 540,
        w: 190,
        h: 130,
        label: "MECHANICAL & ROBOTICS BLOCK",
        hasSolar: false,
        hasHelipad: false,
      },
      {
        x: 880,
        y: 540,
        w: 210,
        h: 130,
        label: "LIBRARY & AUDITORIUM COMPLEX",
        hasSolar: true,
        hasHelipad: false,
      },
      {
        x: 480,
        y: 620,
        w: 140,
        h: 70,
        label: "STUDENT FOOD COURT",
        hasSolar: false,
        hasHelipad: false,
      },
    ];

    // Trees
    const trees = [];
    const treeSeeds = [
      { cx: 190, cy: 220, count: 8, spread: 50 },
      { cx: 440, cy: 220, count: 6, spread: 40 },
      { cx: 830, cy: 220, count: 7, spread: 45 },
      { cx: 1130, cy: 220, count: 8, spread: 55 },
      { cx: 700, cy: 450, count: 12, spread: 38 },
      { cx: 190, cy: 620, count: 9, spread: 60 },
      { cx: 450, cy: 570, count: 6, spread: 35 },
      { cx: 830, cy: 620, count: 7, spread: 45 },
      { cx: 1140, cy: 600, count: 10, spread: 60 },
      { cx: 400, cy: 110, count: 5, spread: 70 },
      { cx: 1000, cy: 110, count: 5, spread: 70 },
      { cx: 400, cy: 790, count: 5, spread: 70 },
      { cx: 1000, cy: 790, count: 5, spread: 70 },
    ];

    treeSeeds.forEach((seed) => {
      for (let i = 0; i < seed.count; i++) {
        const angle = Math.random() * Math.PI * 2;
        const dist = Math.random() * seed.spread;
        trees.push({
          x: seed.cx + Math.cos(angle) * dist,
          y: seed.cy + Math.sin(angle) * dist,
          r: 10 + Math.random() * 12,
        });
      }
    });

    // Street Lamps
    const streetLamps = [
      { x: 140, y: 160 },
      { x: 420, y: 160 },
      { x: 700, y: 160 },
      { x: 980, y: 160 },
      { x: 1260, y: 160 },
      { x: 140, y: 450 },
      { x: 420, y: 450 },
      { x: 980, y: 450 },
      { x: 1260, y: 450 },
      { x: 140, y: 740 },
      { x: 420, y: 740 },
      { x: 700, y: 740 },
      { x: 980, y: 740 },
      { x: 1260, y: 740 },
      { x: 700, y: 300 },
      { x: 700, y: 600 },
    ];

    // Bus Stops
    const busStops = [
      { x: 700, y: 130, name: "KIT North Gate Transit Bay" },
      { x: 1100, y: 420, name: "KIT Tech Park Terminal" },
      { x: 700, y: 770, name: "KIT South Hostel Bay" },
      { x: 110, y: 450, name: "West Campus Entrance" },
    ];

    // Animation Render Loop
    function render(currentTime) {
      // Smooth mouse parallax
      mouseRef.current.x +=
        (mouseRef.current.targetX - mouseRef.current.x) * 0.05;
      mouseRef.current.y +=
        (mouseRef.current.targetY - mouseRef.current.y) * 0.05;

      ctx.clearRect(0, 0, width, height);

      const scale = Math.max(width / baseW, height / baseH) * 1.05;
      const offsetX = (width - baseW * scale) / 2 + mouseRef.current.x;
      const offsetY = (height - baseH * scale) / 2 + mouseRef.current.y;

      ctx.save();
      ctx.translate(offsetX, offsetY);
      ctx.scale(scale, scale);

      // 1. Base Terrain (Campus Grounds & Grass)
      ctx.fillStyle = theme.grass;
      ctx.fillRect(-200, -200, baseW + 400, baseH + 400);

      // Subtle grass lawn grid patches / sports grounds
      ctx.fillStyle = theme.grassSub;
      ctx.beginPath();
      ctx.roundRect(560, 220, 280, 110, 14);
      ctx.fill();
      ctx.strokeStyle = theme.isDay ? "rgba(255,255,255,0.4)" : "rgba(255,255,255,0.18)";
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Center field circle
      ctx.beginPath();
      ctx.arc(700, 275, 25, 0, Math.PI * 2);
      ctx.stroke();

      // 2. Secondary Pathways & Pavers
      ctx.strokeStyle = theme.pavement;
      ctx.lineWidth = 18;
      ctx.lineCap = "round";
      ctx.beginPath();
      ctx.moveTo(330, 340);
      ctx.lineTo(330, 540);
      ctx.moveTo(990, 340);
      ctx.lineTo(990, 540);
      ctx.moveTo(430, 450);
      ctx.lineTo(580, 450);
      ctx.moveTo(820, 450);
      ctx.lineTo(970, 450);
      ctx.stroke();

      // 3. Roads Network
      const roadWidth = 54;
      ctx.strokeStyle = theme.road;
      ctx.lineWidth = roadWidth;
      ctx.lineJoin = "round";
      ctx.lineCap = "round";

      // Outer Loop Parkway
      ctx.beginPath();
      ctx.roundRect(140, 160, 1120, 580, 40);
      ctx.stroke();

      // Central Avenue (East-West)
      ctx.beginPath();
      ctx.moveTo(140, 450);
      ctx.lineTo(1260, 450);
      ctx.stroke();

      // Central Spine (North-South)
      ctx.beginPath();
      ctx.moveTo(700, 160);
      ctx.lineTo(700, 740);
      ctx.stroke();

      // Central Roundabout Base
      ctx.beginPath();
      ctx.arc(700, 450, 78, 0, Math.PI * 2);
      ctx.fillStyle = theme.road;
      ctx.fill();

      // Central Roundabout Green Island
      ctx.beginPath();
      ctx.arc(700, 450, 42, 0, Math.PI * 2);
      ctx.fillStyle = theme.treeDark;
      ctx.fill();
      ctx.strokeStyle = "#38bdf8";
      ctx.lineWidth = 3;
      ctx.stroke();

      // Central Fountain in Roundabout
      ctx.beginPath();
      ctx.arc(700, 450, 14, 0, Math.PI * 2);
      ctx.fillStyle = "#0284c7";
      ctx.fill();

      // Road Markings: Double Yellow Center Line & White Dashed Lanes
      ctx.lineWidth = 2;
      ctx.strokeStyle = theme.roadLine;

      // Outer Loop Yellow Center Line
      ctx.beginPath();
      ctx.roundRect(140, 160, 1120, 580, 40);
      ctx.stroke();

      // Central Avenue Yellow Center Line
      ctx.beginPath();
      ctx.moveTo(140, 450);
      ctx.lineTo(622, 450);
      ctx.moveTo(778, 450);
      ctx.lineTo(1260, 450);
      ctx.moveTo(700, 160);
      ctx.lineTo(700, 372);
      ctx.moveTo(700, 528);
      ctx.lineTo(700, 740);
      ctx.stroke();

      // White Dashed Lane Dividers
      ctx.strokeStyle = theme.laneLine;
      ctx.setLineDash([12, 16]);
      ctx.lineWidth = 1.5;

      ctx.beginPath();
      ctx.roundRect(127, 147, 1146, 606, 45);
      ctx.roundRect(153, 173, 1094, 554, 35);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(140, 437);
      ctx.lineTo(622, 437);
      ctx.moveTo(140, 463);
      ctx.lineTo(622, 463);
      ctx.moveTo(778, 437);
      ctx.lineTo(1260, 437);
      ctx.moveTo(778, 463);
      ctx.lineTo(1260, 463);
      ctx.stroke();
      ctx.setLineDash([]);

      // Zebra Crosswalks at Intersections
      const drawCrosswalk = (cx, cy, vertical = false) => {
        ctx.fillStyle = theme.crosswalk;
        const count = 7;
        for (let i = 0; i < count; i++) {
          if (vertical) {
            ctx.fillRect(cx - 18 + i * 5.5, cy - 20, 3.5, 40);
          } else {
            ctx.fillRect(cx - 20, cy - 18 + i * 5.5, 40, 3.5);
          }
        }
      };

      drawCrosswalk(610, 450, true);
      drawCrosswalk(790, 450, true);
      drawCrosswalk(700, 360, false);
      drawCrosswalk(700, 540, false);
      drawCrosswalk(700, 160, true);
      drawCrosswalk(700, 740, true);
      drawCrosswalk(140, 450, false);
      drawCrosswalk(1260, 450, false);

      // Bus Stop Bays & Shelters
      busStops.forEach((bs) => {
        ctx.fillStyle = theme.isDay ? "rgba(234, 179, 8, 0.4)" : "rgba(251, 191, 36, 0.25)";
        ctx.strokeStyle = "#f59e0b";
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.roundRect(bs.x - 45, bs.y - 12, 90, 24, 6);
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = theme.isDay ? "#78350f" : "#fbbf24";
        ctx.font = "bold 9px Inter, sans-serif";
        ctx.textAlign = "center";
        ctx.fillText("🚌 BUS BAY", bs.x, bs.y + 3);
      });

      // 4. Buildings
      buildings.forEach((b) => {
        // Drop shadow
        ctx.fillStyle = theme.buildingBorder === "#cbd5e1" ? "rgba(0,0,0,0.18)" : "rgba(0, 0, 0, 0.4)";
        ctx.fillRect(b.x + 8, b.y + 10, b.w, b.h);

        // Main building roof
        ctx.fillStyle = theme.buildingFill;
        ctx.fillRect(b.x, b.y, b.w, b.h);
        ctx.strokeStyle = theme.buildingBorder;
        ctx.lineWidth = 2;
        ctx.strokeRect(b.x, b.y, b.w, b.h);

        // Roof inner bevel
        ctx.fillStyle = theme.buildingRoof;
        ctx.fillRect(b.x + 12, b.y + 12, b.w - 24, b.h - 24);

        // Solar panels
        if (b.hasSolar) {
          ctx.fillStyle = "#1e3a8a";
          for (let row = 0; row < 2; row++) {
            for (let col = 0; col < 4; col++) {
              ctx.fillRect(b.x + 22 + col * 22, b.y + 22 + row * 18, 16, 12);
              ctx.strokeStyle = "rgba(255,255,255,0.3)";
              ctx.lineWidth = 0.5;
              ctx.strokeRect(b.x + 22 + col * 22, b.y + 22 + row * 18, 16, 12);
            }
          }
        }

        // Helipad
        if (b.hasHelipad) {
          const hx = b.x + b.w - 45;
          const hy = b.y + b.h / 2;
          ctx.strokeStyle = theme.isDay ? "#475569" : "#e2e8f0";
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.arc(hx, hy, 22, 0, Math.PI * 2);
          ctx.stroke();
          ctx.fillStyle = "#f59e0b";
          ctx.font = "bold 16px Inter, sans-serif";
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          ctx.fillText("H", hx, hy);
        }

        // Building Label
        ctx.fillStyle = theme.buildingText;
        ctx.font = "700 8.5px Inter, sans-serif";
        ctx.textAlign = "center";
        ctx.textBaseline = "alphabetic";
        ctx.fillText(b.label, b.x + b.w / 2, b.y + b.h - 8);
      });

      // 5. Trees
      trees.forEach((t) => {
        // Shadow
        ctx.fillStyle = theme.treeShadow;
        ctx.beginPath();
        ctx.arc(t.x + 4, t.y + 6, t.r * 1.1, 0, Math.PI * 2);
        ctx.fill();

        // Dark foliage base
        ctx.fillStyle = theme.treeDark;
        ctx.beginPath();
        ctx.arc(t.x, t.y, t.r, 0, Math.PI * 2);
        ctx.fill();

        // Light foliage highlights
        ctx.fillStyle = theme.treeLight;
        ctx.beginPath();
        ctx.arc(t.x - t.r * 0.25, t.y - t.r * 0.25, t.r * 0.65, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = "rgba(255,255,255,0.2)";
        ctx.beginPath();
        ctx.arc(t.x - t.r * 0.4, t.y - t.r * 0.4, t.r * 0.35, 0, Math.PI * 2);
        ctx.fill();
      });

      // 6. Street Lamps with Ambient Glow (Night only)
      if (!theme.isDay) {
        streetLamps.forEach((lamp) => {
          const glow = ctx.createRadialGradient(
            lamp.x,
            lamp.y,
            2,
            lamp.x,
            lamp.y,
            38
          );
          glow.addColorStop(0, theme.streetLamp);
          glow.addColorStop(1, "rgba(255, 200, 100, 0)");
          ctx.fillStyle = glow;
          ctx.beginPath();
          ctx.arc(lamp.x, lamp.y, 38, 0, Math.PI * 2);
          ctx.fill();

          ctx.fillStyle = "#fef08a";
          ctx.beginPath();
          ctx.arc(lamp.x, lamp.y, 3, 0, Math.PI * 2);
          ctx.fill();
        });
      }

      // 7. Update & Render Small Traffic (Cars)
      cars.forEach((car) => {
        car.index = (car.index + car.speed) % car.spline.length;
        const cur = car.spline[Math.floor(car.index)];
        const next =
          car.spline[(Math.floor(car.index) + 3) % car.spline.length];
        const angle = Math.atan2(next.y - cur.y, next.x - cur.x);

        ctx.save();
        ctx.translate(cur.x, cur.y);
        ctx.rotate(angle);

        ctx.fillStyle = "rgba(0,0,0,0.35)";
        ctx.fillRect(-car.length / 2 + 3, -car.width / 2 + 4, car.length, car.width);

        ctx.fillStyle = car.color;
        ctx.beginPath();
        ctx.roundRect(-car.length / 2, -car.width / 2, car.length, car.width, 4);
        ctx.fill();

        ctx.fillStyle = "#0f172a";
        ctx.fillRect(-car.length * 0.1, -car.width * 0.35, car.length * 0.3, car.width * 0.7);

        if (!theme.isDay) {
          const hGlow = ctx.createRadialGradient(
            car.length / 2 + 6,
            0,
            2,
            car.length / 2 + 18,
            0,
            28
          );
          hGlow.addColorStop(0, "rgba(255, 255, 210, 0.6)");
          hGlow.addColorStop(1, "rgba(255, 255, 210, 0)");
          ctx.fillStyle = hGlow;
          ctx.beginPath();
          ctx.arc(car.length / 2 + 12, 0, 26, -0.6, 0.6);
          ctx.fill();
        }

        ctx.restore();
      });

      // 8. Update & Render Animated KIT Buses
      buses.forEach((bus) => {
        const curIdx = Math.floor(bus.index);
        const curPoint = bus.spline[curIdx];

        if (curPoint?.stop && bus.stopTimer <= 0 && Math.random() < 0.05) {
          bus.stopTimer = 80;
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
        ctx.fillStyle = "rgba(0,0,0,0.45)";
        ctx.beginPath();
        ctx.roundRect(-bus.length / 2 + 4, -bus.width / 2 + 5, bus.length, bus.width, 6);
        ctx.fill();

        // Bus Headlight Beams in Night mode
        if (!theme.isDay) {
          const lightCone = ctx.createRadialGradient(
            bus.length / 2,
            0,
            4,
            bus.length / 2 + 70,
            0,
            85
          );
          lightCone.addColorStop(0, "rgba(254, 240, 138, 0.7)");
          lightCone.addColorStop(0.5, "rgba(253, 224, 71, 0.3)");
          lightCone.addColorStop(1, "rgba(253, 224, 71, 0)");

          ctx.fillStyle = lightCone;
          ctx.beginPath();
          ctx.moveTo(bus.length / 2, -bus.width / 2 + 2);
          ctx.lineTo(bus.length / 2 + 85, -bus.width * 1.5);
          ctx.lineTo(bus.length / 2 + 85, bus.width * 1.5);
          ctx.lineTo(bus.length / 2, bus.width / 2 - 2);
          ctx.closePath();
          ctx.fill();

          // Tail Lights Glow
          const tailGlow = ctx.createRadialGradient(
            -bus.length / 2 - 4,
            0,
            2,
            -bus.length / 2 - 12,
            0,
            22
          );
          tailGlow.addColorStop(
            0,
            bus.stopTimer > 0 ? "rgba(239, 68, 68, 0.9)" : "rgba(239, 68, 68, 0.5)"
          );
          tailGlow.addColorStop(1, "rgba(239, 68, 68, 0)");
          ctx.fillStyle = tailGlow;
          ctx.beginPath();
          ctx.arc(-bus.length / 2 - 6, 0, 20, 0, Math.PI * 2);
          ctx.fill();
        }

        // Bus Main Body
        ctx.fillStyle = bus.color;
        ctx.beginPath();
        ctx.roundRect(-bus.length / 2, -bus.width / 2, bus.length, bus.width, 6);
        ctx.fill();
        ctx.strokeStyle = "#b45309";
        ctx.lineWidth = 1.5;
        ctx.stroke();

        // KIT Red Stripe
        ctx.fillStyle = "#b91c1c";
        ctx.fillRect(-bus.length / 2 + 6, -bus.width / 2, bus.length - 12, 3);
        ctx.fillRect(-bus.length / 2 + 6, bus.width / 2 - 3, bus.length - 12, 3);

        // Windshield
        ctx.fillStyle = "#0f172a";
        ctx.beginPath();
        ctx.roundRect(bus.length / 2 - 11, -bus.width / 2 + 3, 8, bus.width - 6, 2);
        ctx.fill();

        // Rear Window
        ctx.fillRect(-bus.length / 2 + 3, -bus.width / 2 + 4, 4, bus.width - 8);

        // Roof AC Unit
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(-10, -bus.width / 2 + 5, 20, bus.width - 10);
        ctx.strokeStyle = "#cbd5e1";
        ctx.lineWidth = 1;
        ctx.strokeRect(-10, -bus.width / 2 + 5, 20, bus.width - 10);

        // Roof Branding: "KIT"
        ctx.fillStyle = "#1e3a8a";
        ctx.font = "bold 9px Inter, sans-serif";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(bus.badge, 0, 0);

        // Front Headlights Dots
        ctx.fillStyle = "#fef08a";
        ctx.fillRect(bus.length / 2 - 2, -bus.width / 2 + 2, 2.5, 3);
        ctx.fillRect(bus.length / 2 - 2, bus.width / 2 - 5, 2.5, 3);

        // Rear Brake Light Dots
        ctx.fillStyle = bus.stopTimer > 0 ? "#ff0000" : "#dc2626";
        ctx.fillRect(-bus.length / 2, -bus.width / 2 + 2, 2.5, 3);
        ctx.fillRect(-bus.length / 2, bus.width / 2 - 5, 2.5, 3);

        // Beacon Pulse
        const pulse = (Math.sin(currentTime * 0.005) + 1) * 0.5;
        ctx.beginPath();
        ctx.arc(0, 0, 14 + pulse * 6, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(56, 189, 248, ${0.4 - pulse * 0.3})`;
        ctx.lineWidth = 1.5;
        ctx.stroke();

        ctx.restore();
      });

      // 9. Ambient Vignette Lighting (Night only)
      if (!theme.isDay) {
        ctx.fillStyle = theme.ambientLight;
        ctx.fillRect(-200, -200, baseW + 400, baseH + 400);
      }

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
    <div className={`aerial-map-container ${timeMode}`}>
      <canvas ref={canvasRef} className="aerial-canvas" />
      <div className="aerial-overlay-vignette" />
    </div>
  );
}
