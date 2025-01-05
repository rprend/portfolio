import BlogList from "../components/BlogList";
import Navbar from "../components/NavBar";
import background from "../assets/background.png";

export default function Blog() {
  document.title = "Blog | Ryan Prendergast";
  return (
    <div class="min-h-screen bg-background font-body">
      <Navbar currentPage="/blog" />

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
            BLOG
          </h1>
        </div>
      </div>

      <BlogList />
    </div>
  );
}
