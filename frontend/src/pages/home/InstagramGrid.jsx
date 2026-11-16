
import { FaInstagram } from "react-icons/fa";
import Reveal from "../../components/fx/Reveal";
import SectionHeading from "../../components/ui/SectionHeading";
import { GALLERY, u } from "../../utils/images";

export default function InstagramGrid() {
  return (
    <section className="px-6 pb-28 sm:px-10">
      <SectionHeading
        eyebrow="@luxejewels"
        title="Worn by *you*"
        subtitle="Tag us to be featured in our gallery."
      />

      <div className="mx-auto mt-14 grid max-w-[1500px] grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        {GALLERY.map((id, i) => (
          <Reveal key={id} delay={i * 0.07}>
            <a
              href="#"
              data-cursor="view"
              data-cursor-label="Follow"
              className="group relative block aspect-square overflow-hidden rounded-2xl"
            >
              <img
                src={u(id, 500)}
                alt=""
                loading="lazy"
                className="h-full w-full object-cover transition-transform duration-[1000ms] group-hover:scale-110"
              />

              <div className="absolute inset-0 flex items-center justify-center bg-ink-950/60 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
                <FaInstagram className="text-gold-200" size={26} />
              </div>
            </a>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
