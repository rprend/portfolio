import { A, useNavigate } from "@solidjs/router";
import type { Component } from "solid-js";

export interface NavbarProps {
  currentPage: string;
}

const Navbar: Component<NavbarProps> = (props) => {
  const navigate = useNavigate();

  const getLinkClass = (path: string) => {
    const baseClass =
      "text-primary hover:opacity-80 transition-opacity text-md";
    return `${baseClass} ${props.currentPage === path ? "underline" : "hover:underline"}`;
  };

  return (
    <header class="md:px-8 px-4 py-4 border-b border-primary relative z-50">
      {/* Desktop Navigation */}
      <nav class="hidden md:flex items-center justify-between">
        <button
          onClick={() => navigate("/")}
          class={`${getLinkClass("/")} text-primary hover:underline hover:opacity-80 transition-opacity text-md`}
        >
          prendergast.dev
        </button>

        <div class="flex gap-8">
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
      </nav>

      {/* Mobile Navigation - Horizontal Row */}
      <nav class="md:hidden flex items-center justify-between">
        <button
          onClick={() => navigate("/")}
          class={`${getLinkClass("/")} text-primary`}
        >
          home
        </button>

        <div class="flex gap-4">
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
      </nav>
    </header>
  );
};

export default Navbar;
