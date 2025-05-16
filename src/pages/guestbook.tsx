import { Component, createSignal, createResource, For, Show } from "solid-js";
import Navbar from "../components/NavBar";

interface GuestbookEntry {
  id: number;
  name: string;
  message: string;
  created_at: string;
}

const Guestbook: Component = () => {
  document.title = "Guestbook | Ryan Prendergast";
  const [name, setName] = createSignal("");
  const [message, setMessage] = createSignal("");
  const [showForm, setShowForm] = createSignal(false);
  const [error, setError] = createSignal("");

  const [entries, { refetch }] = createResource<GuestbookEntry[]>(async () => {
    const response = await fetch("/api/guestbook");
    return response.json();
  });

  const handleSubmit = async (e: Event) => {
    e.preventDefault();
    setError("");

    try {
      const response = await fetch("/api/guestbook", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: name(),
          message: message(),
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setName("");
        setMessage("");
        setShowForm(false);
        refetch();
      } else {
        setError(data.error || "Failed to submit entry");
      }
    } catch (error) {
      setError("Failed to submit entry");
      console.error("Failed to submit entry:", error);
    }
  };

  return (
    <div class="min-h-screen bg-background font-body">
      <Navbar currentPage="/guestbook" />
      <main class="max-w-2xl px-4 pb-12 pt-4">
        <div class="flex flex-col md:flex-row md:items-center gap-4 md:gap-8 md:justify-between mb-8">
          <h1 class="text-4xl md:text-5xl font-bold text-primary">guestbook</h1>
          <button
            onClick={() => setShowForm(true)}
            class="self-start my-auto px-4 py-2 bg-primary text-background hover:opacity-80 transition-opacity whitespace-nowrap"
          >
            Sign Guestbook
          </button>
        </div>

        <div class="">
          {/* Entries List */}
          <div>
            {entries.loading && (
              <div class="px-8 py-4 text-primary">Loading entries...</div>
            )}
            <For each={entries()}>
              {(entry) => (
                <div class="border-b border-primary/20 last:border-0">
                  <div class="px-8 py-6 flex flex-col gap-2">
                    <div class="text-primary/80 text-sm">
                      {new Date(entry.created_at).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                        timeZone: "UTC",
                      })}
                    </div>
                    <p class="text-primary whitespace-pre-wrap break-words">
                      {entry.message}
                    </p>
                    <div class="text-primary/80 text-sm">— {entry.name}</div>
                  </div>
                </div>
              )}
            </For>
          </div>
        </div>

        {/* Popup Form */}
        <Show when={showForm()}>
          <div class="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div class="bg-background border border-primary p-8 max-w-md w-full mx-auto">
              <div class="flex justify-between items-center mb-6">
                <h2 class="text-xl font-bold text-primary">Sign Guestbook</h2>
                <button
                  onClick={() => setShowForm(false)}
                  class="text-primary my-auto hover:opacity-80"
                >
                  ✕
                </button>
              </div>

              <p class="text-primary/80 mb-6 mt-2 text-sm">
                This guestbook is anonymous and public. Your message will be
                visible to anyone who visits this site. I reserve the right to
                delete anything bad.
              </p>

              <form onSubmit={handleSubmit} class="space-y-4 mt-4">
                <div>
                  <label for="name" class="block mb-2 text-primary">
                    Name
                  </label>
                  <input
                    id="name"
                    type="text"
                    value={name()}
                    onInput={(e) => setName(e.currentTarget.value)}
                    required
                    class="w-full p-2 border border-primary bg-background text-primary"
                  />
                </div>
                <div>
                  <label for="message" class="block mb-2 text-primary">
                    Message
                  </label>
                  <textarea
                    id="message"
                    value={message()}
                    onInput={(e) => setMessage(e.currentTarget.value)}
                    required
                    class="w-full p-2 border border-primary bg-background h-32 text-primary"
                  />
                </div>

                <Show when={error()}>
                  <p class="text-red-500">{error()}</p>
                </Show>

                <div class="flex justify-end gap-4">
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    class="px-4 py-2 border border-primary text-primary hover:bg-primary/5"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    class="px-4 py-2 bg-primary text-background hover:opacity-80 transition-opacity"
                  >
                    Sign
                  </button>
                </div>
              </form>
            </div>
          </div>
        </Show>
      </main>
    </div>
  );
};

export default Guestbook;
