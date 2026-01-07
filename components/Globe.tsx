'use client';

import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

export function Globe() {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let width = canvas.width;
        let height = canvas.height;
        const dots: { x: number; y: number; z: number }[] = [];
        const dotCount = 1000;
        const radius = 250;

        for (let i = 0; i < dotCount; i++) {
            const theta = Math.random() * 2 * Math.PI;
            const phi = Math.acos(2 * Math.random() - 1);
            dots.push({
                x: radius * Math.sin(phi) * Math.cos(theta),
                y: radius * Math.sin(phi) * Math.sin(theta),
                z: radius * Math.cos(phi)
            });
        }

        let rotation = 0;

        const animate = () => {
            rotation += 0.005;
            ctx.clearRect(0, 0, width, height);

            const centerX = width / 2;
            const centerY = height / 2;

            dots.forEach(dot => {
                // Rotation on Y axis
                const x = dot.x * Math.cos(rotation) - dot.z * Math.sin(rotation);
                const z = dot.x * Math.sin(rotation) + dot.z * Math.cos(rotation);
                const y = dot.y;

                const perspective = 600 / (600 - z);
                const px = x * perspective + centerX;
                const py = y * perspective + centerY;

                const opacity = (z + radius) / (2 * radius);
                const size = perspective * 1.5;

                ctx.fillStyle = `rgba(99, 102, 241, ${opacity * 0.8})`;
                ctx.beginPath();
                ctx.arc(px, py, size, 0, Math.PI * 2);
                ctx.fill();
            });

            requestAnimationFrame(animate);
        };

        const handleResize = () => {
            if (!canvas) return;
            width = canvas.width = canvas.offsetWidth;
            height = canvas.height = canvas.offsetHeight;
        };

        window.addEventListener('resize', handleResize);
        handleResize();
        animate();

        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return (
        <div className="relative w-full h-[600px] flex items-center justify-center overflow-hidden">
            <canvas ref={canvasRef} className="w-[800px] h-[800px] opacity-60" />
            <div className="absolute inset-0 bg-gradient-to-t from-primary via-transparent to-primary pointer-events-none" />
        </div>
    );
}
