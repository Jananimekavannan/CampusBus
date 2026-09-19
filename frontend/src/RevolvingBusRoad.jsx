import React, { useEffect, useRef } from "react";

/**
 * RevolvingBusRoad - High-Performance 3D Realistic Canvas Component
 * Renders a photorealistic continuous racetrack road encircling the login box:
 * - 3D textured asphalt roadway with concrete curbs, reflective double yellow lines, and lane dashes
 * - Photorealistic 3D top-down KIT College Bus with beveled metallic body, roof AC, glass windshield, side mirrors
 * - Dynamic forward headlight light cones projecting onto the asphalt, glowing red taillights, and blinking turn signals
 * - Lush corner tree canopies with foliage gradients, shadows, and campus streetlights
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
          bg: "#e2e8f0",
          lawn: "#2e7d32",
          lawnSub: "#1b5e20",
          lawnHighlight: "#4caf50",
          pavement: "#94a3b8",
          pavementBorder: "#64748b",
          road: "#2d3748",
          roadBorder: "#4a5568",
          roadLine: "#eab308",
          laneLine: "rgba(255, 255, 255, 0.9)",
          crosswalk: "rgba(255, 255, 255, 0.95)",
          treeDark: "#1b5e20",
          treeMid: "#2e7d32",
          treeLight: "#4caf50",
          treeShadow: "rgba(0, 0, 0, 0.18)",
          streetLamp: "rgba(255, 255, 255, 0)",
        }
      : {
          bg: "#050a12",
          lawn: "#08150f",
          lawnSub: "#050e0a",
          lawnHighlight: "#0f2b1c",
          pavement: "#0f172a",
          pavementBorder: "#1e293b",
          road: "#121a27",
          roadBorder: "#1f2c42",
          roadLine: "rgba(250, 204, 21, 0.85)",
          laneLine: "rgba(255, 255, 255, 0.35)",
          crosswalk: "rgba(255, 255, 255, 0.55)",
          treeDark: "#05140b",
          treeMid: "#0a2415",
          treeLight: "#134226",
          treeShadow: "rgba(0, 0, 0, 0.65)",
          streetLamp: "rgba(255, 215, 120, 0.45)",
        };

    // Construct smooth racetrack path points around the login card
    function buildRacetrackPoints(cx, cy, rw, rh, cornerRadius, segments = 360) {
      const pts = [];
      const hw = rw / 2;
      const hh = rh / 2;
      const cr = cornerRadius;

      for (let i = 0; i < segments; i++) {
        const u = (i / segments) * 4; // 0..4
        let x, y, isCorner = false;
        if (u < 1) {
          // Top edge (left to right)
          const f = u;
          if (f < 0.15) {
            const angle = Math.PI + (f / 0.15) * (Math.PI / 2);
            x = cx - hw + cr + Math.cos(angle) * cr;
            y = cy - hh + cr + Math.sin(angle) * cr;
            isCorner = true;
          } else if (f > 0.85) {
            const angle = -Math.PI / 2 + ((f - 0.85) / 0.15) * (Math.PI / 2);
            x = cx + hw - cr + Math.cos(angle) * cr;
            y = cy - hh + cr + Math.sin(angle) * cr;
            isCorner = true;
          } else {
            const linearF = (f - 0.15) / 0.7;
            x = cx - hw + cr + linearF * (rw - 2 * cr);
            y = cy - hh;
          }
        } else if (u < 2) {
          // Right edge (top to bottom)
          const f = u - 1;
          if (f < 0.15) {
            const angle = 0 + (f / 0.15) * (Math.PI / 2);
            x = cx + hw - cr + Math.cos(angle) * cr;
            y = cy - hh + cr + Math.sin(angle) * cr;
            isCorner = true;
          } else if (f > 0.85) {
            const angle = 0 + (Math.PI / 2) + ((f - 0.85) / 0.15) * (Math.PI / 2);
            x = cx + hw - cr + Math.cos(angle) * cr;
            y = cy + hh - cr + Math.sin(angle) * cr;
            isCorner = true;
          } else {
            const linearF = (f - 0.15) / 0.7;
            x = cx + hw;
            y = cy - hh + cr + linearF * (rh - 2 * cr);
          }
        } else if (u < 3) {
          // Bottom edge (right to left)
          const f = u - 2;
          if (f < 0.15) {
            const angle = Math.PI / 2 + (f / 0.15) * (Math.PI / 2);
            x = cx + hw - cr + Math.cos(angle) * cr;
            y = cy + hh - cr + Math.sin(angle) * cr;
            isCorner = true;
          } else if (f > 0.85) {
            const angle = Math.PI + ((f - 0.85) / 0.15) * (Math.PI / 2);
            x = cx - hw + cr + Math.cos(angle) * cr;
            y = cy + hh - cr + Math.sin(angle) * cr;
            isCorner = true;
          } else {
            const linearF = (f - 0.15) / 0.7;
            x = cx + hw - cr - linearF * (rw - 2 * cr);
            y = cy + hh;
          }
        } else {
          // Left edge (bottom to top)
          const f = u - 3;
          if (f < 0.15) {
            const angle = Math.PI + (f / 0.15) * (Math.PI / 2);
            x = cx - hw + cr + Math.cos(angle) * cr;
            y = cy + hh - cr + Math.sin(angle) * cr;
            isCorner = true;
          } else if (f > 0.85) {
            const angle = (3 * Math.PI) / 2 + ((f - 0.85) / 0.15) * (Math.PI / 2);
            x = cx - hw + cr + Math.cos(angle) * cr;
            y = cy - hh + cr + Math.sin(angle) * cr;
            isCorner = true;
          } else {
            const linearF = (f - 0.15) / 0.7;
            x = cx - hw;
            y = cy + hh - cr - linearF * (rh - 2 * cr);
          }
        }
        pts.push({ x, y, isCorner });
      }

      return pts;
    }

    let busIndex = 0;
    const busSpeed = 0.52; // Calm, realistic driving speed

    function render(currentTime) {
      ctx.clearRect(0, 0, width, height);

      // 1. Background Campus Lawn Base
      ctx.fillStyle = theme.bg;
      ctx.fillRect(0, 0, width, height);

      const cx = width / 2;
      const cy = height / 2;

      // Card bounding dimensions + surrounding road offset
      const isMobile = width < 600;
      const cardW = isMobile ? Math.min(width - 40, 360) : 460;
      const cardH = isMobile ? 580 : 540;

      const roadMargin = isMobile ? 60 : 90;
      const roadW = cardW + roadMargin * 2;
      const roadH = cardH + roadMargin * 2;
      const cornerRadius = isMobile ? 50 : 75;
      const asphaltWidth = isMobile ? 54 : 68;

      // 2. Landscape Lawns around & behind Road
      ctx.fillStyle = theme.lawn;
      ctx.beginPath();
      ctx.roundRect(
        cx - roadW / 2 - 60,
        cy - roadH / 2 - 60,
        roadW + 120,
        roadH + 120,
        cornerRadius + 35
      );
      ctx.fill();

      // Lawn Grass Grid Lines & Texture
      ctx.fillStyle = theme.lawnHighlight;
      for (let y = cy - roadH / 2 - 50; y < cy + roadH / 2 + 50; y += 36) {
        ctx.fillRect(cx - roadW / 2 - 55, y, roadW + 110, 18);
      }

      // 3. Sidewalk / Paved Border
      ctx.fillStyle = theme.pavement;
      ctx.beginPath();
      ctx.roundRect(
        cx - (roadW + asphaltWidth + 24) / 2,
        cy - (roadH + asphaltWidth + 24) / 2,
        roadW + asphaltWidth + 24,
        roadH + asphaltWidth + 24,
        cornerRadius + (asphaltWidth + 24) / 2
      );
      ctx.fill();
      ctx.strokeStyle = theme.pavementBorder;
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // 4. Heavy Asphalt Roadway
      ctx.strokeStyle = theme.road;
      ctx.lineWidth = asphaltWidth;
      ctx.lineJoin = "round";
      ctx.lineCap = "round";

      ctx.beginPath();
      ctx.roundRect(
        cx - roadW / 2,
        cy - roadH / 2,
        roadW,
        roadH,
        cornerRadius
      );
      ctx.stroke();

      // Outer & Inner Curbs with 3D Bevel
      ctx.strokeStyle = theme.roadBorder;
      ctx.lineWidth = 2.5;
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
        Math.max(12, cornerRadius - asphaltWidth / 2)
      );
      ctx.stroke();

      // Double Solid Thermoplastic Yellow Center Lines
      ctx.strokeStyle = theme.roadLine;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.roundRect(
        cx - (roadW - 2) / 2,
        cy - (roadH - 2) / 2,
        roadW - 2,
        roadH - 2,
        cornerRadius - 1
      );
      ctx.roundRect(
        cx - (roadW + 2) / 2,
        cy - (roadH + 2) / 2,
        roadW + 2,
        roadH + 2,
        cornerRadius + 1
      );
      ctx.stroke();

      // White Dashed Lane Dividers (Outer & Inner Lanes)
      ctx.strokeStyle = theme.laneLine;
      ctx.lineWidth = 1.5;
      ctx.setLineDash([12, 16]);
      ctx.beginPath();
      ctx.roundRect(
        cx - (roadW + asphaltWidth * 0.5) / 2,
        cy - (roadH + asphaltWidth * 0.5) / 2,
        roadW + asphaltWidth * 0.5,
        roadH + asphaltWidth * 0.5,
        cornerRadius + 14
      );
      ctx.roundRect(
        cx - (roadW - asphaltWidth * 0.5) / 2,
        cy - (roadH - asphaltWidth * 0.5) / 2,
        roadW - asphaltWidth * 0.5,
        roadH - asphaltWidth * 0.5,
        Math.max(10, cornerRadius - 14)
      );
      ctx.stroke();
      ctx.setLineDash([]);

      // Zebra Crosswalks at Top & Bottom Gateways
      const drawCrosswalk = (x, y, vertical = false) => {
        ctx.fillStyle = theme.crosswalk;
        for (let i = 0; i < 7; i++) {
          if (vertical) {
            ctx.fillRect(x - 22 + i * 6.5, y - 24, 4, 48);
          } else {
            ctx.fillRect(x - 24, y - 22 + i * 6.5, 48, 4);
          }
        }
      };
      drawCrosswalk(cx, cy - roadH / 2, true);
      drawCrosswalk(cx, cy + roadH / 2, true);

      // Bus Stop Marking: "KIT BUS BAY"
      ctx.fillStyle = isDay ? "rgba(234, 179, 8, 0.4)" : "rgba(250, 204, 21, 0.25)";
      ctx.strokeStyle = "#f59e0b";
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.roundRect(cx - 75, cy + roadH / 2 + asphaltWidth * 0.15, 150, 20, 5);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = isDay ? "#78350f" : "#fbbf24";
      ctx.font = "bold 9px Inter, sans-serif";
      ctx.textAlign = "center";
      ctx.fillText("🚌 KIT CAMPUS TRANSIT BAY", cx, cy + roadH / 2 + asphaltWidth * 0.15 + 13);

      // 5. Clustered 3D Canopy Trees around the Road
      const trees = [
        { x: cx - roadW / 2 - 42, y: cy - roadH / 2 - 42, r: 24 },
        { x: cx + roadW / 2 + 42, y: cy - roadH / 2 - 42, r: 26 },
        { x: cx + roadW / 2 + 42, y: cy + roadH / 2 + 42, r: 24 },
        { x: cx - roadW / 2 - 42, y: cy + roadH / 2 + 42, r: 26 },
        { x: cx - roadW / 2 - 50, y: cy, r: 20 },
        { x: cx + roadW / 2 + 50, y: cy, r: 20 },
        { x: cx, y: cy - roadH / 2 - 48, r: 18 },
      ];

      trees.forEach((t) => {
        // Shadow
        ctx.fillStyle = theme.treeShadow;
        ctx.beginPath();
        ctx.arc(t.x + 5, t.y + 6, t.r * 1.15, 0, Math.PI * 2);
        ctx.fill();

        // Dark foliage layer
        ctx.fillStyle = theme.treeDark;
        ctx.beginPath();
        ctx.arc(t.x, t.y, t.r, 0, Math.PI * 2);
        ctx.fill();

        // Mid foliage layer
        ctx.fillStyle = theme.treeMid;
        ctx.beginPath();
        ctx.arc(t.x - t.r * 0.2, t.y - t.r * 0.2, t.r * 0.75, 0, Math.PI * 2);
        ctx.fill();

        // Highlight layer
        ctx.fillStyle = theme.treeLight;
        ctx.beginPath();
        ctx.arc(t.x - t.r * 0.35, t.y - t.r * 0.35, t.r * 0.45, 0, Math.PI * 2);
        ctx.fill();
      });

      // 6. Modern LED Streetlamps with Glowing Light Pools
      const lamps = [
        { x: cx - roadW / 2 - 20, y: cy - roadH / 2 - 20 },
        { x: cx + roadW / 2 + 20, y: cy - roadH / 2 - 20 },
        { x: cx + roadW / 2 + 20, y: cy + roadH / 2 + 20 },
        { x: cx - roadW / 2 - 20, y: cy + roadH / 2 + 20 },
      ];

      if (!isDay) {
        lamps.forEach((lamp) => {
          const glow = ctx.createRadialGradient(lamp.x, lamp.y, 2, lamp.x, lamp.y, 50);
          glow.addColorStop(0, theme.streetLamp);
          glow.addColorStop(1, "rgba(255, 200, 100, 0)");
          ctx.fillStyle = glow;
          ctx.beginPath();
          ctx.arc(lamp.x, lamp.y, 50, 0, Math.PI * 2);
          ctx.fill();

          ctx.fillStyle = "#fef08a";
          ctx.beginPath();
          ctx.arc(lamp.x, lamp.y, 4, 0, Math.PI * 2);
          ctx.fill();
        });
      }

      // 7. Calculate Bus Position along the Racetrack Path
      const spline = buildRacetrackPoints(cx, cy, roadW, roadH, cornerRadius, 360);
      busIndex = (busIndex + busSpeed) % spline.length;

      const curIdx = Math.floor(busIndex);
      const nextIdx = (curIdx + 4) % spline.length;
      const cur = spline[curIdx];
      const next = spline[nextIdx];
      const angle = Math.atan2(next.y - cur.y, next.x - cur.x);

      // 8. Render Realistic 3D Top-Down KIT Bus
      const busLen = isMobile ? 48 : 58;
      const busW = isMobile ? 20 : 25;

      ctx.save();
      ctx.translate(cur.x, cur.y);
      ctx.rotate(angle);

      // Bus Ground Drop Shadow
      ctx.fillStyle = "rgba(0, 0, 0, 0.55)";
      ctx.beginPath();
      ctx.roundRect(-busLen / 2 + 5, -busW / 2 + 5, busLen, busW, 6);
      ctx.fill();

      // Headlight Beams (Night Mode) - Luminous Cones lighting up road
      if (!isDay) {
        const lightCone = ctx.createRadialGradient(
          busLen / 2,
          0,
          2,
          busLen / 2 + 85,
          0,
          95
        );
        lightCone.addColorStop(0, "rgba(254, 240, 138, 0.85)");
        lightCone.addColorStop(0.45, "rgba(253, 224, 71, 0.35)");
        lightCone.addColorStop(1, "rgba(253, 224, 71, 0)");

        ctx.fillStyle = lightCone;
        ctx.beginPath();
        ctx.moveTo(busLen / 2, -busW / 2 + 2);
        ctx.lineTo(busLen / 2 + 95, -busW * 1.6);
        ctx.lineTo(busLen / 2 + 95, busW * 1.6);
        ctx.lineTo(busLen / 2, busW / 2 - 2);
        ctx.closePath();
        ctx.fill();

        // Tail Brake Lights Red Pools
        const tailGlow = ctx.createRadialGradient(
          -busLen / 2 - 4,
          0,
          2,
          -busLen / 2 - 14,
          0,
          24
        );
        tailGlow.addColorStop(0, "rgba(239, 68, 68, 0.85)");
        tailGlow.addColorStop(1, "rgba(239, 68, 68, 0)");
        ctx.fillStyle = tailGlow;
        ctx.beginPath();
        ctx.arc(-busLen / 2 - 8, 0, 24, 0, Math.PI * 2);
        ctx.fill();
      }

      // Bus Main Body (Metallic Yellow with 3D Bevel)
      ctx.fillStyle = "#fbbf24";
      ctx.beginPath();
      ctx.roundRect(-busLen / 2, -busW / 2, busLen, busW, 6);
      ctx.fill();
      ctx.strokeStyle = "#b45309";
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // 3D Roof Highlight bevel
      ctx.fillStyle = "rgba(255, 255, 255, 0.35)";
      ctx.fillRect(-busLen / 2 + 8, -busW / 2 + 2, busLen - 16, 2);

      // KIT Crimson Red Stripe
      ctx.fillStyle = "#c01823";
      ctx.fillRect(-busLen / 2 + 6, -busW / 2, busLen - 12, 3.5);
      ctx.fillRect(-busLen / 2 + 6, busW / 2 - 3.5, busLen - 12, 3.5);

      // Front Curved Windshield
      ctx.fillStyle = "#0f172a";
      ctx.beginPath();
      ctx.roundRect(busLen / 2 - 12, -busW / 2 + 3, 9, busW - 6, 2.5);
      ctx.fill();

      // Windshield Sun Glare
      ctx.strokeStyle = "rgba(255, 255, 255, 0.6)";
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(busLen / 2 - 9, -busW / 2 + 5);
      ctx.lineTo(busLen / 2 - 5, busW / 2 - 5);
      ctx.stroke();

      // Rear Window
      ctx.fillStyle = "#0f172a";
      ctx.fillRect(-busLen / 2 + 3, -busW / 2 + 4, 4.5, busW - 8);

      // Roof Air Conditioning Unit
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(-10, -busW / 2 + 5, 20, busW - 10);
      ctx.strokeStyle = "#cbd5e1";
      ctx.lineWidth = 1;
      ctx.strokeRect(-10, -busW / 2 + 5, 20, busW - 10);

      // Roof AC Ventilation Slits
      ctx.strokeStyle = "#94a3b8";
      ctx.lineWidth = 0.8;
      for (let sl = -6; sl <= 6; sl += 3) {
        ctx.beginPath();
        ctx.moveTo(sl, -busW / 2 + 7);
        ctx.lineTo(sl, busW / 2 - 7);
        ctx.stroke();
      }

      // Roof Top Branding: "KIT"
      ctx.fillStyle = "#1e3a8a";
      ctx.font = "bold 9.5px Inter, sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText("KIT-01", 0, 0);

      // Aerodynamic Side Mirrors
      ctx.fillStyle = "#0f172a";
      ctx.fillRect(busLen / 2 - 14, -busW / 2 - 4, 4, 4);
      ctx.fillRect(busLen / 2 - 14, busW / 2, 4, 4);

      // Front LED Headlights
      ctx.fillStyle = "#fef08a";
      ctx.fillRect(busLen / 2 - 2, -busW / 2 + 2, 2.5, 3.5);
      ctx.fillRect(busLen / 2 - 2, busW / 2 - 5.5, 2.5, 3.5);

      // Rear LED Taillights
      ctx.fillStyle = "#ef4444";
      ctx.fillRect(-busLen / 2, -busW / 2 + 2, 2.5, 3.5);
      ctx.fillRect(-busLen / 2, busW / 2 - 5.5, 2.5, 3.5);

      // Amber Turn Signals (Blinking when navigating curves)
      if (cur.isCorner && Math.floor(currentTime / 250) % 2 === 0) {
        ctx.fillStyle = "#f59e0b";
        ctx.fillRect(busLen / 2 - 4, -busW / 2 - 1, 3, 2);
        ctx.fillRect(busLen / 2 - 4, busW / 2 - 1, 3, 2);
      }

      // Live GPS Beacon Ring above bus
      const pulse = (Math.sin(currentTime * 0.006) + 1) * 0.5;
      ctx.beginPath();
      ctx.arc(0, 0, 16 + pulse * 6, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(56, 189, 248, ${0.45 - pulse * 0.35})`;
      ctx.lineWidth = 1.8;
      ctx.stroke();

      ctx.restore();

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
