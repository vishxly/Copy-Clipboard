/* eslint-disable no-undef */
/* eslint-disable react/no-unescaped-entities */
import  { useState, useEffect } from "react";
import Login from "./components/Login";
import Signup from "./components/Signup";
import Dashboard from "./components/Dashboard";
import "./App.css";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [view, setView] = useState("login");

  useEffect(() => {
    if (typeof chrome !== "undefined" && chrome.storage) {
      chrome.storage.local.get(["token"], (result) => {
        if (result.token) {
          setIsLoggedIn(true);
        }
      });
    } else {
      const token = localStorage.getItem("token");
      if (token) {
        setIsLoggedIn(true);
      }
    }
  }, []);

  if (isLoggedIn) {
    return <Dashboard setIsLoggedIn={setIsLoggedIn} />;
  }

  return (
    <div className="p-4">
      {view === "login" ? (
        <>
          <Login setIsLoggedIn={setIsLoggedIn} />
          <p className="mt-4 text-center">
            Don't have an account?{" "}
            <button
              onClick={() => setView("signup")}
              className="text-blue-500 hover:underline"
            >
              Sign up
            </button>
          </p>
        </>
      ) : (
        <>
          <Signup setView={setView} />
          <p className="mt-4 text-center">
            Already have an account?{" "}
            <button
              onClick={() => setView("login")}
              className="text-blue-500 hover:underline"
            >
              Log in
            </button>
          </p>
        </>
      )}
    </div>
  );
}

export default App;
