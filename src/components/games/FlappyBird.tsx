import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Button } from "@/components/ui/button";
import { ArrowLeft, Play, RefreshCw, Volume2, VolumeX, Pause } from "lucide-react";

// --- Types ---
interface GameProps {
    onBack: () => void;
}

interface Pipe {
    x: number;
    height: number;
    passed: boolean;
    id: number;
    variant: number;
}

interface Particle {
    x: number;
    y: number;
    vx: number;
    vy: number;
    life: number;
    id: number;
    color: string;
    size: number;
    type: 'dust' | 'feather' | 'sparkle' | 'star';
}

interface BackgroundEntity {
    x: number;
    y: number;
    type: 'cloud' | 'bird' | 'camel' | 'elephant' | 'poodle' | 'llama' | 'lizard' | 'toucan' | 'cactus' | 'tree' | 'lamp' | 'palm' | 'rock';
    speed: number;
    scale: number;
    id: number;
    frame: number;
}

interface ThemeColors {
    skyTop: string;
    skyBottom: string;
    sunColor: string;
    landmarkLight: string;
    landmarkDark: string;
    groundTop: string;
    groundStripe: string;
    pipeColor: string;
    pipeDark: string;
    starOpacity: number;
    celestialBody: 'sun' | 'moon';
    atmosphere: string;
    sunSize: number;
}

// --- Constants ---
const GRAVITY = 0.5;
const JUMP_STRENGTH = -7.5;
const PIPE_SPEED = 3.2;
const PIPE_SPAWN_RATE = 1500;
const BIRD_SIZE = 42;
const GAP_SIZE = 170;

const POINTS_PER_PHASE = 25;
const POINTS_PER_LOCATION = 100;

// --- Theme Definitions ---
const THEMES: Record<number, ThemeColors> = {
    0: { // Morning
        skyTop: '#38bdf8', skyBottom: '#bae6fd',
        sunColor: '#fef9c3', landmarkLight: '#fcd34d', landmarkDark: '#d97706',
        groundTop: '#fbbf24', groundStripe: '#b45309',
        pipeColor: '#fde68a', pipeDark: '#d97706',
        starOpacity: 0, celestialBody: 'sun', atmosphere: 'rgba(253, 224, 71, 0.2)', sunSize: 35
    },
    1: { // Lunch
        skyTop: '#0ea5e9', skyBottom: '#e0f2fe',
        sunColor: '#ffffff', landmarkLight: '#fde68a', landmarkDark: '#b45309',
        groundTop: '#f59e0b', groundStripe: '#92400e',
        pipeColor: '#fef3c7', pipeDark: '#b45309',
        starOpacity: 0, celestialBody: 'sun', atmosphere: 'rgba(255, 255, 255, 0.4)', sunSize: 40
    },
    2: { // Evening
        skyTop: '#4c0519', skyBottom: '#fb923c',
        sunColor: '#ef4444', landmarkLight: '#c2410c', landmarkDark: '#450a0a',
        groundTop: '#ea580c', groundStripe: '#7c2d12',
        pipeColor: '#fdba74', pipeDark: '#9a3412',
        starOpacity: 0.1, celestialBody: 'sun', atmosphere: 'rgba(239, 68, 68, 0.3)', sunSize: 45
    },
    3: { // Night
        skyTop: '#020617', skyBottom: '#1e1b4b',
        sunColor: '#94a3b8', landmarkLight: '#475569', landmarkDark: '#0f172a',
        groundTop: '#1e293b', groundStripe: '#020617',
        pipeColor: '#64748b', pipeDark: '#1e293b',
        starOpacity: 0.8, celestialBody: 'moon', atmosphere: 'rgba(99, 102, 241, 0.05)', sunSize: 25
    },
    4: { // Full Moon
        skyTop: '#0f172a', skyBottom: '#312e81',
        sunColor: '#f8fafc', landmarkLight: '#94a3b8', landmarkDark: '#1e293b',
        groundTop: '#334155', groundStripe: '#0f172a',
        pipeColor: '#cbd5e1', pipeDark: '#334155',
        starOpacity: 1, celestialBody: 'moon', atmosphere: 'rgba(199, 210, 254, 0.3)', sunSize: 60
    }
};

const lerpColor = (a: string, b: string, t: number) => {
    const ah = parseInt(a.replace('#', ''), 16);
    const ar = (ah >> 16) & 0xff, ag = (ah >> 8) & 0xff, ab = ah & 0xff;
    const bh = parseInt(b.replace('#', ''), 16);
    const br = (bh >> 16) & 0xff, bg = (bh >> 8) & 0xff, bb = bh & 0xff;
    const rr = ar + (br - ar) * t;
    const rg = ag + (bg - ag) * t;
    const rb = ab + (bb - ab) * t;
    return `rgb(${Math.round(rr)},${Math.round(rg)},${Math.round(rb)})`;
};
const lerp = (start: number, end: number, t: number) => start * (1 - t) + end * t;

