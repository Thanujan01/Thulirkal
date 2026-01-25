import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Button } from "@/components/ui/button";
import { ArrowLeft, Play, RotateCcw, Crown, Zap, Star } from "lucide-react";

interface GameProps {
    onBack: () => void;
}

const GRID_SIZE = 20;
const INITIAL_SPEED = 150;

// Calculate responsive canvas size
const getCanvasSize = () => {
    const maxSize = 400;
    const minSize = 280;
    const viewportWidth = typeof window !== 'undefined' ? window.innerWidth : maxSize;
    const viewportHeight = typeof window !== 'undefined' ? window.innerHeight : maxSize;

    // Leave space for controls and UI on mobile
    const availableWidth = Math.min(viewportWidth - 40, maxSize);
    const availableHeight = Math.min(viewportHeight - 300, maxSize);

    return Math.max(Math.min(availableWidth, availableHeight), minSize);
};

const CANVAS_SIZE = getCanvasSize();
const CELL_SIZE = CANVAS_SIZE / GRID_SIZE;

interface Position {
    x: number;
    y: number;
}

interface Particle {
    x: number;
    y: number;
    vx: number;
    vy: number;
    life: number;
    color: string;
    size: number;
}

export const SnakeGame: React.FC<GameProps> = ({ onBack }) => {
    const [gameState, setGameState] = useState<'start' | 'playing' | 'paused' | 'gameOver'>('start');
    const [score, setScore] = useState(0);
    const [highScore, setHighScore] = useState(0);
    const [canvasSize, setCanvasSize] = useState(CANVAS_SIZE);

    const canvasRef = useRef<HTMLCanvasElement>(null);
    const snakeRef = useRef<Position[]>([{ x: 10, y: 10 }]);
    const directionRef = useRef<Position>({ x: 1, y: 0 });
    const nextDirectionRef = useRef<Position>({ x: 1, y: 0 });
    const foodRef = useRef<Position>({ x: 5, y: 5 });
    const particlesRef = useRef<Particle[]>([]);
    const gameLoopRef = useRef<NodeJS.Timeout>();
    const animationFrameRef = useRef<number>();

    // Load high score and handle resize
    useEffect(() => {
        const saved = localStorage.getItem('snakeHighScore');
        if (saved) setHighScore(parseInt(saved, 10));

        // Prevent body scroll on mobile
        document.body.style.overflow = 'hidden';
        document.body.style.position = 'fixed';
        document.body.style.width = '100%';
        document.body.style.height = '100%';

        const handleResize = () => {
            setCanvasSize(getCanvasSize());
        };

        window.addEventListener('resize', handleResize);

        return () => {
            document.body.style.overflow = '';
            document.body.style.position = '';
            document.body.style.width = '';
            document.body.style.height = '';
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    // Update high score
    useEffect(() => {
        if (score > highScore) {
            setHighScore(score);
            localStorage.setItem('snakeHighScore', score.toString());
        }
    }, [score, highScore]);

    const createParticles = useCallback((x: number, y: number, count: number, colors: string[]) => {
        const newParticles = Array.from({ length: count }, () => ({
            x,
            y,
            vx: (Math.random() - 0.5) * 6,
            vy: (Math.random() - 0.5) * 6 - 2,
            life: 1,
            color: colors[Math.floor(Math.random() * colors.length)],
            size: Math.random() * 4 + 2
        }));
        particlesRef.current.push(...newParticles);
    }, []);

    const spawnFood = useCallback((snake: Position[]): Position => {
        let newFood: Position;
        do {
            newFood = {
                x: Math.floor(Math.random() * GRID_SIZE),
                y: Math.floor(Math.random() * GRID_SIZE)
            };
        } while (snake.some(seg => seg.x === newFood.x && seg.y === newFood.y));

        // Create spawn particles
        createParticles(
            (newFood.x + 0.5) * CELL_SIZE,
            (newFood.y + 0.5) * CELL_SIZE,
            6,
            ['#FF6B6B', '#FFE66D', '#4ECDC4']
        );

        return newFood;
    }, [createParticles]);

    const checkCollision = useCallback((head: Position, snake: Position[]): boolean => {
        // Wall collision
        if (head.x < 0 || head.x >= GRID_SIZE || head.y < 0 || head.y >= GRID_SIZE) {
            return true;
        }
        // Self collision
        return snake.some(seg => seg.x === head.x && seg.y === head.y);
    }, []);

    const moveSnake = useCallback(() => {
        if (gameState !== 'playing') return;

        directionRef.current = nextDirectionRef.current;
        const head = snakeRef.current[0];
        const newHead = {
            x: head.x + directionRef.current.x,
            y: head.y + directionRef.current.y
        };

        // Check collision
        if (checkCollision(newHead, snakeRef.current)) {
            setGameState('gameOver');
            createParticles(
                (head.x + 0.5) * CELL_SIZE,
                (head.y + 0.5) * CELL_SIZE,
                30,
                ['#FF6B6B', '#FF8E53', '#FE6B8B']
            );
            return;
        }

        const newSnake = [newHead, ...snakeRef.current];

        // Check food collision
        if (newHead.x === foodRef.current.x && newHead.y === foodRef.current.y) {
            setScore(s => s + 10);
            foodRef.current = spawnFood(newSnake);

            // Food eaten particles
            createParticles(
                (newHead.x + 0.5) * CELL_SIZE,
                (newHead.y + 0.5) * CELL_SIZE,
                8,
                ['#4ECDC4', '#44E5A4', '#95E1D3']
            );
        } else {
            newSnake.pop();
        }

        snakeRef.current = newSnake;
    }, [gameState, checkCollision, spawnFood, createParticles]);

    const handleKeyPress = useCallback((e: KeyboardEvent) => {
        if (gameState !== 'playing') return;

        const key = e.key;
        const dir = directionRef.current;

        switch (key) {
            case 'ArrowUp':
            case 'w':
                if (dir.y === 0) nextDirectionRef.current = { x: 0, y: -1 };
                break;
            case 'ArrowDown':
            case 's':
                if (dir.y === 0) nextDirectionRef.current = { x: 0, y: 1 };
                break;
            case 'ArrowLeft':
            case 'a':
                if (dir.x === 0) nextDirectionRef.current = { x: -1, y: 0 };
                break;
            case 'ArrowRight':
            case 'd':
                if (dir.x === 0) nextDirectionRef.current = { x: 1, y: 0 };
                break;
            case ' ':
                e.preventDefault();
                setGameState(prev => prev === 'playing' ? 'paused' : 'playing');
                break;
        }
    }, [gameState]);

    useEffect(() => {
        window.addEventListener('keydown', handleKeyPress);
        return () => window.removeEventListener('keydown', handleKeyPress);
    }, [handleKeyPress]);

    // Game loop
    useEffect(() => {
        if (gameState === 'playing') {
            const speed = Math.max(50, INITIAL_SPEED - Math.floor(score / 50) * 10);
            gameLoopRef.current = setInterval(moveSnake, speed);
        } else {
            if (gameLoopRef.current) clearInterval(gameLoopRef.current);
        }

        return () => {
            if (gameLoopRef.current) clearInterval(gameLoopRef.current);
        };
    }, [gameState, score, moveSnake]);

    // Animation loop for particles
    useEffect(() => {
        let lastTime = 0;

        const animate = (timestamp: number) => {
            const deltaTime = timestamp - lastTime;
            lastTime = timestamp;

            // Update particles
            particlesRef.current = particlesRef.current
                .map(p => ({
                    ...p,
                    x: p.x + p.vx,
                    y: p.y + p.vy,
                    vy: p.vy + 0.2,
                    life: p.life - 0.03
                }))
                .filter(p => p.life > 0);

            draw();
            animationFrameRef.current = requestAnimationFrame(animate);
        };

        animationFrameRef.current = requestAnimationFrame(animate);

        return () => {
            if (animationFrameRef.current) {
                cancelAnimationFrame(animationFrameRef.current);
            }
        };
    }, []);

    const draw = useCallback(() => {
        const canvas = canvasRef.current;
        const ctx = canvas?.getContext('2d');
        if (!ctx || !canvas) return;

        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Gradient background
        const gradient = ctx.createRadialGradient(
            CANVAS_SIZE / 2, CANVAS_SIZE / 2, 0,
            CANVAS_SIZE / 2, CANVAS_SIZE / 2, CANVAS_SIZE / 1.5
        );
        gradient.addColorStop(0, '#1a1a2e');
        gradient.addColorStop(1, '#0f0f1e');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Grid with glow effect
        ctx.strokeStyle = 'rgba(78, 205, 196, 0.1)';
        ctx.lineWidth = 1;
        for (let i = 0; i <= GRID_SIZE; i++) {
            const pos = i * CELL_SIZE;
            ctx.beginPath();
            ctx.moveTo(pos, 0);
            ctx.lineTo(pos, canvas.height);
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(0, pos);
            ctx.lineTo(canvas.width, pos);
            ctx.stroke();
        }

        // Draw particles
        particlesRef.current.forEach(p => {
            ctx.save();
            ctx.globalAlpha = p.life;
            ctx.fillStyle = p.color;
            ctx.shadowBlur = 10;
            ctx.shadowColor = p.color;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
        });

        // Draw food with pulsing effect
        const foodX = (foodRef.current.x + 0.5) * CELL_SIZE;
        const foodY = (foodRef.current.y + 0.5) * CELL_SIZE;
        const pulse = Math.sin(Date.now() / 200) * 2 + 8;

        ctx.save();
        ctx.shadowBlur = 20;
        ctx.shadowColor = '#FFE66D';

        // Outer glow
        const foodGradient = ctx.createRadialGradient(foodX, foodY, 0, foodX, foodY, pulse);
        foodGradient.addColorStop(0, '#FFE66D');
        foodGradient.addColorStop(0.5, '#FF6B6B');
        foodGradient.addColorStop(1, 'rgba(255, 107, 107, 0)');
        ctx.fillStyle = foodGradient;
        ctx.beginPath();
        ctx.arc(foodX, foodY, pulse, 0, Math.PI * 2);
        ctx.fill();

        // Inner food
        ctx.fillStyle = '#FF6B6B';
        ctx.beginPath();
        ctx.arc(foodX, foodY, 6, 0, Math.PI * 2);
        ctx.fill();

        // Highlight
        ctx.fillStyle = '#FFE66D';
        ctx.beginPath();
        ctx.arc(foodX - 2, foodY - 2, 2, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();

        // Draw snake with gradient and glow
        snakeRef.current.forEach((segment, index) => {
            const x = segment.x * CELL_SIZE;
            const y = segment.y * CELL_SIZE;
            const isHead = index === 0;

            ctx.save();

            if (isHead) {
                // Head with strong glow
                ctx.shadowBlur = 20;
                ctx.shadowColor = '#4ECDC4';

                const headGradient = ctx.createRadialGradient(
                    x + CELL_SIZE / 2, y + CELL_SIZE / 2, 0,
                    x + CELL_SIZE / 2, y + CELL_SIZE / 2, CELL_SIZE / 2
                );
                headGradient.addColorStop(0, '#95E1D3');
                headGradient.addColorStop(1, '#4ECDC4');
                ctx.fillStyle = headGradient;

                ctx.beginPath();
                ctx.roundRect(x + 2, y + 2, CELL_SIZE - 4, CELL_SIZE - 4, 6);
                ctx.fill();

                // Eyes
                const eyeOffset = 4;
                ctx.fillStyle = '#1a1a2e';
                ctx.beginPath();
                ctx.arc(x + eyeOffset, y + eyeOffset, 2, 0, Math.PI * 2);
                ctx.fill();
                ctx.beginPath();
                ctx.arc(x + CELL_SIZE - eyeOffset, y + eyeOffset, 2, 0, Math.PI * 2);
                ctx.fill();
            } else {
                // Body segments with gradient
                const intensity = 1 - (index / snakeRef.current.length) * 0.5;
                const bodyGradient = ctx.createRadialGradient(
                    x + CELL_SIZE / 2, y + CELL_SIZE / 2, 0,
                    x + CELL_SIZE / 2, y + CELL_SIZE / 2, CELL_SIZE / 2
                );
                bodyGradient.addColorStop(0, `rgba(68, 229, 164, ${intensity})`);
                bodyGradient.addColorStop(1, `rgba(78, 205, 196, ${intensity * 0.7})`);
                ctx.fillStyle = bodyGradient;

                ctx.shadowBlur = 10;
                ctx.shadowColor = '#4ECDC4';

                ctx.beginPath();
                ctx.roundRect(x + 3, y + 3, CELL_SIZE - 6, CELL_SIZE - 6, 4);
                ctx.fill();
            }

            ctx.restore();
        });
    }, []);

    const startGame = useCallback(() => {
        setGameState('playing');
        setScore(0);
        snakeRef.current = [{ x: 10, y: 10 }];
        directionRef.current = { x: 1, y: 0 };
        nextDirectionRef.current = { x: 1, y: 0 };
        foodRef.current = spawnFood([{ x: 10, y: 10 }]);
        particlesRef.current = [];
    }, [spawnFood]);

    const handlePlayAgain = useCallback(() => {
        if (gameLoopRef.current) clearInterval(gameLoopRef.current);
        setTimeout(startGame, 100);
    }, [startGame]);

    return (
        <div className="fixed inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-slate-950 via-purple-950/20 to-slate-950 p-2 sm:p-4 overflow-hidden">

            {/* Animated background elements */}
            <div className="absolute inset-0 pointer-events-none">
                {Array.from({ length: 20 }).map((_, i) => (
                    <div
                        key={i}
                        className="absolute rounded-full"
                        style={{
                            background: `radial-gradient(circle, rgba(78, 205, 196, ${0.1 - i * 0.004}) 0%, transparent 70%)`,
                            left: `${(i * 17) % 100}%`,
                            top: `${(i * 23) % 100}%`,
                            width: `${100 + i * 20}px`,
                            height: `${100 + i * 20}px`,
                            animation: `float ${20 + i * 3}s ease-in-out infinite`,
                            animationDelay: `${i * 0.7}s`,
                        }}
                    />
                ))}
            </div>

            {/* Game container */}
            <div className="relative flex flex-col items-center w-full max-w-md">
                {/* Score display */}
                <div className="w-full flex justify-end items-center px-2 mb-3 gap-3">
                    <div className="flex items-center gap-2 bg-gradient-to-r from-cyan-500/20 to-cyan-500/10 backdrop-blur-md px-3 sm:px-4 py-2 rounded-xl border border-cyan-500/30">
                        <Zap className="w-4 h-4 sm:w-5 sm:h-5 text-cyan-400" />
                        <div>
                            <div className="text-cyan-400/70 text-[10px] sm:text-xs font-mono uppercase">Score</div>
                            <div className="text-white text-lg sm:text-xl font-bold font-mono">{score}</div>
                        </div>
                    </div>

                    {highScore > 0 && (
                        <div className="flex items-center gap-2 bg-gradient-to-l from-orange-500/20 to-orange-500/10 backdrop-blur-md px-3 sm:px-4 py-2 rounded-xl border border-orange-500/30">
                            <div className="text-right">
                                <div className="text-orange-400/70 text-[10px] sm:text-xs font-mono uppercase">Best</div>
                                <div className="text-orange-500 text-lg sm:text-xl font-bold font-mono">{highScore}</div>
                            </div>
                            <Crown className="w-4 h-4 sm:w-5 sm:h-5 text-orange-500" />
                        </div>
                    )}
                </div>

                {/* Back button */}
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={onBack}
                    className="absolute top-2 left-2 z-50 bg-slate-800/50 hover:bg-slate-700/50 text-cyan-400 backdrop-blur-md rounded-full border border-cyan-500/30"
                >
                    <ArrowLeft className="w-4 h-4" />
                </Button>

                {/* Canvas container */}
                <div className="relative bg-gradient-to-br from-slate-900/90 to-slate-800/90 p-2 sm:p-3 rounded-2xl sm:rounded-3xl border-2 border-cyan-500/30 shadow-[0_0_80px_rgba(78,205,196,0.3)] backdrop-blur-sm">
                    <canvas
                        ref={canvasRef}
                        width={canvasSize}
                        height={canvasSize}
                        className="rounded-xl sm:rounded-2xl w-full h-auto"
                        style={{ maxWidth: '100%', display: 'block' }}
                    />

                    {/* Start overlay */}
                    {gameState === 'start' && (
                        <div className="absolute inset-0 bg-gradient-to-b from-black/90 via-black/70 to-transparent backdrop-blur-sm rounded-3xl flex items-center justify-center">
                            <div className="text-center space-y-6">
                                <div className="relative">
                                    <h1 className="text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-500 animate-pulse">
                                        SNAKE
                                    </h1>
                                    <div className="absolute -inset-4 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 blur-2xl -z-10" />
                                </div>

                                <Button
                                    onClick={startGame}
                                    size="lg"
                                    className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold px-12 py-6 text-xl rounded-2xl shadow-[0_0_40px_rgba(78,205,196,0.6)] border-2 border-cyan-300/50 group"
                                >
                                    <Play className="mr-3 h-6 w-6 fill-current" />
                                    START GAME
                                </Button>

                                <div className="text-cyan-400/70 text-sm">
                                    Use arrow keys or WASD to move
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Pause overlay */}
                    {gameState === 'paused' && (
                        <div className="absolute inset-0 bg-black/60 backdrop-blur-md rounded-3xl flex items-center justify-center">
                            <div className="text-center space-y-4">
                                <h2 className="text-5xl font-black text-cyan-400 animate-pulse">PAUSED</h2>
                                <p className="text-cyan-300/70">Press SPACE to continue</p>
                            </div>
                        </div>
                    )}

                    {/* Game over overlay */}
                    {gameState === 'gameOver' && (
                        <div className="absolute inset-0 bg-gradient-to-b from-black/95 via-black/80 to-black/95 backdrop-blur-sm rounded-3xl flex items-center justify-center">
                            <div className="text-center space-y-6">
                                {/* Celebration stars */}
                                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                                    {Array.from({ length: 50 }).map((_, i) => (
                                        <Star
                                            key={i}
                                            className="absolute text-yellow-400 opacity-70"
                                            style={{
                                                left: `${Math.random() * 100}%`,
                                                top: `${Math.random() * 100}%`,
                                                width: `${Math.random() * 16 + 8}px`,
                                                height: `${Math.random() * 16 + 8}px`,
                                                animation: `twinkle ${1 + Math.random() * 2}s ease-in-out infinite`,
                                                animationDelay: `${Math.random() * 2}s`,
                                            }}
                                        />
                                    ))}
                                </div>

                                <h2 className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-orange-500 to-yellow-500">
                                    GAME OVER
                                </h2>

                                <div className="flex gap-4 justify-center">
                                    <div className="bg-gradient-to-br from-cyan-500/20 to-blue-500/20 backdrop-blur-md px-8 py-4 rounded-2xl border border-cyan-500/30">
                                        <div className="text-cyan-400/70 text-sm uppercase">Score</div>
                                        <div className="text-white text-4xl font-bold font-mono">{score}</div>
                                    </div>

                                    <div className="bg-gradient-to-br from-yellow-500/20 to-orange-500/20 backdrop-blur-md px-8 py-4 rounded-2xl border border-yellow-500/30">
                                        <div className="text-yellow-400/70 text-sm uppercase">Best</div>
                                        <div className="text-yellow-400 text-4xl font-bold font-mono">{highScore}</div>
                                    </div>
                                </div>

                                <Button
                                    onClick={handlePlayAgain}
                                    size="lg"
                                    className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-400 hover:to-emerald-500 text-white font-bold px-12 py-6 text-xl rounded-2xl shadow-[0_0_40px_rgba(34,197,94,0.6)] border-2 border-green-300/50 group mt-4"
                                >
                                    <RotateCcw className="mr-3 h-6 w-6 group-hover:rotate-180 transition-transform duration-500" />
                                    PLAY AGAIN
                                </Button>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Mobile controls */}
            <div className="mt-4 grid grid-cols-3 gap-2 sm:gap-3">
                <div />
                <Button
                    variant="outline"
                    className="w-14 h-14 sm:w-16 sm:h-16 bg-slate-800/50 hover:bg-slate-700/50 border-cyan-500/30 text-cyan-400 text-xl"
                    onClick={() => {
                        if (directionRef.current.y === 0) nextDirectionRef.current = { x: 0, y: -1 };
                    }}
                >
                    ↑
                </Button>
                <div />

                <Button
                    variant="outline"
                    className="w-14 h-14 sm:w-16 sm:h-16 bg-slate-800/50 hover:bg-slate-700/50 border-cyan-500/30 text-cyan-400 text-xl"
                    onClick={() => {
                        if (directionRef.current.x === 0) nextDirectionRef.current = { x: -1, y: 0 };
                    }}
                >
                    ←
                </Button>
                <Button
                    variant="outline"
                    className="w-14 h-14 sm:w-16 sm:h-16 bg-slate-800/50 hover:bg-slate-700/50 border-cyan-500/30 text-cyan-400 text-xl"
                    onClick={() => {
                        if (directionRef.current.y === 0) nextDirectionRef.current = { x: 0, y: 1 };
                    }}
                >
                    ↓
                </Button>
                <Button
                    variant="outline"
                    className="w-14 h-14 sm:w-16 sm:h-16 bg-slate-800/50 hover:bg-slate-700/50 border-cyan-500/30 text-cyan-400 text-xl"
                    onClick={() => {
                        if (directionRef.current.x === 0) nextDirectionRef.current = { x: 1, y: 0 };
                    }}
                >
                    →
                </Button>
            </div>

            {/* Animations */}
            <style>{`
                @keyframes float {
                    0%, 100% { transform: translate(0, 0) scale(1); }
                    50% { transform: translate(-20px, -20px) scale(1.1); }
                }
                
                @keyframes twinkle {
                    0%, 100% { opacity: 0.3; transform: scale(1); }
                    50% { opacity: 1; transform: scale(1.5); }
                }
            `}</style>
        </div>
    );
};
