import Navbar from "../components/NavBar";

export default function Home() {
  return (
    <div class="min-h-screen bg-background font-body">
      <Navbar currentPage="/" />
      <main class="max-w-2xl px-4 pb-12 pt-6">
        <h1 class="text-headline-mobile md:text-headline font-light text-primary leading-tight tracking-wide font-headline font-semibold pb-4">
          RYAN
          <br class="md:hidden" /> PRENDERGAST
        </h1>
        <p class="text-lg text-primary mb-4">
          Hi! I'm Ryan. I'm currently working on{" "}
          <a
            href="https://zenobiapay.com"
            target="_blank"
            rel="noopener noreferrer"
            class="hover:opacity-80 underline transition-opacity"
          >
            Zenobia Pay
          </a>
          . Our mission is to end the Visa / Mastercard duopoly, and make it 3x
          cheaper to transact online.
        </p>
        <p class="text-lg text-primary mb-4">
          Some hobbies that I enjoy and like to talk about. I enjoy{" "}
          <a
            href="https://www.youtube.com/playlist?list=PL-evJxq7wCJNhu6jh8QCcj_4PiycBDEOW"
            target="_blank"
            rel="noopener noreferrer"
            class="hover:opacity-80 underline transition-opacity"
          >
            amateur filmmaking
          </a>
          . I've played{" "}
          <a
            href="https://www.youtube.com/playlist?list=PL-evJxq7wCJPwhV7P91uooPOauMSX-UbE"
            target="_blank"
            rel="noopener noreferrer"
            class="hover:opacity-80 underline transition-opacity"
          >
            electric guitar and sang
          </a>{" "}
          in a couple bands. I like to write. To describe my writing in a
          sentence: "alien dropped on earth writes a movie review to remember
          what he sees."
        </p>
        <p class="text-lg text-primary mb-4">
          I like to meet new people, and I'm especially interested in people
          with niche problems or professions. My calendar is open at{" "}
          <a
            href="https://calendly.com/rprendergast1121/ryan"
            target="_blank"
            rel="noopener noreferrer"
          >
            calendly.com/rprendergast1121/ryan
          </a>
          .
        </p>
      </main>
    </div>
  );
}
