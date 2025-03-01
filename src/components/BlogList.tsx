import { createResource, For, createSignal, Show } from "solid-js";

interface Post {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  readTime: string;
}

type SortDirection = "asc" | "desc";

interface MonthGroup {
  monthYear: string;
  posts: Post[];
}

export default function BlogList() {
  const [sortDirection, setSortDirection] = createSignal<SortDirection>("desc");

  const [posts] = createResource<Post[]>(async () => {
    try {
      const response = await fetch("/api/posts");
      const text = await response.text();

      try {
        return JSON.parse(text);
      } catch (e) {
        console.error("JSON parse error:", e);
        throw new Error("Invalid JSON response");
      }
    } catch (e) {
      console.error("Fetch error:", e);
      throw e;
    }
  });

  const sortedPosts = () => {
    const direction = sortDirection();
    const items = posts() || [];

    return [...items].sort((a, b) => {
      const aDate = new Date(a.date).getTime();
      const bDate = new Date(b.date).getTime();

      return direction === "asc" ? aDate - bDate : bDate - aDate;
    });
  };

  const toggleSortDirection = () => {
    setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
  };

  const getSortIcon = () => {
    return sortDirection() === "asc" ? "↑" : "↓";
  };

  const groupedByMonth = () => {
    const sorted = sortedPosts();
    const groups: MonthGroup[] = [];

    sorted.forEach((post) => {
      const date = new Date(post.date);
      const monthYear = date.toLocaleDateString("en-US", {
        month: "long",
        year: "numeric",
        timeZone: "UTC",
      });

      let group = groups.find((g) => g.monthYear === monthYear);
      if (!group) {
        group = { monthYear, posts: [] };
        groups.push(group);
      }

      group.posts.push(post);
    });

    return groups;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const month = (date.getUTCMonth() + 1).toString().padStart(2, "0");
    const day = date.getUTCDate().toString().padStart(2, "0");
    return `${month}-${day}`;
  };

  return (
    <div>
      {/* Posts List Grouped by Month */}
      <Show
        when={!posts.loading}
        fallback={<div class="p-4">Loading posts...</div>}
      >
        <div class="flex justify-end border-y border-primary py-2 px-4">
          <button
            onClick={toggleSortDirection}
            class="text-sm text-primary font-medium flex items-center gap-2 hover:bg-primary/5 px-3 py-1 rounded transition-colors"
          >
            <span>Sort by Date</span>
            <span>{getSortIcon()}</span>
          </button>
        </div>

        <For each={groupedByMonth()}>
          {(group) => (
            <div>
              {/* Month Header */}
              <div class="border-b border-primary py-3 px-4 font-medium bg-primary/5">
                {group.monthYear}
              </div>

              {/* Posts in this month */}
              <For each={group.posts}>
                {(post) => (
                  <div class="py-3 px-4 flex items-baseline">
                    <span class="text-primary w-16 pl-2 flex-shrink-0 whitespace-nowrap">
                      {formatDate(post.date)}
                    </span>
                    <div class="group flex items-center min-w-0">
                      <a
                        href={`/blog/${post.slug}`}
                        class="text-primary hover:underline"
                      >
                        {post.title}
                      </a>
                      <span class="ml-1 opacity-0 group-hover:opacity-100 transition-opacity text-primary flex-shrink-0">
                        →
                      </span>
                    </div>
                  </div>
                )}
              </For>
            </div>
          )}
        </For>
      </Show>
    </div>
  );
}
