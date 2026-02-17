/* ============================================
   BEVERAGES CASE STUDY — INTERACTIONS & ANIMATIONS
   ============================================ */

document.addEventListener("DOMContentLoaded", () => {
  // ============================================
  // INTERSECTION OBSERVER — Scroll Reveal
  // ============================================
  const revealElements = document.querySelectorAll(".reveal, .reveal--left, .reveal--right, .reveal--scale");

  const revealObserver = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          // Don't unobserve — keep it for potential re-animation
        }
      });
    },
    {
      threshold: 0.12,
      rootMargin: "0px 0px -60px 0px",
    },
  );

  revealElements.forEach(el => revealObserver.observe(el));

  // ============================================
  // NAVBAR — Hide/Show on Scroll
  // ============================================
  const navbar = document.getElementById("navbar");
  let lastScrollY = 0;
  let ticking = false;

  function updateNavbar() {
    const scrollY = window.scrollY;

    // Add background after scrolling past hero
    if (scrollY > 100) {
      navbar.classList.add("scrolled");
    } else {
      navbar.classList.remove("scrolled");
    }

    // Hide/show on scroll direction
    if (scrollY > lastScrollY && scrollY > 400) {
      navbar.classList.add("hidden");
    } else {
      navbar.classList.remove("hidden");
    }

    lastScrollY = scrollY;
    ticking = false;
  }

  window.addEventListener(
    "scroll",
    () => {
      if (!ticking) {
        requestAnimationFrame(updateNavbar);
        ticking = true;
      }
    },
    { passive: true },
  );

  // ============================================
  // MOBILE MENU TOGGLE
  // ============================================
  const menuBtn = document.getElementById("menuBtn");
  const navLinks = document.getElementById("navLinks");
  let menuOpen = false;

  if (menuBtn) {
    menuBtn.addEventListener("click", () => {
      menuOpen = !menuOpen;
      navLinks.style.display = menuOpen ? "flex" : "";
      if (menuOpen) {
        navLinks.style.position = "fixed";
        navLinks.style.top = "0";
        navLinks.style.left = "0";
        navLinks.style.right = "0";
        navLinks.style.bottom = "0";
        navLinks.style.background = "rgba(250,250,249,0.97)";
        navLinks.style.backdropFilter = "blur(20px)";
        navLinks.style.flexDirection = "column";
        navLinks.style.alignItems = "center";
        navLinks.style.justifyContent = "center";
        navLinks.style.gap = "2rem";
        navLinks.style.zIndex = "999";
        navLinks.style.fontSize = "1.25rem";
      } else {
        navLinks.removeAttribute("style");
      }
    });
  }

  // Close mobile menu on link click
  navLinks.querySelectorAll(".navbar__link").forEach(link => {
    link.addEventListener("click", () => {
      if (menuOpen) {
        menuOpen = false;
        navLinks.removeAttribute("style");
      }
    });
  });

  // ============================================
  // SMOOTH SCROLL — Nav Links
  // ============================================
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener("click", e => {
      const targetId = anchor.getAttribute("href");
      if (targetId === "#") return;

      e.preventDefault();
      const target = document.querySelector(targetId);
      if (target) {
        // Use Lenis for smooth scroll if available
        if (typeof lenis !== "undefined") {
          lenis.scrollTo(target, { offset: -80 });
        } else {
          // Fallback
          const offset = 80;
          const position = target.getBoundingClientRect().top + window.scrollY - offset;
          window.scrollTo({
            top: position,
            behavior: "smooth",
          });
        }
      }
    });
  });

  // ============================================
  // ANIMATED STAT COUNTERS
  // ============================================
  const counters = document.querySelectorAll(".counter");

  const counterObserver = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const counter = entry.target;
          const target = parseInt(counter.dataset.target);
          const suffix = counter.dataset.suffix || "";
          const duration = 2000;
          const startTime = performance.now();

          function easeOutCubic(t) {
            return 1 - Math.pow(1 - t, 3);
          }

          function updateCounter(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const easedProgress = easeOutCubic(progress);
            const currentValue = Math.round(target * easedProgress);

            counter.textContent = currentValue + suffix;

            if (progress < 1) {
              requestAnimationFrame(updateCounter);
            }
          }

          requestAnimationFrame(updateCounter);
          counterObserver.unobserve(counter);
        }
      });
    },
    {
      threshold: 0.5,
    },
  );

  counters.forEach(counter => counterObserver.observe(counter));

  // ============================================
  // ACCORDION — Key Findings
  // ============================================
  const accordionHeaders = document.querySelectorAll(".accordion__header");

  accordionHeaders.forEach(header => {
    header.addEventListener("click", () => {
      const item = header.parentElement;
      const body = item.querySelector(".accordion__body");
      const isActive = item.classList.contains("active");

      // Close all other items
      document.querySelectorAll(".accordion__item.active").forEach(activeItem => {
        if (activeItem !== item) {
          activeItem.classList.remove("active");
          activeItem.querySelector(".accordion__header").setAttribute("aria-expanded", "false");
          activeItem.querySelector(".accordion__body").style.maxHeight = null;
        }
      });

      // Toggle current item
      if (isActive) {
        item.classList.remove("active");
        header.setAttribute("aria-expanded", "false");
        body.style.maxHeight = null;
      } else {
        item.classList.add("active");
        header.setAttribute("aria-expanded", "true");
        body.style.maxHeight = body.scrollHeight + "px";
      }
    });
  });

  // ============================================
  // REFERENCES — Expand/Collapse
  // ============================================
  const referencesToggle = document.getElementById("referencesToggle");
  const referencesExtra = document.getElementById("referencesExtra");
  const referencesToggleText = document.getElementById("referencesToggleText");

  if (referencesToggle && referencesExtra) {
    let refsExpanded = false;

    referencesToggle.addEventListener("click", () => {
      refsExpanded = !refsExpanded;
      referencesExtra.classList.toggle("visible");
      referencesToggleText.textContent = refsExpanded ? "Show fewer references" : "Show more references";
      referencesToggle.querySelector("span:last-child").style.transform = refsExpanded ? "rotate(180deg)" : "";
      referencesToggle.setAttribute("aria-expanded", refsExpanded);
    });
  }

  // ============================================
  // BUTTON RIPPLE EFFECT
  // ============================================
  document.querySelectorAll(".btn").forEach(btn => {
    btn.addEventListener("click", function (e) {
      const ripple = document.createElement("span");
      ripple.classList.add("ripple");
      const rect = this.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      ripple.style.width = ripple.style.height = size + "px";
      ripple.style.left = e.clientX - rect.left - size / 2 + "px";
      ripple.style.top = e.clientY - rect.top - size / 2 + "px";
      this.appendChild(ripple);
      ripple.addEventListener("animationend", () => ripple.remove());
    });
  });

  // ============================================
  // PARALLAX — Hero Background
  // ============================================
  const heroBg = document.querySelector(".hero__bg");
  const heroFloats = document.querySelectorAll(".hero__float-element");

  window.addEventListener(
    "scroll",
    () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const scrollY = window.scrollY;
          if (scrollY < window.innerHeight) {
            const parallaxOffset = scrollY * 0.3;
            if (heroBg) {
              heroBg.style.transform = `translateY(${parallaxOffset}px)`;
            }
            heroFloats.forEach((el, i) => {
              const speed = 0.1 + i * 0.08;
              el.style.transform = `translateY(${scrollY * speed}px)`;
            });
          }
        });
      }
    },
    { passive: true },
  );

  // ============================================
  // ACTIVE NAV LINK — Highlight on Scroll
  // ============================================
  const sections = document.querySelectorAll("section[id]");
  const navLinksAll = document.querySelectorAll(".navbar__link");

  const sectionObserver = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.id;
          navLinksAll.forEach(link => {
            link.style.color = "";
            if (link.getAttribute("href") === `#${id}`) {
              link.style.color = "var(--color-text)";
            }
          });
        }
      });
    },
    {
      threshold: 0.3,
      rootMargin: "-80px 0px -50% 0px",
    },
  );

  sections.forEach(section => sectionObserver.observe(section));

  // ============================================
  // COMPARISON TABLE — Row Hover Highlight
  // ============================================
  const tableRows = document.querySelectorAll(".comparison-table tbody tr");
  tableRows.forEach(row => {
    row.addEventListener("mouseenter", () => {
      row.style.transition = "background 200ms ease";
    });
  });

  // ============================================
  // PRELOAD — Remove loading state
  // ============================================
  document.body.classList.add("loaded");

  // ============================================
  // GSAP — Text Reveal Word-by-Word Stagger
  // ============================================
  function initTextReveal() {
    if (typeof gsap === "undefined") {
      setTimeout(initTextReveal, 100);
      return;
    }

    gsap.registerPlugin(ScrollTrigger);

    const textRevealElements = document.querySelectorAll("[data-text-reveal]");

    textRevealElements.forEach(el => {
      const originalHTML = el.innerHTML;
      const splitContent = splitIntoWords(originalHTML);
      el.innerHTML = splitContent;

      const words = el.querySelectorAll(".word");
      const isHero = el.closest(".hero");

      if (isHero) {
        gsap.fromTo(
          words,
          { opacity: 0, y: "100%", rotateX: -90 },
          {
            opacity: 1,
            y: "0%",
            rotateX: 0,
            duration: 0.7,
            ease: "power4.out",
            stagger: 0.06,
            delay: 0.5,
          },
        );
      } else {
        gsap.fromTo(
          words,
          { opacity: 0, y: "80%", rotateX: -60 },
          {
            opacity: 1,
            y: "0%",
            rotateX: 0,
            duration: 0.55,
            ease: "power3.out",
            stagger: 0.04,
            scrollTrigger: {
              trigger: el,
              start: "top 85%",
              once: true,
            },
          },
        );
      }
    });
  }

  /**
   * Split text into word-level spans while preserving HTML tags.
   */
  function splitIntoWords(html) {
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = html;
    let result = "";

    function processNode(node) {
      if (node.nodeType === Node.TEXT_NODE) {
        const text = node.textContent;
        const words = text.split(/\s+/).filter(w => w.length > 0);
        if (text.match(/^\s/) && result.length > 0) result += " ";
        words.forEach((word, i) => {
          result += `<span class="word">${word}</span>`;
          if (i < words.length - 1) result += " ";
        });
        if (text.match(/\s$/) && words.length > 0) result += " ";
      } else if (node.nodeType === Node.ELEMENT_NODE) {
        const tag = node.tagName.toLowerCase();
        let attrs = "";
        for (const attr of node.attributes) {
          attrs += ` ${attr.name}="${attr.value}"`;
        }
        result += `<${tag}${attrs}>`;
        node.childNodes.forEach(child => processNode(child));
        result += `</${tag}>`;
      }
    }

    tempDiv.childNodes.forEach(child => processNode(child));
    return result;
  }

  // Initialize GSAP text reveal
  initTextReveal();

  /* ============================================
     CUSTOM CURSOR FOLLOWER
     ============================================ */
  const cursorFollower = document.querySelector(".cursor-follower");
  if (cursorFollower && typeof gsap !== "undefined") {
    let mouseX = 0,
      mouseY = 0;
    let cursorX = 0,
      cursorY = 0;

    document.addEventListener("mousemove", e => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    });

    gsap.set(cursorFollower, { xPercent: -50, yPercent: -50 });

    gsap.ticker.add(() => {
      const dt = 1.0 - Math.pow(1.0 - 0.2, gsap.ticker.deltaRatio());
      cursorX += (mouseX - cursorX) * dt;
      cursorY += (mouseY - cursorY) * dt;

      // Calculate velocity
      const vx = mouseX - cursorX;
      const vy = mouseY - cursorY;
      const velocity = Math.sqrt(vx * vx + vy * vy);

      // Scale based on velocity (base scale 1, max scale e.g. 2 or 1.5)
      // The factor 0.005 controls sensitivity.
      const scale = 1 + Math.min(velocity * 0.005, 0.5);

      gsap.set(cursorFollower, {
        x: cursorX,
        y: cursorY,
        scale: scale,
      });
    });
  }

  /* ============================================
     LENIS SMOOTH SCROLL
     ============================================ */
  const lenis = new Lenis({
    duration: 1.2,
    easing: t => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    direction: "vertical",
    gestureDirection: "vertical",
    smooth: true,
    mouseMultiplier: 1,
    smoothTouch: false,
    touchMultiplier: 2,
  });

  // Integreate Lenis with GSAP ScrollTrigger
  if (typeof ScrollTrigger !== "undefined") {
    lenis.on("scroll", ScrollTrigger.update);

    gsap.ticker.add(time => {
      lenis.raf(time * 1000);
    });

    gsap.ticker.lagSmoothing(0);
  } else {
    // Fallback RAF if GSAP not loaded (unlikely)
    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);
  }
});
