import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./components/client/Login";
import Home from "./components/client/Home";
import Order from "./components/client/Order";
import Cart from "./components/client/Cart";
import WmHome from "./components/wm/WmHome";
import DpHome from "./components/dp/DpHome";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/home" element={<Home />} />
        <Route path="/order" element={<Order />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/wmhome" element={<WmHome />} />
                <Route path="/dphome" element={<DpHome />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;
