import { useNavigate } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import { Scissors, Image as ImageIcon, Gem, Palette, Flower, Shirt, Gift, Heart, User, Sparkles } from "lucide-react";
import { CATEGORIES } from "@/config/constants";

// Configuration - Manually adjustable settings
// Use specific units (px, rem) for smooth fine-tuning
const CONFIG = {
    SCROLL_SPEED: "40s",      // Time for one complete loop
    CARD_WIDTH: "68px",      // Width of category panels (e.g., "115px" for small change)
    CARD_HEIGHT: "55px",     // Height of category panels
    GAP: "3px",               // Horizontal spacing (px)
    ICON_SIZE: "20px",        // Size of icons (width and height)
    TEXT_SIZE: "8px",        // Font size of category name
    PADDING_X: "0px",         // Horizontal padding inside card
    PADDING_Y: "0px",         // Vertical padding inside card
    SECTION_PADDING_TOP: "5px",    // Padding above carousel
    SECTION_PADDING_BOTTOM: "5px", // Padding below carousel
};

export const CategoryCarousel = () => {
    const navigate = useNavigate();
    const containerRef = useRef<HTMLDivElement>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [startX, setStartX] = useState(0);
    const [scrollLeft, setScrollLeft] = useState(0);

    const categories = [
        {
            name: CATEGORIES.HAND_CRAFTS.title,
            path: `/category/${CATEGORIES.HAND_CRAFTS.slug}`,
            icon: Scissors,
            color: "bg-orange-100 text-orange-600 border-orange-200",
            darkColor: "dark:bg-orange-900/20 dark:text-orange-400 dark:border-orange-800",
        },
        {
            name: CATEGORIES.PHOTO_FRAMES.title,
            path: `/category/${CATEGORIES.PHOTO_FRAMES.slug}`,
            icon: ImageIcon,
            color: "bg-blue-100 text-blue-600 border-blue-200",
            darkColor: "dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800",
        },
        {
            name: CATEGORIES.JEWELRIES.title,
            path: `/category/${CATEGORIES.JEWELRIES.slug}`,
            icon: Gem,
            color: "bg-pink-100 text-pink-600 border-pink-200",
            darkColor: "dark:bg-pink-900/20 dark:text-pink-400 dark:border-pink-800",
        },
        {
            name: CATEGORIES.RESIN_ARTS.title,
            path: `/category/${CATEGORIES.RESIN_ARTS.slug}`,
            icon: Palette,
            color: "bg-purple-100 text-purple-600 border-purple-200",
            darkColor: "dark:bg-purple-900/20 dark:text-purple-400 dark:border-purple-800",
        },
        {
            name: CATEGORIES.FLOWER_VASES.title,
            path: `/category/${CATEGORIES.FLOWER_VASES.slug}`,
            icon: Flower,
            color: "bg-green-100 text-green-600 border-green-200",
            darkColor: "dark:bg-green-900/20 dark:text-green-400 dark:border-green-800",
        },
        {
            name: CATEGORIES.CLOTHS.title,
            path: `/category/${CATEGORIES.CLOTHS.slug}`,
            icon: Shirt,
            color: "bg-cyan-100 text-cyan-600 border-cyan-200",
            darkColor: "dark:bg-cyan-900/20 dark:text-cyan-400 dark:border-cyan-800",
        },
        {
            name: "Wedding Gifts",
            path: "/?q=wedding",
            icon: Sparkles,
            color: "bg-amber-100 text-amber-600 border-amber-200",
            darkColor: "dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-800",
        },
        {
            name: "Birthday Gift",
            path: "/?q=birthday",
            icon: Gift,
            color: "bg-indigo-100 text-indigo-600 border-indigo-200",
            darkColor: "dark:bg-indigo-900/20 dark:text-indigo-400 dark:border-indigo-800",
        },
        {
            name: "Anniversary Gifts",
            path: "/?q=anniversary",
            icon: Gift,
            color: "bg-rose-100 text-rose-600 border-rose-200",
            darkColor: "dark:bg-rose-900/20 dark:text-rose-400 dark:border-rose-800",
        },
        {
            name: "Love",
            path: "/?q=love",
            icon: Heart,
            color: "bg-red-100 text-red-600 border-red-200",
            darkColor: "dark:bg-red-900/20 dark:text-red-400 dark:border-red-800",
        },
        {
            name: "Girls",
            path: "/?q=girl",
            icon: User,
            color: "bg-pink-100 text-pink-500 border-pink-200",
            darkColor: "dark:bg-pink-900/20 dark:text-pink-400 dark:border-pink-800",
        },
        {
            name: "Boys",
            path: "/?q=boy",
            icon: User,
            color: "bg-blue-100 text-blue-500 border-blue-200",
            darkColor: "dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800",
        },
    ];

    // Auto-scroll resume timeout
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);
    const [isAutoScrollPaused, setIsAutoScrollPaused] = useState(false);

    // Clear timeout and reset auto-scroll after 3 seconds of inactivity
    const resetAutoScroll = () => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }
        setIsAutoScrollPaused(true);

        timeoutRef.current = setTimeout(() => {
            setIsAutoScrollPaused(false);
            setIsDragging(false);
        }, 3000); // 3 seconds
    };

    // Clean up timeout on unmount
    useEffect(() => {
        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, []);

    // Mouse drag handlers
    const handleMouseDown = (e: React.MouseEvent) => {
        if (!containerRef.current) return;
        setIsDragging(true);
        setStartX(e.pageX - containerRef.current.offsetLeft);
        setScrollLeft(containerRef.current.scrollLeft);
        resetAutoScroll();
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!isDragging || !containerRef.current) return;
        e.preventDefault();
        const x = e.pageX - containerRef.current.offsetLeft;
        const walk = (x - startX) * 0.8; // Reduced scroll speed multiplier (was 2)
        containerRef.current.scrollLeft = scrollLeft - walk;
    };

    const handleMouseUp = () => {
        setIsDragging(false);
        resetAutoScroll();
    };

    const handleMouseLeave = () => {
        if (isDragging) {
            setIsDragging(false);
            resetAutoScroll();
        }
    };

    // Touch handlers for mobile
    const handleTouchStart = (e: React.TouchEvent) => {
        if (!containerRef.current) return;
        setIsDragging(true);
        setStartX(e.touches[0].pageX - containerRef.current.offsetLeft);
        setScrollLeft(containerRef.current.scrollLeft);
        resetAutoScroll();
    };

    const handleTouchMove = (e: React.TouchEvent) => {
        if (!isDragging || !containerRef.current) return;
        const x = e.touches[0].pageX - containerRef.current.offsetLeft;
        const walk = (x - startX) * 0.8; // Reduced scroll speed multiplier (was 2)
        containerRef.current.scrollLeft = scrollLeft - walk;
    };

    const handleTouchEnd = () => {
        setIsDragging(false);
        resetAutoScroll();
    };

    return (
        <section
            className="w-full overflow-hidden bg-background border-b border-border"
            style={{
                paddingTop: CONFIG.SECTION_PADDING_TOP,
                paddingBottom: CONFIG.SECTION_PADDING_BOTTOM
            }}
        >
            <div
                ref={containerRef}
                className="relative w-full overflow-x-auto scrollbar-hide cursor-grab active:cursor-grabbing"
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseLeave}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
                style={{ scrollBehavior: isDragging ? 'auto' : 'smooth' }}
            >
                <div
                    className={`flex w-max ${!isDragging && !isAutoScrollPaused ? 'animate-scroll' : ''}`}
                    style={{ animationDuration: CONFIG.SCROLL_SPEED }}
                >
                    {/* Double the list to create seamless infinite scroll loop */}
                    {[...categories, ...categories].map((category, index) => (
                        <div
                            key={`${category.name}-${index}`}
                            onClick={(e) => {
                                // Only navigate if not dragging
                                if (!isDragging) {
                                    navigate(category.path);
                                }
                            }}
                            className={`
                                flex flex-col items-center justify-center
                                rounded-2xl cursor-pointer category-card-shine
                                border transition-all duration-300 transform hover:scale-105
                                ${category.color} ${category.darkColor}
                            `}
                            style={{
                                width: CONFIG.CARD_WIDTH,
                                height: CONFIG.CARD_HEIGHT,
                                marginLeft: CONFIG.GAP,
                                marginRight: CONFIG.GAP,
                                paddingLeft: CONFIG.PADDING_X,
                                paddingRight: CONFIG.PADDING_X,
                                paddingTop: CONFIG.PADDING_Y,
                                paddingBottom: CONFIG.PADDING_Y,
                            }}
                        >
                            <category.icon
                                className="mb-2"
                                strokeWidth={1.5}
                                style={{ width: CONFIG.ICON_SIZE, height: CONFIG.ICON_SIZE }}
                            />
                            <span
                                className="font-semibold text-center leading-tight px-1"
                                style={{ fontSize: CONFIG.TEXT_SIZE }}
                            >
                                {category.name}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

