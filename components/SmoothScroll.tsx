'use client';

import { ReactLenis, useLenis } from 'lenis/react';
import { ReactNode, useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';

// Component to handle scroll reset on navigation
function ScrollToTop() {
    const lenis = useLenis();
    const pathname = usePathname();
    const isFirstMount = useRef(true);
    const [isMounted, setIsMounted] = useState(false);

    // Handle client-side mounting
    useEffect(() => {
        setIsMounted(true);
    }, []);

    useEffect(() => {
        // Don't run on server or before mount
        if (!isMounted) return;

        // Skip the first mount to avoid scrolling on initial page load
        if (isFirstMount.current) {
            isFirstMount.current = false;
            // Still scroll to top on first mount in case page loads from wrong position
            if (typeof window !== 'undefined') {
                window.scrollTo(0, 0);
            }
            if (lenis) {
                lenis.scrollTo(0, { immediate: true });
            }
            return;
        }

        // Scroll to top on route change
        if (typeof window !== 'undefined') {
            window.scrollTo(0, 0);
        }
        if (lenis) {
            lenis.scrollTo(0, { immediate: true });
        }
    }, [pathname, lenis, isMounted]);

    return null;
}

export default function SmoothScroll({ children }: { children: ReactNode }) {
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    // During SSR or before mount, just render children without Lenis wrapper
    if (!isMounted) {
        return <>{children}</>;
    }

    return (
        <ReactLenis root options={{ lerp: 0.1, duration: 1.5, smoothWheel: true }}>
            <ScrollToTop />
            {children}
        </ReactLenis>
    );
}
