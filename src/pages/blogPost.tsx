import { createResource, Show } from "solid-js";
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
`;

export default function BlogPost() {
  const params = useParams();

  const [data] = createResource<PostData | null>(async () => {
    // Sample post for testing

    const response = await fetch(`/api/post?slug=${params.slug}`);
    const data = await response.json();

    if (!data || !data.content) {
      return null;
    }

    const parsedContent = await marked(data.content);
    return { post: data, parsedContent };
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
        when={data()}
        fallback={
          <div class="p-8 text-center">
            <h1 class="text-2xl text-primary font-headline font-semibold mb-4">
              {data.error
                ? "Error Loading Post"
                : data() === null
                  ? "Post Not Found"
                  : "Loading..."}
            </h1>
            {data() === null && (
              <p class="text-primary">
                The blog post you're looking for doesn't exist.
              </p>
            )}
          </div>
        }
      >
        {/* Content */}
        <div class="px-8 py-12 max-w-4xl mx-auto">
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
