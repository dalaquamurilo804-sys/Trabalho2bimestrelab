import React from "react";
import { useNavigate } from "react-router-dom";

export default function Header() {
  const navigate = useNavigate();
  
  const navAuth = () => {
    navigate("/auth");
  }
  return (
    <nav className="about-navbar">
      <div className="about-logo-wrapper">
        <div className="about-logo-icon">⚡</div>
        <span className="about-logo-text">
          Match<span className="about-logo-accent">up</span>
        </span>
      </div>
      <div className="about-nav-menu">
        <span className="nav-link">Explorar</span>
        <span className="nav-link">Grupos</span>
        <span className="nav-link">Ranking</span>
        
        <button 
          onClick={navAuth} 
          className="cta-primary" 
          style={{ padding: "8px 20px", fontSize: 13 }}
        >
          Entrar
        </button>
      </div>
    </nav>
  );
}