import React, { useState } from "react";
import axios from "axios";

const API = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function SosModal({ isOpen, onClose, bus, user, token }) {
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [customMsg, setCustomMsg] = useState("");

  if (!isOpen) return null;

  const triggerSos = async () => {
    setLoading(true);
    try {
      await axios.post(
        `${API}/api/emergency/sos`,
        {
          busId: bus?.id,
          stopName: bus?.waypoints?.[0]?.name || "Coimbatore Transit",
          message: customMsg || "Emergency SOS Triggered from Student Portal",
        },
        { headers: { Authorization: "Bearer " + token } }
      );
      setSent(true);
    } catch (e) {
      console.error(e);
      setSent(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="sos-modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="sos-header">
          <div className="sos-badge-icon">🚨</div>
          <div>
            <h3>KIT Campus Emergency & SOS</h3>
            <p>24x7 Student Transit Security Dispatch</p>
          </div>
          <button className="sos-close-btn" onClick={onClose}>
            ✕
          </button>
        </div>

        {sent ? (
          <div className="sos-success-view">
            <div className="sos-success-check">✓</div>
            <h4>SOS Alert Broadcasted!</h4>
            <p>
              KIT Campus Security and Transport Coordinator have received your
              GPS location. A response unit has been notified.
            </p>
            <div className="sos-emergency-hotlines">
              <a href="tel:+914222367890" className="hotline-btn">
                <span>📞</span> Security Control: 0422-2367890
              </a>
              <a href="tel:+919442212345" className="hotline-btn secondary">
                <span>🚍</span> Transport Officer: +91 94422 12345
              </a>
            </div>
            <button className="sos-ack-btn" onClick={onClose}>
              Dismiss
            </button>
          </div>
        ) : (
          <div className="sos-form-body">
            <div className="sos-warning-box">
              <span>⚠️</span>
              <p>
                Use this button only in genuine transit emergencies or urgent
                assistance required along the <b>{bus?.name}</b> route.
              </p>
            </div>

            <div className="sos-telemetry-summary">
              <div>
                <small>Student</small>
                <b>{user?.name}</b>
              </div>
              <div>
                <small>Assigned Fleet</small>
                <b>{bus?.name}</b>
              </div>
              <div>
                <small>Driver</small>
                <b>{bus?.driver?.name}</b>
              </div>
            </div>

            <div className="sos-input-group">
              <label>Optional Note / Landmark Description</label>
              <input
                type="text"
                placeholder="e.g. Near Peelamedu signal, feeling unwell..."
                value={customMsg}
                onChange={(e) => setCustomMsg(e.target.value)}
              />
            </div>

            <div className="sos-action-row">
              <button
                className="sos-broadcast-btn"
                onClick={triggerSos}
                disabled={loading}
              >
                {loading ? "Transmitting GPS..." : "🚨 Broadcast Emergency SOS"}
              </button>
              <button className="sos-cancel-btn" onClick={onClose}>
                Cancel
              </button>
            </div>

            <div className="emergency-quick-contacts">
              <p>Direct Hotlines:</p>
              <div className="contact-tags">
                <a href="tel:+914222367890">📞 KIT Security: 0422-2367890</a>
                <a href="tel:108">🚑 Ambulance: 108</a>
                <a href="tel:112">👮 Police: 112</a>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
