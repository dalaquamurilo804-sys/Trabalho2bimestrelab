import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../assets/actions/header.jsx";
import Footer from "../assets/actions/footer.jsx";
import "../assets/css/games.css";

// ─── MOCK DATA ────────────────────────────────────────────────────────────────
// Substituir pela chamada real: GET /api/games?include=room_count
// Resposta esperada: [ { id, name, cover_url, genre, rooms_count }, ... ]

const MOCK_GAMES = [
  { id: 1,  name: "Valorant",             cover: "https://placehold.co/200x267/1a0a2e/c084fc?text=VALORANT&font=montserrat",      genre: "FPS",        rooms: 142 },
  { id: 2,  name: "League of Legends",    cover: "https://placehold.co/200x267/0a1628/4f8ef7?text=LoL&font=montserrat",           genre: "MOBA",       rooms: 98  },
  { id: 3,  name: "CS2",                  cover: "https://placehold.co/200x267/0f1b12/4ade80?text=CS2&font=montserrat",           genre: "FPS",        rooms: 87  },
  { id: 4,  name: "Apex Legends",         cover: "https://placehold.co/200x267/1a0d00/fb923c?text=APEX&font=montserrat",          genre: "Battle Royale", rooms: 63 },
  { id: 5,  name: "Rainbow Six Siege",    cover: "https://placehold.co/200x267/0d1520/38bdf8?text=R6S&font=montserrat",           genre: "FPS",        rooms: 55  },
  { id: 6,  name: "Rocket League",        cover: "https://placehold.co/200x267/1a0e00/fbbf24?text=RL&font=montserrat",            genre: "Esporte",    rooms: 44  },
  { id: 7,  name: "Dota 2",               cover: "https://placehold.co/200x267/160a0a/f87171?text=DOTA+2&font=montserrat",        genre: "MOBA",       rooms: 39  },
  { id: 8,  name: "Overwatch 2",          cover: "https://placehold.co/200x267/0a0e1a/818cf8?text=OW2&font=montserrat",           genre: "FPS",        rooms: 36  },
  { id: 9,  name: "Fortnite",             cover: "https://placehold.co/200x267/0e1a1a/34d399?text=FNITE&font=montserrat",         genre: "Battle Royale", rooms: 31 },
  { id: 10, name: "Warzone",              cover: "https://placehold.co/200x267/111111/94a3b8?text=WZ&font=montserrat",            genre: "Battle Royale", rooms: 27 },
  { id: 11, name: "Dead by Daylight",     cover: "https://placehold.co/200x267/1a0505/ef4444?text=DBD&font=montserrat",           genre: "Survival",   rooms: 22  },
  { id: 12, name: "Minecraft",            cover: "https://placehold.co/200x267/0a1a0a/86efac?text=MC&font=montserrat",            genre: "Sandbox",    rooms: 19  },
  { id: 13, name: "FIFA 25",              cover: "https://placehold.co/200x267/001a0d/10b981?text=FIFA25&font=montserrat",        genre: "Esporte",    rooms: 17  },
  { id: 14, name: "World of Warcraft",    cover: "https://placehold.co/200x267/0a0a1a/a78bfa?text=WoW&font=montserrat",          genre: "MMORPG",     rooms: 15  },
  { id: 15, name: "Path of Exile 2",      cover: "https://placehold.co/200x267/1a0a00/f97316?text=PoE2&font=montserrat",         genre: "RPG",        rooms: 14  },
  { id: 16, name: "Teamfight Tactics",    cover: "https://placehold.co/200x267/0a101a/60a5fa?text=TFT&font=montserrat",          genre: "Auto Chess", rooms: 11  },
  { id: 17, name: "Street Fighter 6",     cover: "https://placehold.co/200x267/1a0505/fb7185?text=SF6&font=montserrat",          genre: "Luta",       rooms: 9   },
  { id: 18, name: "Baldur's Gate 3",      cover: "https://placehold.co/200x267/050a1a/93c5fd?text=BG3&font=montserrat",          genre: "RPG",        rooms: 7   },
];

const GENRES = ["Todos", "FPS", "MOBA", "Battle Royale", "RPG", "Esporte", "MMORPG", "Survival", "Sandbox", "Luta", "Auto Chess"];

