import { useState } from "react";

import LandingPage from "./components/LandingPage";
import MessageScreen from "./components/MessageScreen";

import "./App.css";

function App() {
  const [page, setPage] = useState("landing");

  return (
    <>
      {page === "landing" && (
        <LandingPage
          onOpen={() => setPage("message")}
        />
      )}

      {page === "message" && (
        <MessageScreen />
      )}
    </>
  );
}

export default App;
