import React, { useState } from "react";

const dummyUsers = [
  { username: "ACtribal", password: "123456" },
  { username: "user2", password: "password2" },
];

const LoginPage = ({ onLoginSuccess }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();
    const user = dummyUsers.find(
      (u) => u.username === username && u.password === password
    );

    if (user) {
      setError("");
      setTimeout(() => {
        onLoginSuccess();
      }, 1000);
    } else {
      setSuccess("");
      setError("❌ Invalid username or password");
    }
  };

  return (
    <div style={{ color: "black" }} >
      <div >
        <h1 >निर्माण - लॉगिन</h1>
        <p >
          कृपया अपना लॉगिन आईडी और पासवर्ड दर्ज करे।
        </p>
        <form  onSubmit={handleLogin}>
          <label  htmlFor="username">
            लॉगिन आईडी
          </label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="लॉगिन आईडी"
          />
          <label htmlFor="password">
            पासवर्ड
          </label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="पासवर्ड"
          />

          {error && <p >{error}</p>}
          {success && <p >{success}</p>}

          <button type="submit" >
            Log In
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
