import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import Cart from "./components/Cart";
import Order from "./components/Order";
import Home from "./components/Home";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
                <Route path="/home" element={<Home />} />

        <Route path="/order" element={<Order />} />
        <Route path="/cart" element={<Cart />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
