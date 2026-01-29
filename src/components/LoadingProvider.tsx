'use client';

import { createContext, useContext, useState, useEffect, useCallback, useRef, ReactNode } from 'react';
import { usePathname } from 'next/navigation';

// Main menu routes that should trigger loading
// Disabled - no loading screen for any routes
const MAIN_ROUTES: string[] = [];

// Loading images array - from public/loading/
const LOADING_IMAGES = [
  '/loading/87a15768a59e5d603cea938c92454b9868743dfa1b36c.webp',
  '/loading/2425_MD33_FCBBMG_JH_093_4gud8JWh_20250512053606.webp',
  '/loading/740337.jpg',
  '/loading/1258593671.webp',
  '/loading/1671384931565.webp',
  '/loading/GettyImages-2153681267.webp',
  '/loading/GettyImages-2165851302-scaled.jpg',
  '/loading/messi-pictures-jzykf84saw6wbkd6.jpg',
  '/loading/newcastle-united-fc-players-circling-in-meemmb9hltlpxrze.jpg',
  '/loading/skysports-graphic-bundesliga_4991005.jpg',
  '/loading/wp11822419.jpg',
];

interface LoadingContextType {
  isLoading: boolean;
  startLoading: () => void;
  stopLoading: () => void;
}

const LoadingContext = createContext<LoadingContextType>({
  isLoading: false,
  startLoading: () => {},
  stopLoading: () => {},
});

export const useLoading = () => useContext(LoadingContext);

export function LoadingProvider({ children }: { children: ReactNode }) {
  const [isLoading, setIsLoading] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [minTimeElapsed, setMinTimeElapsed] = useState(true);
  const [currentImage, setCurrentImage] = useState('');
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const pathname = usePathname();
  // Removed useSearchParams() - no longer needed since MAIN_ROUTES is empty

  const startLoading = useCallback(() => {
    // Clear any existing timer
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    // Pick random image
    const randomIndex = Math.floor(Math.random() * LOADING_IMAGES.length);
    setCurrentImage(LOADING_IMAGES[randomIndex]);
    setIsLoading(true);
    setIsClosing(false);
    setMinTimeElapsed(false);

    // Show loading for 1 second
    timerRef.current = setTimeout(() => {
      setMinTimeElapsed(true);
    }, 1000);
  }, []);

  const stopLoading = useCallback(() => {
    if (minTimeElapsed) {
      setIsLoading(false);
    }
  }, [minTimeElapsed]);

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  // Stop loading when min time has elapsed and route has changed
  useEffect(() => {
    if (minTimeElapsed && isLoading && !isClosing) {
      // Start closing animation
      setIsClosing(true);
      // After animation completes (500ms), hide the overlay
      setTimeout(() => {
        setIsLoading(false);
        setIsClosing(false);
      }, 500);
    }
  }, [minTimeElapsed, pathname, isLoading, isClosing]);

  // Intercept main menu link clicks only (when switching between different sections)
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const link = target.closest('a');

      if (link) {
        const href = link.getAttribute('href');
        const isInternal = href && (href.startsWith('/') || href.startsWith('#'));
        const isSameOrigin = link.origin === window.location.origin;
        const isNewTab = link.target === '_blank';
        const currentPath = window.location.pathname;

        // Only show loading for main menu routes (not sub-routes like /predictions/123)
        const isMainRoute = href && MAIN_ROUTES.includes(href);

        // Get the base section of current path (e.g., /predictions/123 -> /predictions)
        const currentSection = '/' + (currentPath.split('/')[1] || '');
        const targetSection = href;

        // Only show loading when switching to a DIFFERENT section
        const isDifferentSection = currentSection !== targetSection;

        if (isInternal && isSameOrigin && !isNewTab && href !== currentPath && !href?.startsWith('#') && isMainRoute && isDifferentSection) {
          startLoading();
        }
      }
    };

    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, [startLoading]);

  return (
    <LoadingContext.Provider value={{ isLoading, startLoading, stopLoading }}>
      {children}

      {/* Loading Image Overlay - Below navbar */}
      {isLoading && currentImage && (
        <div
          className={`fixed inset-0 top-16 z-[45] bg-[#0a0a0f] transition-transform duration-500 ease-in-out ${
            isClosing ? 'translate-y-full' : 'translate-y-0'
          }`}
        >
          {/* Full screen background image */}
          <img
            src={currentImage}
            alt="Loading"
            className="absolute inset-0 w-full h-full object-cover"
          />

          {/* Dark overlay for better readability */}
          <div className="absolute inset-0 bg-black/40" />

          {/* Loading indicator centered */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            {/* Spinning logo */}
            <div className="relative">
              <div className="w-32 h-32 rounded-full border-4 border-white/20" />
              <div className="absolute inset-0 w-32 h-32 rounded-full border-4 border-transparent border-t-emerald-500 animate-spin" />
              <div className="absolute inset-0 flex items-center justify-center">
                <img
                  src="/homepage/OddsFlow Logo2.png"
                  alt="OddsFlow"
                  className="w-20 h-20 object-contain animate-pulse"
                />
              </div>
            </div>

            {/* Loading text */}
            <div className="mt-6 flex items-center gap-2 text-white text-lg font-medium">
              <span>Loading</span>
              <span className="flex gap-1">
                <span className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </span>
            </div>
          </div>
        </div>
      )}
    </LoadingContext.Provider>
  );
}
