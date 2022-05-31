import { useState, useEffect } from "react";
import AppRouter from "./Router";
import { authService } from "../myBase";
import { getAuth, onAuthStateChanged } from "firebase/auth";

function App() {
  const [init, setInit] = useState(false);
  const [isLoggedIn, setLoggedIn] = useState(false);
  useEffect(() => {
    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setLoggedIn(true);
      } else {
        setLoggedIn(false);
      }
      setInit(true);
    });
  }, []);
  return (
    <>
      {init ? <AppRouter isLoggedIn={isLoggedIn} /> : "Initialazing..."}
      <footer>&copy; {new Date().getFullYear()}</footer>
    </>
  );
}

export default App;
