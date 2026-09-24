import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import Button from "../components/ui/Button";

export default function NotFound() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center px-5 text-center">
      <motion.h1 initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} className="font-display text-7xl text-gold-500">404</motion.h1>
      <p className="mt-4 text-cream/50">The page you're looking for doesn't exist.</p>
      <Link to="/" className="mt-6"><Button variant="gold">Back to Home</Button></Link>
    </div>
  );
}
