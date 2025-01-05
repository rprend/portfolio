import { A, useNavigate } from "@solidjs/router";
import type { Component } from "solid-js";
import { createSignal } from "solid-js";

export interface NavbarProps {
  currentPage: string;
}

const Navbar: Component<NavbarProps> = (props) => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = createSignal(false);

  const getLinkClass = (path: string) => {
    const baseClass =
      "text-primary hover:opacity-80 transition-opacity text-md";
    return `${baseClass} ${props.currentPage === path ? "underline" : "hover:underline"}`;
  };

  return (
    <header class="px-8 py-4 border-b border-primary">
      <nav class="flex items-center justify-between">
        {/* Mobile menu button - moved to left */}
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen())}
          class="md:hidden text-primary"
        >
          <svg
            class="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            {isMenuOpen() ? (
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M4 6h16M4 12h16M4 18h16"
              />
            )}
          </svg>
        </button>

        {/* Site title - hidden on mobile */}
        <button
          onClick={() => navigate("/")}
          class={`${getLinkClass("/")} hidden md:block text-primary hover:underline hover:opacity-80 transition-opacity text-md`}
        >
          prendergast.dev
        </button>

        {/* Desktop menu */}
        <div class="hidden md:flex gap-8">
          <A href="/blog" class={getLinkClass("/blog")}>
            blog
          </A>
          <A href="/guestbook" class={getLinkClass("/guestbook")}>
            guestbook
          </A>
          <A href="/contact" class={getLinkClass("/contact")}>
            contact
          </A>
        </div>

        {/* Mobile menu dropdown */}
        <div
          class={`absolute top-16 left-0 right-0 bg-background border-b border-primary md:hidden ${
            isMenuOpen() ? "block" : "hidden"
          }`}
        >
          <div class="flex flex-col items-center py-4 gap-4">
            <A
              href="/"
              class={getLinkClass("/")}
              onClick={() => setIsMenuOpen(false)}
            >
              home
            </A>
            <A
              href="/blog"
              class={getLinkClass("/blog")}
              onClick={() => setIsMenuOpen(false)}
            >
              blog
            </A>
            <A
              href="/guestbook"
              class={getLinkClass("/guestbook")}
              onClick={() => setIsMenuOpen(false)}
            >
              guestbook
            </A>
            <A
              href="/contact"
              class={getLinkClass("/contact")}
              onClick={() => setIsMenuOpen(false)}
            >
              contact
            </A>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
