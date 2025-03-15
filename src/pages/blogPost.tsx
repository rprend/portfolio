import { createResource, Show, createSignal, onMount } from "solid-js";
import { useParams, A } from "@solidjs/router";
import Navbar from "../components/NavBar";
import { marked } from "marked";

interface Post {
  slug: string;
  title: string;
  content: string;
  date: string;
  readTime: string;
}

interface PostData {
  post: Post;
  parsedContent: string;
}

// Update the blog styles to handle text wrapping better
const blogStyles = `
  .prose img.not-prose {
    margin: 0 !important;
  }
  .prose div.not-prose {
    margin: 0 !important;
  }
  .prose p {
    clear: none !important;
    line-height: 1.7 !important;
    margin-top: 1.25em !important;
    margin-bottom: 1.25em !important;
  }
  .prose > * {
    clear: none !important;
  }
  .prose {
    line-height: 1.7 !important;
  }

  /* Add fade-in animation */
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }

  .fade-in {
    animation: fadeIn 0.3s ease-in-out;
  }
`;

const SkeletonLoader = () => (
  <div class="px-8 py-12 max-w-3xl mx-auto animate-pulse">
    <div class="mb-8">
      <div class="inline-flex items-center">
        <div class="w-20 h-6 bg-primary/10 rounded"></div>
      </div>
    </div>

    {/* Title skeleton */}
    <div class="h-12 bg-primary/10 rounded-lg w-3/4 mb-4"></div>

    {/* Date and author skeleton */}
    <div class="flex flex-wrap items-center mb-8">
      <div class="w-32 h-5 bg-primary/10 rounded mr-4"></div>
      <div class="w-28 h-5 bg-primary/10 rounded"></div>
    </div>

    {/* Content skeleton */}
    <div class="space-y-6">
      {/* Paragraph skeletons */}
      <div class="h-5 bg-primary/10 rounded w-full"></div>
      <div class="h-5 bg-primary/10 rounded w-full"></div>
      <div class="h-5 bg-primary/10 rounded w-11/12"></div>
      <div class="h-5 bg-primary/10 rounded w-full"></div>
      <div class="h-5 bg-primary/10 rounded w-10/12"></div>

      {/* Heading skeleton */}
      <div class="h-8 bg-primary/10 rounded w-1/2 mt-8 mb-4"></div>

      {/* More paragraphs */}
      <div class="h-5 bg-primary/10 rounded w-full"></div>
      <div class="h-5 bg-primary/10 rounded w-full"></div>
      <div class="h-5 bg-primary/10 rounded w-3/4"></div>

      {/* Image placeholder */}
      <div class="h-64 bg-primary/10 rounded w-full my-8"></div>

      {/* Final paragraphs */}
      <div class="h-5 bg-primary/10 rounded w-full"></div>
      <div class="h-5 bg-primary/10 rounded w-full"></div>
      <div class="h-5 bg-primary/10 rounded w-5/6"></div>
    </div>
  </div>
);

export default function BlogPost() {
  const params = useParams();
  const [isReady, setIsReady] = createSignal(false);

  const [data] = createResource<PostData | null>(async () => {
    // Sample post for testing
    try {
      const response = await fetch(`/api/post?slug=${params.slug}`);
      const data = await response.json();

      if (!data || !data.content) {
        return null;
      }

      const parsedContent = await marked(data.content);

      // Add a small delay before showing content to prevent flickering
      await new Promise((resolve) => setTimeout(resolve, 300));
      setIsReady(true);

      return { post: data, parsedContent };
    } catch (error) {
      console.error("Error fetching post:", error);
      setIsReady(true);
      return null;
    }
  });

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      timeZone: "UTC",
    });
  };

  return (
    <div class="min-h-screen bg-background font-body">
      <style>{blogStyles}</style>
      <Navbar currentPage="/blog" />

      <Show
        when={data() && isReady()}
        fallback={
          <Show
            when={data.loading || (!isReady() && data())}
            fallback={
              <div class="p-8 text-center">
                <h1 class="text-2xl text-primary font-headline font-semibold mb-4">
                  {data.error ? "Error Loading Post" : "Post Not Found"}
                </h1>
                <p class="text-primary">
                  The blog post you're looking for doesn't exist.
                </p>
              </div>
            }
          >
            <SkeletonLoader />
          </Show>
        }
      >
        {/* Content */}
        <div class="px-8 py-12 max-w-3xl mx-auto fade-in">
          <div class="mb-8">
            <A href="/blog" class="inline-flex items-center text-primary group">
              <span class="mr-1">←</span>
              <span class="hover:underline">Blog</span>
            </A>
          </div>

          <h1 class="text-4xl text-primary mb-4 font-headline font-semibold">
            {data()?.post.title}
          </h1>

          <div class="flex flex-wrap items-center text-primary/70 mb-8">
            <div class="mr-4">
              {data()?.post.date ? formatDate(data()?.post.date) : ""}
            </div>
            <div>Ryan Prendergast</div>
          </div>

          <div
            class="prose prose-lg prose-primary"
            innerHTML={data()?.parsedContent}
          />
        </div>
      </Show>
    </div>
  );
}
