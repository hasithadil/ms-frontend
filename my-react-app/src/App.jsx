import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./components/client/Login";
import Home from "./components/client/Home";
import Order from "./components/client/Order";
import Cart from "./components/client/Cart";
import WmHome from "./components/wm/WmHome";
import DpHome from "./components/dp/DpHome";
import Register from "./pages/register";
import { ToastContainer } from "react-toastify";
import Track from "./pages/track";
import AddItem from "./components/wm/AddItem"
import Path from "./pages/Path";
import Wmorders from "./pages/Wmorders";


function App() {
  return (
    <BrowserRouter>
         <ToastContainer 
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        pauseOnHover
        draggable
      />
      <Routes>

        <Route path="/" element={<Login />} />
        <Route path="/home" element={<Home />} />
        <Route path="/order" element={<Order />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/wmhome" element={<WmHome />} />
        <Route path="/addItem" element={<AddItem />} />
        <Route path="/dphome" element={<DpHome />} />
        <Route path="/register" element={<Register />} />
        <Route path="/track/:id" element={<Track />} />
        <Route path="/path" element={<Path />} />
        <Route path="/wmorders" element={<Wmorders />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;
