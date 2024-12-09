import { A, useNavigate } from "@solidjs/router";

export interface NavbarProps {
  showBackButton?: boolean;
}

export default function Navbar(props: NavbarProps): JSX.Element {
  const navigate = useNavigate();

  return (
    <header class="flex align-center items-center h-16 justify-between mb-12">
      {props.showBackButton && (
        <p>
          <button onClick={() => navigate(-1)} class="hover:underline">
            &larr; back
          </button>
        </p>
      )}
      {!props.showBackButton && <p class="">prendergast.dev</p>}
      <div class="flex flex-row space-x-4">
        <A href="/" class="hover:underline">
          home
        </A>
        <A href="/blog" class="hover:underline">
          blog
        </A>
        <A href="/contact" class="hover:underline">
          contact
        </A>
      </div>
    </header>
  );
}
