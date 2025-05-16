import BlogList from "../components/BlogList";
import Navbar from "../components/NavBar";

export default function Blog() {
  document.title = "Blog | Ryan Prendergast";
  return (
    <div class="min-h-screen bg-background font-body">
      <Navbar currentPage="/blog" />
      <main class="max-w-2xl px-4 pb-12 pt-4">
        <h1 class="text-4xl md:text-5xl font-bold text-primary mb-8">blog</h1>
        <BlogList />
      </main>
    </div>
  );
}
