import { motion } from "framer-motion";
import CountUp from "../fx/CountUp";

export default function StatCard({ icon: Icon, label, value, prefix = "", index = 0, tone = "from-[#cda355] to-[#9c6c30]" }) {
  return (
    <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.08, duration: 0.6 }} whileHover={{ y: -4 }} className="relative overflow-hidden rounded-2xl bg-white p-6 shadow-sm ring-1 ring-black/5">
      <div className={`absolute -right-8 -top-8 h-28 w-28 rounded-full bg-gradient-to-br ${tone} opacity-10`} />
      <div className={`mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br ${tone} text-white shadow`}><Icon size={20} /></div>
      <p className="text-sm text-black/50">{label}</p>
      <p className="mt-1 font-display text-3xl font-semibold"><CountUp to={Math.round(value || 0)} prefix={prefix} /></p>
    </motion.div>
  );
}
