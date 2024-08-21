import BlogList from "../components/BlogList";
import Navbar from "../components/NavBar";

export default function Blog() {
  return (
    <div class='container mx-auto max-w-2xl px-4 mt-6'>
      <Navbar showBackButton={true} />
      <article class="prose">
        <BlogList />
      </article>
    </div>
  )
}