// ─── GAME CARD ────────────────────────────────────────────────────────────────
function GameCard({ game, index }) {
  const [hovered, setHovered] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 60 + index * 45);
    return () => clearTimeout(t);
  }, [index]);

  return (
    <div
      className={`game-card ${visible ? "game-card--visible" : ""} ${hovered ? "game-card--hovered" : ""}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="game-card__cover-wrap">
        <img
          src={game.cover}
          alt={game.name}
          className="game-card__cover"
          loading="lazy"
        />
        <div className="game-card__overlay">
          <button className="game-card__cta">Ver salas</button>
        </div>
        <span className="game-card__genre-badge">{game.genre}</span>
      </div>

      <div className="game-card__info">
        <h3 className="game-card__name">{game.name}</h3>
        <div className="game-card__rooms">
          <span className="game-card__rooms-dot" />
          <span className="game-card__rooms-count">{game.rooms.toLocaleString("pt-BR")}</span>
          <span className="game-card__rooms-label">
            {game.rooms === 1 ? "sala aberta" : "salas abertas"}
          </span>
        </div>
      </div>
    </div>
  );
}

// ─── MAIN PAGE ────────────────────────────────────────────────────────────────
export default function GamesDirectory() {
  const [search,      setSearch]      = useState("");
  const [activeGenre, setActiveGenre] = useState("Todos");
  const [sortBy,      setSortBy]      = useState("rooms"); // "rooms" | "name"

  const filtered = MOCK_GAMES
    .filter(g => {
      const matchSearch = g.name.toLowerCase().includes(search.toLowerCase());
      const matchGenre  = activeGenre === "Todos" || g.genre === activeGenre;
      return matchSearch && matchGenre;
    })
    .sort((a, b) =>
      sortBy === "rooms" ? b.rooms - a.rooms : a.name.localeCompare(b.name)
    );

  const totalRooms = filtered.reduce((acc, g) => acc + g.rooms, 0);

  return (
    <div className="dir-page">
      <Header />

      <main className="dir-main">
        {/* ── Hero strip ── */}
        <section className="dir-hero">
          <div className="dir-hero__inner">
            <div className="dir-hero__text">
              <h1 className="dir-hero__title">
                Escolha seu <span className="dir-hero__title-accent">jogo</span>
              </h1>
              <p className="dir-hero__sub">
                {MOCK_GAMES.length} jogos disponíveis ·{" "}
                <strong>{MOCK_GAMES.reduce((a, g) => a + g.rooms, 0).toLocaleString("pt-BR")}</strong> salas abertas agora
              </p>
            </div>
          </div>
          <div className="dir-hero__glow" />
        </section>

        {/* ── Controls ── */}
        <section className="dir-controls">
          <div className="dir-controls__inner">
            {/* Search */}
            <div className="dir-search">
              <svg className="dir-search__icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <input
                type="text"
                className="dir-search__input"
                placeholder="Buscar jogo..."
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
              {search && (
                <button className="dir-search__clear" onClick={() => setSearch("")}>✕</button>
              )}
            </div>

            {/* Sort */}
            <div className="dir-sort">
              <span className="dir-sort__label">Ordenar:</span>
              <button
                className={`dir-sort__btn ${sortBy === "rooms" ? "dir-sort__btn--active" : ""}`}
                onClick={() => setSortBy("rooms")}
              >
                Mais salas
              </button>
              <button
                className={`dir-sort__btn ${sortBy === "name" ? "dir-sort__btn--active" : ""}`}
                onClick={() => setSortBy("name")}
              >
                A–Z
              </button>
            </div>
          </div>

          {/* Genre pills */}
          <div className="dir-genres">
            {GENRES.map(g => (
              <button
                key={g}
                className={`dir-genre-pill ${activeGenre === g ? "dir-genre-pill--active" : ""}`}
                onClick={() => setActiveGenre(g)}
              >
                {g}
              </button>
            ))}
          </div>
        </section>

        {/* ── Results meta ── */}
        <div className="dir-meta">
          <span className="dir-meta__count">
            {filtered.length} {filtered.length === 1 ? "jogo" : "jogos"}
            {activeGenre !== "Todos" && <> em <strong>{activeGenre}</strong></>}
            {search && <> para "<strong>{search}</strong>"</>}
          </span>
          <span className="dir-meta__rooms">
            {totalRooms.toLocaleString("pt-BR")} salas no total
          </span>
        </div>

        {/* ── Grid ── */}
        {filtered.length > 0 ? (
          <div className="dir-grid">
            {filtered.map((game, i) => (
              <GameCard key={game.id} game={game} index={i} />
            ))}
          </div>
        ) : (
          <div className="dir-empty">
            <div className="dir-empty__icon">🎮</div>
            <p className="dir-empty__title">Nenhum jogo encontrado</p>
            <p className="dir-empty__sub">Tente um termo diferente ou limpe os filtros.</p>
            <button className="dir-empty__btn" onClick={() => { setSearch(""); setActiveGenre("Todos"); }}>
              Limpar filtros
            </button>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
