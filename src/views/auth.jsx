import { useState } from "react";
import "../assets/css/auth.css";

// ─── API PAYLOAD DOCUMENTATION ────────────────────────────────────────────────
// [Mantido oculto no resumo, mas mantido idêntico no seu arquivo final]
// ─────────────────────────────────────────────────────────────────────────────

const SCREENS = { LOGIN: "login", REGISTER: "register", RECOVER: "recover" };

// ─── ICONS ───────────────────────────────────────────────────────────────────
const IconEye = ({ off }) => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    {off ? (
      <>
        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
        <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
        <line x1="1" y1="1" x2="23" y2="23" />
      </>
    ) : (
      <>
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
        <circle cx="12" cy="12" r="3" />
      </>
    )}
  </svg>
);

const IconUser = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
  </svg>
);

const IconMail = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
    <polyline points="22,6 12,13 2,6" />
  </svg>
);

const IconLock = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </svg>
);

const IconCheck = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

const IconArrow = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" />
  </svg>
);

// ─── SHARED FIELD ────────────────────────────────────────────────────────────
function Field({ label, icon, type = "text", value, onChange, placeholder, error, hint, rightSlot }) {
  return (
    <div className="field-container">
      <label className="field-label">{label}</label>
      <div className="field-input-wrapper">
        <span className={`field-icon ${error ? "error-state" : ""}`}>
          {icon}
        </span>
        <input
          type={type}
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder={placeholder}
          className={`field-input ${error ? "error-state" : ""}`}
        />
        {rightSlot && (
          <span className="field-right-slot">
            {rightSlot}
          </span>
        )}
      </div>
      {error && <span className="field-error-msg">{error}</span>}
      {hint && !error && <span className="field-hint-msg">{hint}</span>}
    </div>
  );
}

// ─── PASSWORD STRENGTH ────────────────────────────────────────────────────────
function PasswordStrength({ password }) {
  const checks = [
    { label: "Mínimo 8 caracteres", ok: password.length >= 8 },
    { label: "Letra maiúscula", ok: /[A-Z]/.test(password) },
    { label: "Número", ok: /[0-9]/.test(password) },
  ];
  const score = checks.filter(c => c.ok).length;
  const colors = ["var(--error)", "var(--warn)", "var(--success)"];
  const labels = ["Fraca", "Média", "Forte"];

  if (!password) return null;

  return (
    <div className="pwd-strength-container">
      <div className="pwd-strength-bars">
        {[0, 1, 2].map(i => (
          <div 
            key={i} 
            className="pwd-strength-bar"
            style={{ background: i < score ? colors[score - 1] : "var(--input-border)" }} 
          />
        ))}
      </div>
      <div className="pwd-strength-checklist">
        {checks.map(c => (
          <span key={c.label} className={`pwd-strength-item ${c.ok ? "ok" : ""}`}>
            <span className="pwd-strength-bullet">
              {c.ok && <IconCheck />}
            </span>
            {c.label}
          </span>
        ))}
      </div>
      {score > 0 && (
        <span className="pwd-strength-label" style={{ color: colors[score - 1] }}>
          Senha {labels[score - 1]}
        </span>
      )}
    </div>
  );
}

// ─── SUBMIT BUTTON ────────────────────────────────────────────────────────────
function SubmitBtn({ children, loading, onClick }) {
  return (
    <button
      onClick={onClick}
      disabled={loading}
      className="submit-btn"
    >
      {loading ? (
        <>
          <span className="submit-btn-spinner" />
          Aguarde...
        </>
      ) : children}
    </button>
  );
}

// ─── TOAST ────────────────────────────────────────────────────────────────────
function Toast({ msg, type }) {
  if (!msg) return null;
  const bg = type === "success" ? "var(--success)" : type === "error" ? "var(--error)" : "var(--accent)";
  return (
    <div className="toast-container" style={{ background: bg }}>
      {msg}
    </div>
  );
}

// ─── CARD WRAPPER ─────────────────────────────────────────────────────────────
function AuthCard({ children }) {
  return (
    <div className="auth-card">
      {children}
    </div>
  );
}

// ─── LOGO ─────────────────────────────────────────────────────────────────────
function Logo() {
  return (
    <div className="logo-container">
      <div className="logo-badge">⚡</div>
      <span className="logo-text">
        Match<span className="logo-accent">up</span>
      </span>
    </div>
  );
}

