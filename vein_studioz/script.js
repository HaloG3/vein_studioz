/* ========== VEIN STUDIOZ - JAVASCRIPT FUNCTIONALITY ========== */
/* This file handles all interactive features on the website */
/* Main functions: Menu overlay toggle, Scroll reveal animations, Error handling, Link validation */

/* ========== GLOBAL ERROR HANDLER & STUDIO OBJECT ========== */
const veinStudio = {
  studioPhone: "+91 95299 06956",
  studioEmail: "veinstudioz@gmail.com",
  studioAddress: "Block A, Rayan Enclave Rd, Gurugram, Haryana 122102",
  backgroundAudio: null,
  audioButton: null,
  audioPlaying: false,

  /* Initialize background audio and audio control button */
  initBackgroundAudio(url, delay = 5000) {
    if (!url) return;

    try {
      const audio = document.createElement("audio");
      audio.src = url;
      audio.loop = true;
      audio.preload = "auto";
      audio.volume = 0.35;
      audio.setAttribute("playsinline", "true");
      audio.style.display = "none";
      document.body.appendChild(audio);

      this.backgroundAudio = audio;
      this.audioButton = document.getElementById("audioControlButton");

      audio.addEventListener("play", () => {
        this.audioPlaying = true;
        this.updateAudioButton();
      });
      audio.addEventListener("pause", () => {
        this.audioPlaying = false;
        this.updateAudioButton();
      });

      if (this.audioButton) {
        this.audioButton.addEventListener("click", () => this.toggleBackgroundAudio());
      }

      setTimeout(() => {
        this.attemptPlayAudio();
      }, delay);
    } catch (error) {
      console.error("Background audio initialization failed:", error);
    }
  },

  attemptPlayAudio() {
    if (!this.backgroundAudio) return;

    this.backgroundAudio.play().catch((error) => {
      console.warn("Autoplay prevented or audio failed to play:", error);
      this.audioPlaying = false;
      this.updateAudioButton();
    });
  },

  toggleBackgroundAudio() {
    if (!this.backgroundAudio) return;

    if (this.audioPlaying) {
      this.backgroundAudio.pause();
      return;
    }

    this.backgroundAudio.play().catch((error) => {
      console.warn("Audio play failed on toggle:", error);
      this.audioPlaying = false;
      this.updateAudioButton();
    });
  },

  updateAudioButton() {
    if (!this.audioButton) return;

    this.audioButton.textContent = this.audioPlaying ? "⏸" : "▶";
    this.audioButton.setAttribute("aria-label", this.audioPlaying ? "Pause background audio" : "Play background audio");
  },

  /* Handle global errors and display contact modal */
  showErrorModal(title = "Oops! Something went wrong", message = "Please contact us for assistance") {
    const errorHTML = `
      <div class="error-modal-overlay" id="errorModal">
        <div class="error-modal">
          <button class="error-modal-close" onclick="veinStudio.closeErrorModal()">×</button>
          <h2>${title}</h2>
          <p>${message}</p>
          <div class="error-contact-info">
            <h3>Contact Vein Studioz</h3>
            <p><strong>Phone:</strong> <a href="tel:${this.studioPhone}">${this.studioPhone}</a></p>
            <p><strong>Email:</strong> <a href="mailto:${this.studioEmail}">${this.studioEmail}</a></p>
            <p><strong>Address:</strong> ${this.studioAddress}</p>
          </div>
          <button class="error-modal-close-btn" onclick="veinStudio.closeErrorModal()">Got it</button>
        </div>
      </div>
    `;
    
    const existingModal = document.getElementById("errorModal");
    if (existingModal) existingModal.remove();
    
    document.body.insertAdjacentHTML("beforeend", errorHTML);
    console.error(`[Error] ${title}: ${message}`);
  },
  
  closeErrorModal() {
    const modal = document.getElementById("errorModal");
    if (modal) modal.remove();
  },
  
  /* Validate link before opening */
  validateLink(url) {
    if (!url || url === "javascript:void(0)" || url === "#") {
      this.showErrorModal(
        "Feature Coming Soon",
        "This feature will be available soon. Please contact us to inquire about this demo."
      );
      return false;
    }
    return true;
  },
  
  /* Handle demo clicks (raw/processed vocals) */
  handleDemoClick(event) {
    event.preventDefault();
    const demoType = event.target.getAttribute("data-demo");
    this.showErrorModal(
      `${demoType.charAt(0).toUpperCase() + demoType.slice(1)} Vocals Demo`,
      "This demo link is being configured. Contact us to request access to our vocal samples."
    );
  },
  
  /* Handle category filter clicks */
  handleCategoryClick(event) {
    event.preventDefault();
    const category = event.target.getAttribute("data-category");
    this.showErrorModal(
      `${category.charAt(0).toUpperCase() + category.slice(1)} Songs Collection`,
      "This category collection link is being configured. Contact us for specific song recommendations."
    );
  }
};

