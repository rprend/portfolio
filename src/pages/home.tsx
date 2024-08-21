import { createSignal, For } from 'solid-js';
import postsMetadata from '../utils/postsMetadata';
import { A } from '@solidjs/router';
import BlogList from '../components/BlogList';
import Navbar from '../components/NavBar';
// import { Title } from "@solidjs/meta";


export default function Home() {
  const [count, setCount] = createSignal(0);

  return (

    <div class='container mx-auto max-w-2xl px-4 mt-6'>
        <Navbar showBackButton={false}/>
        <article class="prose prose-slate mx-auto mb-12">
          <h3>Ryan&apos;s homepage</h3>
          <p>Hi, I&apos;m Ryan. I&apos;m a software engineer at <a href="https://www.bubble.io/" target="_blank" rel="noreferrer">Bubble</a> in New York. </p>
          <h3>Coding</h3>
          <p>Here are some of the things I&apos;ve worked on:</p>
          <div class="grid grid-cols-2 gap-4">
            <div class="bg-gray-100 p-4">
              <h4>prendergast.dev</h4>
              <p>This site! It's a Static blog built with <a href="https://solidjs.com/" target="_blank" rel="noreferrer">Solid.js</a> and hosted with <a href="https://pages.cloudflare.com/" target="_blank" rel="noreferrer">Cloudflare pages</a>.</p>
            </div>
            <div class="bg-gray-100 p-4">
              <h4>calvino editor</h4>
              <p>Rewrite text in the style of Italo Calvino&apos;s Invisible Cities. <a href="https://stylistic.vercel.app" target="_blank" rel="noreferrer">Try here</a>.</p>
            </div>
            <div class="bg-gray-100 p-4">
              <h4>generative art</h4>
              <p>Miscellaneous generative art projects. <a href="https://generative-art-chi.vercel.app" target="_blank" rel="noreferrer">View here</a>.</p>
            </div>
          </div>
          <h3>Blog</h3>
          <BlogList />
        </article>
    </div>
  );
}
