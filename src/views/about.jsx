import { useState, useEffect } from "react";
import './../assets/css/about.css';

const PLAYERS = [
  { id: 1, name: "GhostReaper", game: "Valorant", rank: "Diamante", style: "Competitivo", status: "online" },
  { id: 2, name: "LunaStrike", game: "League of Legends", rank: "Platina", style: "Casual", status: "online" },
  { id: 3, name: "IronVeil", game: "CS2", rank: "Global Elite", style: "Competitivo", status: "away" },
  { id: 4, name: "SkyWarden", game: "Valorant", rank: "Imortal", style: "Competitivo", status: "online" },
  { id: 5, name: "NovaPulse", game: "Apex Legends", rank: "Predador", style: "Casual", status: "online" },
];

const TAGS = ["Competitivo", "Casual", "Sem tilt", "Com voz", "Noturno", "Focado em rank"];

const GAMES = ["Valorant", "League of Legends", "CS2", "Apex Legends", "R6 Siege"];

function StatusDot({ status }) {
  const colors = { online: "#22c55e", away: "#f59e0b", offline: "#6b7280" };
  return (
    <span
      style={{
        display: "inline-block",
        width: 8,
        height: 8,
        borderRadius: "50%",
        background: colors[status] || colors.offline,
        marginRight: 6,
        flexShrink: 0,
      }}
    />
  );
}