/* ========== GLOBAL ERROR & RESOURCE HANDLING ========== */
window.addEventListener("error", (event) => {
  console.error("Global error caught:", event.error);
  if (event.filename && event.filename.includes(".png")) {
    console.warn(`Image failed to load: ${event.filename}`);
  }
});

window.addEventListener("unhandledrejection", (event) => {
  console.error("Unhandled promise rejection:", event.reason);
});

document.addEventListener("DOMContentLoaded", () => {
  /* ========== LINK VALIDATION ON PAGE LOAD ========== */
  /* Validate all external links */
  const allLinks = document.querySelectorAll("a[href]");
  allLinks.forEach((link) => {
    const href = link.getAttribute("href");
    if (href && !href.startsWith("javascript") && !href.startsWith("#") && !href.startsWith("tel:") && !href.startsWith("mailto:")) {
      link.addEventListener("click", (e) => {
        if (!veinStudio.validateLink(href)) {
          e.preventDefault();
        }
      });
    }
  });

  /* ========== PROJECT CATEGORY FILTERS ========== */
  const projectFilters = document.querySelectorAll(".project-filter");
  projectFilters.forEach((filter) => {
    filter.addEventListener("click", (e) => veinStudio.handleCategoryClick(e));
  });

  /* ========== MENU OVERLAY FUNCTIONALITY ========== */
  /* Selects DOM elements for menu interactions */
  const navToggle = document.querySelector(".nav-toggle");
  const nav = document.querySelector(".nav");
  const menuToggle = document.querySelector(".menu-toggle");
  const menuOverlay = document.querySelector(".menu-overlay");
  const menuLinks = document.querySelectorAll(".menu-overlay .hero-menu a");

  /* Navigation toggle if nav exists */
  if (navToggle && nav) {
    navToggle.addEventListener("click", () => {
      nav.classList.toggle("show");
    });
  }

  /* Menu overlay toggle with hamburger button */
  if (menuToggle && menuOverlay) {
    /* Toggle menu open/close on button click */
    menuToggle.addEventListener("click", () => {
      const isOpen = menuOverlay.classList.toggle("show");
      menuToggle.classList.toggle("open", isOpen);
      menuOverlay.setAttribute("aria-hidden", String(!isOpen));
    });

    /* Close menu when a link is clicked */
    menuLinks.forEach((link) => {
      link.addEventListener("click", () => {
        menuOverlay.classList.remove("show");
        menuToggle.classList.remove("open");
        menuOverlay.setAttribute("aria-hidden", "true");
      });
    });

    /* Close menu when clicking outside (on overlay background) */
    menuOverlay.addEventListener("click", (event) => {
      if (event.target === menuOverlay) {
        menuOverlay.classList.remove("show");
        menuOverlay.setAttribute("aria-hidden", "true");
      }
    });
  }

  /* ========== SCROLL REVEAL ANIMATION ========== */
  /* Elements with class "reveal" will fade in when they appear in viewport */
  const revealElements = document.querySelectorAll(".reveal");
  const observerOptions = {
    threshold: 0.15, /* Trigger animation when 15% of element is visible */
  };

  /* Intersection Observer for scroll-triggered animations */
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        revealObserver.unobserve(entry.target);
      }
    });
  }, observerOptions);

  revealElements.forEach((element) => revealObserver.observe(element));

  /* Initialize background audio after page load */
  /* Place your track in the audios/ folder (same filename or edit this path). */
  veinStudio.initBackgroundAudio("audios/DAYTO.mp3", 5000);
  
  console.log("Vein Studioz website initialized successfully");
});

/* ========== HOW TO EXTEND THIS CODE ========== */
/* 
 * To add new interactive features:
 * 1. Add a comment section with clear headers (like the ones above)
 * 2. Select your HTML elements using document.querySelector()
 * 3. Add event listeners (click, scroll, submit, etc.)
 * 4. Explain what each function does in comments
 * 5. Use veinStudio.showErrorModal() for user-facing error messages
 *
 * Common events to use:
 * - click: when user clicks an element
 * - submit: when form is submitted
 * - scroll: when page is scrolled
 * - change: when input value changes
 *
 * Example:
 * const button = document.querySelector('.my-button');
 * button.addEventListener('click', () => {
 *   console.log('Button was clicked!');
 * });
 */
