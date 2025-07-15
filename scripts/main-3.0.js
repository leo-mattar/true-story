document.addEventListener("DOMContentLoaded", function () {
  // --------------- GSAP ---------------
  gsap.registerPlugin(ScrollTrigger, CustomEase, Flip);

  gsap.config({
    nullTargetWarn: false,
    trialWarn: false,
  });

  let mm = gsap.matchMedia();

  // --------------- CUSTOM EASE ---------------
  CustomEase.create("ease-out-1", "0.25, 1, 0.5, 1");
  CustomEase.create("ease-in-out-1", "0.87, 0, 0.13, 1");

  // --------------- GLOBAL - RELOAD AT THE TOP ---------------
  window.addEventListener("beforeunload", function () {
    history.scrollRestoration = "manual";
  });

  // --------------- LENIS ---------------
  window.lenis = new Lenis();

  lenis.on("scroll", ScrollTrigger.update);

  gsap.ticker.add(time => {
    lenis.raf(time * 1000);
  });

  gsap.ticker.lagSmoothing(0);

  // --------------- PAPER TIGET SIGNATURE ---------------
  const pprtgr = [
    "color: #F2F3F3",
    "background: #080808",
    "font-size: 12px",
    "padding-left: 10px",
    "line-height: 2",
    "border-left: 5px solid #ff3c31",
  ].join(";");
  console.info(
    `

%cWebsite by Paper Tiger${" "}
www.papertiger.com${"     "}

`,
    pprtgr
  );

  // --------------- CURRENT YEAR ---------------
  const currentYear = document.querySelector("[current-year]");
  if (currentYear) {
    currentYear.innerHTML = new Date().getFullYear();
  }

  // --- PROJECTS FILTER
  function projectsFilter() {
    const filterList = document.querySelector(".c-proj-filter-list");
    const allBtn = document.querySelector("[data-filter-all-btn]");
    const filterForm = document.querySelector(".c-proj-filter-form-block");

    if (!filterList) return;

    filterList.prepend(allBtn);
    gsap.to(filterForm, { opacity: 1, duration: 0.8, ease: "power3.out" });
  }

  // --- CONTACT FORM
  function contactForm() {
    // Inputs
    const inputs = document.querySelectorAll(".c-form-input");
    const textareas = document.querySelectorAll(".c-form-textarea");

    if (inputs.length === 0 && textareas.length === 0) return;

    // Handle inputs
    inputs.forEach(input => {
      input.addEventListener("focus", () => {
        input.closest(".c-form-item").classList.add("input-focused");
      });
      input.addEventListener("blur", () => {
        input.closest(".c-form-item").classList.remove("input-focused");
      });
    });

    // Handle textareas
    textareas.forEach(textarea => {
      textarea.addEventListener("focus", () => {
        textarea.closest(".c-form-item").classList.add("input-focused");
      });
      textarea.addEventListener("blur", () => {
        textarea.closest(".c-form-item").classList.remove("input-focused");
      });
    });

    // Dropdowns
    const dropdowns = document.querySelectorAll(".c-form-dd");

    dropdowns.forEach(dropdown => {
      const toggle = dropdown.querySelector(".c-form-dd-toggle");
      const formItem = dropdown.closest(".c-form-item");

      if (!toggle || !formItem) return;

      const observer = new MutationObserver(mutations => {
        mutations.forEach(mutation => {
          if (mutation.attributeName === "class") {
            if (toggle.classList.contains("w--open")) {
              formItem.classList.add("input-focused");
            } else {
              formItem.classList.remove("input-focused");
            }
          }
        });
      });

      observer.observe(toggle, { attributes: true });
    });
  }

  // --- COPY TEXT BUTTONS
  function copyText() {
    const buttons = document.querySelectorAll("[data-btn-copy]");
    if (buttons.length === 0) return;

    buttons.forEach(button => {
      const btnText = button.querySelector("[data-btn-txt]");
      if (!btnText) return;

      button.addEventListener("click", () => {
        const originalText = btnText.textContent;

        navigator.clipboard
          .writeText(originalText)
          .then(() => {
            btnText.textContent = "Kopiert!";
            setTimeout(() => {
              btnText.textContent = originalText;
            }, 1500);
          })
          .catch(err => {
            console.error("Failed to copy text: ", err);
          });
      });
    });
  }

  // --- PROJECTS SINGLE MEDIA
  function projectsSingleMedia() {
    const items = document.querySelectorAll(".c-img-contain.proj-a");
    if (items.length === 0) return;
    items.forEach(item => {
      const video = item.querySelector(".c-video");
      const playBtn = item.querySelector(".c-icon.proj-play-btn");
      const progressContainer = item.querySelector(".c-custom-progress");
      const progressBar = item.querySelector(".c-custom-progress-bar");
      const audioBtn = item.querySelector(".c-audio-btn");
      if (!video || !playBtn) return;
      let isPlaying = false;

      if (video.muted) {
        item.classList.add("is-muted");
      }

      video.addEventListener("loadedmetadata", () => {
        if (audioBtn) {
          // Simple, reliable audio detection
          const hasAudio =
            video.mozHasAudio !== false ||
            (video.webkitAudioDecodedByteCount !== undefined &&
              video.webkitAudioDecodedByteCount > 0) ||
            (video.audioTracks && video.audioTracks.length > 0);

          audioBtn.style.display = hasAudio ? "flex" : "none";
        }
      });

      item.addEventListener("click", function () {
        if (!isPlaying) {
          isPlaying = true;
          video.play();
          item.classList.add("is-playing");
        } else {
          isPlaying = false;
          video.pause();
          item.classList.remove("is-playing");
        }
      });
      if (progressContainer && progressBar) {
        video.addEventListener("timeupdate", () => {
          const progress = (video.currentTime / video.duration) * 100;
          progressBar.style.width = progress + "%";
        });
        progressContainer.addEventListener("click", e => {
          e.stopPropagation();
          const rect = progressContainer.getBoundingClientRect();
          const clickX = e.clientX - rect.left;
          const clickRatio = clickX / rect.width;
          video.currentTime = clickRatio * video.duration;
        });
      }
      if (audioBtn) {
        audioBtn.addEventListener("click", e => {
          e.stopPropagation();
          if (video.muted) {
            video.muted = false;
            item.classList.remove("is-muted");
          } else {
            video.muted = true;
            item.classList.add("is-muted");
          }
        });
      }
    });
  }

  // --- PROJECTS SINGLE - GALLERY SLIDER
  function gallerySlider() {
    const sliderEl = document.querySelector(".swiper.proj-gallery");
    const slides = document.querySelectorAll(".c-img-contain.proj-a.slide");
    if (!sliderEl || slides.length === 0) return;

    const slider = new Swiper(sliderEl, {
      slidesPerView: "auto",
      speed: 600,
      grabCursor: true,
      navigation: {
        nextEl: ".swiper-next.proj-gallery",
        prevEl: ".swiper-prev.proj-gallery",
      },
      breakpoints: {
        320: {
          spaceBetween: 8,
        },
        992: {
          spaceBetween: 24,
        },
      },
    });
  }

  // --- PROJECTS/TEAM/RELATED PROJECTS SLIDER
  // function projectsSlider() {
  //   const sliderEl = document.querySelector(".swiper.projects");
  //   if (!sliderEl) return;

  //   const slider = new Swiper(sliderEl, {
  //     slidesPerView: "auto",
  //     grabCursor: true,
  //     speed: 600,
  //     loop: true,
  //     navigation: {
  //       nextEl: ".swiper-next.projects",
  //       prevEl: ".swiper-prev.projects",
  //     },
  //     autoplay: {
  //       delay: 5000,
  //       disableOnInteraction: false,
  //     },
  //     breakpoints: {
  //       320: {
  //         spaceBetween: 8,
  //       },
  //       992: {
  //         spaceBetween: 24,
  //       }
  //     },
  //   });

  //   // Use Intersection Observer to detect visibility
  //   const observer = new IntersectionObserver(
  //     ([entry]) => {
  //       if (entry.isIntersecting) {
  //         slider.autoplay.start();
  //       } else {
  //         slider.autoplay.stop();
  //       }
  //     },
  //     {
  //       threshold: 0.5,
  //     }
  //   );

  //   observer.observe(sliderEl);
  // }

  function projectsSlider() {
    const sliderEl = document.querySelector(".swiper.projects");
    if (!sliderEl) return;

    const slider = new Swiper(sliderEl, {
      slidesPerView: "auto",
      grabCursor: true,
      speed: 600,
      // loop: true,
      navigation: {
        nextEl: ".swiper-next.projects",
        prevEl: ".swiper-prev.projects",
      },
      // autoplay: {
      //   delay: 5000,
      //   disableOnInteraction: false,
      // },
      breakpoints: {
        320: {
          spaceBetween: 8,
        },
        992: {
          spaceBetween: 24,
        },
      },
    });

    // Handle slide change after Swiper is initialized
    slider.on("slideChange", function () {
      const titleEl = document.querySelector(".c-projects-title");
      const viewportWidth = window.innerWidth;

      if (viewportWidth >= 992) {
        const realIndex = slider.realIndex;

        if (titleEl) {
          titleEl.style.opacity = realIndex >= 1 ? "0" : "1";
        }

        sliderEl.style.transform =
          realIndex >= 1 ? "translateX(0)" : "translateX(35em)";
      } else {
        // Clear transform and show title when below 992px
        if (titleEl) titleEl.style.opacity = "1";
        sliderEl.style.transform = "";
      }
    });

    // Use Intersection Observer to detect visibility
    // const observer = new IntersectionObserver(
    //   ([entry]) => {
    //     if (entry.isIntersecting) {
    //       slider.autoplay.start();
    //     } else {
    //       slider.autoplay.stop();
    //     }
    //   },
    //   {
    //     threshold: 0.5,
    //   }
    // );

    // observer.observe(sliderEl);
  }

  // --- MARQUEE
  function marquee() {
    const tickerSections = document.querySelectorAll(".c-section.marquee");
    if (!tickerSections) return;
    tickerSections.forEach(section => {
      const ticker = section.querySelector(".c-marquee");
      const logoList = section.querySelector(".c-marquee-list");
      if (!logoList || !ticker) return;

      const duplicatedList1 = logoList.cloneNode(true);
      const duplicatedList2 = logoList.cloneNode(true);

      ticker.appendChild(duplicatedList1);
      ticker.appendChild(duplicatedList2);

      const charCount = logoList.textContent.length;
      const marqueeDuration =
        window.innerWidth <= 479 ? charCount * 0.3 : charCount * 0.5;

      const tl = gsap.timeline();
      tl.to([logoList, duplicatedList1, duplicatedList2], {
        xPercent: -100,
        duration: marqueeDuration,
        ease: "linear",
        repeat: -1,
      });
    });
  }

  // --- FOOTER LOGO ANIMATION
  function footerLogoAnimation() {
    const footerSection = document.querySelector(".c-section.footer");
    const footerLogo = document.querySelector(".c-logo-footer");

    if (!footerSection || !footerLogo) return;

    // gsap.to(footerLogo, {
    //   rotation: 160,
    //   ease: "none",
    //   scrollTrigger: {
    //     trigger: footerSection,
    //     start: "top bottom",
    //     end: "bottom top",
    //     scrub: true,
    //   }
    // });

    gsap.to(footerLogo, {
      rotation: 360,
      ease: "none",
      duration: 50,
      repeat: -1,
      transformOrigin: "center center",
    });
  }

  // --- PARALLAX
  function parallax() {
    const images = document.querySelectorAll("[parallax]");

    if (images) {
      new Ukiyo(images, {
        scale: 1.2,
        speed: 1.2,
        // willChange: true,
      });
    }
  }

  // --- HOME TEAM SECTION
  // function homeTeamSection() {
  //   const section = document.querySelector(".c-section.hm-team");
  //   if (!section) return;

  //   const tl = gsap.timeline({
  //     scrollTrigger: {
  //       trigger: section,
  //       start: "top center",
  //       end: "bottom top",
  //       scrub: 1,
  //     }
  //   });

  //   tl.to(".c-img-contain.team-1", { yPercent: 15 });
  //   tl.to(".c-img-contain.team-2", { yPercent: -5 }, 0);
  //   tl.to(".c-img-contain.team-3", { yPercent: 15 }, 0);
  //   tl.to(".c-img-contain.team-4", { yPercent: 10 }, 0);
  //   tl.to(".c-img-contain.team-5", { yPercent: 15 }, 0);

  //   // Magnetic hover effect
  //   const images = document.querySelectorAll(".c-hm-team .c-img-contain");

  //   images.forEach(img => {
  //     // Set initial position to zero to avoid jump on first hover
  //     gsap.set(img, { x: 0, y: 0 });

  //     let bounds = null;
  //     const moveX = gsap.quickTo(img, "x", { duration: 0.3, ease: "power3.out" });
  //     const moveY = gsap.quickTo(img, "y", { duration: 0.3, ease: "power3.out" });

  //     function onMouseMove(e) {
  //       if (!bounds) bounds = img.getBoundingClientRect();
  //       const relX = e.clientX - bounds.left;
  //       const relY = e.clientY - bounds.top;
  //       const x = (relX - bounds.width / 2) / bounds.width * 75;
  //       const y = (relY - bounds.height / 2) / bounds.height * 75;
  //       moveX(x);
  //       moveY(y);
  //     }

  //     function onMouseLeave() {
  //       moveX(0);
  //       moveY(0);
  //     }

  //     img.addEventListener("mouseenter", () => {
  //       bounds = img.getBoundingClientRect();
  //       img.addEventListener("mousemove", onMouseMove);
  //     });

  //     img.addEventListener("mouseleave", () => {
  //       onMouseLeave();
  //       img.removeEventListener("mousemove", onMouseMove);
  //       bounds = null;
  //     });
  //   });
  // }

  function homeTeamSection() {
    const section = document.querySelector(".c-section.hm-team");
    if (!section) return;

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: "top center",
        end: "bottom top",
        scrub: 1,
      },
    });

    tl.to(".c-img-contain.team-1", { yPercent: 15 });
    tl.to(".c-img-contain.team-2", { yPercent: -5 }, 0);
    tl.to(".c-img-contain.team-3", { yPercent: 15 }, 0);
    tl.to(".c-img-contain.team-4", { yPercent: 10 }, 0);
    tl.to(".c-img-contain.team-5", { yPercent: 15 }, 0);

    // Call magnetic effect on your images, customize selector and strength here
    applyMagneticEffect(".c-hm-team .c-img-contain", {
      strength: 75,
      duration: 0.3,
    });
  }

  // Magnetic hover effect function
  function applyMagneticEffect(selector, options = {}) {
    const elements = document.querySelectorAll(selector);
    const strength = options.strength ?? 50; // max pixels to move
    const duration = options.duration ?? 0.3;
    const ease = options.ease || "power3.out";

    elements.forEach(el => {
      gsap.set(el, { x: 0, y: 0 });

      let bounds = null;
      const moveX = gsap.quickTo(el, "x", { duration, ease });
      const moveY = gsap.quickTo(el, "y", { duration, ease });

      function onMouseMove(e) {
        if (!bounds) bounds = el.getBoundingClientRect();
        const relX = e.clientX - bounds.left;
        const relY = e.clientY - bounds.top;
        const x = ((relX - bounds.width / 2) / bounds.width) * strength;
        const y = ((relY - bounds.height / 2) / bounds.height) * strength;
        moveX(x);
        moveY(y);
      }

      function onMouseLeave() {
        moveX(0);
        moveY(0);
        bounds = null;
      }

      el.addEventListener("mouseenter", () => {
        bounds = el.getBoundingClientRect();
        el.addEventListener("mousemove", onMouseMove);
      });

      el.addEventListener("mouseleave", () => {
        onMouseLeave();
        el.removeEventListener("mousemove", onMouseMove);
      });
    });
  }

  // --- TEAM PAGE SECTION
  function teamPageSection() {
    const section = document.querySelector(".c-section.team");
    if (!section) return;

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: "top center",
        end: "bottom top",
        scrub: 1,
      },
    });

    tl.to(".c-img-contain.team-comp-1", {
      yPercent: -20,
    });

    tl.to(
      ".c-img-contain.team-comp-2",
      {
        yPercent: 15,
      },
      0
    );

    tl.to(
      ".c-img-contain.team-comp-3",
      {
        yPercent: -10,
      },
      0
    );

    tl.to(
      ".c-img-contain.team-comp-4",
      {
        yPercent: 15,
      },
      0
    );

    tl.to(
      ".c-img-contain.team-comp-5",
      {
        yPercent: 15,
      },
      0
    );

    tl.to(
      ".c-img-contain.team-comp-6",
      {
        yPercent: -20,
      },
      0
    );

    tl.to(
      ".c-img-contain.team-comp-7",
      {
        yPercent: -15,
      },
      0
    );

    applyMagneticEffect(".c-section.team .c-img-contain", {
      strength: 75,
      duration: 0.3,
    });
  }

  // --- PILLS HOVER ANIMATION
  function pillsHoverAnimation() {
    const pills = document.querySelectorAll(".u-pill");

    pills.forEach(pill => {
      if (pill.querySelector(".u-pill-txt")) return;

      const wrapper = document.createElement("div");
      wrapper.classList.add("u-pill-txt");

      while (pill.firstChild) {
        wrapper.appendChild(pill.firstChild);
      }

      pill.appendChild(wrapper);

      const tl = gsap.timeline({ paused: true });

      tl.to(wrapper, {
        rotation: -3,
        ease: "bounce.out",
        duration: 0.6,
      });

      pill.addEventListener("mouseenter", function () {
        tl.timeScale(1);
        tl.restart();
      });

      pill.addEventListener("mouseleave", function () {
        tl.timeScale(2);
        tl.reverse();
      });
    });
  }

  // --- HOME LOADER
  function homeLoader() {
    const loader = document.querySelector(".c-loader");
    if (!loader) return;

    lenis.stop();

    const tl = gsap.timeline({
      delay: 0.5,
      defaults: {
        ease: "ease-out-1",
        duration: 1.4,
      },
    });

    gsap.set([".t-headline-3xl.hm-hero", ".c-img-contain.hm-hero-visual"], {
      yPercent: 30,
    });
    gsap.set(".c-header", { yPercent: -100 });

    tl.to(".c-loader-logo-mask", {
      clipPath: "inset(0% 0% 0% 0%)",
      duration: 3,
    });

    tl.to(".c-loader-logo-wrap", {
      yPercent: 25,
      opacity: 0,
      duration: 0.8,
      onComplete: () => {
        loader.style.display = "none";
      },
    });

    tl.to(".c-video.hm-hero", {
      autoAlpha: 1,
      duration: 1,
    });

    tl.to(
      [".t-headline-3xl.hm-hero", ".c-img-contain.hm-hero-visual"],
      {
        yPercent: 0,
        autoAlpha: 1,
        stagger: 0.3,
      },
      "<0.2"
    );

    tl.to(
      ".c-header",
      {
        yPercent: 0,
        autoAlpha: 1,
        onEnter: () => {
          lenis.start();
          document.querySelector(".c-body").classList.remove("no-scroll");
          homeHeroScrollAnimation();
        },
      },
      "<0.2"
    );
  }

  // --- HOME HERO VISUAL SCROLL ANIMATION
  // function homeHeroScrollAnimation() {
  //   const heroSection = document.querySelector(".c-section.hm-hero");
  //   if (!heroSection) return;

  //   const visual = document.querySelector(".c-img-contain.hm-hero-visual");

  //   gsap.to(visual, {
  //     width: "100%",
  //     height: "100%",
  //     borderRadius: "0em",
  //     x: "0",
  //     y: "0",
  //     ease: "linear",
  //     scrollTrigger: {
  //       trigger: heroSection,
  //       start: "top top",
  //       end: "bottom bottom+=200",
  //       scrub: true
  //     }
  //   })
  // }
  function homeHeroScrollAnimation() {
    const heroSection = document.querySelector(".c-section.hm-hero");
    if (!heroSection) return;

    const visual = document.querySelector(".c-img-contain.hm-hero-visual");

    gsap.to(visual, {
      width: "100%",
      height: "100%",
      borderRadius: "0em",
      x: "0",
      y: "0",
      ease: "linear",
      scrollTrigger: {
        trigger: heroSection,
        start: "top top",
        end: "bottom bottom+=200",
        scrub: true,
      },
    });

    // Clear inline styles on resize
    window.addEventListener("resize", () => {
      // Clear all GSAP inline styles on the visual element
      gsap.set(visual, {
        clearProps: "height",
      });
    });
  }

  // --- LOGO HOVER ANIMATION
  function logoHoverAnimation() {
    const logo = document.querySelector(".c-logo-link");
    const activeClass = "is-ts";

    logo.addEventListener("mouseenter", function () {
      logo.classList.toggle(activeClass);
    });

    logo.addEventListener("mouseleave", function () {
      logo.classList.toggle(activeClass);
    });
  }

  // --- HEADER SCROLLED
  function headerScrolled() {
    const header = document.querySelector(".c-header");
    const logo = document.querySelector(".c-logo-link");

    if (!header || !logo) return;

    ScrollTrigger.create({
      trigger: "body",
      start: "50 top",
      onToggle: self => {
        if (self.isActive) {
          header.classList.add("scrolled");
          logo.classList.add("is-ts");
        } else {
          header.classList.remove("scrolled");
          logo.classList.remove("is-ts");
        }
      },
    });
  }

  // --- GLOBAL FADE ANIMATION
  function fade() {
    const allFadeElements = document.querySelectorAll("[fade]");
    const exclusions = ['[data-wf--global-pill--style="small-outline"]'];
    const isExcluded = el => exclusions.some(selector => el.matches(selector));
    const fadeElements = Array.from(allFadeElements).filter(
      el => !isExcluded(el)
    );

    gsap.set(fadeElements, {
      opacity: 0,
      y: "5em",
    });

    ScrollTrigger.batch(fadeElements, {
      once: true,
      onEnter: batch => {
        const staggerAmount = 0.15;

        batch.forEach((element, index) => {
          const staggerDelay = index * staggerAmount;
          const customDuration = element.getAttribute("fade-duration")
            ? parseFloat(element.getAttribute("fade-duration"))
            : 1.2;

          gsap.to(element, {
            opacity: 1,
            y: 0,
            duration: customDuration,
            delay: staggerDelay,
            ease: "ease-out-1",
            onComplete: () => {
              if (
                element.hasAttribute("fade-clear-styles") &&
                window.innerWidth >= 992
              ) {
                element.removeAttribute("style");
                element.style.opacity = 1;
              }
            },
          });
        });
      },
    });
  }

  // --- SKIP TO MAIN CONTENT
  function skipToMain() {
    document
      .getElementById("skip-link")
      ?.addEventListener("click", function (e) {
        const main = document.getElementById("smooth-wrapper");
        if (main) {
          main.setAttribute("tabindex", "-1");
          main.focus();
          main.addEventListener(
            "blur",
            () => main.removeAttribute("tabindex"),
            {
              once: true,
            }
          );
        }
      });
  }

  // --- HEADER MOBILE
  function headerMobile() {
    const header = document.querySelector(".c-header");
    const navBtn = document.querySelector(".c-nav-btn");
    const navMenu = document.querySelector(".c-header-nav");
    const menuLine1 = document.querySelectorAll(".c-nav-bar.is-1");
    const menuLine2 = document.querySelectorAll(".c-nav-bar.is-2");
    const menuLine3 = document.querySelectorAll(".c-nav-bar.is-3");
    let navStatus = "closed";

    const tl = gsap.timeline({
      paused: true,
      defaults: { ease: "expo.inOut", duration: 1 },
    });

    gsap.set(menuLine1, { transformOrigin: "center center" });
    gsap.set(menuLine2, { transformOrigin: "center center" });
    gsap.set(menuLine3, { transformOrigin: "center center" });

    tl.to(navMenu, { clipPath: "inset(0% 0% 0% 0%)", opacity: 1 });
    tl.to(menuLine1, { rotation: 45, y: 8 }, 0);
    tl.to(menuLine2, { width: 0 }, 0);
    tl.to(menuLine3, { rotation: -45, y: -8, width: 32 }, 0);

    tl.call(
      () => {
        if (tl.reversed()) {
          gsap.set(header, { mixBlendMode: "difference" });
        }
      },
      null,
      "-=0.7"
    );

    tl.eventCallback("onStart", () => {
      gsap.delayedCall(0.2, () => {
        gsap.set(header, { mixBlendMode: "normal" });
      });
    });

    // tl.eventCallback("onReverseComplete", () => {
    //   gsap.set(header, { mixBlendMode: "difference" });
    // });

    navBtn.addEventListener("click", function () {
      if (navStatus === "closed") {
        tl.restart();
        navStatus = "open";
        lenis.stop();
      } else {
        tl.reverse();
        navStatus = "closed";
        lenis.start();
      }
    });
  }

  // --- PROJECT HERO FADE
  function projectHeroFade() {
    const section = document.querySelector(".c-section.proj-media");
    const overlay = document.querySelector(".c-overlay");

    if (!section || !overlay) return;

    gsap.to(overlay, {
      duration: 1.8,
      ease: "ease-out-1",
      opacity: 0,
      delay: 0.3,
    });
  }

  // --- THEME COLORS TRANSITION
  // function themeColorsTransition() {
  //   const themeSections = document.querySelectorAll('[section-theme]');

  //   document.querySelectorAll('.c-section').forEach(section => {
  //     if (section.hasAttribute('data-fade-bg')) {
  //       let endValue = 'bottom center';

  //       if (section.hasAttribute('data-scroll-end')) {
  //         endValue = section.getAttribute('data-scroll-end');
  //       }

  //       ScrollTrigger.create({
  //         trigger: section,
  //         start: 'top center',
  //         end: endValue,
  //         onEnter: toggleThemes,
  //         onEnterBack: toggleThemes,
  //         onLeave: toggleThemes,
  //         onLeaveBack: toggleThemes,
  //         markers: true
  //       });
  //     }
  //   });

  //   function toggleThemes() {
  //     themeSections.forEach(sec => {
  //       if (sec.hasAttribute('data-fade-exclude') || sec.getAttribute('data-bg-fade') === 'false')
  //         return;
  //       const current = sec.getAttribute('section-theme');
  //       sec.setAttribute('section-theme', current === 'dark' ? '' : 'dark');
  //     });
  //   }
  // }
  function themeColorsTransition() {
    const themeSections = document.querySelectorAll("[section-theme]");

    document.querySelectorAll(".c-section").forEach(section => {
      const fadeBgAttr = section.getAttribute("data-fade-bg");

      // Skip this section if data-fade-bg is explicitly set to 'false'
      if (fadeBgAttr !== null && fadeBgAttr.toLowerCase() === "false") return;

      if (fadeBgAttr !== null) {
        let endValue = "bottom center";

        if (section.hasAttribute("data-scroll-end")) {
          endValue = section.getAttribute("data-scroll-end");
        }

        ScrollTrigger.create({
          trigger: section,
          start: "top center",
          end: endValue,
          onEnter: toggleThemes,
          onEnterBack: toggleThemes,
          onLeave: toggleThemes,
          onLeaveBack: toggleThemes,
        });
      }
    });

    function toggleThemes() {
      themeSections.forEach(sec => {
        if (
          sec.hasAttribute("data-fade-exclude") ||
          sec.getAttribute("data-bg-fade") === "false"
        )
          return;

        const current = sec.getAttribute("section-theme");
        sec.setAttribute("section-theme", current === "dark" ? "" : "dark");
      });
    }
  }

  // --------------- PROJECTS SINGLE VIDEO CONTROLS ---------------
  function projectsSingleVideoAudio() {
    const videoElements = [];

    document.querySelectorAll(".c-video-wrap").forEach(videoWrap => {
      const audioButton = videoWrap.querySelector(".c-icon.player-audio");
      const video = videoWrap.querySelector(".c-video");

      if (audioButton && video) {
        videoElements.push({ audioButton, video });

        audioButton.addEventListener("click", function () {
          audioButton.classList.toggle("is-playing");

          if (video.muted) {
            video.muted = false;
          } else {
            video.muted = true;
          }
        });
      }
    });

    function resetVideosToDefault() {
      videoElements.forEach(({ audioButton, video }) => {
        audioButton.classList.remove("is-playing");
        video.pause();
        video.muted = true;
      });
    }

    let previousWidth = window.innerWidth;

    window.addEventListener("resize", function () {
      const currentWidth = window.innerWidth;

      if (
        (previousWidth > 479 && currentWidth <= 479) ||
        (previousWidth <= 479 && currentWidth > 479)
      ) {
        resetVideosToDefault();
      }

      previousWidth = currentWidth;
    });
  }

  const homepage = document.querySelector("[data-page='homepage']");
  const projectsSingle = document.querySelector(
    "[data-page='projects-single']"
  );

  // --------------- INIT ---------------
  function init() {
    projectsFilter();
    contactForm();
    copyText();
    projectsSingleMedia();
    gallerySlider();
    projectsSlider();
    marquee();
    footerLogoAnimation();
    homeLoader();
    logoHoverAnimation();
    headerScrolled();
    skipToMain();
    homeTeamSection();
    teamPageSection();
    projectHeroFade();
    themeColorsTransition();
    if (projectsSingle) {
      projectsSingleVideoAudio();
    }
  }

  init();

  // --------------- MATCHMEDIA (DESKTOP) ---------------
  mm.add("(min-width: 992px)", () => {
    parallax();
    pillsHoverAnimation();
    fade();
    return () => {
      //
    };
  });

  // --------------- MATCHMEDIA (TABLET AND MOBILE) ---------------
  mm.add("(max-width: 991px)", () => {
    headerMobile();
    return () => {
      //
    };
  });
});