function PlayerCard({ player, delay }) {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setVisible(true), delay);
    return () => clearTimeout(t);
  }, [delay]);

  return (
    <div
      style={{
        background: "rgba(255,255,255,0.04)",
        border: "1px solid rgba(255,255,255,0.08)",
        borderRadius: 12,
        padding: "14px 16px",
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(16px)",
        transition: "opacity 0.5s ease, transform 0.5s ease",
        cursor: "pointer",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: 2,
          background: player.style === "Competitivo"
            ? "linear-gradient(90deg, #7c3aed, #a855f7)"
            : "linear-gradient(90deg, #0ea5e9, #22d3ee)",
        }}
      />
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
        <div
          style={{
            width: 36,
            height: 36,
            borderRadius: "50%",
            background: player.style === "Competitivo"
              ? "linear-gradient(135deg, #7c3aed, #4f46e5)"
              : "linear-gradient(135deg, #0ea5e9, #0284c7)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 14,
            fontWeight: 700,
            color: "#fff",
            flexShrink: 0,
          }}
        >
          {player.name[0]}
        </div>
        <div style={{ minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
            <StatusDot status={player.status} />
            <span style={{ fontWeight: 600, fontSize: 14, color: "#f1f5f9", letterSpacing: 0.2 }}>
              {player.name}
            </span>
          </div>
          <div style={{ fontSize: 12, color: "#94a3b8", marginTop: 1 }}>{player.game}</div>
        </div>
      </div>
      <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
        <span
          style={{
            fontSize: 11,
            padding: "2px 8px",
            borderRadius: 999,
            background: "rgba(168,85,247,0.15)",
            color: "#c084fc",
            fontWeight: 500,
          }}
        >
          {player.rank}
        </span>
        <span
          style={{
            fontSize: 11,
            padding: "2px 8px",
            borderRadius: 999,
            background: "rgba(148,163,184,0.1)",
            color: "#94a3b8",
            fontWeight: 500,
          }}
        >
          {player.style}
        </span>
      </div>
    </div>
  );
}

function AnimatedNumber({ value }) {
  const [display, setDisplay] = useState(0);
  useEffect(() => {
    const step = Math.ceil(value / 40);
    let current = 0;
    const t = setInterval(() => {
      current = Math.min(current + step, value);
      setDisplay(current);
      if (current >= value) clearInterval(t);
    }, 30);
    return () => clearInterval(t);
  }, [value]);
  return <>{display.toLocaleString("pt-BR")}</>;
}

export default function AboutUs() {
  const [selectedGame, setSelectedGame] = useState("Todos");
  const [selectedStyle, setSelectedStyle] = useState("Todos");
  const [glowPos, setGlowPos] = useState({ x: 50, y: 30 });

  useEffect(() => {
    let angle = 0;
    const interval = setInterval(() => {
      angle += 0.3;
      setGlowPos({
        x: 50 + 30 * Math.cos((angle * Math.PI) / 180),
        y: 30 + 20 * Math.sin((angle * Math.PI) / 180),
      });
    }, 50);
    return () => clearInterval(interval);
  }, []);

  const filtered = PLAYERS.filter((p) => {
    const gameOk = selectedGame === "Todos" || p.game === selectedGame;
    const styleOk = selectedStyle === "Todos" || p.style === selectedStyle;
    return gameOk && styleOk;
  });

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#0a0a0f",
        fontFamily: "'Syne', 'Space Grotesk', system-ui, sans-serif",
        color: "#f1f5f9",
        overflowX: "hidden",
        position: "relative",
      }}
    >

      {/* Animated background glow */}
      <div
        style={{
          position: "fixed",
          top: 0, left: 0, right: 0, bottom: 0,
          pointerEvents: "none",
          zIndex: 0,
        }}
      >
        <div
          style={{
            position: "absolute",
            width: 700,
            height: 700,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(124,58,237,0.12) 0%, transparent 70%)",
            left: `${glowPos.x}%`,
            top: `${glowPos.y}%`,
            transform: "translate(-50%, -50%)",
            transition: "left 1s ease, top 1s ease",
          }}
        />
        <div
          style={{
            position: "absolute",
            width: 400,
            height: 400,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(14,165,233,0.08) 0%, transparent 70%)",
            right: "10%",
            bottom: "20%",
          }}
        />
        {/* Grid pattern */}
        <svg width="100%" height="100%" style={{ position: "absolute", inset: 0, opacity: 0.03 }}>
          <defs>
            <pattern id="grid" width="48" height="48" patternUnits="userSpaceOnUse">
              <path d="M 48 0 L 0 0 0 48" fill="none" stroke="white" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      {/* NAV */}
      <nav
        style={{
          position: "sticky",
          top: 0,
          zIndex: 100,
          background: "rgba(10,10,15,0.8)",
          backdropFilter: "blur(12px)",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
          padding: "0 24px",
          height: 60,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          maxWidth: 1100,
          margin: "0 auto",
          width: "100%",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: 8,
              background: "linear-gradient(135deg, #7c3aed, #9333ea)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 16,
            }}
          >
            ⚡
          </div>
          <span style={{ fontWeight: 800, fontSize: 18, letterSpacing: -0.5 }}>
            Match<span style={{ color: "#a855f7" }}>up</span>
          </span>
        </div>
        <div style={{ display: "flex", gap: 28, alignItems: "center" }}>
          <span className="nav-link">Explorar</span>
          <span className="nav-link">Grupos</span>
          <span className="nav-link">Ranking</span>
          <button className="cta-primary" style={{ padding: "8px 20px", fontSize: 13 }}>
            Entrar
          </button>
        </div>
      </nav>

      {/* HERO */}
      <section
        style={{
          maxWidth: 1100,
          margin: "0 auto",
          padding: "80px 24px 60px",
          position: "relative",
          zIndex: 1,
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 48,
          alignItems: "center",
        }}
      >
        <div>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              background: "rgba(168,85,247,0.12)",
              border: "1px solid rgba(168,85,247,0.25)",
              borderRadius: 999,
              padding: "4px 14px",
              fontSize: 12,
              color: "#c084fc",
              fontWeight: 600,
              letterSpacing: 0.5,
              marginBottom: 24,
              textTransform: "uppercase",
            }}
          >
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#a855f7", display: "inline-block" }} />
            Plataforma de Matchmaking
          </div>

          <h1
            style={{
              fontSize: "clamp(36px, 5vw, 56px)",
              fontWeight: 800,
              lineHeight: 1.1,
              letterSpacing: -1.5,
              marginBottom: 20,
            }}
          >
            Encontre seu{" "}
            <span
              style={{
                background: "linear-gradient(135deg, #a855f7, #7c3aed, #6366f1)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              time ideal.
            </span>
            <br />
            Jogue no seu nível.
          </h1>

          <p
            style={{
              fontSize: 17,
              color: "#94a3b8",
              lineHeight: 1.7,
              marginBottom: 36,
              maxWidth: 480,
            }}
          >
            Chega de Solo Queue frustrante. O Matchup conecta jogadores por perfil de jogo,
            objetivos e disponibilidade de horário — formando equipes que realmente funcionam.
          </p>

          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            <button className="cta-primary">Criar perfil gratuito</button>
            <button className="cta-secondary">Ver jogadores →</button>
          </div>

          <div style={{ display: "flex", gap: 24, marginTop: 36, flexWrap: "wrap" }}>
            {[
              { label: "Jogadores ativos", value: 12400 },
              { label: "Grupos formados", value: 3800 },
              { label: "Jogos suportados", value: 18 },
            ].map((stat) => (
              <div key={stat.label}>
                <div style={{ fontSize: 22, fontWeight: 800, color: "#f1f5f9" }}>
                  <AnimatedNumber value={stat.value} />
                  <span style={{ color: "#a855f7" }}>+</span>
                </div>
                <div style={{ fontSize: 12, color: "#64748b", marginTop: 2 }}>{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Player cards preview */}
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <div
            style={{
              fontSize: 11,
              color: "#64748b",
              fontFamily: "'JetBrains Mono', monospace",
              marginBottom: 4,
              letterSpacing: 0.5,
            }}
          >
            // jogadores online agora
          </div>
          {PLAYERS.map((p, i) => (
            <PlayerCard key={p.id} player={p} delay={300 + i * 120} />
          ))}
        </div>
      </section>

      {/* FEATURES */}
      <section
        style={{
          maxWidth: 1100,
          margin: "0 auto",
          padding: "60px 24px",
          position: "relative",
          zIndex: 1,
        }}
      >
        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <h2 style={{ fontSize: 32, fontWeight: 800, letterSpacing: -0.8, marginBottom: 12 }}>
            Por que o Matchup é diferente?
          </h2>
          <p style={{ color: "#64748b", fontSize: 15, maxWidth: 520, margin: "0 auto" }}>
            Sistemas nativos dos jogos medem apenas MMR. Nós medimos compatibilidade real.
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 16 }}>
          {[
            {
              icon: "🎯",
              title: "Filtros inteligentes",
              desc: "Filtre por jogo, rank, horário e estilo. Encontre parceiros que combinam com você de verdade.",
              color: "#a855f7",
            },
            {
              icon: "🛡️",
              title: "Ambiente sem toxicidade",
              desc: "Grupos fechados eliminam comportamento antidesportivo e criam canais de comunicação eficientes.",
              color: "#22d3ee",
            },
            {
              icon: "👥",
              title: "Grupos pre-made",
              desc: "Saia da Solo Queue e forme equipes estáveis com sinergia estratégica desde o começo.",
              color: "#4ade80",
            },
            {
              icon: "📊",
              title: "Perfil multidimensional",
              desc: "Cadastre múltiplos títulos, estilos de jogo e objetivos — não somos só mais um ranking de MMR.",
              color: "#fb923c",
            },
          ].map((f) => (
            <div
              key={f.title}
              className="stat-card"
              style={{
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.07)",
                borderRadius: 14,
                padding: 24,
                transition: "all 0.3s",
              }}
            >
              <div style={{ fontSize: 28, marginBottom: 14 }}>{f.icon}</div>
              <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 8, color: "#f1f5f9" }}>{f.title}</div>
              <div style={{ fontSize: 13, color: "#64748b", lineHeight: 1.6 }}>{f.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* SEARCH DEMO */}
      <section
        style={{
          maxWidth: 1100,
          margin: "0 auto",
          padding: "60px 24px",
          position: "relative",
          zIndex: 1,
        }}
      >
        <div
          style={{
            background: "rgba(255,255,255,0.03)",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: 20,
            padding: "40px",
          }}
        >
          <div style={{ marginBottom: 28 }}>
            <h2 style={{ fontSize: 26, fontWeight: 800, letterSpacing: -0.6, marginBottom: 6 }}>
              Explore jogadores agora
            </h2>
            <p style={{ color: "#64748b", fontSize: 14 }}>
              Prévia do mecanismo de filtragem — sem precisar criar conta.
            </p>
          </div>

          <div style={{ display: "flex", gap: 24, flexWrap: "wrap", marginBottom: 28 }}>
            <div>
              <div style={{ fontSize: 12, color: "#64748b", marginBottom: 8, fontWeight: 600, letterSpacing: 0.4, textTransform: "uppercase" }}>
                Jogo
              </div>
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                {["Todos", ...GAMES].map((g) => (
                  <button
                    key={g}
                    className={`pill-btn ${selectedGame === g ? "active" : ""}`}
                    onClick={() => setSelectedGame(g)}
                  >
                    {g}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <div style={{ fontSize: 12, color: "#64748b", marginBottom: 8, fontWeight: 600, letterSpacing: 0.4, textTransform: "uppercase" }}>
                Estilo
              </div>
              <div style={{ display: "flex", gap: 6 }}>
                {["Todos", "Competitivo", "Casual"].map((s) => (
                  <button
                    key={s}
                    className={`pill-btn ${selectedStyle === s ? "active" : ""}`}
                    onClick={() => setSelectedStyle(s)}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 12 }}>
            {filtered.length > 0 ? (
              filtered.map((p, i) => <PlayerCard key={p.id} player={p} delay={i * 80} />)
            ) : (
              <div style={{ color: "#64748b", fontSize: 14, gridColumn: "1/-1", padding: "24px 0" }}>
                Nenhum jogador encontrado com esses filtros.
              </div>
            )}
          </div>
        </div>
      </section>

      {/* TAGS / INTERESTS */}
      <section
        style={{
          maxWidth: 1100,
          margin: "0 auto",
          padding: "20px 24px 60px",
          position: "relative",
          zIndex: 1,
        }}
      >
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", justifyContent: "center" }}>
          {TAGS.map((tag) => (
            <span
              key={tag}
              style={{
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.08)",
                color: "#94a3b8",
                padding: "8px 18px",
                borderRadius: 999,
                fontSize: 13,
                fontWeight: 500,
              }}
            >
              #{tag}
            </span>
          ))}
        </div>
      </section>

      {/* CTA FINAL */}
      <section
        style={{
          maxWidth: 1100,
          margin: "0 auto 80px",
          padding: "0 24px",
          position: "relative",
          zIndex: 1,
        }}
      >
        <div
          style={{
            background: "linear-gradient(135deg, rgba(124,58,237,0.2), rgba(99,102,241,0.1))",
            border: "1px solid rgba(168,85,247,0.25)",
            borderRadius: 20,
            padding: "60px 40px",
            textAlign: "center",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              position: "absolute",
              width: 300,
              height: 300,
              borderRadius: "50%",
              background: "radial-gradient(circle, rgba(168,85,247,0.2) 0%, transparent 70%)",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              pointerEvents: "none",
            }}
          />
          <div style={{ position: "relative" }}>
            <h2
              style={{
                fontSize: "clamp(28px, 4vw, 42px)",
                fontWeight: 800,
                letterSpacing: -1,
                marginBottom: 14,
              }}
            >
              Pronto para sair da Solo Queue?
            </h2>
            <p style={{ color: "#94a3b8", fontSize: 16, marginBottom: 32, maxWidth: 480, margin: "0 auto 32px" }}>
              Crie seu perfil, defina seus critérios e encontre parceiros que elevam seu jogo.
            </p>
            <button className="cta-primary" style={{ padding: "16px 40px", fontSize: 16 }}>
              Criar conta gratuita ⚡
            </button>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer
        style={{
          borderTop: "1px solid rgba(255,255,255,0.06)",
          padding: "24px",
          textAlign: "center",
          color: "#334155",
          fontSize: 13,
          fontFamily: "'JetBrains Mono', monospace",
          position: "relative",
          zIndex: 1,
        }}
      >
        Matchup — Laboratório de Engenharia de Software · 5° Termo · Fatec Presidente Prudente · 2025
      </footer>
    </div>
  );
}