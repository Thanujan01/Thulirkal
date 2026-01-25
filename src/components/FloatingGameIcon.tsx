import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Gamepad2 } from "lucide-react";

export const FloatingGameIcon = () => {
    const navigate = useNavigate();
    const [position, setPosition] = useState({ x: window.innerWidth - 80, y: window.innerHeight / 2 });
    const [isDragging, setIsDragging] = useState(false);
    const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
    const iconRef = useRef<HTMLDivElement>(null);

    const handleMouseDown = (e: React.MouseEvent) => {
        setIsDragging(true);
        if (iconRef.current) {
            const rect = iconRef.current.getBoundingClientRect();
            setDragOffset({
                x: e.clientX - rect.left,
                y: e.clientY - rect.top,
            });
        }
    };

    const handleTouchStart = (e: React.TouchEvent) => {
        setIsDragging(true);
        if (iconRef.current && e.touches[0]) {
            const rect = iconRef.current.getBoundingClientRect();
            setDragOffset({
                x: e.touches[0].clientX - rect.left,
                y: e.touches[0].clientY - rect.top,
            });
        }
    };

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            if (isDragging) {
                const newX = e.clientX - dragOffset.x;
                const newY = e.clientY - dragOffset.y;

                // Clamp to window bounds (64 is approx width/height of icon)
                const clampedX = Math.min(Math.max(0, newX), window.innerWidth - 64);
                const clampedY = Math.min(Math.max(0, newY), window.innerHeight - 64);

                setPosition({
                    x: clampedX,
                    y: clampedY,
                });
            }
        };

        const handleTouchMove = (e: TouchEvent) => {
            if (isDragging && e.touches[0]) {
                e.preventDefault(); // Prevent scrolling while dragging
                const newX = e.touches[0].clientX - dragOffset.x;
                const newY = e.touches[0].clientY - dragOffset.y;

                // Clamp to window bounds
                const clampedX = Math.min(Math.max(0, newX), window.innerWidth - 64);
                const clampedY = Math.min(Math.max(0, newY), window.innerHeight - 64);

                setPosition({
                    x: clampedX,
                    y: clampedY,
                });
            }
        };

        const handleMouseUp = () => {
            setIsDragging(false);
        };

        if (isDragging) {
            window.addEventListener("mousemove", handleMouseMove);
            window.addEventListener("mouseup", handleMouseUp);
            window.addEventListener("touchmove", handleTouchMove, { passive: false });
            window.addEventListener("touchend", handleMouseUp);
        }

        return () => {
            window.removeEventListener("mousemove", handleMouseMove);
            window.removeEventListener("mouseup", handleMouseUp);
            window.removeEventListener("touchmove", handleTouchMove);
            window.removeEventListener("touchend", handleMouseUp);
        };
    }, [isDragging, dragOffset]);

    const handleClick = (e: React.MouseEvent) => {
        if (!isDragging) {
            navigate("/games");
        }
    };

    return (
        <div
            ref={iconRef}
            style={{
                position: "fixed",
                left: `${position.x}px`,
                top: `${position.y}px`,
                zIndex: 9999,
                cursor: isDragging ? "grabbing" : "grab",
                touchAction: "none",
            }}
            onMouseDown={handleMouseDown}
            onTouchStart={handleTouchStart}
            onClick={handleClick}
            className="group flex flex-col items-center justify-center p-2 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 shadow-lg hover:shadow-xl transform hover:scale-105 transition-transform duration-200 w-16 h-16"
        >
            <Gamepad2 className="text-white w-8 h-8 animate-pulse" />
            <span className="text-[10px] font-bold text-white mt-1 leading-none">PLAY</span>
        </div>
    );
};
