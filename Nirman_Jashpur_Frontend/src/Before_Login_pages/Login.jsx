// import React, { useState } from "react";

// const dummyUsers = [
//   { username: "ACtribal", password: "123456" },
//   { username: "user2", password: "password2" },
// ];

// const LoginPage = ({ onLoginSuccess }) => {
//   const [username, setUsername] = useState("");
//   const [password, setPassword] = useState("");
//   const [error, setError] = useState("");
//   const [success, setSuccess] = useState("");

//   const handleLogin = (e) => {
//     e.preventDefault();
//     const user = dummyUsers.find(
//       (u) => u.username === username && u.password === password
//     );

//     if (user) {
//       setError("");
//       setTimeout(() => {
//         onLoginSuccess();
//       }, 1000);
//     } else {
//       setSuccess("");
//       setError("❌ Invalid username or password");
//     }
//   };

//   return (
//     <div style={{ color: "black" }} >
//       <div >
//         <h1 >निर्माण - लॉगिन</h1>
//         <p >
//           कृपया अपना लॉगिन आईडी और पासवर्ड दर्ज करे।
//         </p>
//         <form  onSubmit={handleLogin}>
//           <label  htmlFor="username">
//             लॉगिन आईडी
//           </label>
//           <input
//             type="text"
//             id="username"
//             value={username}
//             onChange={(e) => setUsername(e.target.value)}
//             placeholder="लॉगिन आईडी"
//           />
//           <label htmlFor="password">
//             पासवर्ड
//           </label>
//           <input
//             type="password"
//             id="password"
//             value={password}
//             onChange={(e) => setPassword(e.target.value)}
//             placeholder="पासवर्ड"
//           />

//           {error && <p >{error}</p>}
//           {success && <p >{success}</p>}

//           <button type="submit" >
//             Log In
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default LoginPage;

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
      setSuccess("✅ Login successful! Redirecting...");
      setTimeout(() => {
        onLoginSuccess();
      }, 1000);
    } else {
      setSuccess("");
      setError("❌ Invalid username or password");
    }
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "flex-end",
        alignItems: "center",       
        height: "100vh",backgroundImage: "url('assets/img/auth_bg3.jpg')",
        backgroundsize:"cover",
        backgroundposition :"start",
        color: "black",
        paddingRight: "50px",   
      }}
    >
      <div
        style={{
          backgroundImage: "#fff",
          padding: "30px",
          borderRadius: "12px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
          width: "350px",
          textAlign: "center",
        }}
      >
       <div
      style={{
        backgroundColor: "#565b56ff",
        marginBottom: "10px",
        padding: "10px",
        borderRadius: "10px",
        textAlign: "center",
        boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
      }}
    >
      <h1
        style={{
          margin: "0",
          fontSize: "26px",
          fontWeight: "bold",
          color: "#ff620d",
        }}
      >
        निर्माण - लॉगिन
      </h1>
      <p
        style={{
          marginTop: "10px",
          fontSize: "16px",
          color: "#ffffffff",
        }}
      >
        कृपया अपना लॉगिन आईडी और पासवर्ड दर्ज करे।
      </p>
    </div>
        <form
          onSubmit={handleLogin}
          style={{ display: "flex", flexDirection: "column", gap: "15px" }}
        >
          <label htmlFor="username" style={{ textAlign: "left" }}>
            लॉगिन आईडी
          </label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="लॉगिन आईडी"
            style={{
              padding: "10px",
              borderRadius: "6px",
              border: "1px solid #ccc",
            }}
          />
          <label htmlFor="password" style={{ textAlign: "left" }}>
            पासवर्ड
          </label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="पासवर्ड"
            style={{
              padding: "10px",
              borderRadius: "6px",
              border: "1px solid #ccc",
            }}
          />

          {error && <p style={{ color: "red" }}>{error}</p>}
          {success && <p style={{ color: "green" }}>{success}</p>}

          <button
            type="submit"
            style={{
              fontSize: "20px",
              background: "#249335ff",
              color: "white",
              padding: "10px",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
            }}
          >
            Log in
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;

