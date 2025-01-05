import Navbar from "../components/NavBar";
import ProjectCard from "../components/ProjectCard";
import OneMb from "../assets/1mb.png";
import background from "../assets/background.png";
import GenArt2 from "../assets/GenArt2.png";
import GenArt4 from "../assets/GenArt4.png";
import Site from "../assets/site.png";
import Grinn from "../assets/Grinn.png";
import Calvino from "../assets/Calvino.png";

export default function Home() {
  return (
    <div class="min-h-screen bg-background font-body">
      <Navbar currentPage="/" />

      {/* Combined Headline and Intro Section with shared background */}
      <div class="relative overflow-hidden">
        {/* Background image for both sections */}
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

        {/* Headline Section */}
        <div class="w-full px-6 py-6 relative z-10">
          <h1 class="text-headline-mobile md:text-headline font-light text-primary leading-tight tracking-wide font-headline font-semibold">
            RYAN
            <br class="md:hidden" /> PRENDERGAST
          </h1>
        </div>

        <div class="px-4 md:px-12 py-4 md:py-section relative z-10">
          <div class="flex flex-col md:flex-row items-center md:items-start gap-6 md:gap-12">
            <div class="w-full md:w-1/2">
              <p class="text-lg md:text-3xl font-light text-primary leading-relaxed">
                Hi. I'm Ryan.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Diagonal Stripes - Updated colors */}
      {/* <div class="relative w-full h-40 overflow-hidden bg-gradient-to-b from-background to-background/95">
        <div
          class="absolute right-0 top-0 w-72 h-[200%] -rotate-45 flex flex-col mix-blend-multiply"
          style="transform-origin: right top;"
        >
          <div class="h-8 bg-[#9D4EDD]/90 translate-x-12 mix-blend-screen"></div>
          <div class="h-8 bg-[#7B2CBF]/90 translate-x-8 mix-blend-screen"></div>
          <div class="h-10 bg-[#5A189A]/90 translate-x-4 mix-blend-overlay"></div>
          <div class="h-10 bg-[#3C096C]/90 translate-x-0"></div>
        </div>
        <div
          class="absolute right-12 top-0 w-72 h-[200%] -rotate-45 flex flex-col mix-blend-soft-light"
          style="transform-origin: right top;"
        >
          <div class="h-12 bg-[#FF449F]/40 translate-x-8"></div>
          <div class="h-12 bg-[#9D4EDD]/80 translate-x-4"></div>
        </div>
      </div> */}

      {/* Project Table/Grid */}
      <div class="border-t border-primary">
        {/* Header Row */}
        <div class="h-12 border-b border-primary px-8 flex items-center">
          <h2 class="text-md font-semibold font-headline">PROJECTS</h2>
        </div>

        {/* Project Grid */}
        <div class="grid grid-cols-1 md:grid-cols-2">
          <div class="border-b md:border-r border-primary">
            <ProjectCard
              title="one million bids"
              description="Two way paid auction markets supporting thousands of concurrent lobbies."
              href="/blog/1mb"
              date="August 2024"
              images={[OneMb]}
            />
          </div>
          <div class="border-b border-primary">
            <ProjectCard
              title="prendergast.dev"
              description="Personal portfolio-- this site and blog. Built with SolidJS"
              href="/"
              date="August 2024"
              images={[Site]}
            />
          </div>

          <div class="border-b md:border-r border-primary">
            <ProjectCard
              title="grinn"
              description="Writes a joke in the style of whoever you wish"
              date="November 2023"
              href="https://grinn.vercel.app/"
              images={[Grinn]}
            />
          </div>

          <div class="border-b border-primary">
            <ProjectCard
              title="calvino editor"
              description='Rewrites your words into the style of "Invisible Cities" by Italo Calvino'
              date="November 2023"
              href="https://stylistic.vercel.app/"
              images={[Calvino]}
            />
          </div>

          <div class="border-b md:border-r border-primary">
            <ProjectCard
              title="generative art"
              description="Miscellaneous collection of generative art sketches using p5.js"
              href="https://generative-art-chi.vercel.app/"
              date="Decemember 2022"
              images={[GenArt4, GenArt2]}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
