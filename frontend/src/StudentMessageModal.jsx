import React, { useState } from "react";
import axios from "axios";

const API = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function StudentMessageModal({ isOpen, onClose, user, token, buses, currentBusId }) {
  const [category, setCategory] = useState("stop_request");
  const [busId, setBusId] = useState(currentBusId || "bus12");
  const [subject, setSubject] = useState("");
  const [content, setContent] = useState("");
  const [sending, setSending] = useState(false);
  const [sentSuccess, setSentSuccess] = useState(false);
  const [errMsg, setErrMsg] = useState("");

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim()) return;

    setSending(true);
    setErrMsg("");

    const categoryLabels = {
      stop_request: "New Boarding Stop Request",
      delay_inquiry: "Transit Delay Inquiry",
      lost_found: "Lost & Found Report",
      feedback: "Student Feedback / Inquiry",
    };

    const formattedTitle = subject.trim()
      ? `💬 [${categoryLabels[category] || "Student Message"}] ${subject}`
      : `💬 ${categoryLabels[category] || "Student Message"} from ${user?.name || "Student"}`;

    try {
      await axios.post(
        `${API}/api/messages`,
        {
          category: "query",
          title: formattedTitle,
          content: content.trim(),
          busId: busId,
        },
        { headers: { Authorization: "Bearer " + token } }
      );
      setSentSuccess(true);
      setTimeout(() => {
        setSubject("");
        setContent("");
        setSentSuccess(false);
        onClose();
      }, 2500);
    } catch (err) {
      console.error(err);
      setErrMsg(err.response?.data?.message || "Failed to send message to Transport Office.");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="student-msg-modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="student-msg-modal-header">
          <div className="msg-badge-icon">💬</div>
          <div>
            <h3>Message Transport Admin Desk</h3>
            <p>Send direct requests, stop changes, and inquiries to KIT Transport Office</p>
          </div>
          <button className="sos-close-btn" onClick={onClose}>
            ✕
          </button>
        </div>

        {sentSuccess ? (
          <div className="student-msg-success-view">
            <div className="sos-success-check">✓</div>
            <h4>Message Delivered to Admin Inbox!</h4>
            <p>
              Your inquiry has been received at the <b>Central Fleet Intelligence Command Desk</b>.
              The transport coordinator is reviewing your request.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="student-msg-form">
            <div className="form-group">
              <label>Message Category</label>
              <div className="category-pill-grid">
                <button
                  type="button"
                  className={`cat-pill-btn ${category === "stop_request" ? "active" : ""}`}
                  onClick={() => setCategory("stop_request")}
                >
                  📍 Stop Request
                </button>
                <button
                  type="button"
                  className={`cat-pill-btn ${category === "delay_inquiry" ? "active" : ""}`}
                  onClick={() => setCategory("delay_inquiry")}
                >
                  🕒 Bus Delay
                </button>
                <button
                  type="button"
                  className={`cat-pill-btn ${category === "lost_found" ? "active" : ""}`}
                  onClick={() => setCategory("lost_found")}
                >
                  🎒 Lost & Found
                </button>
                <button
                  type="button"
                  className={`cat-pill-btn ${category === "feedback" ? "active" : ""}`}
                  onClick={() => setCategory("feedback")}
                >
                  💡 Feedback
                </button>
              </div>
            </div>

            <div className="form-group">
              <label>Relevant Route / Assigned Bus</label>
              <select
                value={busId}
                onChange={(e) => setBusId(e.target.value)}
                className="bus-select-dropdown"
              >
                {buses &&
                  buses.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.name} ({b.route})
                    </option>
                  ))}
              </select>
            </div>

            <div className="form-group">
              <label>Subject / Brief Summary</label>
              <input
                type="text"
                placeholder="e.g. Requesting pickup at Singanallur Signal 07:55 AM"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label>Detailed Message</label>
              <textarea
                rows={4}
                required
                placeholder="Describe your query, stop landmark, or request for the Transport Admin..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
              />
            </div>

            {errMsg && <div className="error-banner">{errMsg}</div>}

            <div className="modal-actions-row">
              <button
                type="button"
                className="btn-cancel-modal"
                onClick={onClose}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn-submit-msg"
                disabled={sending || !content.trim()}
              >
                {sending ? "Transmitting..." : "📨 Send Message to Admin"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
