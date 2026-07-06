// ============================================================
// BUNDLE.JS – All JavaScript Combined & Optimized
// ============================================================

// ============================================================
// 1. DEFER EXECUTION WITH requestIdleCallback
// ============================================================
if (window.requestIdleCallback) {
  window.requestIdleCallback(
    () => {
      initApp();
    },
    { timeout: 2000 },
  );
} else {
  // Fallback for older browsers
  document.addEventListener("DOMContentLoaded", initApp);
}

// ============================================================
// 2. MAIN APPLICATION
// ============================================================
function initApp() {
  // ============================================================
  // NAVBAR – Mobile toggle & Language dropdown
  // ============================================================
  const mobileToggle = document.getElementById("mobileToggle");
  const navMenu = document.getElementById("navMenu");
  const langBtn = document.getElementById("langBtn");
  const langDropdown = document.getElementById("langDropdown");

  // Mobile menu toggle
  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener("click", (e) => {
      e.stopPropagation();
      const isOpen = navMenu.classList.toggle("open");
      mobileToggle.classList.toggle("open");
      mobileToggle.setAttribute("aria-expanded", isOpen);
    });
  }

  // Language dropdown toggle
  if (langBtn && langDropdown) {
    langBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      langDropdown.classList.toggle("open");
    });
  }

  // Close dropdowns when clicking outside
  document.addEventListener("click", (e) => {
    if (langDropdown && langDropdown.classList.contains("open")) {
      if (!langBtn.contains(e.target) && !langDropdown.contains(e.target)) {
        langDropdown.classList.remove("open");
      }
    }
    if (navMenu && navMenu.classList.contains("open")) {
      if (!mobileToggle.contains(e.target) && !navMenu.contains(e.target)) {
        navMenu.classList.remove("open");
        mobileToggle.classList.remove("open");
        mobileToggle.setAttribute("aria-expanded", "false");
      }
    }
  });

  // Close dropdowns with Escape key
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      if (langDropdown && langDropdown.classList.contains("open")) {
        langDropdown.classList.remove("open");
      }
      if (navMenu && navMenu.classList.contains("open")) {
        navMenu.classList.remove("open");
        mobileToggle.classList.remove("open");
        mobileToggle.setAttribute("aria-expanded", "false");
      }
    }
  });

  // ============================================================
  // THEME – Dark/Light mode toggle with localStorage
  // ============================================================
  const themeToggle = document.getElementById("themeToggle");
  const icon = themeToggle?.querySelector("i");
  const body = document.body;

  const savedTheme = localStorage.getItem("theme");
  if (savedTheme === "dark") {
    body.classList.add("dark-theme");
    if (icon) icon.className = "fas fa-sun";
  } else {
    if (icon) icon.className = "fas fa-moon";
  }

  if (themeToggle) {
    themeToggle.addEventListener("click", () => {
      body.classList.toggle("dark-theme");
      const isDark = body.classList.contains("dark-theme");
      if (icon) {
        icon.className = isDark ? "fas fa-sun" : "fas fa-moon";
      }
      localStorage.setItem("theme", isDark ? "dark" : "light");
    });
  }

  // ============================================================
  // COUNTERS – Animated statistics (scroll-triggered)
  // ============================================================
  setTimeout(() => {
    const counters = document.querySelectorAll(".stat-number");
    if (counters.length > 0) {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              const counter = entry.target;
              // Prevent re-triggering
              if (counter.dataset.animated === "true") return;
              counter.dataset.animated = "true";

              const target = parseFloat(counter.getAttribute("data-target"));
              if (isNaN(target)) return;

              const duration = Math.min(2000, Math.max(800, target * 10));
              const startTime = performance.now();
              const isDecimal = target % 1 !== 0;
              const decimals = isDecimal ? 1 : 0;

              const animateCounter = (currentTime) => {
                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / duration, 1);
                // Ease-out cubic
                const eased = 1 - Math.pow(1 - progress, 3);
                const currentValue = target * eased;
                counter.textContent = currentValue.toFixed(decimals);
                if (progress < 1) {
                  requestAnimationFrame(animateCounter);
                } else {
                  counter.textContent = target.toFixed(decimals);
                }
              };
              requestAnimationFrame(animateCounter);
              observer.unobserve(counter);
            }
          });
        },
        { threshold: 0.3 },
      );
      counters.forEach((counter) => observer.observe(counter));
    }
  }, 500);

  // ============================================================
  // SCROLL REVEAL – Fade-in animations (deferred)
  // ============================================================
  if (window.requestIdleCallback) {
    window.requestIdleCallback(
      () => {
        const revealElements = document.querySelectorAll(
          ".reveal, .reveal-left, .reveal-right",
        );
        if (revealElements.length > 0) {
          const revealObserver = new IntersectionObserver(
            (entries) => {
              entries.forEach((entry) => {
                if (entry.isIntersecting) {
                  entry.target.classList.add("visible");
                }
              });
            },
            { threshold: 0.1, rootMargin: "0px 0px -30px 0px" },
          );
          revealElements.forEach((el) => revealObserver.observe(el));
        }
      },
      { timeout: 1000 },
    );
  } else {
    // Fallback for older browsers
    const revealElements = document.querySelectorAll(
      ".reveal, .reveal-left, .reveal-right",
    );
    if (revealElements.length > 0) {
      const revealObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add("visible");
            }
          });
        },
        { threshold: 0.1, rootMargin: "0px 0px -30px 0px" },
      );
      revealElements.forEach((el) => revealObserver.observe(el));
    }
  }

  // ============================================================
  // ACTIVE NAV LINK – Highlight current section (deferred)
  // ============================================================
  if (window.requestIdleCallback) {
    window.requestIdleCallback(
      () => {
        const sections = document.querySelectorAll("section[id]");
        const navLinks = document.querySelectorAll(".nav-links a");
        if (sections.length > 0 && navLinks.length > 0) {
          const navObserver = new IntersectionObserver(
            (entries) => {
              entries.forEach((entry) => {
                if (entry.isIntersecting) {
                  const currentId = entry.target.id;
                  navLinks.forEach((link) => link.classList.remove("active"));
                  navLinks.forEach((link) => {
                    if (link.getAttribute("href") === `#${currentId}`) {
                      link.classList.add("active");
                    }
                  });
                }
              });
            },
            { threshold: 0.45 },
          );
          sections.forEach((section) => navObserver.observe(section));
        }
      },
      { timeout: 1500 },
    );
  } else {
    // Fallback for older browsers
    const sections = document.querySelectorAll("section[id]");
    const navLinks = document.querySelectorAll(".nav-links a");
    if (sections.length > 0 && navLinks.length > 0) {
      const navObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              const currentId = entry.target.id;
              navLinks.forEach((link) => link.classList.remove("active"));
              navLinks.forEach((link) => {
                if (link.getAttribute("href") === `#${currentId}`) {
                  link.classList.add("active");
                }
              });
            }
          });
        },
        { threshold: 0.45 },
      );
      sections.forEach((section) => navObserver.observe(section));
    }
  }

  // ============================================================
  // SMOOTH SCROLL – With navbar offset + close mobile menu
  // ============================================================
  const navbarHeight = document.getElementById("navbar")?.offsetHeight || 80;
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      const targetId = this.getAttribute("href");
      if (targetId === "#") return;
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        e.preventDefault();
        const targetPosition =
          targetElement.getBoundingClientRect().top +
          window.pageYOffset -
          navbarHeight;
        window.scrollTo({ top: targetPosition, behavior: "smooth" });
        // Close mobile menu if open
        if (navMenu?.classList.contains("open")) {
          navMenu.classList.remove("open");
          if (mobileToggle) {
            mobileToggle.classList.remove("open");
            mobileToggle.setAttribute("aria-expanded", "false");
          }
        }
      }
    });
  });

  // ============================================================
  // FAQ ACCORDION – Smooth expand/collapse
  // ============================================================
  const faqQuestions = document.querySelectorAll(".faq-question");
  faqQuestions.forEach((question) => {
    question.addEventListener("click", function () {
      const isExpanded = this.getAttribute("aria-expanded") === "true";
      const newState = !isExpanded;
      this.setAttribute("aria-expanded", newState);
      const answer = this.nextElementSibling;
      if (answer && answer.classList.contains("faq-answer")) {
        if (newState) {
          answer.classList.add("open");
          answer.style.maxHeight = answer.scrollHeight + "px";
        } else {
          answer.classList.remove("open");
          answer.style.maxHeight = null;
        }
      }
    });
  });

  // ============================================================
  // CONTACT FORM – Validation & feedback
  // ============================================================
  const contactForm = document.getElementById("contactForm");
  if (contactForm) {
    contactForm.addEventListener("submit", function (e) {
      e.preventDefault();
      const name = document.getElementById("contactName")?.value.trim();
      const email = document.getElementById("contactEmail")?.value.trim();
      const message = document.getElementById("contactMessage")?.value.trim();
      if (!name || !email || !message) {
        alert("Please fill in all fields.");
        return;
      }
      alert(
        "Your message has been sent successfully! We will get back to you shortly.",
      );
      this.reset();
    });
  }

  // ============================================================
  // NEWSLETTER FORM – Simple subscription
  // ============================================================
  const newsletterForm = document.getElementById("newsletterForm");
  if (newsletterForm) {
    newsletterForm.addEventListener("submit", function (e) {
      e.preventDefault();
      const input = this.querySelector('input[type="email"]');
      if (input && input.value.trim()) {
        alert("Thank you for subscribing to our newsletter!");
        this.reset();
      } else {
        alert("Please enter a valid email address.");
      }
    });
  }
} // End of initApp()
