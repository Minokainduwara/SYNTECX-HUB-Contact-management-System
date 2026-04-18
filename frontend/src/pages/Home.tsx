import { useEffect, useState, useCallback } from "react";
import {
  getContacts,
  deleteContact,
  updateContact,
} from "../services/contactService";
import { type Contact } from "../types/contact";
import AddContact from "../components/AddContact";
import SakuraCursor from "../components/SakuraCursor";

// Sakura petal SVG path
const PetalSVG = ({ style }: { style: React.CSSProperties }) => (
  <svg
    viewBox="0 0 40 40"
    xmlns="http://www.w3.org/2000/svg"
    style={{
      position: "fixed",
      pointerEvents: "none",
      zIndex: 0,
      opacity: 0,
      ...style,
    }}
  >
    <ellipse cx="20" cy="20" rx="10" ry="18" fill="rgba(255,182,193,0.75)" />
    <ellipse
      cx="20"
      cy="20"
      rx="10"
      ry="18"
      fill="rgba(255,200,210,0.4)"
      transform="rotate(60 20 20)"
    />
    <ellipse
      cx="20"
      cy="20"
      rx="10"
      ry="18"
      fill="rgba(255,210,220,0.3)"
      transform="rotate(120 20 20)"
    />
  </svg>
);

// Generate random petals
function generatePetals(count: number) {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    left: `${Math.random() * 100}vw`,
    size: `${18 + Math.random() * 22}px`,
    duration: `${6 + Math.random() * 10}s`,
    delay: `${Math.random() * 12}s`,
    rotation: `${Math.random() * 360}deg`,
    drift: `${-60 + Math.random() * 120}px`,
  }));
}

const petals = generatePetals(28);

