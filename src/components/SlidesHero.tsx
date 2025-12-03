import { useEffect, useState } from "react";
import { slideImages } from "@/data/slideImages";

export const SlidesHero = () => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (slideImages.length <= 1) return;

    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % slideImages.length);
    }, 1500); // change slide every 1.5 seconds

    return () => clearInterval(interval);
  }, []);

  if (slideImages.length === 0) {
    return null;
  }

  return (
    <section className="relative bg-gradient-to-br from-primary/10 via-secondary/10 to-accent/10 py-6 md:py-10">
      <div className="container mx-auto px-4">
        <div className="w-full max-w-4xl mx-auto">
          <div className="aspect-[16/9] rounded-xl overflow-hidden bg-card border border-border shadow-card">
            <div
              className="flex w-full h-full transition-transform duration-700 ease-in-out"
              style={{ transform: `translateX(-${index * 100}%)` }}
            >
              {slideImages.map((image, i) => (
                <div key={i} className="w-full h-full flex-shrink-0">
                  <img
                    src={image.src}
                    alt={image.alt}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

