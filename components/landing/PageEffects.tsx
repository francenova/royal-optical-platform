'use client';

import { useEffect } from 'react';

/**
 * Ports the original landing page's bottom-of-file <script> block (scroll
 * progress bar, sticky header state, data-animate/data-stagger reveal
 * system, data-counter animation, magnetic buttons, data-parallax) as one
 * client component mounted once at the top of the page. Kept close to the
 * original's direct-DOM-query approach on purpose — it's proven behavior,
 * and re-architecting it into per-component React state would be a bigger
 * source of subtle bugs than it's worth for a first faithful port.
 */
export function PageEffects() {
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Scroll progress bar + sticky header state
    const progressBar = document.getElementById('scroll-progress');
    const siteHeader = document.getElementById('site-header');
    function onScroll() {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      if (progressBar) progressBar.style.width = pct + '%';
      if (siteHeader) siteHeader.classList.toggle('nav-scrolled', scrollTop > 24);
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    // Reveal animations
    let revealObserver: IntersectionObserver | undefined;
    if (prefersReducedMotion) {
      document.querySelectorAll('[data-animate]').forEach((el) => el.classList.add('in-view'));
      document.querySelectorAll('[data-stagger]').forEach((el) => el.classList.add('in-view'));
    } else {
      document.querySelectorAll('[data-stagger]').forEach((container) => {
        Array.from(container.children).forEach((child, i) => {
          (child as HTMLElement).style.setProperty('--stagger-i', String(Math.min(i, 9)));
        });
      });

      revealObserver = new IntersectionObserver(
        (entries, obs) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add('in-view');
              obs.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.15, rootMargin: '0px 0px -8% 0px' }
      );
      document.querySelectorAll('[data-animate], [data-stagger]').forEach((el) => revealObserver!.observe(el));
    }

    // Counter animation (data-counter)
    function animateCounter(el: Element) {
      const target = parseFloat(el.getAttribute('data-counter') || '0');
      const suffix = el.getAttribute('data-counter-suffix') || '';
      const duration = 1400;
      const start = performance.now();
      function tick(now: number) {
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        el.textContent = Math.round(target * eased) + suffix;
        if (progress < 1) requestAnimationFrame(tick);
      }
      requestAnimationFrame(tick);
    }
    let counterObserver: IntersectionObserver | undefined;
    if (prefersReducedMotion) {
      document.querySelectorAll('[data-counter]').forEach((el) => {
        el.textContent = (el.getAttribute('data-counter') || '') + (el.getAttribute('data-counter-suffix') || '');
      });
    } else {
      counterObserver = new IntersectionObserver(
        (entries, obs) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              animateCounter(entry.target);
              obs.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.6 }
      );
      document.querySelectorAll('[data-counter]').forEach((el) => counterObserver!.observe(el));
    }

    // Magnetic buttons (desktop, fine pointer only)
    const magneticCleanups: Array<() => void> = [];
    if (!prefersReducedMotion && window.matchMedia('(pointer: fine)').matches) {
      document.querySelectorAll<HTMLElement>('.btn-magnetic').forEach((btn) => {
        const onMove = (e: MouseEvent) => {
          const rect = btn.getBoundingClientRect();
          const x = e.clientX - rect.left - rect.width / 2;
          const y = e.clientY - rect.top - rect.height / 2;
          btn.style.transform = `translate(${x * 0.18}px, ${y * 0.35}px)`;
        };
        const onLeave = () => {
          btn.style.transform = 'translate(0, 0)';
        };
        btn.addEventListener('mousemove', onMove);
        btn.addEventListener('mouseleave', onLeave);
        magneticCleanups.push(() => {
          btn.removeEventListener('mousemove', onMove);
          btn.removeEventListener('mouseleave', onLeave);
        });
      });
    }

    // Parallax (desktop hero image / map card)
    let parallaxTicking = false;
    const parallaxEls = Array.from(document.querySelectorAll<HTMLElement>('[data-parallax]'));
    function updateParallax() {
      const viewportH = window.innerHeight;
      parallaxEls.forEach((el) => {
        const speed = parseFloat(el.getAttribute('data-parallax') || '0.1');
        const rect = el.getBoundingClientRect();
        const centerOffset = rect.top + rect.height / 2 - viewportH / 2;
        el.style.setProperty('--parallax-y', -centerOffset * speed + 'px');
        el.style.transform = `translateY(var(--parallax-y))`;
      });
      parallaxTicking = false;
    }
    function onParallaxScroll() {
      if (!parallaxTicking) {
        requestAnimationFrame(updateParallax);
        parallaxTicking = true;
      }
    }
    if (!prefersReducedMotion) {
      window.addEventListener('scroll', onParallaxScroll, { passive: true });
      updateParallax();
    }

    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('scroll', onParallaxScroll);
      revealObserver?.disconnect();
      counterObserver?.disconnect();
      magneticCleanups.forEach((fn) => fn());
    };
  }, []);

  return <div id="scroll-progress" />;
}
