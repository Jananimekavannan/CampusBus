import React, { useEffect, useRef } from "react";

/**
 * RevolvingBusRoad - High-Performance Canvas Component
 * Renders a clean, realistic continuous racetrack road encircling the login card:
 * - A continuous asphalt road precisely surrounding the login box
 * - Double yellow center lines, white dashed lane markings, and zebra crosswalks
 * - An animated KIT Bus continuously revolving around the login box along the road
 * - Smooth headlights casting light cones, tail brake lights, and physics-based turning
 * - Decorative corner campus trees & streetlights
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
          bg: "#f1f5f9",
          lawn: "#3b7a42",
          lawnSub: "#2e6934",
          road: "#334155",
          roadBorder: "#475569",
          roadLine: "#eab308",
          laneLine: "rgba(255, 255, 255, 0.85)",
          crosswalk: "rgba(255, 255, 255, 0.95)",
          treeDark: "#1b5e20",
          treeLight: "#4caf50",
          treeShadow: "rgba(0,0,0,0.15)",
          streetLamp: "rgba(255, 255, 255, 0)",
        }
      : {
          bg: "#090e17",
          lawn: "#0b1712",
          lawnSub: "#08120e",
          road: "#161f2e",
          roadBorder: "#27354a",
          roadLine: "rgba(250, 204, 21, 0.75)",
          laneLine: "rgba(255, 255, 255, 0.3)",
          crosswalk: "rgba(255, 255, 255, 0.5)",
          treeDark: "#081c12",
          treeLight: "#103822",
          treeShadow: "rgba(0,0,0,0.6)",
          streetLamp: "rgba(255, 215, 120, 0.4)",
        };

    // Construct the closed racetrack path points around the center
    function buildRacetrackPoints(cx, cy, rw, rh, cornerRadius, segments = 240) {
      const pts = [];
      // Half dimensions of the track center
      const hw = rw / 2;
      const hh = rh / 2;
      const cr = cornerRadius;

      // 4 straight segments and 4 rounded arc corners
      // Top right corner arc
      for (let i = 0; i <= segments / 4; i++) {
        const t = (i / (segments / 4)) * (Math.PI / 2);
        // From top straight to right straight
      }

      // Generate parametric points along rounded rectangle perimeter
      for (let i = 0; i < segments; i++) {
        const u = (i / segments) * 4; // 0..4
        let x, y;
        if (u < 1) {
          // Top edge (left to right)
          const f = u;
          x = cx - hw + cr + f * (rw - 2 * cr);
          y = cy - hh;
          if (f > 0.85) {
            const angle = -Math.PI / 2 + (f - 0.85) / 0.15 * (Math.PI / 2);
            x = cx + hw - cr + Math.cos(angle) * cr;
            y = cy - hh + cr + Math.sin(angle) * cr;
          }
        } else if (u < 2) {
          // Right edge (top to bottom)
          const f = u - 1;
          x = cx + hw;
          y = cy - hh + cr + f * (rh - 2 * cr);
          if (f > 0.85) {
            const angle = 0 + (f - 0.85) / 0.15 * (Math.PI / 2);
            x = cx + hw - cr + Math.cos(angle) * cr;
            y = cy + hh - cr + Math.sin(angle) * cr;
          }
        } else if (u < 3) {
          // Bottom edge (right to left)
          const f = u - 2;
          x = cx + hw - cr - f * (rw - 2 * cr);
          y = cy + hh;
          if (f > 0.85) {
            const angle = Math.PI / 2 + (f - 0.85) / 0.15 * (Math.PI / 2);
            x = cx - hw + cr + Math.cos(angle) * cr;
            y = cy + hh - cr + Math.sin(angle) * cr;
          }
        } else {
          // Left edge (bottom to top)
          const f = u - 3;
          x = cx - hw;
          y = cy + hh - cr - f * (rh - 2 * cr);
          if (f > 0.85) {
            const angle = Math.PI + (f - 0.85) / 0.15 * (Math.PI / 2);
            x = cx - hw + cr + Math.cos(angle) * cr;
            y = cy - hh + cr + Math.sin(angle) * cr;
          }
        }
        pts.push({ x, y });
      }

      return pts;
    }

    // Bus state
    let busIndex = 0;
    const busSpeed = 0.55; // Smooth realistic revolving speed

    function render(currentTime) {
      ctx.clearRect(0, 0, width, height);

      // 1. Background Fill
      ctx.fillStyle = theme.bg;
      ctx.fillRect(0, 0, width, height);

      const cx = width / 2;
      const cy = height / 2;

      // Card bounding dimensions + surrounding road offset
      const isMobile = width < 600;
      const cardW = isMobile ? Math.min(width - 40, 360) : 460;
      const cardH = isMobile ? 580 : 540;

      const roadMargin = isMobile ? 55 : 85;
      const roadW = cardW + roadMargin * 2;
      const roadH = cardH + roadMargin * 2;
      const cornerRadius = isMobile ? 45 : 65;
      const asphaltWidth = isMobile ? 48 : 62;

      // 2. Campus Lawn Island behind and around the road
      ctx.fillStyle = theme.lawn;
      ctx.beginPath();
      ctx.roundRect(
        cx - roadW / 2 - 50,
        cy - roadH / 2 - 50,
        roadW + 100,
        roadH + 100,
        cornerRadius + 30
      );
      ctx.fill();

      // Lawn stripes / texture
      ctx.fillStyle = theme.lawnSub;
      for (let y = cy - roadH / 2 - 40; y < cy + roadH / 2 + 40; y += 30) {
        ctx.fillRect(cx - roadW / 2 - 45, y, roadW + 90, 15);
      }

      // 3. Draw Continuous Asphalt Road encircling the login box
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

      // Road Curbs / Borders
      ctx.strokeStyle = theme.roadBorder;
      ctx.lineWidth = 2;
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

      // Double Yellow Center Line
      ctx.strokeStyle = theme.roadLine;
      ctx.lineWidth = 1.8;
      ctx.beginPath();
      ctx.roundRect(
        cx - roadW / 2,
        cy - roadH / 2,
        roadW,
        roadH,
        cornerRadius
      );
      ctx.stroke();

      // White Dashed Lane Dividers (Outer & Inner Lanes)
      ctx.strokeStyle = theme.laneLine;
      ctx.lineWidth = 1.2;
      ctx.setLineDash([10, 14]);
      ctx.beginPath();
      ctx.roundRect(
        cx - (roadW + asphaltWidth * 0.45) / 2,
        cy - (roadH + asphaltWidth * 0.45) / 2,
        roadW + asphaltWidth * 0.45,
        roadH + asphaltWidth * 0.45,
        cornerRadius + 12
      );
      ctx.roundRect(
        cx - (roadW - asphaltWidth * 0.45) / 2,
        cy - (roadH - asphaltWidth * 0.45) / 2,
        roadW - asphaltWidth * 0.45,
        roadH - asphaltWidth * 0.45,
        Math.max(10, cornerRadius - 12)
      );
      ctx.stroke();
      ctx.setLineDash([]);

      // Zebra Crosswalks at Top & Bottom entrance
      const drawCrosswalk = (x, y, vertical = false) => {
        ctx.fillStyle = theme.crosswalk;
        for (let i = 0; i < 7; i++) {
          if (vertical) {
            ctx.fillRect(x - 18 + i * 5.5, y - 20, 3.5, 40);
          } else {
            ctx.fillRect(x - 20, y - 18 + i * 5.5, 40, 3.5);
          }
        }
      };
      drawCrosswalk(cx, cy - roadH / 2, true);
      drawCrosswalk(cx, cy + roadH / 2, true);

      // 4. Corner Campus Trees
      const cornerOffsets = [
        { x: cx - roadW / 2 - 35, y: cy - roadH / 2 - 35, r: 20 },
        { x: cx + roadW / 2 + 35, y: cy - roadH / 2 - 35, r: 22 },
        { x: cx + roadW / 2 + 35, y: cy + roadH / 2 + 35, r: 20 },
        { x: cx - roadW / 2 - 35, y: cy + roadH / 2 + 35, r: 22 },
        // Side mid trees
        { x: cx - roadW / 2 - 45, y: cy, r: 18 },
        { x: cx + roadW / 2 + 45, y: cy, r: 18 },
      ];

      cornerOffsets.forEach((t) => {
        ctx.fillStyle = theme.treeShadow;
        ctx.beginPath();
        ctx.arc(t.x + 4, t.y + 5, t.r * 1.1, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = theme.treeDark;
        ctx.beginPath();
        ctx.arc(t.x, t.y, t.r, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = theme.treeLight;
        ctx.beginPath();
        ctx.arc(t.x - t.r * 0.25, t.y - t.r * 0.25, t.r * 0.65, 0, Math.PI * 2);
        ctx.fill();
      });

      // 5. Street Lamps at 4 corners of the road
      const lamps = [
        { x: cx - roadW / 2 - 15, y: cy - roadH / 2 - 15 },
        { x: cx + roadW / 2 + 15, y: cy - roadH / 2 - 15 },
        { x: cx + roadW / 2 + 15, y: cy + roadH / 2 + 15 },
        { x: cx - roadW / 2 - 15, y: cy + roadH / 2 + 15 },
      ];

      if (!isDay) {
        lamps.forEach((lamp) => {
          const glow = ctx.createRadialGradient(lamp.x, lamp.y, 2, lamp.x, lamp.y, 45);
          glow.addColorStop(0, theme.streetLamp);
          glow.addColorStop(1, "rgba(255, 200, 100, 0)");
          ctx.fillStyle = glow;
          ctx.beginPath();
          ctx.arc(lamp.x, lamp.y, 45, 0, Math.PI * 2);
          ctx.fill();

          ctx.fillStyle = "#fef08a";
          ctx.beginPath();
          ctx.arc(lamp.x, lamp.y, 3.5, 0, Math.PI * 2);
          ctx.fill();
        });
      }

      // 6. Calculate Current Bus Position along the Racetrack Path
      // Generate spline points
      const spline = buildRacetrackPoints(cx, cy, roadW, roadH, cornerRadius, 360);
      busIndex = (busIndex + busSpeed) % spline.length;

      const curIdx = Math.floor(busIndex);
      const nextIdx = (curIdx + 4) % spline.length;
      const cur = spline[curIdx];
      const next = spline[nextIdx];
      const angle = Math.atan2(next.y - cur.y, next.x - cur.x);

      // 7. Render Revolving KIT Bus
      const busLen = isMobile ? 42 : 52;
      const busW = isMobile ? 18 : 22;

      ctx.save();
      ctx.translate(cur.x, cur.y);
      ctx.rotate(angle);

      // Bus Drop Shadow
      ctx.fillStyle = "rgba(0, 0, 0, 0.45)";
      ctx.beginPath();
      ctx.roundRect(-busLen / 2 + 4, -busW / 2 + 4, busLen, busW, 6);
      ctx.fill();

      // Forward Headlight Beams (Night Mode)
      if (!isDay) {
        const lightCone = ctx.createRadialGradient(
          busLen / 2,
          0,
          2,
          busLen / 2 + 75,
          0,
          85
        );
        lightCone.addColorStop(0, "rgba(254, 240, 138, 0.7)");
        lightCone.addColorStop(0.5, "rgba(253, 224, 71, 0.25)");
        lightCone.addColorStop(1, "rgba(253, 224, 71, 0)");

        ctx.fillStyle = lightCone;
        ctx.beginPath();
        ctx.moveTo(busLen / 2, -busW / 2 + 2);
        ctx.lineTo(busLen / 2 + 85, -busW * 1.5);
        ctx.lineTo(busLen / 2 + 85, busW * 1.5);
        ctx.lineTo(busLen / 2, busW / 2 - 2);
        ctx.closePath();
        ctx.fill();

        // Tail Lights Glow (Red)
        const tailGlow = ctx.createRadialGradient(
          -busLen / 2 - 4,
          0,
          2,
          -busLen / 2 - 12,
          0,
          20
        );
        tailGlow.addColorStop(0, "rgba(239, 68, 68, 0.75)");
        tailGlow.addColorStop(1, "rgba(239, 68, 68, 0)");
        ctx.fillStyle = tailGlow;
        ctx.beginPath();
        ctx.arc(-busLen / 2 - 6, 0, 20, 0, Math.PI * 2);
        ctx.fill();
      }

      // Bus Main Chassis (Yellow)
      ctx.fillStyle = "#fbbf24";
      ctx.beginPath();
      ctx.roundRect(-busLen / 2, -busW / 2, busLen, busW, 6);
      ctx.fill();
      ctx.strokeStyle = "#b45309";
      ctx.lineWidth = 1.4;
      ctx.stroke();

      // KIT Red Stripe
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

      // Roof AC Unit
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(-8, -busW / 2 + 4, 16, busW - 8);
      ctx.strokeStyle = "#cbd5e1";
      ctx.lineWidth = 0.8;
      ctx.strokeRect(-8, -busW / 2 + 4, 16, busW - 8);

      // Roof Badge "KIT"
      ctx.fillStyle = "#1e3a8a";
      ctx.font = "bold 9px Inter, sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText("KIT-01", 0, 0);

      // Front Headlight Dots
      ctx.fillStyle = "#fef08a";
      ctx.fillRect(busLen / 2 - 2, -busW / 2 + 2, 2.5, 3);
      ctx.fillRect(busLen / 2 - 2, busW / 2 - 5, 2.5, 3);

      // Rear Brake Light Dots
      ctx.fillStyle = "#dc2626";
      ctx.fillRect(-busLen / 2, -busW / 2 + 2, 2.5, 3);
      ctx.fillRect(-busLen / 2, busW / 2 - 5, 2.5, 3);

      // Beacon Pulse above Bus
      const pulse = (Math.sin(currentTime * 0.006) + 1) * 0.5;
      ctx.beginPath();
      ctx.arc(0, 0, 14 + pulse * 6, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(56, 189, 248, ${0.4 - pulse * 0.3})`;
      ctx.lineWidth = 1.5;
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
