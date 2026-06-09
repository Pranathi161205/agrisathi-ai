import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import Chat from "./pages/Chat";
import Detect from "./pages/Detect";
import Weather from "./pages/Weather";

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/weather" element={<Weather />} />
          <Route path="/chat" element={<Chat />} />
          <Route path="/detect" element={<Detect />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;
