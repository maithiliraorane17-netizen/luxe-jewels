import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Phone, MapPin } from "lucide-react";
import toast from "react-hot-toast";
import Button from "../components/ui/Button";

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });

  const submit = (e) => {
    e.preventDefault();
    toast.success("Message sent! We'll get back to you soon.");
    setForm({ name: "", email: "", message: "" });
  };

  return (
    <div className="mx-auto max-w-6xl px-5 py-16 sm:px-8">
      <motion.h1 initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mb-10 text-center font-display text-4xl font-semibold">
        Get in Touch
      </motion.h1>
      <div className="grid gap-12 lg:grid-cols-2">
        <motion.form initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} onSubmit={submit} className="space-y-4">
          <input required placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full rounded-lg border border-cream/15 bg-ink-900 px-4 py-3 text-sm text-cream placeholder:text-cream/30 focus:border-gold-400 focus:outline-none transition-colors" />
          <input required type="email" placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="w-full rounded-lg border border-cream/15 bg-ink-900 px-4 py-3 text-sm text-cream placeholder:text-cream/30 focus:border-gold-400 focus:outline-none transition-colors" />
          <textarea required rows={5} placeholder="Message" value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} className="w-full rounded-lg border border-cream/15 bg-ink-900 px-4 py-3 text-sm text-cream placeholder:text-cream/30 focus:border-gold-400 focus:outline-none transition-colors" />
          <Button type="submit" variant="gold">Send Message</Button>
        </motion.form>
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
          <div className="flex items-center gap-4"><Mail className="text-gold-400" /> hello@luxejewels.com</div>
          <div className="flex items-center gap-4"><Phone className="text-gold-400" /> +91 98765 43210</div>
          <div className="flex items-center gap-4"><MapPin className="text-gold-400" /> Borivali, Mumbai, India</div>
        </motion.div>
      </div>
    </div>
  );
}
