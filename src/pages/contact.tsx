import Navbar from "../components/NavBar";
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
      <main class="max-w-2xl px-4 pb-12 pt-4">
        <h1 class="text-4xl md:text-5xl font-bold text-primary mb-4">
          contact
        </h1>
        <div class="mb-8">
          <p class="text-xl text-primary">Ryan Prendergast</p>
          <p class="text-xl text-primary">rprendergast1121 at gmail.com</p>
          <p class="text-xl mb-4"></p>
          <div class="flex flex-col gap-8 text-primary flex-wrap">
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
      </main>
    </div>
  );
}
