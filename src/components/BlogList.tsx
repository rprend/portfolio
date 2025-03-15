import { createResource, For, createSignal, Show } from "solid-js";

interface Post {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  readTime: string;
}

type SortDirection = "asc" | "desc";

interface YearGroup {
  year: string;
  posts: Post[];
}

// Add styles for fade-in animation
const blogListStyles = `
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }

  .fade-in {
    animation: fadeIn 0.3s ease-in-out;
  }
`;

export default function BlogList() {
  const [sortDirection, setSortDirection] = createSignal<SortDirection>("desc");
  const [isReady, setIsReady] = createSignal(false);

  const [posts] = createResource<Post[]>(async () => {
    try {
      const response = await fetch("/api/posts");
      const text = await response.text();

      try {
        const data = JSON.parse(text);

        // Add a small delay before showing content to prevent flickering
        await new Promise((resolve) => setTimeout(resolve, 300));
        setIsReady(true);

        return data;
      } catch (e) {
        console.error("JSON parse error:", e);
        setIsReady(true);
        throw new Error("Invalid JSON response");
      }
    } catch (e) {
      console.error("Fetch error:", e);
      setIsReady(true);
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

  const groupedByYear = () => {
    const sorted = sortedPosts();
    const groups: YearGroup[] = [];

    sorted.forEach((post) => {
      const date = new Date(post.date);
      const year = date.getUTCFullYear().toString();

      let group = groups.find((g) => g.year === year);
      if (!group) {
        group = { year, posts: [] };
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

  const SkeletonLoader = () => (
    <div class="animate-pulse">
      <div class="flex justify-end border-y border-primary py-2 px-4">
        <div class="h-8 w-28 bg-primary/10 rounded"></div>
      </div>

      {/* First year group */}
      <div>
        <div class="px-4 pt-8 pb-2">
          <div class="h-7 w-16 bg-primary/10 rounded"></div>
        </div>

        {/* Skeleton posts */}
        {Array(6)
          .fill(0)
          .map(() => (
            <div class="py-3 px-4 flex items-baseline">
              <div class="w-16 h-5 bg-primary/10 rounded mr-2"></div>
              <div class="h-5 bg-primary/10 rounded w-3/4"></div>
            </div>
          ))}
      </div>

      {/* Second year group */}
      <div>
        <div class="px-4 pt-8 pb-2">
          <div class="h-7 w-16 bg-primary/10 rounded"></div>
        </div>

        {/* Skeleton posts */}
        {Array(4)
          .fill(0)
          .map(() => (
            <div class="py-3 px-4 flex items-baseline">
              <div class="w-16 h-5 bg-primary/10 rounded mr-2"></div>
              <div class="h-5 bg-primary/10 rounded w-2/3"></div>
            </div>
          ))}
      </div>
    </div>
  );

  return (
    <div>
      <style>{blogListStyles}</style>
      {/* Posts List Grouped by Year */}
      <Show
        when={posts() && isReady()}
        fallback={
          <Show
            when={posts.loading || (!isReady() && posts())}
            fallback={
              <div class="p-4 text-center text-primary">
                No posts available.
              </div>
            }
          >
            <SkeletonLoader />
          </Show>
        }
      >
        <div class="fade-in">
          <div class="flex justify-end border-y border-primary py-2 px-4">
            <button
              onClick={toggleSortDirection}
              class="text-sm text-primary font-medium flex items-center gap-2 hover:bg-primary/5 px-3 py-1 rounded transition-colors"
            >
              <span>Sort by Date</span>
              <span>{getSortIcon()}</span>
            </button>
          </div>

          <For each={groupedByYear()}>
            {(group) => (
              <div>
                {/* Year Header */}
                <div class="px-4 pt-8 pb-2">
                  <h2 class="text-xl font-bold text-primary">{group.year}</h2>
                </div>

                {/* Posts in this year */}
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
        </div>
      </Show>
    </div>
  );
}
