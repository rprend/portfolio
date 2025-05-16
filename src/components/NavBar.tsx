import { A, useNavigate } from "@solidjs/router";
import type { Component } from "solid-js";

export interface NavbarProps {
  currentPage: string;
}

const Navbar: Component<NavbarProps> = (props) => {
  const navigate = useNavigate();

  const getLinkClass = (path: string) => {
    return `text-primary hover:underline text-md px-2${props.currentPage === path ? " underline" : ""}`;
  };

  return (
    <header class="px-4 py-4">
      <nav class="flex items-center gap-2">
        <button onClick={() => navigate("/")} class={getLinkClass("/")}>
          home
        </button>
        <A href="/blog" class={getLinkClass("/blog")}>
          blog
        </A>
        <A href="/guestbook" class={getLinkClass("/guestbook")}>
          guestbook
        </A>
        <A href="/contact" class={getLinkClass("/contact")}>
          contact
        </A>
      </nav>
    </header>
  );
};

export default Navbar;
