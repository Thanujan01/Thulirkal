import { Navbar } from "@/components/Navbar";
import { slideImages } from "@/data/slideImages";

const SlideView = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <section className="mx-auto max-w-7xl px-1 py-1 md:px-1 md:py-1">
        <div className="mb-2 md:mb-2">
          <h1 className="text-3xl md:text-4xl font-serif font-bold mb-2">
            Slide Images
          </h1>
          <p className="text-sm md:text-base text-muted-foreground">
            All images listed here are used in the homepage slide view. To change the slideshow,
            update the list in <code>src/data/slideImages.ts</code>.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-1 md:gap-2 lg:gap-2">
          {slideImages.map((image, index) => (
            <div
              key={`${image.src}-${index}`}
              className="rounded-lg overflow-hidden border border-border bg-card shadow-sm flex flex-col"
            >
              <div className="aspect-[16/9] w-full">
                <img
                  src={image.src}
                  alt={image.alt}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-3">
                <p className="text-xs text-muted-foreground break-all mb-1">
                  {image.src}
                </p>
                <p className="text-sm font-medium">{image.alt}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default SlideView;


