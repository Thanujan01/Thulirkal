import React, { useState } from 'react';
import { Navbar } from "@/components/Navbar";
import { FlappyBird } from "@/components/games/FlappyBird";
import { SnakeGame } from "@/components/games/SnakeGame";

import { Button } from "@/components/ui/button";
import { Play } from "lucide-react";

const GamesPage = () => {
    const [activeGame, setActiveGame] = useState<'none' | 'flappy' | 'snake'>('none');

    return (
        <div className="min-h-screen bg-background">
            <Navbar />
            <div className="container mx-auto py-8 px-4">

                {activeGame === 'none' && (
                    <div className="animate-in fade-in zoom-in duration-500">
                        <h1 className="text-4xl font-bold text-center mb-8 text-primary">Game Zone</h1>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
                            {/* Flappy Bird Card */}
                            <div className="group relative overflow-hidden rounded-2xl border bg-card text-card-foreground shadow-sm hover:shadow-xl transition-all duration-300">
                                <div className="absolute inset-0 bg-gradient-to-br from-sky-400 to-blue-600 opacity-10 group-hover:opacity-20 transition-opacity" />
                                <div className="p-6 flex flex-col items-center text-center h-full">
                                    <div className="w-24 h-24 mb-6 rounded-full bg-sky-100 flex items-center justify-center text-4xl shadow-inner">
                                        🐦
                                    </div>
                                    <h3 className="text-2xl font-bold mb-2">Flappy Thulir</h3>
                                    <p className="text-muted-foreground mb-6 flex-grow">
                                        Navigate the bird through the pipes. A classic challenge of timing and precision!
                                    </p>
                                    <Button
                                        size="lg"
                                        className="w-full bg-sky-500 hover:bg-sky-600 text-white font-bold py-6 text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all"
                                        onClick={() => setActiveGame('flappy')}
                                    >
                                        <Play className="mr-2 h-6 w-6 fill-current" /> Play Now
                                    </Button>
                                </div>
                            </div>

                            {/* Snake Game Card */}
                            <div className="group relative overflow-hidden rounded-2xl border bg-card text-card-foreground shadow-sm hover:shadow-xl transition-all duration-300">
                                <div className="absolute inset-0 bg-gradient-to-br from-green-400 to-emerald-600 opacity-10 group-hover:opacity-20 transition-opacity" />
                                <div className="p-6 flex flex-col items-center text-center h-full">
                                    <div className="w-24 h-24 mb-6 rounded-full bg-green-100 flex items-center justify-center text-4xl shadow-inner">
                                        🐍
                                    </div>
                                    <h3 className="text-2xl font-bold mb-2">Neon Snake</h3>
                                    <p className="text-muted-foreground mb-6 flex-grow">
                                        Collect food and grow longer. Don't hit the walls or yourself!
                                    </p>
                                    <Button
                                        size="lg"
                                        className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-6 text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all"
                                        onClick={() => setActiveGame('snake')}
                                    >
                                        <Play className="mr-2 h-6 w-6 fill-current" /> Play Now
                                    </Button>
                                </div>
                            </div>

                        </div>
                    </div>
                )}

                {activeGame === 'flappy' && (
                    <div className="animate-in slide-in-from-right duration-500">
                        <FlappyBird onBack={() => setActiveGame('none')} />
                    </div>
                )}

                {activeGame === 'snake' && (
                    <div className="animate-in slide-in-from-right duration-500">
                        <SnakeGame onBack={() => setActiveGame('none')} />
                    </div>
                )}



            </div>
        </div>
    );
};

export default GamesPage;
