(function () {
  "use strict";

  const doc = document;
  const root = doc.documentElement;
  const body = doc.body;
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const nav = doc.querySelector(".site-nav");
  const menuToggle = doc.querySelector(".menu-toggle");
  const backToTop = doc.querySelector(".back-to-top");
  const contactFloat = doc.querySelector("[data-contact-float]");
  const firstContentSection = doc.querySelector(".content-section");
  const videos = Array.from(doc.querySelectorAll("video[autoplay]"));
  let rafQueued = false;

  function setupLineSidebar() {
    const sidebar = doc.querySelector("[data-line-sidebar]");
    if (!sidebar) return function () {};

    const panel = sidebar.querySelector(".line-sidebar__panel");
    const toggle = sidebar.querySelector(".line-sidebar__toggle");
    const list = sidebar.querySelector(".line-sidebar__list");
    const items = Array.from(sidebar.querySelectorAll(".line-sidebar__item"));
    const links = Array.from(sidebar.querySelectorAll("[data-sidebar-link]"));
    const count = sidebar.querySelector("[data-sidebar-count]");
    const sections = links.map(function (link) { return doc.querySelector(link.getAttribute("href")); });
    const mobileMode = window.matchMedia("(max-width: 1179px)");
    const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");
    const effectTargets = items.map(function () { return 0; });
    const effectValues = items.map(function (item) { return Number.parseFloat(item.style.getPropertyValue("--effect")) || 0; });
    let activeIndex = 0;
    let effectFrame = null;
    let effectTime = 0;

    function runEffects(now) {
      const dt = Math.min((now - effectTime) / 1000, .05);
      const ease = 1 - Math.exp(-dt / .1);
      let moving = false;
      effectTime = now;
      items.forEach(function (item, index) {
        const target = Math.max(effectTargets[index], activeIndex === index ? 1 : 0);
        const next = effectValues[index] + (target - effectValues[index]) * ease;
        const settled = Math.abs(target - next) < .0015;
        effectValues[index] = settled ? target : next;
        item.style.setProperty("--effect", effectValues[index].toFixed(4));
        if (!settled) moving = true;
      });
      effectFrame = moving ? window.requestAnimationFrame(runEffects) : null;
    }

    function startEffects() {
      if (effectFrame !== null) return;
      effectTime = performance.now();
      effectFrame = window.requestAnimationFrame(runEffects);
    }

    function setOpen(open) {
      sidebar.classList.toggle("is-open", open);
      if (toggle) {
        toggle.setAttribute("aria-expanded", String(open));
        toggle.setAttribute("aria-label", open ? "关闭作品目录" : "打开作品目录");
      }
      if (panel) panel.setAttribute("aria-hidden", String(mobileMode.matches && !open));
    }

    function setActive(index) {
      activeIndex = Math.max(0, Math.min(index, items.length - 1));
      links.forEach(function (link, itemIndex) {
        if (itemIndex === activeIndex) link.setAttribute("aria-current", "true");
        else link.removeAttribute("aria-current");
      });
      if (count) count.textContent = String(activeIndex + 1).padStart(2, "0") + "/" + String(items.length).padStart(2, "0");
      startEffects();
    }

    function updateActiveSection() {
      const readingLine = window.scrollY + window.innerHeight * .4;
      let nextIndex = 0;
      sections.forEach(function (section, index) {
        if (!section) return;
        const sectionTop = section.getBoundingClientRect().top + window.scrollY;
        if (sectionTop <= readingLine) nextIndex = index;
      });
      if (nextIndex !== activeIndex) setActive(nextIndex);
    }

    if (toggle) {
      toggle.addEventListener("click", function () {
        setOpen(!sidebar.classList.contains("is-open"));
      });
    }

    links.forEach(function (link, index) {
      link.addEventListener("click", function (event) {
        const target = sections[index];
        if (!target) return;
        event.preventDefault();
        setActive(index);
        setOpen(false);
        target.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" });
        if (window.history && window.history.replaceState) window.history.replaceState(null, "", link.getAttribute("href"));
      });
    });

    if (list && finePointer.matches) {
      list.addEventListener("pointermove", function (event) {
        items.forEach(function (item, index) {
          const rect = item.getBoundingClientRect();
          const distance = Math.abs(event.clientY - (rect.top + rect.height / 2));
          const linear = Math.max(0, 1 - distance / 100);
          effectTargets[index] = linear * linear * (3 - 2 * linear);
        });
        startEffects();
      });
      list.addEventListener("pointerleave", function () {
        effectTargets.fill(0);
        startEffects();
      });
    }

    doc.addEventListener("click", function (event) {
      if (mobileMode.matches && !sidebar.contains(event.target)) setOpen(false);
    });
    doc.addEventListener("keydown", function (event) {
      if (event.key === "Escape" && sidebar.classList.contains("is-open")) {
        setOpen(false);
        if (toggle) toggle.focus();
      }
    });
    mobileMode.addEventListener("change", function () { setOpen(false); });

    setOpen(false);
    setActive(0);
    return updateActiveSection;
  }

  const updateLineSidebar = setupLineSidebar();

  function revealNearbyMedia() {
    doc.querySelectorAll(".media-reveal:not(.is-revealed)").forEach(function (element) {
      const rect = element.getBoundingClientRect();
      if (rect.top < window.innerHeight * 1.45 && rect.bottom > -window.innerHeight * 0.4) {
        revealImmediately(element, Number(element.dataset.staggerDelay || 0));
      }
    });
  }

  function updateChrome() {
    const scrolled = window.scrollY > 6;
    if (nav) nav.classList.toggle("is-floating", scrolled);
    if (backToTop) backToTop.classList.toggle("is-visible", window.scrollY > window.innerHeight * 0.65);
    if (firstContentSection) {
      body.classList.toggle("aurora-visible", window.scrollY > firstContentSection.offsetTop - window.innerHeight * 0.72);
    }
    updateLineSidebar();
    revealNearbyMedia();
    rafQueued = false;
  }

  function requestChromeUpdate() {
    if (!rafQueued) {
      rafQueued = true;
      window.requestAnimationFrame(updateChrome);
    }
  }

  updateChrome();
  window.addEventListener("scroll", requestChromeUpdate, { passive: true });
  window.addEventListener("resize", requestChromeUpdate, { passive: true });

  if (menuToggle) {
    menuToggle.addEventListener("click", function () {
      const open = body.classList.toggle("menu-open");
      menuToggle.setAttribute("aria-expanded", String(open));
      menuToggle.setAttribute("aria-label", open ? "关闭导航" : "打开导航");
      const label = menuToggle.querySelector("span");
      if (label) label.textContent = open ? "CLOSE" : "MENU";
    });
  }

  doc.querySelectorAll(".nav-links a").forEach(function (link) {
    link.addEventListener("click", function () {
      body.classList.remove("menu-open");
      if (menuToggle) menuToggle.setAttribute("aria-expanded", "false");
      if (menuToggle && menuToggle.querySelector("span")) menuToggle.querySelector("span").textContent = "MENU";
    });
  });

  if (backToTop) {
    backToTop.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" });
    });
  }

  if (contactFloat) {
    const contactToggle = contactFloat.querySelector(".contact-toggle");
    const contactPanel = contactFloat.querySelector(".contact-panel");
    const copyWechat = contactFloat.querySelector("[data-copy-wechat]");
    const copyStatus = contactFloat.querySelector("[data-contact-status]");

    function setContactOpen(open) {
      contactFloat.classList.toggle("is-open", open);
      contactToggle.setAttribute("aria-expanded", String(open));
      contactToggle.setAttribute("aria-label", open ? "关闭联系方式" : "打开联系方式");
      contactPanel.setAttribute("aria-hidden", String(!open));
    }

    contactToggle.addEventListener("click", function () {
      setContactOpen(!contactFloat.classList.contains("is-open"));
    });

    doc.addEventListener("click", function (event) {
      if (!contactFloat.contains(event.target)) setContactOpen(false);
    });

    doc.addEventListener("keydown", function (event) {
      if (event.key === "Escape" && contactFloat.classList.contains("is-open")) {
        setContactOpen(false);
        contactToggle.focus();
      }
    });

    if (copyWechat) {
      copyWechat.addEventListener("click", function () {
        const value = "www6561628";
        const copied = navigator.clipboard && window.isSecureContext
          ? navigator.clipboard.writeText(value)
          : new Promise(function (resolve, reject) {
              const field = doc.createElement("textarea");
              field.value = value;
              field.setAttribute("readonly", "");
              field.style.position = "fixed";
              field.style.opacity = "0";
              doc.body.appendChild(field);
              field.select();
              try {
                doc.execCommand("copy") ? resolve() : reject(new Error("copy failed"));
              } catch (error) {
                reject(error);
              }
              field.remove();
            });
        copied.then(function () {
          if (copyStatus) copyStatus.textContent = "微信号已复制：" + value;
          const label = copyWechat.querySelector(".contact-option-value");
          if (label) {
            const original = label.textContent;
            label.textContent = "已复制微信号 " + value;
            window.setTimeout(function () { label.textContent = original; }, 1800);
          }
        }).catch(function () {
          if (copyStatus) copyStatus.textContent = "微信号：" + value;
        });
      });
    }
  }

  function revealImmediately(element, delay) {
    if (!element) return;
    if (delay) element.style.transitionDelay = delay + "ms";
    element.classList.add("is-revealed");
  }

  root.classList.add("motion-ready");

  window.requestAnimationFrame(function () {
    const activeHero = window.matchMedia("(max-width: 900px)").matches
      ? doc.querySelector(".mobile-hero")
      : doc.querySelector(".desktop-hero");
    revealImmediately(activeHero && activeHero.querySelector(".hero-video-layer, .mobile-video-stage"), 0);
    revealImmediately(activeHero && activeHero.querySelector("[data-reveal-title]"), 240);
    (activeHero ? activeHero.querySelectorAll("[data-reveal]") : []).forEach(function (element, index) {
      revealImmediately(element, 440 + index * 110);
    });
  });

  const motionSections = Array.from(doc.querySelectorAll(".content-section, .booking-section"));
  const revealTargets = [];

  motionSections.forEach(function (section) {
    const titles = Array.from(section.querySelectorAll("[data-reveal-title]"));
    const supporting = Array.from(section.querySelectorAll("[data-reveal]:not([data-reveal-title])"));
    const cards = Array.from(section.querySelectorAll("[data-stagger-item], .media-reveal"));

    titles.forEach(function (element, index) {
      element.dataset.staggerDelay = String(index * 90);
      revealTargets.push(element);
    });
    supporting.forEach(function (element, index) {
      element.dataset.staggerDelay = String(190 + Math.min(index, 4) * 100);
      revealTargets.push(element);
    });
    cards.forEach(function (element, index) {
      element.dataset.staggerDelay = String(360 + Math.min(index % 6, 5) * 125);
      revealTargets.push(element);
    });
  });

  if (reduceMotion || !("IntersectionObserver" in window)) {
    revealTargets.forEach(function (element) { revealImmediately(element, 0); });
  } else {
    const observer = new IntersectionObserver(function (entries, currentObserver) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        const delay = Number(entry.target.dataset.staggerDelay || 0);
        revealImmediately(entry.target, delay);
        currentObserver.unobserve(entry.target);
      });
    }, { rootMargin: "18% 0px 18% 0px", threshold: 0.01 });

    revealTargets.forEach(function (element) { observer.observe(element); });
  }

  if (!reduceMotion && window.matchMedia("(min-width: 901px)").matches) {
    const parallaxItems = Array.from(doc.querySelectorAll(".featured-card img, .portfolio-gallery img"));
    let parallaxFrame = false;
    function renderParallax() {
      parallaxItems.forEach(function (element) {
        const rect = element.getBoundingClientRect();
        if (rect.bottom < 0 || rect.top > window.innerHeight) return;
        const centerOffset = (rect.top + rect.height / 2 - window.innerHeight / 2) / window.innerHeight;
        element.style.translate = "0 " + Math.round(centerOffset * -22) + "px";
      });
      parallaxFrame = false;
    }
    window.addEventListener("scroll", function () {
      if (!parallaxFrame) {
        parallaxFrame = true;
        window.requestAnimationFrame(renderParallax);
      }
    }, { passive: true });
    renderParallax();
  }

  videos.forEach(function (video) {
    video.muted = true;
    const attemptPlay = function () { video.play().catch(function () {}); };
    attemptPlay();
    video.addEventListener("canplay", attemptPlay, { once: true });
  });

  const mobileVideo = doc.querySelector("#mobile-hero-video");
  const playButton = doc.querySelector("[data-video-play]");
  const fullscreenButton = doc.querySelector("[data-video-fullscreen]");

  if (mobileVideo && playButton) {
    playButton.addEventListener("click", function () {
      if (mobileVideo.paused) {
        mobileVideo.play().catch(function () {});
        playButton.textContent = "暂停";
      } else {
        mobileVideo.pause();
        playButton.textContent = "播放";
      }
    });
    mobileVideo.addEventListener("play", function () { playButton.textContent = "暂停"; });
    mobileVideo.addEventListener("pause", function () { playButton.textContent = "播放"; });
  }

  if (mobileVideo && fullscreenButton) {
    fullscreenButton.addEventListener("click", function () {
      const request = mobileVideo.requestFullscreen || mobileVideo.webkitRequestFullscreen;
      if (request) {
        Promise.resolve(request.call(mobileVideo)).then(function () {
          if (screen.orientation && screen.orientation.lock) screen.orientation.lock("landscape").catch(function () {});
        }).catch(function () {});
      } else if (mobileVideo.webkitEnterFullscreen) {
        mobileVideo.webkitEnterFullscreen();
      }
    });
  }

  const lightbox = doc.querySelector(".lightbox");
  if (lightbox) {
    const lightboxImage = lightbox.querySelector("img");
    const lightboxCaption = lightbox.querySelector(".lightbox-caption");
    const closeButton = lightbox.querySelector(".lightbox-close");
    let previousFocus = null;

    function openLightbox(frame) {
      const image = frame.querySelector("img");
      if (!image) return;
      previousFocus = doc.activeElement;
      lightboxImage.src = image.dataset.full || image.currentSrc || image.src;
      lightboxImage.alt = image.alt || "Martin Sports Visual";
      lightboxCaption.textContent = frame.dataset.caption || image.alt || "Martin Sports Visual";
      lightbox.classList.add("is-open");
      body.classList.add("lightbox-open");
      closeButton.focus();
    }

    function closeLightbox() {
      lightbox.classList.remove("is-open");
      body.classList.remove("lightbox-open");
      window.setTimeout(function () { lightboxImage.removeAttribute("src"); }, 350);
      if (previousFocus && previousFocus.focus) previousFocus.focus();
    }

    doc.addEventListener("click", function (event) {
      const frame = event.target.closest(".portfolio-shot, .portfolio-frame");
      if (frame) openLightbox(frame);
    });
    doc.addEventListener("keydown", function (event) {
      const frame = event.target.closest && event.target.closest(".portfolio-shot, .portfolio-frame");
      if (frame && (event.key === "Enter" || event.key === " ")) {
        event.preventDefault();
        openLightbox(frame);
      }
      if (event.key === "Escape" && lightbox.classList.contains("is-open")) closeLightbox();
    });
    closeButton.addEventListener("click", closeLightbox);
    lightbox.addEventListener("click", function (event) { if (event.target === lightbox) closeLightbox(); });
  }

  const year = doc.querySelector("[data-year]");
  if (year) year.textContent = String(new Date().getFullYear());
})();
