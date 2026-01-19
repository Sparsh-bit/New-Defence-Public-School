'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { X } from 'lucide-react';
import { TypingText } from './lightswind/typing-text';

const images = [
    { src: "/images/ndps.jpg", title: "School Building" },
    { src: "/images/gen/smart_classroom_india_1766952364269.png", title: "Smart Classroom" },
    { src: "/images/gen/school_infrastructure_india_1766952342809.png", title: "Infrastructure" },
    { src: "/images/library.png", title: "Learning Resource" },
    { src: "/images/lab.png", title: "Science Lab" },
    { src: "/images/playground.png", title: "Sports Arena" },
    { src: "/images/aerial_view.png", title: "Aerial View" },
];

export function OfficialGallery() {
    const [selectedImage, setSelectedImage] = useState<string | null>(null);

    return (
        <section className="py-[120px] bg-white">
            <div className="container-premium mb-20 text-center">
                <TypingText
                    fontSize="text-4xl md:text-5xl"
                    fontWeight="font-display font-medium"
                    color="text-[#0B1C2D]"
                    className="flex justify-center w-full"
                >
                    Glimpses of NDPS
                </TypingText>
            </div>

            <div className="container-premium px-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {images.map((img, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8, delay: i * 0.1 }}
                            onClick={() => setSelectedImage(img.src)}
                            className="relative aspect-square rounded-2xl overflow-hidden cursor-pointer group shadow-md"
                        >
                            <Image
                                src={img.src}
                                alt={img.title}
                                fill
                                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                                className="object-cover transition-transform duration-700 group-hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-[#0B1C2D]/0 group-hover:bg-[#0B1C2D]/40 transition-colors duration-500 flex items-center justify-center">
                                <span className="text-white text-sm font-bold tracking-widest uppercase opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                                    View Large
                                </span>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* Lightbox */}
            <AnimatePresence>
                {selectedImage && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[200] bg-[#0B1C2D]/95 flex items-center justify-center p-4 md:p-10"
                        onClick={() => setSelectedImage(null)}
                    >
                        <button
                            className="absolute top-10 right-10 text-white/50 hover:text-white transition-colors"
                            onClick={() => setSelectedImage(null)}
                        >
                            <X size={40} />
                        </button>
                        <motion.div
                            initial={{ scale: 0.9 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0.9 }}
                            className="relative w-full max-w-5xl aspect-video rounded-3xl overflow-hidden shadow-2xl"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <Image
                                src={selectedImage}
                                alt="Gallery Lightbox"
                                fill
                                sizes="100vw"
                                className="object-cover"
                            />
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

        </section>
    );
}
