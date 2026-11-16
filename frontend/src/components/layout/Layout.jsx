import { useLocation, useOutlet } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import AnnouncementBar from "./AnnouncementBar";
import Navbar from "./Navbar";
import Footer from "./Footer";
import CartDrawer from "../overlays/CartDrawer";
import SearchOverlay from "../overlays/SearchOverlay";
import QuickView from "../overlays/QuickView";
import { scrollToTop } from "../fx/SmoothScroll";

export default function Layout() {
  const location = useLocation();
  const outlet = useOutlet();
  return (
    <div className="flex min-h-screen flex-col">
      <AnnouncementBar />
      <Navbar />
      <main className="flex-1">
        <AnimatePresence mode="wait" onExitComplete={scrollToTop}>
          <motion.div key={location.pathname} initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -18 }} transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}>{outlet}</motion.div>
        </AnimatePresence>
      </main>
      <Footer />
      <CartDrawer />
      <SearchOverlay />
      <QuickView />
    </div>
  );
}
