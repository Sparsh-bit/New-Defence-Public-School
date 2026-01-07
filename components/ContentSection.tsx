'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface ContentSectionProps {
    title?: string;
    subtitle?: string;
    children: ReactNode;
    alternate?: boolean;
    className?: string;
}

export default function ContentSection({ title, subtitle, children, alternate, className }: ContentSectionProps) {
    return (
        <section className={cn(`py-24 md:py-32 ${alternate ? 'bg-[#0A1628]/5' : 'bg-white'}`, className)}>
            <div className="container-premium">
                {(title || subtitle) && (
                    <div className="mb-20 max-w-3xl">
                        {subtitle && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                className="text-[#D4AF37] text-sm font-bold tracking-[0.3em] uppercase mb-4"
                            >
                                {subtitle}
                            </motion.div>
                        )}
                        {title && (
                            <motion.h2
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                                className="text-4xl md:text-5xl font-display font-black text-[#0A1628] tracking-tight"
                            >
                                {title}
                            </motion.h2>
                        )}
                        <motion.div
                            initial={{ scaleX: 0 }}
                            whileInView={{ scaleX: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.3, duration: 1 }}
                            className="h-1 bg-[#FFD700] w-24 mt-6 origin-left"
                        />
                    </div>
                )}

                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                >
                    {children}
                </motion.div>
            </div>
        </section>
    );
}
