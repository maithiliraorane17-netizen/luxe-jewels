import { Link } from "react-router-dom";
import Button from "../components/ui/Button";
import Particles from "../components/fx/Particles";

export default function NotFound() {
  return (
    <div className="relative flex min-h-[70vh] flex-col items-center justify-center overflow-hidden px-6 text-center">
      <Particles count={18} />
      <p className="font-display text-[28vw] leading-none outline-text-gold sm:text-[16rem]">404</p>
      <p className="-mt-4 font-display text-3xl italic">This piece seems to be missing</p>
      <Link to="/" className="mt-10"><Button>Back to home</Button></Link>
    </div>
  );
}
