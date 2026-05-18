import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";

function Login({ setUser }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    fetch("http://127.0.0.1:8000/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, mot_de_passe: password }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        if (data.success) {
          const userWithRole = { ...data.user, role: data.role };
          setUser(userWithRole);
          localStorage.setItem("user", JSON.stringify(userWithRole));
          if (data.role === "Administrateur") navigate("/dashboard");
          if (data.role === "Employé") navigate("/mes-projets");
          if (data.role === "client") navigate("/client-dashboard");
        } else {
          alert(data.message);
        }
      });
  };

  return (
    <div className="login-box">
      <h2>Login</h2>
      <form onSubmit={handleSubmit} autoComplete="off">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="off"
          required
        />
        <input
          type="password"
          placeholder="Mot de passe"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="new-password"
          required
        />
        <br />
        <br />
        <button type="submit">Login</button>
      </form>
    </div>
  );
}

export default Login;