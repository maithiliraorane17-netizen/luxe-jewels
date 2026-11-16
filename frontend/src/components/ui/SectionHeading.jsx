import Reveal from "../fx/Reveal";
import SplitText from "../fx/SplitText";

export default function SectionHeading({ eyebrow, title, subtitle, align = "center", className = "" }) {
  return (
    <div className={`${align === "center" ? "mx-auto text-center" : ""} max-w-3xl ${className}`}>
      {eyebrow && (
        <Reveal>
          <p className={`mb-5 flex items-center gap-4 text-[11px] font-semibold uppercase tracking-[0.4em] text-gold-400 ${align === "center" ? "justify-center" : ""}`}>
            <span className="h-px w-10 bg-gold-400/50" /> {eyebrow} {align === "center" && <span className="h-px w-10 bg-gold-400/50" />}
          </p>
        </Reveal>
      )}
      <SplitText text={title} as="h2" className="font-display text-4xl font-medium leading-[1.05] sm:text-6xl" />
      {subtitle && <Reveal delay={0.2}><p className="mt-5 text-cream/50">{subtitle}</p></Reveal>}
    </div>
  );
}
