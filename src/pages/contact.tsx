import Navbar from "../components/NavBar";
import background from "../assets/background.png";
import {
  FaBrandsGithub,
  FaBrandsLinkedin,
  FaBrandsInstagram,
  FaBrandsYoutube,
} from "solid-icons/fa";
import { SiLetterboxd } from "solid-icons/si";

export default function Contact() {
  document.title = "Contact | Ryan Prendergast";
  return (
    <div class="min-h-screen bg-background font-body">
      <Navbar currentPage="/contact" />

      <div class="relative overflow-hidden">
        <div
          class="absolute inset-0"
          style={{
            "background-image": `url(${background})`,
            "background-size": "cover",
            "background-position": "center",
            opacity: "0.85",
            "mix-blend-mode": "multiply",
          }}
        ></div>
        <div class="w-full px-6 py-6 relative z-10">
          <h1 class="text-headline-mobile md:text-headline font-semibold text-primary leading-tight tracking-wide font-afacad">
            CONTACT
          </h1>
        </div>
      </div>

      {/* Contact Info Table */}
      <div class="border-t border-primary">
        {/* Header Row */}
        <div class="h-12 border-b border-primary px-8 flex items-center">
          <h2 class="text-sm text-primary font-medium">GET IN TOUCH</h2>
        </div>

        {/* Contact Details */}
        <div class="px-8 py-12">
          <div class="space-y-6">
            <p class="text-xl text-primary">Ryan Prendergast</p>
            <p class="text-xl text-primary">rprendergast1121 at gmail.com</p>
            <div class="flex gap-8 text-primary">
              <a
                href="https://github.com/rprend"
                target="_blank"
                rel="noopener noreferrer"
                class="hover:opacity-80 hover:underline transition-opacity flex items-center gap-2"
              >
                <FaBrandsGithub size={24} /> GitHub
              </a>
              <a
                href="https://linkedin.com/in/rprendergast"
                target="_blank"
                rel="noopener noreferrer"
                class="hover:opacity-80 hover:underline transition-opacity flex items-center gap-2"
              >
                <FaBrandsLinkedin size={24} /> LinkedIn
              </a>
              <a
                href="https://www.instagram.com/r.prendie/"
                target="_blank"
                rel="noopener noreferrer"
                class="hover:opacity-80 hover:underline transition-opacity flex items-center gap-2"
              >
                <FaBrandsInstagram size={24} /> Instagram
              </a>
              <a
                href="https://youtube.com/@ryanprendergast6424"
                target="_blank"
                rel="noopener noreferrer"
                class="hover:opacity-80 hover:underline transition-opacity flex items-center gap-2"
              >
                <FaBrandsYoutube size={24} /> YouTube
              </a>
              <a
                href="https://letterboxd.com/rprend"
                target="_blank"
                rel="noopener noreferrer"
                class="hover:opacity-80 hover:underline transition-opacity flex items-center gap-2"
              >
                <SiLetterboxd size={24} /> Letterboxd
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
