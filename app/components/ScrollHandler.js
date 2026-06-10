// components/ScrollHandler.js
'use client';

import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';

const ScrollHandler = () => {
    const searchParams = useSearchParams();
    const sectionId = searchParams.get('section'); // Use a specific param name

    useEffect(() => {
        if (!sectionId) return;

        const scrollToSection = () => {
            const element = document.getElementById(sectionId);
            if (element) {
                const yOffset = -225;
                const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;

                window.scrollTo({
                    top: y,
                    behavior: 'smooth'
                });
            }
        };

        // Try immediately, then again after a short delay in case content isn't loaded
        scrollToSection();
        const timer = setTimeout(scrollToSection, 300);
        
        return () => clearTimeout(timer);
    }, [sectionId]); // Only depend on sectionId

    return null;
};

export default ScrollHandler;