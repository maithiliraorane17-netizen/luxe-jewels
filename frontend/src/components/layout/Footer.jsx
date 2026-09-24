import { Link } from "react-router-dom";
import {
  FaInstagram,
  FaFacebookF,
  FaTwitter,
} from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="mt-24 border-t border-ink-900/10 bg-ink-900 text-cream">
      <div className="mx-auto grid max-w-7xl gap-10 px-5 py-16 sm:px-8 md:grid-cols-4">
        <div>
          <h3 className="font-display text-2xl font-bold">
            Luxe<span className="text-gold-400">Jewels</span>
          </h3>
          <p className="mt-3 max-w-xs text-sm text-cream/60">
            Fine jewelry crafted for life's most defining moments. Timeless designs, ethically sourced.
          </p>
          <div className="mt-5 flex gap-4">
            <a href="#" className="text-cream/60 hover:text-gold-400">
              <FaInstagram size={18} />
            </a>
            <a href="#" className="text-cream/60 hover:text-gold-400">
              <FaFacebookF size={18} />
            </a>
            <a href="#" className="text-cream/60 hover:text-gold-400">
              <FaTwitter size={18} />
            </a>
          </div>
        </div>

        <div>
          <h4 className="mb-4 text-sm font-semibold uppercase tracking-widest text-gold-400">
            Shop
          </h4>
          <ul className="space-y-2 text-sm text-cream/60">
            <li>
              <Link to="/products" className="hover:text-cream">
                All Products
              </Link>
            </li>
            <li>
              <Link to="/collections" className="hover:text-cream">
                Collections
              </Link>
            </li>
            <li>
              <Link
                to="/products?newArrival=true"
                className="hover:text-cream"
              >
                New Arrivals
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="mb-4 text-sm font-semibold uppercase tracking-widest text-gold-400">
            Company
          </h4>
          <ul className="space-y-2 text-sm text-cream/60">
            <li>
              <Link to="/about" className="hover:text-cream">
                About Us
              </Link>
            </li>
            <li>
              <Link to="/blog" className="hover:text-cream">
                Journal
              </Link>
            </li>
            <li>
              <Link to="/contact" className="hover:text-cream">
                Contact
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="mb-4 text-sm font-semibold uppercase tracking-widest text-gold-400">
            Account
          </h4>
          <ul className="space-y-2 text-sm text-cream/60">
            <li>
              <Link to="/account" className="hover:text-cream">
                Order History
              </Link>
            </li>
            <li>
              <Link to="/wishlist" className="hover:text-cream">
                Wishlist
              </Link>
            </li>
            <li>
              <Link to="/login" className="hover:text-cream">
                Sign In
              </Link>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-cream/10 py-6 text-center text-xs text-cream/40">
        © {new Date().getFullYear()} LuxeJewels. All rights reserved.
      </div>
    </footer>
  );
}

