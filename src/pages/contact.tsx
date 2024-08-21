import Navbar from "../components/NavBar";

export function Contact(): JSX.Element {
  return (
    <div class='container mx-auto max-w-2xl px-4 mt-6'>
    <Navbar showBackButton={true} />
    <article class="prose">
      <h1>Contact</h1>
      <p>Ryan Prendergast</p>
      <p>Contact me at rprendergast1121 at gmail</p>
    </article>
  </div>
  )
}