import { createResource, For, createSignal } from "solid-js";

interface Post {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  readTime: string;
}

type SortField = "title" | "date";
type SortDirection = "asc" | "desc";

export default function BlogList() {
  const [sortField, setSortField] = createSignal<SortField>("date");
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
    const field = sortField();
    const direction = sortDirection();
    const items = posts() || [];

    return [...items].sort((a, b) => {
      const aValue = field === "date" ? new Date(a[field]).getTime() : a[field];
      const bValue = field === "date" ? new Date(b[field]).getTime() : b[field];

      if (aValue < bValue) return direction === "asc" ? -1 : 1;
      if (aValue > bValue) return direction === "asc" ? 1 : -1;
      return 0;
    });
  };

  const toggleSort = (field: SortField) => {
    if (sortField() === field) {
      setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortDirection(field === "title" ? "desc" : "asc");
    }
  };

  const getSortIcon = (field: SortField) => {
    if (sortField() !== field) return "";
    if (field === "title") {
      return sortDirection() === "asc" ? "↓" : "↑";
    }
    return sortDirection() === "asc" ? "↑" : "↓";
  };

  return (
    <div class="border-t border-primary">
      {/* Header Row */}
      <div class="h-12 border-b border-primary grid grid-cols-[1fr_170px] items-stretch">
        <button
          onClick={() => toggleSort("title")}
          class="text-sm text-primary font-medium px-8 flex items-center justify-between border-r border-primary hover:bg-primary/5"
        >
          <span>WRITINGS</span>
          <span class="opacity-50 group-hover:opacity-100">
            {getSortIcon("title")}
          </span>
        </button>
        <button
          onClick={() => toggleSort("date")}
          class="text-sm text-primary font-medium px-8 flex items-center justify-between hover:bg-primary/5"
        >
          <span>DATE</span>
          <span class="opacity-50 group-hover:opacity-100">
            {getSortIcon("date")}
          </span>
        </button>
      </div>

      {/* Posts List */}
      <div>
        <For each={sortedPosts()}>
          {(post) => (
            <a
              href={`/blog/${post.slug}`}
              class="group border-b border-primary block hover:cursor-pointer"
            >
              <div class="grid grid-cols-[1fr_170px] md:items-stretch relative">
                {/* Hover effect background */}
                <div class="absolute inset-0 bg-primary/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

                {/* Content */}
                <div class="relative px-8 py-4 flex items-center gap-2 md:border-r border-primary min-w-0">
                  <span class="text-xl text-primary transition-opacity break-words">
                    {post.title}
                  </span>
                  <span class="text-primary opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                    →
                  </span>
                </div>
                <div class="relative px-8 py-4 text-primary/80 text-right flex items-center justify-end shrink-0">
                  {new Date(post.date).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                    timeZone: "UTC",
                  })}
                </div>
              </div>
            </a>
          )}
        </For>
      </div>
    </div>
  );
}
