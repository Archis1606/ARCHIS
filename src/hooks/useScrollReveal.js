import { useEffect } from 'react';

export function useScrollReveal() {
  useEffect(() => {
    const reveals = document.querySelectorAll('.reveal');

    // First, check for elements already in view and activate them immediately
    reveals.forEach((el) => {
      const rect = el.getBoundingClientRect();
      const isInView = rect.top < window.innerHeight && rect.bottom > 0;
      if (isInView) {
        el.classList.add('active');
      }
    });

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('active');
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -10% 0px',
      }
    );

    reveals.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);
}