// ─── LOGIN ────────────────────────────────────────────────────────────────────
function LoginScreen({ setScreen }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);

  function validate() {
    const e = {};
    if (!email) e.email = "E-mail obrigatório";
    else if (!/\S+@\S+\.\S+/.test(email)) e.email = "E-mail inválido";
    if (!password) e.password = "Senha obrigatória";
    return e;
  }

  async function handleLogin() {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    setErrors({});
    setLoading(true);

    const payload = { email, password };
    console.log("[LOGIN] payload →", payload);

    await new Promise(r => setTimeout(r, 1400));
    setLoading(false);
    setToast({ msg: "Login realizado com sucesso!", type: "success" });
    setTimeout(() => setToast(null), 3000);
  }

  return (
    <>
      <Toast msg={toast?.msg} type={toast?.type} />
      <AuthCard>
        <Logo />
        <h2 className="screen-title">Bem-vindo de volta</h2>
        <p className="screen-subtitle">Entre na sua conta para continuar.</p>

        <div className="form-grid">
          <Field
            label="E-mail"
            icon={<IconMail />}
            type="email"
            value={email}
            onChange={setEmail}
            placeholder="seu@email.com"
            error={errors.email}
          />
          <Field
            label="Senha"
            icon={<IconLock />}
            type={showPass ? "text" : "password"}
            value={password}
            onChange={setPassword}
            placeholder="••••••••"
            error={errors.password}
            rightSlot={
              <button onClick={() => setShowPass(v => !v)} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--icon)", padding: 2 }}>
                <IconEye off={showPass} />
              </button>
            }
          />

          <div className="text-link-wrapper">
            <button onClick={() => setScreen(SCREENS.RECOVER)} className="text-link-btn">
              Esqueci minha senha
            </button>
          </div>

          <SubmitBtn loading={loading} onClick={handleLogin}>Entrar</SubmitBtn>
        </div>

        <p className="footer-text">
          Não tem conta?{" "}
          <button onClick={() => setScreen(SCREENS.REGISTER)} className="footer-btn">
            Criar conta
          </button>
        </p>
      </AuthCard>
    </>
  );
}

// REGISTER
function RegisterScreen({ setScreen }) {
  const [email, setEmail] = useState("");
  const [nickname, setNickname] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);
  const [agreed, setAgreed] = useState(false);

  function validate() {
    const e = {};
    if (!nickname || nickname.trim().length < 3) e.nickname = "Nick deve ter ao menos 3 caracteres";
    if (nickname.length > 50) e.nickname = "Nick pode ter no máximo 50 caracteres";
    if (!email) e.email = "E-mail obrigatório";
    else if (!/\S+@\S+\.\S+/.test(email)) e.email = "E-mail inválido";
    if (!password) e.password = "Senha obrigatória";
    else if (password.length < 8) e.password = "Mínimo 8 caracteres";
    if (password !== confirm) e.confirm = "Senhas não coincidem";
    if (!agreed) e.agreed = "Você deve aceitar os termos";
    return e;
  }

  async function handleRegister() {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    setErrors({});
    setLoading(true);
    const payload = { email, password, nickname: nickname.trim() };
    console.log("[REGISTER] payload →", payload);

    await new Promise(r => setTimeout(r, 1600));
    setLoading(false);
    setToast({ msg: "Conta criada! Bem-vindo ao Matchup 🎮", type: "success" });
    setTimeout(() => { setToast(null); setScreen(SCREENS.LOGIN); }, 2500);
  }

  return (
    <>
      <Toast msg={toast?.msg} type={toast?.type} />
      <AuthCard>
        <Logo />
        <h2 className="screen-title">Criar conta</h2>
        <p className="screen-subtitle">Registre-se e encontre seu time ideal.</p>

        <div className="form-grid-register">
          <Field
            label="Nickname"
            icon={<IconUser />}
            value={nickname}
            onChange={setNickname}
            placeholder="SeuNickGamer"
            error={errors.nickname}
            hint="Será exibido para outros jogadores (máx. 50 caracteres)"
          />
          <Field
            label="E-mail"
            icon={<IconMail />}
            type="email"
            value={email}
            onChange={setEmail}
            placeholder="seu@email.com"
            error={errors.email}
          />
          <div>
            <Field
              label="Senha"
              icon={<IconLock />}
              type={showPass ? "text" : "password"}
              value={password}
              onChange={setPassword}
              placeholder="Mínimo 8 caracteres"
              error={errors.password}
              rightSlot={
                <button onClick={() => setShowPass(v => !v)} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--icon)", padding: 2 }}>
                  <IconEye off={showPass} />
                </button>
              }
            />
            <PasswordStrength password={password} />
          </div>
          <Field
            label="Confirmar senha"
            icon={<IconLock />}
            type={showConfirm ? "text" : "password"}
            value={confirm}
            onChange={setConfirm}
            placeholder="Repita a senha"
            error={errors.confirm}
            rightSlot={
              <button onClick={() => setShowConfirm(v => !v)} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--icon)", padding: 2 }}>
                <IconEye off={showConfirm} />
              </button>
            }
          />

          <label className="terms-label">
            <div
              onClick={() => setAgreed(v => !v)}
              className={`terms-checkbox ${agreed ? "agreed" : ""} ${errors.agreed ? "error-state" : ""}`}
            >
              {agreed && (
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              )}
            </div>
            <span className="terms-text">
              Concordo com os <span className="terms-highlight">Termos de Uso</span> e a{" "}
              <span className="terms-highlight">Política de Privacidade</span>
            </span>
          </label>
          {errors.agreed && <span className="field-error-msg" style={{ marginTop: -8 }}>{errors.agreed}</span>}

          <SubmitBtn loading={loading} onClick={handleRegister}>Criar conta gratuita</SubmitBtn>
        </div>

        <p className="footer-text">
          Já tem conta?{" "}
          <button onClick={() => setScreen(SCREENS.LOGIN)} className="footer-btn">
            Entrar
          </button>
        </p>
      </AuthCard>
    </>
  );
}