export const FlappyBird: React.FC<GameProps> = ({ onBack }) => {
    // Added 'PAUSED' state
    const [gameState, setGameState] = useState<'START' | 'PLAYING' | 'GAMEOVER' | 'PAUSED'>('START');
    const [score, setScore] = useState(0);
    const [highScore, setHighScore] = useState(0);
    const [isMuted, setIsMuted] = useState(false);
    const [countdown, setCountdown] = useState<number | null>(null); // New Countdown State

    const audioCtxRef = useRef<AudioContext | null>(null);

    const birdY = useRef(250);
    const birdVelocity = useRef(0);
    const birdRotation = useRef(0);
    const pipes = useRef<Pipe[]>([]);
    const particles = useRef<Particle[]>([]);
    const bgEntities = useRef<BackgroundEntity[]>([]);
    const bgOffsetFar = useRef(0);
    const groundOffset = useRef(0);
    const scoreRef = useRef(0);
    const lastPipeTime = useRef<number>(0);
    const shakeIntensity = useRef(0);
    const flashIntensity = useRef(0);

    const canvasRef = useRef<HTMLCanvasElement>(null);
    const requestRef = useRef<number>();
    const lastTimeRef = useRef<number>(0);

    // --- Audio System ---
    const initAudio = () => {
        if (!audioCtxRef.current) {
            const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
            if (AudioContext) {
                audioCtxRef.current = new AudioContext();
            }
        }
        if (audioCtxRef.current && audioCtxRef.current.state === 'suspended') {
            audioCtxRef.current.resume().catch(e => console.log("Audio resume failed", e));
        }
    };

    const playSound = useCallback((type: 'jump' | 'score' | 'crash' | 'click' | 'countdown') => {
        if (isMuted || !audioCtxRef.current) return;

        const ctx = audioCtxRef.current;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.connect(gain);
        gain.connect(ctx.destination);

        const now = ctx.currentTime;

        if (type === 'jump') {
            osc.type = 'square';
            osc.frequency.setValueAtTime(150, now);
            osc.frequency.exponentialRampToValueAtTime(600, now + 0.1);
            gain.gain.setValueAtTime(0.05, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);
            osc.start(now);
            osc.stop(now + 0.1);
        } else if (type === 'score') {
            osc.type = 'sine';
            osc.frequency.setValueAtTime(800, now);
            osc.frequency.setValueAtTime(1200, now + 0.05);
            gain.gain.setValueAtTime(0.03, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);
            osc.start(now);
            osc.stop(now + 0.4);
        } else if (type === 'crash') {
            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(150, now);
            osc.frequency.exponentialRampToValueAtTime(40, now + 0.3);
            gain.gain.setValueAtTime(0.1, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
            osc.start(now);
            osc.stop(now + 0.3);
        } else if (type === 'click') {
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(400, now);
            gain.gain.setValueAtTime(0.02, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
            osc.start(now);
            osc.stop(now + 0.05);
        } else if (type === 'countdown') {
            osc.type = 'sine';
            osc.frequency.setValueAtTime(600, now);
            gain.gain.setValueAtTime(0.05, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);
            osc.start(now);
            osc.stop(now + 0.1);
        }
    }, [isMuted]);

    useEffect(() => {
        const saved = localStorage.getItem('flappyHighScore');
        if (saved) setHighScore(parseInt(saved, 10));
    }, []);

    const toggleMute = (e: React.MouseEvent | React.TouchEvent) => {
        e.stopPropagation();
        initAudio();
        setIsMuted(prev => !prev);
        if (isMuted) playSound('click');
    };

    const resetGame = useCallback(() => {
        setGameState('START');
        setScore(0);
        birdY.current = 250;
        birdVelocity.current = 0;
        birdRotation.current = 0;
        pipes.current = [];
        particles.current = [];
        bgEntities.current = [];
        scoreRef.current = 0;
        shakeIntensity.current = 0;
        flashIntensity.current = 0;
    }, []);

    const startGame = useCallback(() => {
        initAudio();
        resetGame();
        setGameState('PLAYING');
        if (!isMuted) playSound('click');
        lastPipeTime.current = performance.now();
        lastTimeRef.current = performance.now(); // Reset time to prevent jumps
        birdVelocity.current = JUMP_STRENGTH;
    }, [resetGame, isMuted, playSound]);

    // --- Pause / Resume Logic ---
    const pauseGame = (e: React.MouseEvent | React.TouchEvent) => {
        e.stopPropagation();
        if (gameState === 'PLAYING') {
            setGameState('PAUSED');
            playSound('click');
        }
    };

    const triggerResume = (e: React.MouseEvent | React.TouchEvent) => {
        e.stopPropagation();
        initAudio(); // Ensure audio is active
        playSound('click');
        setCountdown(3); // Start countdown
    };

    // Countdown Effect
    useEffect(() => {
        if (countdown === null) return;

        if (countdown > 0) {
            playSound('countdown');
            const timer = setTimeout(() => {
                setCountdown(prev => (prev !== null ? prev - 1 : null));
            }, 1000);
            return () => clearTimeout(timer);
        } else {
            // Countdown finished, resume game
            setGameState('PLAYING');
            setCountdown(null);
            // CRITICAL: Reset lastTimeRef so the game doesn't calculate 
            // the delta time based on how long we were paused (avoids teleporting)
            lastTimeRef.current = performance.now();
            // Also adjust pipe spawn timer so we don't spawn 10 pipes instantly
            lastPipeTime.current = performance.now() - (lastPipeTime.current % PIPE_SPAWN_RATE);
        }
    }, [countdown, playSound]);

    const jump = useCallback(() => {
        if (audioCtxRef.current?.state === 'suspended') audioCtxRef.current.resume();

        // Block jumping if paused or counting down
        if (gameState !== 'PLAYING' || countdown !== null) return;

        birdVelocity.current = JUMP_STRENGTH;
        playSound('jump');
        createParticles(60, birdY.current + BIRD_SIZE, 3, 'dust', 'rgba(255,255,255,0.3)');
    }, [gameState, playSound, countdown]);

    const createParticles = (x: number, y: number, count: number, type: Particle['type'], color?: string) => {
        for (let i = 0; i < count; i++) {
            particles.current.push({
                x, y,
                vx: (Math.random() - 0.5) * 12,
                vy: (Math.random() - 0.5) * 12,
                life: 1.0,
                id: Math.random(),
                size: Math.random() * 5 + 2,
                color: color || '#fff',
                type
            });
        }
    };

    // --- Entity Spawning & Theme Logic (Same as before) ---
    const spawnBgEntity = (width: number, height: number, locationIndex: number) => {
        const rand = Math.random();
        const groundY = height - 40;

        if (rand < 0.002) {
            bgEntities.current.push({
                x: width + 100, y: Math.random() * 150, type: 'cloud', speed: 0.5,
                scale: 0.5 + Math.random() * 0.5, id: Math.random(), frame: 0
            });
            return;
        }

        if (rand < 0.005) {
            let entityType: BackgroundEntity['type'] = 'camel';
            if (locationIndex === 0) entityType = 'bird';
            if (locationIndex === 1) entityType = 'lizard';
            if (locationIndex === 2) entityType = 'poodle';
            if (locationIndex === 3) entityType = 'elephant';
            if (locationIndex === 4) entityType = 'toucan';
            if (locationIndex >= 5) entityType = 'llama';

            const yPos = (entityType === 'toucan' || entityType === 'bird') ? Math.random() * (height / 2) : groundY - 25;
            const speed = (entityType === 'toucan' || entityType === 'bird') ? 2.5 : 1.5;

            bgEntities.current.push({
                x: width + 50, y: yPos, type: entityType, speed: speed,
                scale: 0.8 + Math.random() * 0.4, id: Math.random(), frame: 0
            });
        }
        else if (rand < 0.03) {
            let type: BackgroundEntity['type'] = 'cactus';
            if (locationIndex === 1) type = 'cactus';
            if (locationIndex === 2) type = 'lamp';
            if (locationIndex === 3) type = 'tree';
            if (locationIndex === 4) type = 'palm';
            if (locationIndex >= 5) type = 'rock';

            bgEntities.current.push({
                x: width + 50, y: groundY, type: type, speed: PIPE_SPEED * 0.5,
                scale: 0.7 + Math.random() * 0.6, id: Math.random(), frame: 0
            });
        }
    };

    const getCurrentTheme = (currentScore: number) => {
        const locationIndex = Math.min(5, Math.floor(currentScore / POINTS_PER_LOCATION));
        const scoreInCycle = currentScore % POINTS_PER_LOCATION;
        const phaseIndex = Math.min(3, Math.floor(scoreInCycle / POINTS_PER_PHASE));
        const progress = (scoreInCycle % POINTS_PER_PHASE) / POINTS_PER_PHASE;

        const currentThemeId = phaseIndex;
        const nextThemeId = phaseIndex + 1;

        const t1 = THEMES[currentThemeId];
        const t2 = THEMES[nextThemeId];

        return {
            theme: {
                skyTop: lerpColor(t1.skyTop, t2.skyTop, progress),
                skyBottom: lerpColor(t1.skyBottom, t2.skyBottom, progress),
                sunColor: lerpColor(t1.sunColor, t2.sunColor, progress),
                landmarkLight: lerpColor(t1.landmarkLight, t2.landmarkLight, progress),
                landmarkDark: lerpColor(t1.landmarkDark, t2.landmarkDark, progress),
                groundTop: lerpColor(t1.groundTop, t2.groundTop, progress),
                groundStripe: lerpColor(t1.groundStripe, t2.groundStripe, progress),
                pipeColor: lerpColor(t1.pipeColor, t2.pipeColor, progress),
                pipeDark: lerpColor(t1.pipeDark, t2.pipeDark, progress),
                starOpacity: lerp(t1.starOpacity, t2.starOpacity, progress),
                celestialBody: t1.celestialBody,
                atmosphere: t1.atmosphere,
                sunSize: lerp(t1.sunSize, t2.sunSize, progress)
            },
            locationIndex
        };
    };

    // --- Rendering Functions (Same as before) ---
    const drawBackground = (ctx: CanvasRenderingContext2D, width: number, height: number, theme: ThemeColors, locationIndex: number) => {
        const gradient = ctx.createLinearGradient(0, 0, 0, height);
        gradient.addColorStop(0, theme.skyTop);
        gradient.addColorStop(1, theme.skyBottom);
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, width, height);

        if (theme.starOpacity > 0.05) {
            ctx.fillStyle = `rgba(255, 255, 255, ${theme.starOpacity})`;
            for (let i = 0; i < 40; i++) {
                const x = (i * 113) % width;
                const y = (i * 47) % (height / 2);
                ctx.beginPath(); ctx.arc(x, y, Math.random() * 1.5, 0, Math.PI * 2); ctx.fill();
            }
        }

        const sunX = width - 80;
        const sunY = 100;
        const glow = ctx.createRadialGradient(sunX, sunY, theme.sunSize, sunX, sunY, theme.sunSize * 4);
        glow.addColorStop(0, theme.atmosphere);
        glow.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = glow;
        ctx.fillRect(sunX - 200, sunY - 200, 400, 400);

        ctx.fillStyle = theme.sunColor;
        ctx.shadowColor = theme.sunColor;
        ctx.shadowBlur = theme.celestialBody === 'sun' ? 50 : 20;
        ctx.beginPath(); ctx.arc(sunX, sunY, theme.sunSize, 0, Math.PI * 2); ctx.fill();
        ctx.shadowBlur = 0;

        const groundY = height - 40;
        ctx.save();
        const pyOffset = bgOffsetFar.current * 0.5;

        // Landmarks logic (Condensed for brevity)
        const drawPyramid = (x: number, scale: number) => {
            const w = 300 * scale; const h = 200 * scale;
            const drawX = (x - pyOffset) % (width + 500); const actualX = drawX < -300 ? drawX + width + 500 : drawX;
            const pGrad = ctx.createLinearGradient(actualX, groundY - h, actualX, groundY);
            pGrad.addColorStop(0, theme.landmarkLight); pGrad.addColorStop(1, theme.landmarkDark);
            ctx.fillStyle = pGrad;
            ctx.beginPath(); ctx.moveTo(actualX, groundY); ctx.lineTo(actualX + w / 2, groundY - h); ctx.lineTo(actualX + w / 2, groundY); ctx.fill();
            ctx.fillStyle = theme.landmarkDark;
            ctx.beginPath(); ctx.moveTo(actualX + w / 2, groundY); ctx.lineTo(actualX + w / 2, groundY - h); ctx.lineTo(actualX + w, groundY); ctx.fill();
        };
        const drawChichenItza = (x: number, scale: number) => {
            const w = 250 * scale; const h = 150 * scale;
            const drawX = (x - pyOffset) % (width + 500); const actualX = drawX < -300 ? drawX + width + 500 : drawX;
            const cx = actualX + w / 2;
            ctx.fillStyle = theme.landmarkDark;
            ctx.beginPath(); ctx.moveTo(cx - w / 2, groundY); ctx.lineTo(cx - w / 4, groundY - h); ctx.lineTo(cx + w / 4, groundY - h); ctx.lineTo(cx + w / 2, groundY); ctx.fill();
            ctx.fillStyle = theme.landmarkLight;
            ctx.beginPath(); ctx.moveTo(cx - w / 8, groundY); ctx.lineTo(cx - w / 12, groundY - h); ctx.lineTo(cx + w / 12, groundY - h); ctx.lineTo(cx + w / 8, groundY); ctx.fill();
            ctx.fillStyle = theme.landmarkDark;
            ctx.fillRect(cx - w / 6, groundY - h - (h * 0.2), w / 3, h * 0.2);
        };
        const drawEiffel = (x: number, scale: number) => {
            const w = 150 * scale; const h = 300 * scale;
            const drawX = (x - pyOffset) % (width + 500); const actualX = drawX < -300 ? drawX + width + 500 : drawX;
            const cx = actualX + w / 2;
            ctx.fillStyle = theme.landmarkDark;
            ctx.beginPath(); ctx.moveTo(cx - w / 2, groundY); ctx.quadraticCurveTo(cx - w / 4, groundY - h / 2, cx, groundY - h); ctx.lineTo(cx + w / 2, groundY); ctx.quadraticCurveTo(cx + w / 4, groundY - h / 2, cx, groundY - h); ctx.fill();
            ctx.fillStyle = theme.skyBottom;
            ctx.beginPath(); ctx.moveTo(cx - w / 3, groundY); ctx.quadraticCurveTo(cx, groundY - h / 4, cx + w / 3, groundY); ctx.fill();
            ctx.fillStyle = theme.landmarkLight;
            ctx.fillRect(cx - w / 4, groundY - h * 0.3, w / 2, 5); ctx.fillRect(cx - w / 6, groundY - h * 0.6, w / 3, 5);
        };
        const drawTajMahal = (x: number, scale: number) => {
            const w = 240 * scale; const h = 180 * scale;
            const drawX = (x - pyOffset) % (width + 500); const actualX = drawX < -300 ? drawX + width + 500 : drawX;
            const cx = actualX + w / 2;
            ctx.fillStyle = theme.landmarkLight;
            ctx.beginPath(); ctx.arc(cx, groundY - h * 0.8, h * 0.35, Math.PI, 0); ctx.fill();
            ctx.beginPath(); ctx.moveTo(cx, groundY - h * 0.8 - h * 0.35); ctx.lineTo(cx, groundY - h * 1.1); ctx.stroke();
            ctx.fillRect(cx - w * 0.25, groundY - h * 0.6, w * 0.5, h * 0.6);
            ctx.fillStyle = theme.landmarkDark;
            ctx.beginPath(); ctx.arc(cx, groundY, w * 0.1, Math.PI, 0); ctx.fill();
            ctx.fillStyle = theme.landmarkLight;
            ctx.fillRect(cx - w * 0.4, groundY - h * 0.7, w * 0.05, h * 0.7); ctx.fillRect(cx + w * 0.35, groundY - h * 0.7, w * 0.05, h * 0.7);
        };
        const drawChristRedeemer = (x: number, scale: number) => {
            const w = 180 * scale; const h = 250 * scale;
            const drawX = (x - pyOffset) % (width + 500); const actualX = drawX < -300 ? drawX + width + 500 : drawX;
            const cx = actualX + w / 2;
            ctx.fillStyle = theme.landmarkDark;
            ctx.beginPath(); ctx.moveTo(cx - w, groundY); ctx.quadraticCurveTo(cx, groundY - h * 0.8, cx + w, groundY); ctx.fill();
            ctx.fillStyle = theme.landmarkLight;
            ctx.fillRect(cx - w * 0.1, groundY - h, w * 0.2, h * 0.4);
            ctx.fillRect(cx - w * 0.4, groundY - h + (h * 0.1), w * 0.8, h * 0.05);
            ctx.beginPath(); ctx.arc(cx, groundY - h, w * 0.1, 0, Math.PI * 2); ctx.fill();
        };
        const drawMachuPicchu = (x: number, scale: number) => {
            const w = 400 * scale; const h = 250 * scale;
            const drawX = (x - pyOffset) % (width + 500); const actualX = drawX < -300 ? drawX + width + 500 : drawX;
            ctx.fillStyle = theme.landmarkDark;
            ctx.beginPath(); ctx.moveTo(actualX, groundY); ctx.lineTo(actualX + w * 0.2, groundY - h * 0.6); ctx.lineTo(actualX + w * 0.4, groundY - h * 0.3); ctx.lineTo(actualX + w * 0.6, groundY - h); ctx.lineTo(actualX + w * 0.8, groundY - h * 0.5); ctx.lineTo(actualX + w, groundY); ctx.fill();
            ctx.strokeStyle = theme.landmarkLight; ctx.lineWidth = 2;
            ctx.beginPath(); ctx.moveTo(actualX + w * 0.2, groundY - h * 0.4); ctx.lineTo(actualX + w * 0.8, groundY - h * 0.4); ctx.moveTo(actualX + w * 0.1, groundY - h * 0.2); ctx.lineTo(actualX + w * 0.9, groundY - h * 0.2); ctx.stroke();
        };

        if (locationIndex === 0) { drawPyramid(100, 0.8); drawPyramid(400, 1.2); drawPyramid(750, 0.9); }
        else if (locationIndex === 1) { drawChichenItza(150, 0.9); drawChichenItza(600, 1.1); }
        else if (locationIndex === 2) { drawEiffel(150, 0.6); drawEiffel(500, 0.9); drawEiffel(850, 0.7); }
        else if (locationIndex === 3) { drawTajMahal(100, 0.7); drawTajMahal(500, 1.0); }
        else if (locationIndex === 4) { drawChristRedeemer(200, 1.0); drawChristRedeemer(600, 0.8); }
        else if (locationIndex >= 5) { drawMachuPicchu(0, 1.0); drawMachuPicchu(500, 0.9); }

        ctx.restore();
    };

    const drawBgEntities = (ctx: CanvasRenderingContext2D, locationIndex: number) => {
        bgEntities.current.forEach(ent => {
            ctx.save();
            ctx.translate(ent.x, ent.y);
            ctx.scale(ent.scale, ent.scale);

            if (ent.type === 'cloud') {
                ctx.fillStyle = 'rgba(255,255,255,0.2)';
                ctx.beginPath(); ctx.arc(0, 0, 30, 0, Math.PI * 2); ctx.arc(25, -10, 35, 0, Math.PI * 2); ctx.arc(50, 0, 30, 0, Math.PI * 2); ctx.fill();
            }
            else {
                ctx.fillStyle = 'rgba(20, 15, 10, 0.8)';
                if (ent.type === 'camel') {
                    const bob = Math.sin(ent.frame) * 2; ctx.translate(0, bob);
                    ctx.beginPath(); ctx.ellipse(0, -20, 25, 15, 0, 0, Math.PI * 2); ctx.fill();
                    ctx.beginPath(); ctx.arc(0, -35, 10, 0, Math.PI, true); ctx.fill();
                    ctx.beginPath(); ctx.moveTo(20, -25); ctx.lineTo(35, -45); ctx.lineTo(45, -45); ctx.lineTo(20, -25); ctx.fill();
                    ctx.lineWidth = 4; ctx.strokeStyle = ctx.fillStyle;
                    const legSwing = Math.sin(ent.frame) * 10;
                    ctx.beginPath(); ctx.moveTo(-15, -10); ctx.lineTo(-15 + legSwing, 0); ctx.moveTo(15, -10); ctx.lineTo(15 - legSwing, 0); ctx.stroke();
                }
                else if (ent.type === 'lizard') {
                    const wig = Math.sin(ent.frame * 2) * 2; ctx.translate(0, wig);
                    ctx.beginPath(); ctx.ellipse(0, 0, 15, 4, 0, 0, Math.PI * 2); ctx.fill();
                    ctx.beginPath(); ctx.arc(15, -2, 4, 0, Math.PI * 2); ctx.fill();
                }
                else if (ent.type === 'elephant') {
                    const bob = Math.sin(ent.frame * 0.5) * 2; ctx.translate(0, bob);
                    ctx.beginPath(); ctx.ellipse(0, -20, 35, 25, 0, 0, Math.PI * 2); ctx.fill();
                    ctx.beginPath(); ctx.arc(30, -30, 15, 0, Math.PI * 2); ctx.fill();
                    ctx.beginPath(); ctx.moveTo(40, -25); ctx.quadraticCurveTo(50, -10, 45, 0); ctx.lineWidth = 6; ctx.strokeStyle = ctx.fillStyle; ctx.stroke();
                    ctx.fillStyle = 'rgba(20, 15, 10, 0.8)';
                    const legSwing = Math.sin(ent.frame * 0.5) * 5;
                    ctx.fillRect(-20 + legSwing, -10, 10, 15); ctx.fillRect(10 - legSwing, -10, 10, 15);
                }
                else if (ent.type === 'poodle') {
                    const jump = Math.abs(Math.sin(ent.frame * 3)) * -10; ctx.translate(0, jump);
                    ctx.beginPath(); ctx.arc(0, 0, 8, 0, Math.PI * 2); ctx.fill();
                    ctx.beginPath(); ctx.arc(0, -10, 6, 0, Math.PI * 2); ctx.fill();
                    ctx.beginPath(); ctx.arc(-10, 0, 6, 0, Math.PI * 2); ctx.fill();
                    ctx.fillStyle = ctx.fillStyle; ctx.fillRect(-10, 0, 4, 10); ctx.fillRect(5, 0, 4, 10);
                }
                else if (ent.type === 'llama') {
                    const bob = Math.sin(ent.frame) * 2; ctx.translate(0, bob);
                    ctx.beginPath(); ctx.ellipse(0, -20, 20, 12, 0, 0, Math.PI * 2); ctx.fill();
                    ctx.beginPath(); ctx.moveTo(15, -25); ctx.lineTo(20, -50); ctx.lineTo(25, -50); ctx.lineTo(20, -25); ctx.fill();
                    ctx.beginPath(); ctx.arc(22, -50, 5, 0, Math.PI * 2); ctx.fill();
                    ctx.lineWidth = 3; ctx.strokeStyle = ctx.fillStyle;
                    const legSwing = Math.sin(ent.frame) * 8;
                    ctx.beginPath(); ctx.moveTo(-10, -10); ctx.lineTo(-10 + legSwing, 0); ctx.moveTo(10, -10); ctx.lineTo(10 - legSwing, 0); ctx.stroke();
                }
                else if (ent.type === 'toucan') {
                    const flap = Math.sin(ent.frame * 0.5) * 10;
                    ctx.beginPath(); ctx.moveTo(-10, 0); ctx.quadraticCurveTo(0, flap - 5, 10, 0); ctx.quadraticCurveTo(0, 5, -10, 0); ctx.fill();
                    ctx.beginPath(); ctx.moveTo(5, -2); ctx.lineTo(20, 0); ctx.lineTo(5, 5); ctx.fill();
                }
                else if (ent.type === 'cactus') {
                    ctx.beginPath(); ctx.roundRect(-5, -40, 10, 40, 5); ctx.fill();
                    ctx.beginPath(); ctx.roundRect(-15, -30, 10, 10, 2); ctx.fill();
                }
                else if (ent.type === 'tree') {
                    ctx.beginPath(); ctx.rect(-5, -20, 10, 20); ctx.fill();
                    ctx.beginPath(); ctx.arc(0, -30, 20, 0, Math.PI * 2); ctx.fill();
                }
                else if (ent.type === 'lamp') {
                    ctx.fillRect(-2, -60, 4, 60);
                    ctx.beginPath(); ctx.arc(0, -60, 8, 0, Math.PI * 2); ctx.fill();
                }
                else if (ent.type === 'palm') {
                    ctx.beginPath(); ctx.moveTo(-2, 0); ctx.lineTo(-4, -50); ctx.lineTo(4, -50); ctx.lineTo(2, 0); ctx.fill();
                    ctx.beginPath(); ctx.arc(0, -50, 25, Math.PI, Math.PI * 2); ctx.fill();
                }
                else if (ent.type === 'rock') {
                    ctx.beginPath(); ctx.moveTo(-15, 0); ctx.lineTo(-5, -15); ctx.lineTo(5, -10); ctx.lineTo(15, 0); ctx.fill();
                }
            }
            ctx.restore();
        });
    };

    const drawAngryBird = (ctx: CanvasRenderingContext2D) => {
        ctx.save();
        const centerX = 50 + BIRD_SIZE / 2;
        const centerY = birdY.current + BIRD_SIZE / 2;

        ctx.translate(centerX, centerY);
        ctx.rotate(birdRotation.current);
        const flapState = Math.min(10, Math.max(-10, birdVelocity.current * 2));

        ctx.fillStyle = '#000000'; ctx.beginPath(); ctx.fillRect(-22, -5, 10, 10); ctx.fill();
        const grad = ctx.createRadialGradient(-5, -5, 5, 0, 0, 22);
        grad.addColorStop(0, '#ef4444'); grad.addColorStop(1, '#991b1b');
        ctx.fillStyle = grad; ctx.beginPath(); ctx.arc(0, 0, 22, 0, Math.PI * 2); ctx.fill();
        ctx.strokeStyle = '#450a0a'; ctx.lineWidth = 2; ctx.stroke();
        ctx.fillStyle = '#fee2e2'; ctx.beginPath(); ctx.ellipse(0, 12, 12, 8, 0, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = 'white'; ctx.beginPath(); ctx.arc(8, -2, 7, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
        ctx.beginPath(); ctx.arc(-2, -2, 7, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
        ctx.fillStyle = 'black'; ctx.beginPath(); ctx.arc(9, -2, 2.5, 0, Math.PI * 2); ctx.fill(); ctx.beginPath(); ctx.arc(-1, -2, 2.5, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = '#000000'; ctx.beginPath(); ctx.moveTo(4, -12); ctx.lineTo(18, -6); ctx.lineTo(18, -10); ctx.lineTo(4, -16); ctx.fill();
        ctx.beginPath(); ctx.moveTo(2, -12); ctx.lineTo(-12, -10); ctx.lineTo(-12, -14); ctx.lineTo(2, -16); ctx.fill();
        ctx.fillStyle = '#fbbf24'; ctx.beginPath(); ctx.moveTo(6, 2); ctx.lineTo(26, 6); ctx.lineTo(6, 10); ctx.fill(); ctx.stroke();
        ctx.fillStyle = '#d97706'; ctx.beginPath(); ctx.moveTo(8, 10); ctx.lineTo(22, 8); ctx.lineTo(8, 14); ctx.fill(); ctx.stroke();
        ctx.save(); ctx.rotate(flapState * 0.05); ctx.fillStyle = '#b91c1c'; ctx.beginPath(); ctx.moveTo(-10, 0); ctx.quadraticCurveTo(-5, -15, 10, -5); ctx.quadraticCurveTo(5, 10, -10, 0); ctx.fill(); ctx.strokeStyle = '#450a0a'; ctx.stroke(); ctx.restore();

        ctx.restore();
    };

    const drawPipes = (ctx: CanvasRenderingContext2D, pipe: Pipe, theme: ThemeColors) => {
        const w = 64;
        const drawColumn = (y: number, h: number, isTop: boolean) => {
            const grad = ctx.createLinearGradient(pipe.x, 0, pipe.x + w, 0);
            grad.addColorStop(0, theme.pipeDark);
            grad.addColorStop(0.2, theme.pipeColor);
            grad.addColorStop(0.5, theme.pipeColor);
            grad.addColorStop(0.8, theme.pipeDark);
            grad.addColorStop(1, '#000000');
            ctx.fillStyle = grad;
            ctx.fillRect(pipe.x, y, w, h);
            ctx.fillStyle = 'rgba(0,0,0,0.15)';
            ctx.fillRect(pipe.x + 10, y, 4, h); ctx.fillRect(pipe.x + 25, y, 4, h); ctx.fillRect(pipe.x + 40, y, 4, h); ctx.fillRect(pipe.x + 55, y, 4, h);
            const capH = 35;
            const capY = isTop ? y + h - capH : y;
            ctx.fillStyle = grad;
            ctx.beginPath(); ctx.rect(pipe.x - 6, capY, w + 12, capH); ctx.fill();
            ctx.fillStyle = theme.landmarkDark;
            ctx.fillRect(pipe.x - 4, capY + 5, w + 8, 4); ctx.fillRect(pipe.x - 4, capY + 25, w + 8, 4);
            ctx.strokeStyle = '#27272a'; ctx.lineWidth = 2; ctx.strokeRect(pipe.x - 6, capY, w + 12, capH);
        };
        drawColumn(0, pipe.height, true);
        drawColumn(pipe.height + GAP_SIZE, 600, false);
    };

    const drawGround = (ctx: CanvasRenderingContext2D, width: number, height: number, theme: ThemeColors) => {
        const floorY = height - 40;
        const grad = ctx.createLinearGradient(0, floorY, 0, height);
        grad.addColorStop(0, theme.groundTop);
        grad.addColorStop(1, theme.groundStripe);
        ctx.fillStyle = grad;
        ctx.fillRect(0, floorY, width, 40);
        ctx.fillStyle = 'rgba(0,0,0,0.15)';
        ctx.save();
        ctx.translate(-groundOffset.current, 0);
        for (let i = 0; i < width + 50; i += 30) {
            ctx.beginPath(); ctx.moveTo(i, floorY); ctx.lineTo(i + 15, height); ctx.lineTo(i + 30, floorY); ctx.fill();
        }
        ctx.restore();
        ctx.fillStyle = '#fef3c7'; ctx.fillRect(0, floorY, width, 4);
    };

    // --- Main Loop ---
    const update = (time: number) => {
        // If paused, just update lastTimeRef so when we resume we don't jump
        if (gameState === 'PAUSED' || countdown !== null) {
            lastTimeRef.current = time;
            requestRef.current = requestAnimationFrame(update);
            return;
        }

        const deltaTime = Math.min((time - lastTimeRef.current) / 16.6, 2);
        lastTimeRef.current = time;

        const canvas = canvasRef.current;
        const ctx = canvas?.getContext('2d');
        if (!canvas || !ctx) return;

        const { theme, locationIndex } = getCurrentTheme(scoreRef.current);

        if (gameState === 'PLAYING') {
            birdVelocity.current += GRAVITY * deltaTime;
            birdY.current += birdVelocity.current * deltaTime;

            const targetRotation = Math.min(Math.PI / 4, Math.max(-Math.PI / 3, (birdVelocity.current * 0.12)));
            birdRotation.current += (targetRotation - birdRotation.current) * 0.15;

            bgOffsetFar.current = (bgOffsetFar.current + (PIPE_SPEED * 0.1 * deltaTime));
            groundOffset.current = (groundOffset.current + (PIPE_SPEED * deltaTime)) % 30;

            spawnBgEntity(canvas.width, canvas.height, locationIndex);

            if (time - lastPipeTime.current > PIPE_SPAWN_RATE) {
                const minH = 80;
                const maxH = canvas.height - GAP_SIZE - 160;
                pipes.current.push({
                    x: canvas.width,
                    height: Math.random() * (maxH - minH) + minH,
                    passed: false,
                    id: Math.random(),
                    variant: Math.floor(Math.random() * 3)
                });
                lastPipeTime.current = time;
            }

            pipes.current.forEach(p => {
                p.x -= PIPE_SPEED * deltaTime;
                const bLeft = 58;
                const bRight = 50 + BIRD_SIZE - 8;
                const bTop = birdY.current + 8;
                const bBottom = birdY.current + BIRD_SIZE - 6;

                if (bRight > p.x && bLeft < p.x + 64) {
                    if (bTop < p.height || bBottom > p.height + GAP_SIZE) triggerGameOver();
                }

                if (!p.passed && p.x + 64 < 50) {
                    p.passed = true;
                    scoreRef.current += 1;
                    setScore(scoreRef.current);
                    playSound('score');
                    createParticles(p.x + 32, 200, 15, 'sparkle', '#fef08a');
                }
            });

            pipes.current = pipes.current.filter(p => p.x > -80);

            if (birdY.current + BIRD_SIZE >= canvas.height - 40 || birdY.current < -100) {
                triggerGameOver();
            }
        } else if (gameState === 'START') {
            birdY.current = 250 + Math.sin(time / 200) * 10;
            groundOffset.current = (groundOffset.current + (PIPE_SPEED * deltaTime)) % 30;
        }

        bgEntities.current.forEach(ent => {
            ent.x -= ent.speed * deltaTime;
            ent.frame += 0.2 * deltaTime;
        });
        bgEntities.current = bgEntities.current.filter(e => e.x > -100);

        particles.current.forEach(p => {
            p.x += p.vx * deltaTime;
            p.y += p.vy * deltaTime;
            p.life -= 0.02 * deltaTime;
            p.vy += 0.2 * deltaTime;
        });
        particles.current = particles.current.filter(p => p.life > 0);

        if (shakeIntensity.current > 0) shakeIntensity.current *= 0.9;
        if (flashIntensity.current > 0) flashIntensity.current -= 0.05;

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        ctx.save();
        if (shakeIntensity.current > 0.5) {
            ctx.translate((Math.random() - 0.5) * shakeIntensity.current, (Math.random() - 0.5) * shakeIntensity.current);
        }

        drawBackground(ctx, canvas.width, canvas.height, theme, locationIndex);
        drawBgEntities(ctx, locationIndex);
        pipes.current.forEach(p => drawPipes(ctx, p, theme));
        drawGround(ctx, canvas.width, canvas.height, theme);
        drawAngryBird(ctx);

        particles.current.forEach(p => {
            ctx.globalAlpha = p.life;
            ctx.fillStyle = p.color;
            ctx.beginPath(); ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2); ctx.fill();
        });
        ctx.globalAlpha = 1;

        if (flashIntensity.current > 0) {
            ctx.fillStyle = `rgba(255, 255, 255, ${flashIntensity.current})`;
            ctx.fillRect(0, 0, canvas.width, canvas.height);
        }

        ctx.restore();
        requestRef.current = requestAnimationFrame(update);
    };

    const triggerGameOver = () => {
        if (gameState === 'GAMEOVER') return;
        setGameState('GAMEOVER');
        playSound('crash');
        shakeIntensity.current = 25;
        flashIntensity.current = 0.8;
        createParticles(50, birdY.current, 30, 'feather', '#ef4444');
        if (scoreRef.current > highScore) {
            setHighScore(scoreRef.current);
            localStorage.setItem('flappyHighScore', scoreRef.current.toString());
        }
    };

    useEffect(() => {
        requestRef.current = requestAnimationFrame(update);
        return () => { if (requestRef.current) cancelAnimationFrame(requestRef.current); };
    }, [gameState, playSound, countdown]);

    useEffect(() => {
        const handler = (e: KeyboardEvent) => {
            if (e.code === 'Space') {
                e.preventDefault();
                if (gameState === 'START' || gameState === 'GAMEOVER') startGame();
                else if (gameState === 'PLAYING' && countdown === null) jump();
                else if (gameState === 'PLAYING' && countdown !== null) return; // Do nothing if counting down
            }
        };
        window.addEventListener('keydown', handler);
        return () => window.removeEventListener('keydown', handler);
    }, [gameState, jump, startGame, countdown]);

    return (
        <div className="flex flex-col items-center justify-center min-h-[90vh] w-full bg-slate-900 font-sans select-none p-4">
            <div
                className="relative rounded-2xl overflow-hidden shadow-2xl ring-8 ring-slate-800 cursor-pointer group"
                style={{ width: 400, height: 600 }}
                onMouseDown={(e) => { e.preventDefault(); if (gameState === 'PLAYING' && countdown === null) jump(); else if (gameState === 'START') startGame(); }}
                onTouchStart={(e) => { e.preventDefault(); if (gameState === 'PLAYING' && countdown === null) jump(); else if (gameState === 'START') startGame(); }}
            >
                <canvas ref={canvasRef} width={400} height={600} className="block w-full h-full" />

                <div className="absolute top-8 w-full flex flex-col items-center pointer-events-none z-20">
                    <span
                        className="text-8xl font-black text-white drop-shadow-lg scale-100 transition-transform duration-100"
                        style={{ WebkitTextStroke: '3px black', textShadow: '0px 4px 10px rgba(0,0,0,0.5)' }}
                    >
                        {score}
                    </span>
                    {highScore > 0 && (
                        <span className="mt-2 px-4 py-1 bg-black/50 backdrop-blur-sm rounded-full text-white/90 text-sm font-bold border border-white/10 shadow-sm">
                            BEST: {highScore}
                        </span>
                    )}
                </div>

                {/* Back Button */}
                <Button
                    className="absolute top-4 left-4 z-30 rounded-full w-12 h-12 p-0 bg-white/10 backdrop-blur hover:bg-white/30 border border-white/20 transition-all hover:scale-110 active:scale-95"
                    variant="ghost" onClick={(e) => { e.stopPropagation(); onBack(); }}
                >
                    <ArrowLeft className="text-white w-6 h-6" />
                </Button>

                <div className="absolute top-4 right-4 z-30 flex gap-2">
                    {/* Pause Button */}
                    {gameState === 'PLAYING' && countdown === null && (
                        <Button
                            className="rounded-full w-12 h-12 p-0 bg-white/10 backdrop-blur hover:bg-white/30 border border-white/20 transition-all hover:scale-110 active:scale-95"
                            variant="ghost" onClick={pauseGame}
                        >
                            <Pause className="text-white w-6 h-6" />
                        </Button>
                    )}

                    {/* Sound Toggle Button */}
                    <Button
                        className="rounded-full w-12 h-12 p-0 bg-white/10 backdrop-blur hover:bg-white/30 border border-white/20 transition-all hover:scale-110 active:scale-95"
                        variant="ghost" onClick={toggleMute}
                    >
                        {isMuted ? <VolumeX className="text-white w-6 h-6" /> : <Volume2 className="text-white w-6 h-6" />}
                    </Button>
                </div>

                {/* COUNTDOWN OVERLAY */}
                {countdown !== null && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/20 z-50 pointer-events-none">
                        <span className="text-9xl font-black text-white animate-pulse drop-shadow-[0_0_15px_rgba(0,0,0,1)] scale-150">
                            {countdown}
                        </span>
                    </div>
                )}

                {/* PAUSE MENU */}
                {gameState === 'PAUSED' && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-40 animate-in fade-in duration-200">
                        <div className="bg-white/95 p-8 rounded-3xl shadow-2xl text-center border-4 border-amber-400">
                            <h2 className="text-4xl font-black text-slate-800 mb-6 uppercase tracking-tighter">Paused</h2>
                            <Button
                                size="lg"
                                className="w-full bg-slate-800 hover:bg-slate-900 text-white font-bold text-lg h-14 rounded-xl shadow-lg"
                                onClick={triggerResume}
                            >
                                <Play className="mr-2 h-6 w-6" /> RESUME
                            </Button>
                        </div>
                    </div>
                )}

                {gameState === 'START' && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-[3px] transition-all">
                        <div className="bg-white/95 p-8 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] text-center animate-in zoom-in-95 duration-300 border-4 border-amber-400/50">
                            <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-br from-amber-500 to-orange-600 mb-6 tracking-tighter drop-shadow-sm">
                                WORLD<br />TOUR
                            </h1>
                            <Button size="lg" className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-bold text-lg h-14 rounded-xl shadow-lg transition-transform hover:-translate-y-1" onClick={(e) => { e.stopPropagation(); startGame(); }}>
                                <Play className="mr-2 h-6 w-6 fill-current" /> PLAY
                            </Button>
                        </div>
                    </div>
                )}

                {gameState === 'GAMEOVER' && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm z-30 animate-in fade-in duration-300">
                        <div className="bg-white/95 p-6 rounded-3xl shadow-2xl text-center w-72 border-4 border-slate-200">
                            <h2 className="text-4xl font-black text-slate-800 mb-1 uppercase tracking-tighter">Wasted!</h2>
                            <p className="text-slate-400 font-bold text-xs mb-6 uppercase tracking-widest">Better luck next time</p>

                            <div className="grid grid-cols-2 gap-2 mb-6">
                                <div className="bg-slate-100 p-3 rounded-2xl">
                                    <div className="text-[10px] font-black text-slate-400 uppercase">Score</div>
                                    <div className="text-2xl font-black text-slate-700">{score}</div>
                                </div>
                                <div className="bg-amber-50 p-3 rounded-2xl border border-amber-100">
                                    <div className="text-[10px] font-black text-amber-500 uppercase">Best</div>
                                    <div className="text-2xl font-black text-amber-600">{highScore}</div>
                                </div>
                            </div>

                            <Button className="w-full h-14 text-lg font-bold bg-slate-800 hover:bg-slate-900 text-white rounded-2xl shadow-xl transition-all hover:scale-[1.02]" onClick={(e) => { e.stopPropagation(); startGame(); }}>
                                <RefreshCw className="mr-2 h-5 w-5" /> TRY AGAIN
                            </Button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};