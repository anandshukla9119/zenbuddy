



import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getAuth, signInWithEmailAndPassword, sendPasswordResetEmail } from "firebase/auth";
import { getFirestore, collection, query, where, getDocs } from "firebase/firestore";
import "./Login.css";

export default function Login() {
  const [identifier, setIdentifier] = useState(""); // Accepts email or username
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false); // State for password visibility
  const navigate = useNavigate();
  const auth = getAuth();
  const db = getFirestore();

  async function getEmailFromUsername(username) {
    const usersRef = collection(db, "users");
    const q = query(usersRef, where("username", "==", username));
    const querySnapshot = await getDocs(q);
    
    if (querySnapshot.empty) {
      throw new Error("Username not found. Please check and try again.");
    }
    
    return querySnapshot.docs[0].data().email;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      let email = identifier;

      // If user entered a username, fetch the corresponding email from Firestore
      if (!identifier.includes("@")) {
        email = await getEmailFromUsername(identifier);
      }

      // Proceed with login using email
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/");
    } catch (error) {
      setError("Failed to sign in: " + error.message);
    }

    setLoading(false);
  }

  async function handleForgotPassword() {
    setError("");

    try {
      let email = identifier;

      // Ensure the input is an email or convert username to email
      if (!identifier.includes("@")) {
        email = await getEmailFromUsername(identifier);
      }

      await sendPasswordResetEmail(auth, email);
      setError("✅ Password reset link sent to your email.");
    } catch (error) {
      setError("❌ Failed to reset password: " + error.message);
    }
  }

  return (
    <div className="auth-container">
      <div className="auth-form-container">
        <h2>🌿 ZenBuddy Login</h2>
        {error && <div className="auth-error">{error}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email or Username</label>
            <input
              type="text"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <span
              className="password-toggle"
              onClick={() => setShowPassword(!showPassword)}
            >
              {/* {showPassword ? "👁️‍🗨️" : "👁️"} */}
            </span>
          </div>

          {/* Forgot Password Button */}
          <div className="forgot-password">
            <button type="button" onClick={handleForgotPassword} disabled={loading}>
              Forgot Password?
            </button>
          </div>

          <button disabled={loading} type="submit" className="auth-button">
            {loading ? "Logging in..." : "Log In"}
          </button>
        </form>

        <div className="auth-links">
          <p>
            Don't have an account? <Link to="/signup">Sign Up</Link>
          </p>
        </div>
      </div>
    </div>
  );
}


