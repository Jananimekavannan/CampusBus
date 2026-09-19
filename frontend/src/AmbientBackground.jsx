import React from "react";

export default function AmbientBackground({ timeMode = "night" }) {
  return (
    <div className={`ambient-bg-layer ${timeMode}`} aria-hidden="true">
      {/* 1. Dynamic Glowing Aurora Mesh Orbs */}
      <div className="mesh-orb orb-1" />
      <div className="mesh-orb orb-2" />
      <div className="mesh-orb orb-3" />
      <div className="mesh-orb orb-4" />

      {/* 2. Cyber Transit Matrix Grid */}
      <div className="cyber-transit-grid" />

      {/* 3. Laser Radar Scanline */}
      <div className="radar-laser-sweep" />

      {/* 4. Drifting Floating Transit Sparks & Data Nodes */}
      <div className="transit-spark-particles">
        <span className="spark s1" />
        <span className="spark s2" />
        <span className="spark s3" />
        <span className="spark s4" />
        <span className="spark s5" />
        <span className="spark s6" />
        <span className="spark s7" />
        <span className="spark s8" />
        <span className="spark s9" />
        <span className="spark s10" />
      </div>
    </div>
  );
}
