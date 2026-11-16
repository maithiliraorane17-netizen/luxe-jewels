import { motion } from "framer-motion";
import { useUI } from "../../store/uiStore";

export default function Reveal({ children, delay = 0, y = 36, className = "", as = "div", once = true, x = 0 }) {
  const ready = useUI((s) => s.ready);
  const Comp = motion[as] || motion.div;
  return (
    <Comp initial={{ opacity: 0, y, x }} whileInView={ready ? { opacity: 1, y: 0, x: 0 } : undefined} animate={ready ? undefined : { opacity: 0, y, x }} viewport={{ once, margin: "0px 0px -8% 0px" }} transition={{ duration: 0.9, delay, ease: [0.16, 1, 0.3, 1] }} className={className}>
      {children}
    </Comp>
  );
}
