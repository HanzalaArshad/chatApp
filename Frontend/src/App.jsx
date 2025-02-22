import { Routes, Route } from "react-router-dom";
import Home from "./Pages/Home";
import "./App.css";
import ChatPage from "./Pages/ChatPage";

const App = () => {
  return (
    <div className="App ">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/chat" element={<ChatPage />} />
      </Routes>
    </div>
  );
};

export default App;
