'use client';

import { cn } from "@/lib/utils";
import React from "react";

export const BentoGrid = ({
    className,
    children,
}: {
    className?: string;
    children?: React.ReactNode;
}) => {
    return (
        <div
            className={cn(
                "grid md:auto-rows-[18rem] grid-cols-1 md:grid-cols-3 gap-6 max-w-7xl mx-auto",
                className
            )}
        >
            {children}
        </div>
    );
};

export const BentoGridItem = ({
    className,
    title,
    description,
    header,
    icon,
}: {
    className?: string;
    title?: string | React.ReactNode;
    description?: string | React.ReactNode;
    header?: React.ReactNode;
    icon?: React.ReactNode;
}) => {
    return (
        <div
            className={cn(
                "row-span-1 rounded-[2.5rem] group/bento hover:shadow-2xl transition-all duration-500 shadow-sm p-8 bg-white border border-slate-900/5 justify-between flex flex-col space-y-4",
                className
            )}
        >
            {header}
            <div className="group-hover/bento:translate-x-2 transition duration-500">
                <div className="mb-4">{icon}</div>
                <div className="font-display font-black text-slate-950 mb-3 text-xl leading-tight">
                    {title}
                </div>
                <div className="font-normal text-slate-500 text-sm leading-relaxed">
                    {description}
                </div>
            </div>
        </div>
    );
};
