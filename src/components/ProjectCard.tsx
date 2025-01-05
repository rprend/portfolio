import { Component, Show, createSignal } from "solid-js";

interface ProjectCardProps {
  title: string;
  description: string;
  href: string;
  date: string;
  images?: string[];
}

const ProjectCard: Component<ProjectCardProps> = (parentProps) => {
  const [isModalOpen, setIsModalOpen] = createSignal(false);
  const [currentImageIndex, setCurrentImageIndex] = createSignal(0);

  const handleImageClick = (e: MouseEvent) => {
    e.preventDefault();
    setIsModalOpen(true);
  };

  const nextImage = (e: MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev + 1) % parentProps.images!.length);
  };

  const prevImage = (e: MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentImageIndex(
      (prev) =>
        (prev - 1 + parentProps.images!.length) % parentProps.images!.length
    );
  };

  const NavigationArrows = (props: { isModal?: boolean }) => (
    <Show when={parentProps.images?.length > 1}>
      <button
        onClick={prevImage}
        class={`absolute left-2 top-1/2 -translate-y-1/2
          bg-background/60 hover:bg-background/90
          text-primary/80 hover:text-primary
          rounded-full transition-all duration-300 ease-in-out
          backdrop-blur-sm
          ${props.isModal ? "text-3xl p-3" : "text-lg p-2"}`}
        aria-label="Previous image"
      >
        ←
      </button>
      <button
        onClick={nextImage}
        class={`absolute right-2 top-1/2 -translate-y-1/2
          bg-background/60 hover:bg-background/90
          text-primary/80 hover:text-primary
          rounded-full transition-all duration-300 ease-in-out
          backdrop-blur-sm
          ${props.isModal ? "text-3xl p-3" : "text-lg p-2"}`}
        aria-label="Next image"
      >
        →
      </button>
    </Show>
  );

  return (
    <>
      <a
        href={parentProps.href}
        class="group relative p-4 md:p-8 h-full flex flex-col md:flex-row block hover:cursor-pointer"
      >
        <div class="absolute inset-0 bg-primary/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

        {/* Title and Description Column */}
        <div class="relative w-full md:w-1/2 md:pr-8 flex flex-col">
          <h3 class="text-lg md:text-xl text-primary font-headline font-medium mb-4 md:mb-6">
            {parentProps.title}
          </h3>
          <div class="flex flex-col h-full">
            <div>
              <p class="text-primary/80 text-sm md:text-base mb-2">
                {parentProps.description}
              </p>
              <div class="flex items-center gap-2">
                <span class="text-primary/60 text-sm">{parentProps.date}</span>
                <span class="text-primary/60 opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:translate-x-1">
                  →
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Image Gallery Column */}
        <Show when={parentProps.images?.length}>
          <div class="relative w-full md:w-1/2 mt-4 md:mt-0">
            <div
              class="relative aspect-[3/2] h-full cursor-zoom-in group/gallery"
              onClick={handleImageClick}
            >
              <img
                src={parentProps.images![currentImageIndex()]}
                alt={`${parentProps.title} - Image ${currentImageIndex() + 1}`}
                class="w-full h-full object-cover"
              />
              <div class="absolute inset-0 opacity-0 group-hover/gallery:opacity-100 transition-opacity">
                <NavigationArrows />
              </div>
              <Show when={parentProps.images!.length > 1}>
                <div class="absolute bottom-2 right-2 bg-background/80 px-2 py-1 rounded text-xs text-primary">
                  {currentImageIndex() + 1} / {parentProps.images!.length}
                </div>
              </Show>
            </div>
          </div>
        </Show>
      </a>

      {/* Image Modal */}
      <Show when={isModalOpen() && parentProps.images?.length}>
        <div
          class="fixed inset-0 bg-background/95 z-50 flex items-center justify-center p-12 cursor-zoom-out"
          onClick={() => setIsModalOpen(false)}
        >
          <div class="relative max-h-[80vh] max-w-[80vw] flex items-center justify-center">
            <NavigationArrows isModal={true} />
            <img
              src={parentProps.images![currentImageIndex()]}
              alt={`${parentProps.title} - Image ${currentImageIndex() + 1}`}
              class="max-h-full max-w-full object-contain"
            />
          </div>
        </div>
      </Show>
    </>
  );
};

export default ProjectCard;
