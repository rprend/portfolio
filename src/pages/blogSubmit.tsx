import { createSignal, Show, createResource } from "solid-js";
import { createTiptapEditor } from "solid-tiptap";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Navbar from "../components/NavBar";
import { useNavigate } from "@solidjs/router";
import Image from "@tiptap/extension-image";

export default function BlogSubmit() {
  const navigate = useNavigate();
  const [title, setTitle] = createSignal("");
  const [showSubmitModal, setShowSubmitModal] = createSignal(false);
  const [slug, setSlug] = createSignal("");
  const [date, setDate] = createSignal(new Date().toISOString().split("T")[0]);
  const [selection, setSelection] = createSignal(false);
  const [editorState, setEditorState] = createSignal(0);
  const [showLinkInput, setShowLinkInput] = createSignal(false);
  const [linkUrl, setLinkUrl] = createSignal("");
  const [showImageModal, setShowImageModal] = createSignal(false);
  const [imageUrl, setImageUrl] = createSignal("");
  const [imageSize, setImageSize] = createSignal("medium");
  const [selectedImage, setSelectedImage] =
    createSignal<HTMLImageElement | null>(null);
  const [showImageEditModal, setShowImageEditModal] = createSignal(false);
  const [resizeMode, setResizeMode] = createSignal<
    "both" | "horizontal" | "vertical" | "none"
  >("none");
  const [imageAlignment, setImageAlignment] = createSignal<
    "left" | "center" | "right"
  >("center");
  const [imageCaption, setImageCaption] = createSignal("");
  const [previewUrl, setPreviewUrl] = createSignal("");
  const [uploadStatus, setUploadStatus] = createSignal<
    "idle" | "uploading" | "error"
  >("idle");
  let ref!: HTMLDivElement;
  let toolbarRef!: HTMLDivElement;
  let linkInputRef!: HTMLInputElement;

  // Fetch available images using a resource
  const fetchImages = async () => {
    const response = await fetch("/api/images/list");
    if (!response.ok) {
      throw new Error("Failed to fetch images");
    }
    const data = (await response.json()) as {
      results: Array<{ id: string; name: string; url: string }>;
    };
    return data.results;
  };

  const [images, { refetch }] =
    createResource<Array<{ id: string; name: string; url: string }>>(
      fetchImages
    );

  // Add function to handle image selection from dropdown
  const handleImageSelect = (url: string) => {
    setImageUrl(url);
    setPreviewUrl(url);
  };

  // Add function to handle URL input
  const handleUrlInput = (url: string) => {
    setImageUrl(url);
    setPreviewUrl(url);
  };

  const handleFileUpload = async (e: Event) => {
    const input = e.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;

    setUploadStatus("uploading");
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("/api/images/upload", {
        method: "POST",
        body: formData,
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error(await response.text());
      }

      const { url } = await response.json();
      handleImageSelect(url);
      setUploadStatus("idle");
      // Refresh the images list
      refetch();

      // Clear the input so the same file can be uploaded again if needed
      input.value = "";
    } catch (error) {
      console.error("Upload error:", error);
      setUploadStatus("error");
      setTimeout(() => setUploadStatus("idle"), 3000);
    }
  };

  const editor = createTiptapEditor(() => ({
    element: ref!,
    extensions: [
      StarterKit,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: "text-primary underline decoration-primary hover:decoration-2",
        },
      }),
      Image.extend({
        addAttributes() {
          return {
            ...this.parent?.(),
            class: {
              default: "max-w-full h-auto not-prose",
            },
            style: {
              default: null,
            },
            caption: {
              default: null,
            },
          };
        },
        addNodeView() {
          return ({ node }) => {
            const dom = document.createElement("div");
            dom.className = "relative group";

            const wrapper = document.createElement("div");
            wrapper.className = node.attrs.class + " not-prose";

            // Add spacing only for floated images
            if (node.attrs.class.includes("float-left")) {
              wrapper.className += " mr-6";
            } else if (node.attrs.class.includes("float-right")) {
              wrapper.className += " ml-6";
            }

            const img = document.createElement("img");
            img.src = node.attrs.src;
            img.className = "max-w-full h-auto not-prose";

            // Add caption if it exists
            if (node.attrs.caption) {
              const caption = document.createElement("figcaption");
              caption.textContent = node.attrs.caption;
              caption.className =
                "text-sm text-gray-600 mt-2 text-center italic not-prose";
              wrapper.appendChild(img);
              wrapper.appendChild(caption);
            } else {
              wrapper.appendChild(img);
            }

            // Add edit button that appears on hover
            const editButton = document.createElement("button");
            editButton.innerHTML = "✏️";
            editButton.className =
              "absolute top-2 right-2 bg-primary text-background rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity";
            editButton.addEventListener("click", () => {
              setSelectedImage(img);
              setImageSize(getSizeFromClass(wrapper.className));
              setImageAlignment(getAlignmentFromClass(wrapper.className));
              setImageCaption(node.attrs.caption || "");
              setShowImageEditModal(true);
            });

            dom.appendChild(wrapper);
            dom.appendChild(editButton);
            return { dom };
          };
        },
      }).configure({
        inline: true,
        allowBase64: true,
      }),
    ],
    editorProps: {
      attributes: {
        class: "prose prose-lg prose-primary focus:outline-none min-h-[300px]",
      },
    },
    onUpdate: () => {
      setEditorState((prev) => prev + 1);
    },
    onSelectionUpdate: ({ editor }) => {
      const { from, to } = editor.state.selection;
      const hasSelection = from !== to;
      setSelection(hasSelection);
      setEditorState((prev) => prev + 1);

      if (!hasSelection || !toolbarRef) return;

      // Improved positioning
      requestAnimationFrame(() => {
        const selection = window.getSelection();
        if (!selection?.rangeCount) return;

        const range = selection.getRangeAt(0);
        const rect = range.getBoundingClientRect();
        const viewportHeight = window.innerHeight;

        // Position toolbar centered above selection
        const toolbarHeight = toolbarRef.offsetHeight;
        const spacing = 10; // pixels above selection

        // Calculate position relative to viewport
        let top = rect.top - toolbarHeight - spacing;

        // If toolbar would go above viewport, place it below selection instead
        if (top < 0) {
          top = rect.bottom + spacing;
        }

        toolbarRef.style.position = "fixed";
        toolbarRef.style.top = `${top}px`;
        toolbarRef.style.left = `${rect.left + (rect.width - toolbarRef.offsetWidth) / 2}px`;

        // Update link input position if it's open
        if (showLinkInput()) {
          requestAnimationFrame(() => {
            const linkForm = document.querySelector(
              "form.fixed"
            ) as HTMLElement;
            if (linkForm) {
              linkForm.style.top = `${top + toolbarHeight + spacing}px`;
              linkForm.style.left = toolbarRef.style.left;
            }
          });
        }
      });
    },
  }));

  // Helper function to check if a format is active
  const isActive = (type: string, attrs = {}) => {
    editorState();
    return editor()?.isActive(type, attrs) ?? false;
  };

  const handleSubmit = async (e: Event) => {
    e.preventDefault();

    const postData = {
      title: title(),
      slug: slug(),
      content: editor()?.getHTML(),
      date: date(),
    };

    try {
      const response = await fetch("/api/post", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(postData),
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Failed to submit post");
      }

      // Clear the form
      setTitle("");
      setSlug("");
      setDate(new Date().toISOString().split("T")[0]);
      editor()?.commands.clearContent();
      setShowSubmitModal(false);

      // Navigate to the new post
      navigate(`/blog/${postData.slug}`);
    } catch (error) {
      console.error("Error submitting post:", error);
      alert("Failed to submit post. Please try again.");
    }
  };

  const handleSetLink = (e: Event) => {
    e.preventDefault();
    if (linkUrl()) {
      editor()?.commands.setLink({ href: linkUrl() });
    } else {
      editor()?.commands.unsetLink();
    }
    setShowLinkInput(false);
    setLinkUrl("");
  };

  const handleLinkButtonClick = () => {
    const previousUrl = editor()?.getAttributes("link").href;
    setLinkUrl(previousUrl || "");
    setShowLinkInput(true);
    requestAnimationFrame(() => {
      linkInputRef?.focus();
    });
  };

  const addImage = () => setShowImageModal(true);

  const handleImageSubmit = (e: Event) => {
    e.preventDefault();
    if (imageUrl()) {
      let className = "max-w-full h-auto cursor-pointer"; // default

      switch (imageSize()) {
        case "small":
          className = "w-1/4 h-auto mx-auto cursor-pointer";
          break;
        case "medium":
          className = "w-1/2 h-auto mx-auto cursor-pointer";
          break;
        case "large":
          className = "w-3/4 h-auto mx-auto cursor-pointer";
          break;
        case "full":
          className = "max-w-full h-auto cursor-pointer";
          break;
      }

      editor()
        ?.chain()
        .focus()
        .insertContent({
          type: "image",
          attrs: {
            src: imageUrl(),
            class: className,
          },
        })
        .run();

      setShowImageModal(false);
      setImageUrl("");
    }
  };

  // Helper function to determine current size from class
  const getSizeFromClass = (className: string) => {
    if (className.includes("w-1/4")) return "small";
    if (className.includes("w-1/2")) return "medium";
    if (className.includes("w-3/4")) return "large";
    return "full";
  };

  // Helper function to determine default alignment based on size and aspect ratio
  const getDefaultAlignment = (
    img: HTMLImageElement,
    size: string
  ): "left" | "center" | "right" => {
    const aspectRatio = img.naturalWidth / img.naturalHeight;

    if (size === "small" || size === "medium") {
      // Tall images (portrait) tend to look better on the sides
      if (aspectRatio < 0.8) return "left";
      // Wide images (landscape) work well centered
      if (aspectRatio > 1.2) return "center";
      // Square-ish images can go right
      return "right";
    }

    // Large and full-width images are always centered
    return "center";
  };

  // Helper function to get alignment from class
  const getAlignmentFromClass = (
    className: string
  ): "left" | "center" | "right" => {
    if (className.includes("float-left")) return "left";
    if (className.includes("float-right")) return "right";
    return "center";
  };

  // Add this function to handle image updates
  const handleImageEdit = (e: Event) => {
    e.preventDefault();
    const img = selectedImage();
    if (!img) return;

    let className = "";

    // Set size classes
    switch (imageSize()) {
      case "small":
        className += "w-1/4 ";
        break;
      case "medium":
        className += "w-1/2 ";
        break;
      case "large":
        className += "w-3/4 ";
        break;
      case "full":
        className += "w-full ";
        break;
    }

    // Set alignment classes
    switch (imageAlignment()) {
      case "left":
        className += "float-left ";
        break;
      case "right":
        className += "float-right ";
        break;
      case "center":
        className += "mx-auto block ";
        break;
    }

    editor()
      ?.chain()
      .focus()
      .insertContent({
        type: "image",
        attrs: {
          src: img.src,
          class: className,
          caption: imageCaption() || null,
        },
      })
      .run();

    setShowImageEditModal(false);
    setSelectedImage(null);
    setImageCaption("");
  };

  // Add function to handle image deletion
  const handleImageDelete = async (id: string) => {
    try {
      const response = await fetch("/api/image", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id }),
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error(await response.text());
      }

      // Refresh the images list
      refetch();
    } catch (error) {
      console.error("Delete error:", error);
    }
  };

  return (
    <div class="min-h-screen bg-background font-body">
      <Navbar currentPage="/blog" />

      <div class="max-w-4xl mx-auto">
        <Show when={selection()}>
          <div
            ref={toolbarRef}
            class="fixed z-20 flex gap-2 p-2 bg-background border border-primary rounded shadow-lg"
            onMouseDown={(e) => e.preventDefault()} // Prevent toolbar from losing focus
          >
            <button
              type="button"
              onClick={() => editor()?.commands.toggleBold()}
              class={`px-2 py-1 text-primary rounded transition-colors ${
                isActive("bold")
                  ? "bg-primary text-background"
                  : "hover:bg-primary hover:text-background"
              }`}
            >
              B
            </button>
            <button
              type="button"
              onClick={() => editor()?.commands.toggleItalic()}
              class={`px-2 py-1 text-primary rounded transition-colors ${
                isActive("italic")
                  ? "bg-primary text-background"
                  : "hover:bg-primary hover:text-background"
              }`}
            >
              I
            </button>
            <button
              type="button"
              onClick={() => editor()?.commands.toggleHeading({ level: 2 })}
              class={`px-2 py-1 text-primary rounded transition-colors ${
                isActive("heading", { level: 2 })
                  ? "bg-primary text-background"
                  : "hover:bg-primary hover:text-background"
              }`}
            >
              H2
            </button>
            <button
              type="button"
              onClick={() => editor()?.commands.toggleBlockquote()}
              class={`px-2 py-1 text-primary rounded transition-colors ${
                isActive("blockquote")
                  ? "bg-primary text-background"
                  : "hover:bg-primary hover:text-background"
              }`}
            >
              "
            </button>
            <button
              type="button"
              onClick={() => editor()?.commands.toggleBulletList()}
              class={`px-2 py-1 text-primary rounded transition-colors ${
                isActive("bulletList")
                  ? "bg-primary text-background"
                  : "hover:bg-primary hover:text-background"
              }`}
            >
              •
            </button>
            <button
              type="button"
              onClick={() => editor()?.commands.toggleCodeBlock()}
              class={`px-2 py-1 text-primary rounded transition-colors ${
                isActive("codeBlock")
                  ? "bg-primary text-background"
                  : "hover:bg-primary hover:text-background"
              }`}
            >
              <code>{"</>"}</code>
            </button>
            <button
              type="button"
              onClick={handleLinkButtonClick}
              class={`px-2 py-1 text-primary rounded transition-colors ${
                isActive("link")
                  ? "bg-primary text-background"
                  : "hover:bg-primary hover:text-background"
              }`}
            >
              🔗
            </button>
            <button
              type="button"
              onClick={addImage}
              class="px-2 py-1 text-primary rounded transition-colors hover:bg-primary hover:text-background"
            >
              📷
            </button>
          </div>
        </Show>

        <Show when={showLinkInput()}>
          <form
            class="fixed z-30 p-2 bg-background border border-primary rounded shadow-lg"
            style={{
              top: `${(toolbarRef?.offsetTop || 0) + (toolbarRef?.offsetHeight || 0) + 5}px`,
              left: `${toolbarRef?.offsetLeft || 0}px`,
            }}
            onSubmit={handleSetLink}
          >
            <div class="flex gap-2">
              <input
                ref={linkInputRef}
                type="url"
                value={linkUrl()}
                onInput={(e) => setLinkUrl(e.currentTarget.value)}
                placeholder="Enter URL"
                class="p-1 bg-background-light border border-primary text-primary rounded"
              />
              <button
                type="submit"
                class="px-2 py-1 bg-primary text-background rounded hover:bg-primary-dark"
              >
                ✓
              </button>
              <button
                type="button"
                onClick={() => setShowLinkInput(false)}
                class="px-2 py-1 bg-red-600 text-white rounded hover:bg-red-700"
              >
                ✕
              </button>
            </div>
          </form>
        </Show>

        <Show when={showImageModal()}>
          <div class="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
            <form
              onSubmit={handleImageSubmit}
              class="bg-background p-6 rounded-lg shadow-xl max-w-md w-full space-y-4"
            >
              <h2 class="text-2xl text-primary font-headline font-semibold mb-4">
                Insert Image
              </h2>

              <div>
                <div class="flex justify-between items-center mb-2">
                  <label class="block text-primary">Select Image</label>
                  <div class="relative">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      class="hidden"
                      id="image-upload"
                    />
                    <label
                      for="image-upload"
                      class={`flex items-center justify-center w-8 h-8 rounded-full border-2 border-primary cursor-pointer hover:bg-primary/10 transition-colors ${
                        uploadStatus() === "uploading"
                          ? "bg-primary/20 cursor-wait"
                          : ""
                      } ${
                        uploadStatus() === "error"
                          ? "bg-red-100 border-red-500"
                          : ""
                      }`}
                    >
                      {uploadStatus() === "uploading" ? (
                        <span class="animate-spin">↻</span>
                      ) : uploadStatus() === "error" ? (
                        <span class="text-red-500">!</span>
                      ) : (
                        <span class="text-xl leading-none">+</span>
                      )}
                    </label>
                  </div>
                </div>
                <div class="grid grid-cols-3 gap-4 mb-4 max-h-64 overflow-y-auto p-2 bg-background-light border border-primary rounded">
                  <Show
                    when={!images.loading}
                    fallback={
                      <div class="col-span-3 text-center py-4 text-primary">
                        Loading images...
                      </div>
                    }
                  >
                    <Show
                      when={images()?.length > 0}
                      fallback={
                        <div class="col-span-3 flex flex-col items-center justify-center gap-4 py-8 text-primary/60">
                          <span class="text-4xl">📷</span>
                          <p class="text-center">No images uploaded yet</p>
                          <label
                            for="image-upload"
                            class="px-4 py-2 border-2 border-primary rounded cursor-pointer hover:bg-primary/10 transition-colors"
                          >
                            Upload your first image
                          </label>
                        </div>
                      }
                    >
                      {images()?.map((img) => (
                        <div
                          class={`relative group p-2 rounded hover:bg-primary/10 transition-colors ${
                            imageUrl() === img.url
                              ? "bg-primary/20 ring-2 ring-primary"
                              : ""
                          }`}
                        >
                          <button
                            type="button"
                            onClick={() => handleImageSelect(img.url)}
                            class="w-full"
                          >
                            <img
                              src={img.url}
                              alt={img.name}
                              class="w-full aspect-square object-cover rounded"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src =
                                  'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100"><rect width="100%" height="100%" fill="%23eee"/><text x="50%" y="50%" font-family="Arial" font-size="14" fill="%23999" text-anchor="middle" dy=".3em">Error</text></svg>';
                              }}
                            />
                            <div class="mt-1 px-1">
                              <p class="text-xs text-primary line-clamp-2 text-left">
                                {img.name}
                              </p>
                            </div>
                          </button>
                          <button
                            type="button"
                            onClick={() => handleImageDelete(img.id)}
                            class="absolute top-1 right-1 w-6 h-6 flex items-center justify-center bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600 z-10"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </Show>
                  </Show>
                </div>

                <div>
                  <label class="block text-primary mb-2">
                    Or Enter Image URL
                  </label>
                  <input
                    type="text"
                    value={imageUrl()}
                    onInput={(e) => handleUrlInput(e.currentTarget.value)}
                    class="w-full p-2 bg-background-light border border-primary text-primary rounded"
                    placeholder="Enter image URL"
                  />
                </div>
              </div>

              <div>
                <label class="block text-primary mb-2">Size</label>
                <select
                  value={imageSize()}
                  onChange={(e) => setImageSize(e.currentTarget.value)}
                  class="w-full p-2 bg-background-light border border-primary text-primary rounded"
                >
                  <option value="small">Small</option>
                  <option value="medium">Medium</option>
                  <option value="large">Large</option>
                  <option value="full">Full Width</option>
                </select>
              </div>

              <div class="flex gap-4 mt-6">
                <button
                  type="submit"
                  class="flex-1 py-2 bg-primary text-background rounded hover:bg-primary-dark"
                >
                  Insert
                </button>
                <button
                  type="button"
                  onClick={() => setShowImageModal(false)}
                  class="flex-1 py-2 border border-primary text-primary rounded hover:bg-primary hover:text-background"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </Show>

        <Show when={showImageEditModal()}>
          <div class="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
            <form
              onSubmit={handleImageEdit}
              class="bg-background p-6 rounded-lg shadow-xl max-w-md w-full space-y-4"
            >
              <h2 class="text-2xl text-primary font-headline font-semibold mb-4">
                Edit Image
              </h2>

              <div>
                <label class="block text-primary mb-2">Size</label>
                <select
                  value={imageSize()}
                  onChange={(e) => {
                    setImageSize(e.currentTarget.value);
                    const img = selectedImage();
                    if (img) {
                      setImageAlignment(
                        getDefaultAlignment(img, e.currentTarget.value)
                      );
                    }
                  }}
                  class="w-full p-2 bg-background-light border border-primary text-primary rounded"
                >
                  <option value="small">Small (25%)</option>
                  <option value="medium">Medium (50%)</option>
                  <option value="large">Large (75%)</option>
                  <option value="full">Full Width</option>
                </select>
              </div>

              <div>
                <label class="block text-primary mb-2">Alignment</label>
                <select
                  value={imageAlignment()}
                  onChange={(e) =>
                    setImageAlignment(e.currentTarget.value as any)
                  }
                  class="w-full p-2 bg-background-light border border-primary text-primary rounded"
                >
                  <option value="left">Float Left</option>
                  <option value="center">Center</option>
                  <option value="right">Float Right</option>
                </select>
              </div>

              <div>
                <label class="block text-primary mb-2">Caption</label>
                <input
                  type="text"
                  value={imageCaption()}
                  onInput={(e) => setImageCaption(e.currentTarget.value)}
                  placeholder="Optional image caption"
                  class="w-full p-2 bg-background-light border border-primary text-primary rounded"
                />
              </div>

              <div class="flex gap-4 mt-6">
                <button
                  type="submit"
                  class="flex-1 py-2 bg-primary text-background rounded hover:bg-primary-dark"
                >
                  Update
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowImageEditModal(false);
                    setSelectedImage(null);
                    setImageCaption("");
                  }}
                  class="flex-1 py-2 border border-primary text-primary rounded hover:bg-primary hover:text-background"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </Show>

        <div class="px-8 py-12">
          <input
            type="text"
            value={title()}
            onInput={(e) => setTitle(e.currentTarget.value)}
            class="w-full mb-8 bg-transparent text-4xl text-primary font-headline font-semibold focus:outline-none break-words whitespace-normal"
            required
            placeholder="Post Title"
          />

          <div id="editor" ref={ref} />
        </div>

        <button
          type="button"
          onClick={() => setShowSubmitModal(true)}
          class="fixed bottom-8 right-8 px-6 py-2 bg-primary text-background rounded-full hover:bg-primary-dark transition-colors shadow-lg"
        >
          Submit Post
        </button>

        <Show when={showSubmitModal()}>
          <div class="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
            <form
              onSubmit={handleSubmit}
              class="bg-background p-6 rounded-lg shadow-xl max-w-md w-full space-y-4"
            >
              <h2 class="text-2xl text-primary font-headline font-semibold mb-4">
                Submit Post
              </h2>

              <div>
                <label class="block text-primary mb-2">URL Slug</label>
                <input
                  type="text"
                  value={slug()}
                  onInput={(e) => setSlug(e.currentTarget.value)}
                  class="w-full p-2 bg-background-light border border-primary text-primary rounded"
                  required
                  placeholder="url-friendly-post-name"
                />
              </div>

              <div>
                <label class="block text-primary mb-2">Publish Date</label>
                <input
                  type="date"
                  value={date()}
                  onInput={(e) => setDate(e.currentTarget.value)}
                  class="w-full p-2 bg-background-light border border-primary text-primary rounded"
                  required
                />
              </div>

              <div class="flex gap-4 mt-6">
                <button
                  type="submit"
                  class="flex-1 py-2 bg-primary text-background rounded hover:bg-primary-dark transition-colors"
                >
                  Publish
                </button>
                <button
                  type="button"
                  onClick={() => setShowSubmitModal(false)}
                  class="flex-1 py-2 border border-primary text-primary rounded hover:bg-primary hover:text-background transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </Show>
      </div>
    </div>
  );
}
