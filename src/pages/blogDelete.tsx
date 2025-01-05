import { createResource, For, Show } from "solid-js";
import Navbar from "../components/NavBar";

interface Post {
  slug: string;
  title: string;
  date: string;
}

export default function BlogDelete() {
  const [posts, { refetch }] = createResource<Post[]>(async () => {
    const response = await fetch("/api/posts", {
      credentials: "include",
    });
    const data = await response.json();
    return data;
  });

  const handleDelete = async (slug: string) => {
    if (!confirm(`Are you sure you want to delete "${slug}"?`)) {
      return;
    }

    try {
      const response = await fetch("/api/post", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ slug }),
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Failed to delete post");
      }

      alert("Post deleted successfully!");
      refetch();
    } catch (error) {
      console.error("Error deleting post:", error);
      alert("Failed to delete post. Please try again.");
    }
  };

  return (
    <div class="min-h-screen bg-background font-body">
      <Navbar showBackButton={true} />

      <div class="max-w-4xl mx-auto p-8">
        <h1 class="text-4xl text-primary mb-8 font-headline font-semibold">
          Delete Posts
        </h1>

        <div class="space-y-4">
          <Show
            when={!posts.loading}
            fallback={<div class="text-primary">Loading posts...</div>}
          >
            <For each={posts()}>
              {(post) => (
                <div class="flex items-center justify-between p-4 border border-primary rounded">
                  <div>
                    <h2 class="text-xl text-primary">{post.title}</h2>
                    <p class="text-sm text-primary-light">{post.date}</p>
                  </div>
                  <button
                    onClick={() => handleDelete(post.slug)}
                    class="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                    title="Delete post"
                  >
                    🗑️
                  </button>
                </div>
              )}
            </For>
          </Show>
        </div>
      </div>
    </div>
  );
}
