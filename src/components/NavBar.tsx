import { A, useNavigate } from "@solidjs/router"

export interface NavbarProps {
  showBackButton?: boolean
}

export default function Navbar(props: NavbarProps): JSX.Element {
  const navigate = useNavigate()

  return (
    <header class="flex align-center items-center h-16 justify-between mb-12">
    {props.showBackButton && (
      <p><button onClick={() => navigate(-1)}>&larr; back</button></p>
    )}
    {!props.showBackButton && (
      <p class="">prendergast.dev</p>
    )}
    <div class="flex flex-row space-x-4">
      <A href="/">home</A>
      <A href="/blog">blog</A>
      <A href="/contact">contact</A>
    </div>
    </header>
  )
}