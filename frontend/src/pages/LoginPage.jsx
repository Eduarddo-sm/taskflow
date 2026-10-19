import { useState } from "react";
import "./LoginPage.css";
import BoardsPage from "./BoardsPage.jsx";

function LoginForm({ onLogin, mensagem }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function handleSubmit(event) {
    event.preventDefault();

    onLogin(email, password);
  }

  return (
    <>
      <h1>TaskFlow</h1>
      <div className="login-card">
        <form onSubmit={handleSubmit}>
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            placeholder="Digite seu email"
            value={email}
            onChange={(evento) => setEmail(evento.target.value)}
          />

          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            placeholder="Digite sua senha"
            value={password}
            onChange={(evento) => setPassword(evento.target.value)}
          />

          <button type="submit">Entrar</button>
        </form>
        <div className={`popup-login ${mensagem ? "active" : ""}`}>
          <p>{mensagem}</p>
        </div>
      </div>
    </>
  );
}

function LoginPage() {
  const [mensagem, setMensagem] = useState("");
  const [logado, setLogado] = useState(false);
  const [token, setToken] = useState("");

  async function handleLogin(email, password) {
    try {
      const response = await fetch("http://localhost:3000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
          password: password,
        }),
      });

      if (!response.ok) {
        throw new Error("Falha ao fazer login");
      }

      const dados = await response.json();
      setToken(dados.response.token);
      setLogado(true);
      setMensagem("Login com sucesso");
    } catch (error) {
      console.log(error);
      setMensagem(error.message);
    }
  }

  return (
    <>
      {logado ? (
        <BoardsPage token={token} />
      ) : (
        <LoginForm onLogin={handleLogin} mensagem={mensagem} />
      )}
    </>
  );
}

export default LoginPage;
