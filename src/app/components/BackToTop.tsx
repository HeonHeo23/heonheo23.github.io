import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

const SHOW_AFTER_PX = 320;

export default function BackToTop() {
  const { pathname } = useLocation();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const updateVisibility = () => {
      setIsVisible(window.scrollY > SHOW_AFTER_PX);
    };

    updateVisibility();
    window.addEventListener("scroll", updateVisibility, { passive: true });
    return () => window.removeEventListener("scroll", updateVisibility);
  }, [pathname]);

  return (
    <button
      type="button"
      className={`btn fixed right-4 bottom-4 z-40 btn-square bg-primary text-primary-content transition-opacity duration-200 motion-reduce:transition-none sm:right-6 sm:bottom-6 ${
        isVisible ? "opacity-100" : "pointer-events-none invisible opacity-0"
      }`}
      aria-label="Back to top"
      aria-hidden={!isVisible}
      tabIndex={isVisible ? 0 : -1}
      title="Back to top"
      onClick={(event) => {
        event.currentTarget.blur();
        window.scrollTo({
          top: 0,
          behavior: window.matchMedia("(prefers-reduced-motion: reduce)")
            .matches
            ? "auto"
            : "smooth",
        });
      }}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-5 w-5"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2.5"
          d="M5 10l7-7 7 7M12 3v18"
        />
      </svg>
    </button>
  );
}