export default function Home() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [search, setSearch] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchContacts = useCallback(async (q = "") => {
    const res = await getContacts(q);
    setContacts(res.data);
  }, []);

  useEffect(() => {
    fetchContacts();
  }, [fetchContacts]);

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    setTimeout(async () => {
      await deleteContact(id);
      fetchContacts(search);
      setDeletingId(null);
    }, 350);
  };

  const toggleFavorite = async (c: Contact) => {
    await updateContact(c._id, { isFavorite: !c.isFavorite });
    fetchContacts(search);
  };

  return (
    <>
      {/* Global styles */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;600&family=DM+Sans:wght@300;400;500&display=swap');

        * { box-sizing: border-box; margin: 0; padding: 0; }

        body {
          background: #fef6f8;
          min-height: 100vh;
          font-family: 'DM Sans', sans-serif;
          overflow-x: hidden;
        }

        /* ---------- Petal Keyframes ---------- */
        @keyframes sakura-fall {
          0%   { transform: translateY(-60px) rotate(0deg) translateX(0); opacity: 0; }
          10%  { opacity: 1; }
          80%  { opacity: 0.8; }
          100% { transform: translateY(110vh) rotate(720deg) translateX(var(--drift)); opacity: 0; }
        }

        .petal {
          animation: sakura-fall var(--duration) var(--delay) infinite ease-in-out;
          top: -60px;
        }

        /* ---------- Card entrance ---------- */
        @keyframes rise-in {
          from { opacity: 0; transform: translateY(18px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        .contact-card {
          animation: rise-in 0.4s ease both;
          transition: transform 0.2s ease, box-shadow 0.2s ease, opacity 0.35s ease;
        }

        .contact-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 12px 36px rgba(220,120,150,0.15);
        }

        .contact-card.deleting { opacity: 0; transform: translateX(40px) scale(0.97); }

        /* ---------- Search ---------- */
        .search-wrap { position: relative; }
        .search-wrap input:focus { outline: none; border-color: #e8849a; box-shadow: 0 0 0 3px rgba(232,132,154,0.15); }

        /* ---------- Favorite button ---------- */
        .fav-btn { transition: transform 0.15s ease; }
        .fav-btn:hover { transform: scale(1.25); }
        .fav-btn:active { transform: scale(0.95); }

        /* ---------- Delete button ---------- */
        .del-btn {
          border: 1.5px solid #fcc;
          color: #e06070;
          background: transparent;
          border-radius: 8px;
          padding: 5px 14px;
          font-size: 13px;
          cursor: pointer;
          font-family: 'DM Sans', sans-serif;
          font-weight: 500;
          transition: background 0.18s, color 0.18s;
          letter-spacing: 0.02em;
        }
        .del-btn:hover { background: #fde8ec; color: #c0404f; }

        /* ---------- Badge ---------- */
        .badge {
          display: inline-flex;
          align-items: center;
          gap: 3px;
          font-size: 11px;
          font-weight: 500;
          padding: 2px 8px;
          border-radius: 20px;
          letter-spacing: 0.04em;
        }
        .badge-fav  { background: #fff0f4; color: #d46080; }
        .badge-pin  { background: #fff5e6; color: #b07030; }

        /* ---------- Empty state ---------- */
        @keyframes float {
          0%,100% { transform: translateY(0); }
          50%      { transform: translateY(-8px); }
        }
        .empty-icon { animation: float 3s ease-in-out infinite; }

        /* ---------- Scrollbar ---------- */
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #f0b8c8; border-radius: 10px; }
      `}</style>

      {/* ── Mouse-trail sakura cursor ── */}
      <SakuraCursor />

      {/* ── Falling petals ── */}
      {petals.map((p) => (
        <PetalSVG
          key={p.id}
          style={
            {
              left: p.left,
              width: p.size,
              height: p.size,
              "--duration": p.duration,
              "--delay": p.delay,
              "--drift": p.drift,
              "--rotation": p.rotation,
            } as React.CSSProperties
          }
        />
      ))}

      {/* ── Background gradient blobs ── */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 0,
          pointerEvents: "none",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            width: 600,
            height: 600,
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(255,200,215,0.45) 0%, transparent 70%)",
            top: -200,
            right: -150,
          }}
        />
        <div
          style={{
            position: "absolute",
            width: 500,
            height: 500,
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(255,220,235,0.35) 0%, transparent 70%)",
            bottom: -150,
            left: -100,
          }}
        />
      </div>

      {/* ── Main container ── */}
      <div
        style={{
          position: "relative",
          zIndex: 1,
          maxWidth: 720,
          margin: "0 auto",
          padding: "48px 24px 80px",
        }}
      >
        {/* Header */}
        <div style={{ marginBottom: 36, textAlign: "center" }}>
          <div style={{ fontSize: 36, marginBottom: 6 }}>🌸</div>
          <h1
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: "clamp(2rem, 5vw, 2.8rem)",
              fontWeight: 600,
              color: "#3a1a24",
              letterSpacing: "-0.02em",
              lineHeight: 1.15,
            }}
          >
            Contact Garden
          </h1>
          <p
            style={{
              color: "#b07090",
              fontSize: 14,
              marginTop: 6,
              fontWeight: 300,
              letterSpacing: "0.08em",
            }}
          >
            {contacts.length} blossom{contacts.length !== 1 ? "s" : ""} in your garden
          </p>
        </div>

        {/* Search */}
        <div className="search-wrap" style={{ marginBottom: 24 }}>
          <span
            style={{
              position: "absolute",
              left: 14,
              top: "50%",
              transform: "translateY(-50%)",
              fontSize: 16,
              color: "#d4889a",
            }}
          >
            🔍
          </span>
          <input
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              fetchContacts(e.target.value);
            }}
            placeholder="Search blossoms…"
            style={{
              width: "100%",
              padding: "12px 16px 12px 42px",
              border: "1.5px solid #f0c8d4",
              borderRadius: 14,
              background: "rgba(255,255,255,0.8)",
              backdropFilter: "blur(8px)",
              fontSize: 14,
              color: "#3a1a24",
              fontFamily: "'DM Sans', sans-serif",
              transition: "border-color 0.2s, box-shadow 0.2s",
            }}
          />
        </div>

        {/* Add Contact */}
        <AddContact refresh={() => fetchContacts(search)} />

        {/* Divider */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            margin: "28px 0 20px",
          }}
        >
          <div
            style={{ flex: 1, height: 1, background: "linear-gradient(to right, transparent, #f0c0d0)" }}
          />
          <span style={{ fontSize: 18 }}>🌸</span>
          <div
            style={{ flex: 1, height: 1, background: "linear-gradient(to left, transparent, #f0c0d0)" }}
          />
        </div>

        {/* Contact list */}
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {contacts.length === 0 ? (
            <div
              style={{
                textAlign: "center",
                padding: "60px 20px",
                color: "#c090a8",
              }}
            >
              <div className="empty-icon" style={{ fontSize: 48, marginBottom: 12 }}>
                🌺
              </div>
              <p
                style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: 20,
                  fontWeight: 400,
                  color: "#a07080",
                }}
              >
                Your garden is empty
              </p>
              <p style={{ fontSize: 13, marginTop: 6, fontWeight: 300 }}>
                Add your first blossom above
              </p>
            </div>
          ) : (
            contacts.map((c, i) => (
              <div
                key={c._id}
                className={`contact-card${deletingId === c._id ? " deleting" : ""}`}
                style={{
                  background: "rgba(255,255,255,0.78)",
                  backdropFilter: "blur(12px)",
                  border: "1.5px solid rgba(240,190,210,0.5)",
                  borderRadius: 18,
                  padding: "18px 20px",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  animationDelay: `${i * 0.05}s`,
                  boxShadow: "0 4px 20px rgba(220,120,150,0.08)",
                }}
              >
                {/* Avatar + info */}
                <div style={{ display: "flex", alignItems: "center", gap: 14, minWidth: 0 }}>
                  <div
                    style={{
                      width: 44,
                      height: 44,
                      borderRadius: "50%",
                      background: "linear-gradient(135deg, #ffc0cb, #ffb6c1 60%, #ff8fa3)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 18,
                      flexShrink: 0,
                      boxShadow: "0 4px 12px rgba(220,100,130,0.2)",
                    }}
                  >
                    {c.name.charAt(0).toUpperCase()}
                  </div>
                  <div style={{ minWidth: 0 }}>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                        flexWrap: "wrap",
                      }}
                    >
                      <p
                        style={{
                          fontFamily: "'Cormorant Garamond', serif",
                          fontSize: 17,
                          fontWeight: 600,
                          color: "#2e1020",
                          letterSpacing: "-0.01em",
                        }}
                      >
                        {c.name}
                      </p>
                      {c.isFavorite && (
                        <span className="badge badge-fav">⭐ Fav</span>
                      )}
                      {c.isPinned && (
                        <span className="badge badge-pin">📌 Pinned</span>
                      )}
                    </div>
                    {c.email && (
                      <p
                        style={{
                          fontSize: 12,
                          color: "#b07090",
                          marginTop: 2,
                          fontWeight: 300,
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {c.email}
                      </p>
                    )}
                    {c.phone && (
                      <p style={{ fontSize: 12, color: "#b07090", fontWeight: 300 }}>
                        {c.phone}
                      </p>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
                  <button
                    className="fav-btn"
                    onClick={() => toggleFavorite(c)}
                    title={c.isFavorite ? "Unfavorite" : "Favorite"}
                    style={{
                      background: c.isFavorite ? "#fff0f4" : "transparent",
                      border: "1.5px solid",
                      borderColor: c.isFavorite ? "#f0b8c8" : "#f0d8e0",
                      borderRadius: 10,
                      width: 36,
                      height: 36,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      cursor: "pointer",
                      fontSize: 16,
                    }}
                  >
                    {c.isFavorite ? "⭐" : "☆"}
                  </button>
                  <button
                    className="del-btn"
                    onClick={() => handleDelete(c._id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
}