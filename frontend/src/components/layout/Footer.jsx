
import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowUp, ArrowRight } from "lucide-react";
import {
  FaInstagram,
  FaFacebookF,
  FaTwitter,
} from "react-icons/fa";
import toast from "react-hot-toast";
import { scrollToTop } from "../fx/SmoothScroll";

export default function Footer() {
  const [email, setEmail] = useState("");

  const col = (title, items) => (
    <div>
      <h4 className="mb-5 text-[11px] font-semibold uppercase tracking-[0.3em] text-gold-400">
        {title}
      </h4>

      <ul className="space-y-3 text-sm text-cream/55">
        {items.map(([label, to]) => (
          <li key={label}>
            <Link
              to={to}
              className="underline-grow transition hover:text-cream"
            >
              {label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );

  const socialIcons = [FaInstagram, FaFacebookF, FaTwitter];

  return (
    <footer className="relative mt-10 overflow-hidden border-t border-gold-400/10 bg-ink-900">
      <div className="mx-auto grid max-w-[1500px] gap-12 px-6 pb-10 pt-20 sm:px-10 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">

        <div>
          <h3 className="font-display text-3xl">
            Join the <span className="gold-text italic">inner circle</span>
          </h3>

          <p className="mt-3 max-w-sm text-sm text-cream/50">
            Private previews, atelier stories and early access to new collections.
          </p>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              toast.success("Welcome to the inner circle ✦");
              setEmail("");
            }}
            className="mt-6 flex max-w-sm items-center border-b border-cream/25 pb-2 transition focus-within:border-gold-400"
          >
            <input
              required
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Your email address"
              className="flex-1 bg-transparent text-sm outline-none placeholder:text-cream/30"
            />

            <button
              type="submit"
              className="text-gold-300 transition hover:translate-x-1"
            >
              <ArrowRight size={18} />
            </button>
          </form>

          <div className="mt-8 flex gap-3">
            {socialIcons.map((Icon, i) => (
              <a
                key={i}
                href="#"
                aria-label={["Instagram", "Facebook", "Twitter"][i]}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-cream/15 text-cream/60 transition hover:border-gold-400 hover:text-gold-300"
              >
                <Icon size={16} />
              </a>
            ))}
          </div>
        </div>

        {col("Shop", [
          ["All jewelry", "/products"],
          ["Collections", "/collections"],
          ["New arrivals", "/products?newArrival=true"],
          ["Gold", "/products?metalType=Gold"],
          ["Platinum", "/products?metalType=Platinum"],
        ])}

        {col("Maison", [
          ["Our story", "/about"],
          ["The journal", "/blog"],
          ["Contact", "/contact"],
        ])}

        {col("Account", [
          ["Orders", "/account"],
          ["Wishlist", "/wishlist"],
          ["Sign in", "/login"],
        ])}
      </div>

      <div className="pointer-events-none select-none px-4 text-center font-display text-[18vw] font-semibold leading-[.8] tracking-tight outline-text">
        LuxeJewels
      </div>

      <div className="mx-auto flex max-w-[1500px] flex-wrap items-center justify-between gap-3 border-t border-cream/10 px-6 py-6 text-xs text-cream/40 sm:px-10">
        <span>
          © {new Date().getFullYear()} LuxeJewels. All rights reserved.
        </span>

        <span className="uppercase tracking-widest">
          UPI · Visa · Mastercard · Cash on Delivery
        </span>

        <button
          onClick={scrollToTop}
          className="flex items-center gap-2 uppercase tracking-widest transition hover:text-gold-300"
        >
          Back to top <ArrowUp size={14} />
        </button>
      </div>
    </footer>
  );
}
