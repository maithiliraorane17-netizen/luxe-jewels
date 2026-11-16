import { useCallback, useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { Toaster } from "react-hot-toast";

import SmoothScroll from "./components/fx/SmoothScroll";
import Preloader from "./components/fx/Preloader";
import CustomCursor from "./components/fx/CustomCursor";
import ScrollProgress from "./components/fx/ScrollProgress";
import Layout from "./components/layout/Layout";
import ProtectedRoute from "./components/ProtectedRoute";
import { useUI } from "./store/uiStore";

import Home from "./pages/Home";
import ProductListing from "./pages/ProductListing";
import ProductDetail from "./pages/ProductDetail";
import Collections from "./pages/Collections";
import CollectionDetail from "./pages/CollectionDetail";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import OrderDetail from "./pages/OrderDetail";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Account from "./pages/Account";
import Wishlist from "./pages/Wishlist";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Blog from "./pages/Blog";
import BlogPost from "./pages/BlogPost";
import NotFound from "./pages/NotFound";

import AdminLayout from "./pages/admin/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminProducts from "./pages/admin/AdminProducts";
import AdminOrders from "./pages/admin/AdminOrders";
import AdminCollections from "./pages/admin/AdminCollections";
import AdminReviews from "./pages/admin/AdminReviews";
import AdminBlog from "./pages/admin/AdminBlog";
import AdminUsers from "./pages/admin/AdminUsers";

function Chrome() {
  const { pathname } = useLocation();
  const isAdmin = pathname.startsWith("/admin");
  return (<><SmoothScroll /><CustomCursor />{!isAdmin && <ScrollProgress />}</>);
}

export default function App() {
  const setReady = useUI((s) => s.setReady);
  const [loading, setLoading] = useState(() => !sessionStorage.getItem("lj_loaded") && !window.location.pathname.startsWith("/admin"));
  useEffect(() => { if (!loading) setReady(true); }, []); // eslint-disable-line
  const done = useCallback(() => { sessionStorage.setItem("lj_loaded", "1"); setReady(true); setLoading(false); }, [setReady]);

  return (
    <BrowserRouter>
      <Toaster position="top-center" toastOptions={{ style: { background: "#18181b", color: "#faf7f2", border: "1px solid rgba(205,163,85,.25)" } }} />
      <Chrome />
      <AnimatePresence>{loading && <Preloader onDone={done} />}</AnimatePresence>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<ProductListing />} />
          <Route path="/products/:slug" element={<ProductDetail />} />
          <Route path="/collections" element={<Collections />} />
          <Route path="/collections/:slug" element={<CollectionDetail />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
          <Route path="/order/:id" element={<ProtectedRoute><OrderDetail /></ProtectedRoute>} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/account" element={<ProtectedRoute><Account /></ProtectedRoute>} />
          <Route path="/wishlist" element={<Wishlist />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:slug" element={<BlogPost />} />
          <Route path="*" element={<NotFound />} />
        </Route>
        <Route path="/admin" element={<ProtectedRoute adminOnly><AdminLayout /></ProtectedRoute>}>
          <Route index element={<AdminDashboard />} />
          <Route path="products" element={<AdminProducts />} />
          <Route path="orders" element={<AdminOrders />} />
          <Route path="collections" element={<AdminCollections />} />
          <Route path="reviews" element={<AdminReviews />} />
          <Route path="blog" element={<AdminBlog />} />
          <Route path="users" element={<AdminUsers />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
