import {
  createUserWithEmailAndPassword,
  getAuth,
  GithubAuthProvider,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  signInWithPopup,
} from "firebase/auth";
import React, { useState } from "react";
import { authService } from "../myBase";

function Auth() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [newAccount, setNewAccount] = useState(false);
  const [error, setError] = useState("");
  const onChange = (event) => {
    const {
      target: { value, name },
    } = event;
    if (name === "email") {
      setEmail(value);
    } else if (name === "password") {
      setPassword(value);
    }
  };
  const onSubmit = async (event) => {
    event.preventDefault();
    try {
      if (newAccount) {
        const auth = getAuth();
        const data = await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );
      } else {
        const auth = getAuth();
        const data = await signInWithEmailAndPassword(auth, email, password);
      }
    } catch (error) {
      setError(error.message.replace("Firebase:", ""));
    }
  };
  const onClick = () => {
    setNewAccount((prev) => !prev);
  };
  const onSocialIn = async (event) => {
    const {
      target: { name },
    } = event;
    let provider;
    if (name === "google") {
      provider = new GoogleAuthProvider();
    } else if (name === "github") {
      provider = new GithubAuthProvider();
    }

    await signInWithPopup(authService, provider);
  };
  return (
    <div>
      <form onSubmit={onSubmit}>
        <input
          name="email"
          type="text"
          placeholder="Email"
          required
          value={email}
          onChange={onChange}
        />
        <input
          name="password"
          type="password"
          placeholder="Password"
          required
          value={password}
          onChange={onChange}
        />
        <input
          type="submit"
          value={newAccount ? "Create Acoount" : "Sign In"}
        />
      </form>
      {error}
      <span onClick={onClick}>{newAccount ? "Sign In" : "Create Account"}</span>
      <div>
        <button onClick={onSocialIn} name="google">
          continue with Google
        </button>
        <button onClick={onSocialIn} name="github">
          continue with Github
        </button>
      </div>
    </div>
  );
}

export default Auth;