// RECOVER
function RecoverScreen({ setScreen }) {
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  function validate() {
    const e = {};
    if (!email) e.email = "E-mail obrigatório";
    else if (!/\S+@\S+\.\S+/.test(email)) e.email = "E-mail inválido";
    return e;
  }

  async function handleRecover() {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    setErrors({});
    setLoading(true);

    const payload = { email };
    console.log("[FORGOT-PASSWORD] payload →", payload);

    await new Promise(r => setTimeout(r, 1400));
    setLoading(false);
    setSent(true);
  }

  return (
    <AuthCard>
      <Logo />
      {!sent ? (
        <>
          <button onClick={() => setScreen(SCREENS.LOGIN)} className="back-btn">
            <IconArrow /> Voltar para login
          </button>
          <h2 className="screen-title">Recuperar senha</h2>
          <p className="screen-subtitle" style={{ lineHeight: 1.6 }}>
            Informe seu e-mail de cadastro. Enviaremos um link para redefinir sua senha.
          </p>
          <div className="form-grid">
            <Field
              label="E-mail cadastrado"
              icon={<IconMail />}
              type="email"
              value={email}
              onChange={setEmail}
              placeholder="seu@email.com"
              error={errors.email}
            />
            <SubmitBtn loading={loading} onClick={handleRecover}>Enviar link de recuperação</SubmitBtn>
          </div>
        </>
      ) : (
        <div className="success-state-container">
          <div className="success-icon-badge">📬</div>
          <h2 className="success-title">E-mail enviado!</h2>
          <p className="success-description">
            Se o endereço <strong className="success-highlight">{email}</strong> estiver cadastrado, você receberá um link de redefinição em instantes.
          </p>
          <p className="success-subtext">
            Não encontrou? Verifique a caixa de spam.
          </p>
          <button onClick={() => setScreen(SCREENS.LOGIN)} className="outline-btn">
            Voltar ao login
          </button>
        </div>
      )}
    </AuthCard>
  );
}

// ROOT
export default function AuthScreens() {
  const [screen, setScreen] = useState(SCREENS.LOGIN);

  return (
    <div className="main-layout">
      {/* Background FX Layer */}
      <div className="bg-fx-layer">
        <div className="bg-blur-top" />
        <div className="bg-blur-bottom" />
        <svg className="bg-grid-svg" width="100%" height="100%">
          <defs>
            <pattern id="gr" width="48" height="48" patternUnits="userSpaceOnUse">
              <path d="M 48 0 L 0 0 0 48" fill="none" stroke="white" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#gr)" />
        </svg>
        
        {/* Floating decorative elements */}
        {[
          { top: "15%", left: "6%", size: 40, delay: "0s", icon: "🎮" },
          { top: "70%", left: "4%", size: 32, delay: "1.2s", icon: "⚔️" },
          { top: "30%", right: "5%", size: 36, delay: "0.6s", icon: "🏆" },
          { top: "75%", right: "7%", size: 30, delay: "1.8s", icon: "🎯" },
        ].map((d, i) => (
          <div 
            key={i} 
            className="floating-icon"
            style={{
              top: d.top, left: d.left, right: d.right,
              fontSize: d.size,
              animation: `float 4s ease-in-out ${d.delay} infinite`
            }}
          >
            {d.icon}
          </div>
        ))}
      </div>

      {/* Left panel — visible on wider screens */}
      <div className="left-panel">
        <div className="left-panel-content">
          <div className="badge-tag">Sistema de Matchmaking</div>
          <h1 className="main-headline">
            Encontre<br />seu time.<br />
            <span className="main-headline-gradient">Jogue melhor.</span>
          </h1>
          <p className="main-description">
            Pare de depender da Solo Queue. Conecte-se com jogadores que têm os mesmos objetivos, horários e estilo de jogo que você.
          </p>
          
          <div className="features-list">
            {["Filtros por jogo, rank e estilo", "Grupos pre-made sem toxicidade", "Perfil multidimensional de jogador"].map(txt => (
              <div key={txt} className="feature-item">
                <div className="feature-icon-wrapper">
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#a855f7" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </div>
                <span className="feature-text">{txt}</span>
              </div>
            ))}
          </div>

          {/* Screen tabs */}
          <div className="tabs-container">
            {[
              { id: SCREENS.LOGIN, label: "Login" },
              { id: SCREENS.REGISTER, label: "Cadastro" },
              { id: SCREENS.RECOVER, label: "Recuperar senha" },
            ].map(s => (
              <button
                key={s.id}
                onClick={() => setScreen(s.id)}
                className={`tab-btn ${screen === s.id ? "active" : ""}`}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Right panel — forms */}
      <div className="right-panel">
        {screen === SCREENS.LOGIN && <LoginScreen setScreen={setScreen} />}
        {screen === SCREENS.REGISTER && <RegisterScreen setScreen={setScreen} />}
        {screen === SCREENS.RECOVER && <RecoverScreen setScreen={setScreen} />}
      </div>
    </div>
  );
}