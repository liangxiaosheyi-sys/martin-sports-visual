(function () {
  const cases = [
    {
      id: "001",
      title: "TOUR-INSPIRED RACE POSTER",
      source: "DSC09993 · CYCLING",
      before: "case-01-dsc09993-before.webp",
      after: "case-01-tour-poster.webp",
      ratio: "1672 / 941",
      orientation: "landscape",
      beforePosition: "50% 50%",
      beforeTransform: "scale(1.08) translateX(-10%)",
      mobileOrder: 6
    },
    {
      id: "002",
      title: "MOUNTAINS MAKE LEGENDS",
      source: "LIN08748 · CYCLING",
      before: "case-02-lin08748-before.webp",
      after: "case-02-mountain-poster.webp",
      ratio: "1672 / 941",
      orientation: "landscape",
      beforePosition: "58% 48%",
      beforeTransform: "none",
      mobileOrder: 7
    },
    {
      id: "003",
      title: "PUSH YOUR LIMIT",
      source: "DSC05838 · HYROX",
      before: "case-03-dsc05838-before.webp",
      after: "case-03-hyrox-poster.webp",
      ratio: "941 / 1672",
      orientation: "portrait",
      beforePosition: "50% 50%",
      beforeTransform: "none",
      mobileOrder: 1
    },
    {
      id: "004",
      title: "EVERY WORKOUT COUNTS",
      source: "DSC05607 · HYROX",
      before: "case-04-dsc05607-before.webp",
      after: "case-04-hyrox-poster.webp",
      ratio: "1024 / 1536",
      orientation: "portrait",
      beforePosition: "48% 50%",
      beforeTransform: "none",
      mobileOrder: 2
    },
    {
      id: "005",
      title: "CHASE THE BREAKAWAY",
      source: "123 · CYCLING",
      before: "case-05-123-before.webp",
      after: "case-05-tour-poster.webp",
      ratio: "941 / 1672",
      orientation: "portrait",
      beforePosition: "48% 50%",
      beforeTransform: "none",
      mobileOrder: 3
    },
    {
      id: "006",
      title: "S-WORKS SPEED STUDY",
      source: "DSC09463 · CYCLING",
      before: "case-06-dsc09463-before.webp",
      after: "case-06-sworks-poster.webp",
      ratio: "941 / 1672",
      orientation: "portrait",
      beforePosition: "45% 50%",
      beforeTransform: "scale(1.12) translateY(14%)",
      mobileOrder: 4
    },
    {
      id: "007",
      title: "LIVE TO RIDE",
      source: "DSC09991 · CYCLING",
      before: "case-07-dsc09991-before.webp",
      after: "case-07-tour-poster.webp",
      ratio: "941 / 1672",
      orientation: "portrait",
      beforePosition: "52% 50%",
      beforeTransform: "scale(1.12) translateY(17%)",
      mobileOrder: 5
    }
  ];

  const assetPath = "./assets/images/ai-poster-lab/";
  const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

  document.querySelectorAll("[data-ai-poster-gallery]").forEach(function (gallery) {
    gallery.innerHTML = cases.map(function (item, index) {
      const eager = index < 2 ? "eager" : "lazy";
      return '<article class="ai-case-card ai-case--' + item.orientation + ' media-reveal" data-ai-case data-stagger-item style="--poster-ratio:' + item.ratio + ';--before-position:' + item.beforePosition + ';--before-transform:' + item.beforeTransform + ';--mobile-order:' + item.mobileOrder + '">'
        + '<header class="ai-case-head"><span class="ai-case-no">CASE ' + item.id + '</span><h3>' + item.title + '</h3><p>' + item.source + '<br>ORIGINAL CAPTURE → AGENT ART DIRECTION</p></header>'
        + '<div class="ai-compare-card">'
        + '<div class="ai-compare-meta" aria-hidden="true"><span><b>BEFORE</b> 原始摄影</span><span><b>AFTER</b> AI 赛事海报</span></div>'
        + '<figure class="ai-compare-frame is-original" data-ai-compare role="slider" tabindex="0" aria-label="拖动查看 ' + item.source + ' 原片与 AI 海报对比" aria-valuemin="0" aria-valuemax="100" aria-valuenow="100" style="--split:100%">'
        + '<img class="ai-after-image" src="' + assetPath + item.after + '" alt="' + item.title + ' AI 赛事海报" loading="' + eager + '" decoding="async">'
        + '<span class="ai-before-layer" aria-hidden="true"><img src="' + assetPath + item.before + '" alt="" loading="' + eager + '" decoding="async"></span>'
        + '<span class="ai-split-guide" aria-hidden="true"><span>DRAG</span></span>'
        + '<span class="ai-frame-label ai-frame-label--before">ORIGINAL / 原片</span>'
        + '<span class="ai-frame-label ai-frame-label--after">AGENT POSTER / 海报</span>'
        + '</figure>'
        + '<div class="ai-compare-controls"><p><strong>移动鼠标或手指左右拖动</strong><span>Drag to reveal the transformation</span></p><div class="ai-view-buttons" aria-label="快速切换对比状态"><button type="button" data-ai-view="before" class="is-selected">查看原片</button><button type="button" data-ai-view="after">查看海报</button></div></div>'
        + '</div></article>';
    }).join("")
      + '<aside class="ai-method-card" data-stagger-item style="--mobile-order:8"><span class="ai-case-no">THE PROCESS / 制作流程</span><h3>ONE SHOOT.<br>MORE VALUE.</h3><ol><li><b>01</b><span>Original Capture<br><em>真实运动摄影</em></span></li><li><b>02</b><span>Agent Direction<br><em>赛事主题与视觉策划</em></span></li><li><b>03</b><span>Campaign Output<br><em>海报与社媒商业交付</em></span></li></ol><a href="./pricing.html">咨询 AI 视觉方案</a></aside>';
  });

  function setSplit(frame, next, isDragging) {
    const split = clamp(next, 0, 100);
    frame.style.setProperty("--split", split + "%");
    frame.setAttribute("aria-valuenow", Math.round(split));
    frame.classList.toggle("is-active", Boolean(isDragging));
    frame.classList.toggle("is-original", split >= 99.5);
    frame.classList.toggle("is-poster", split <= 0.5);

    const card = frame.closest("[data-ai-case]");
    if (!card) return;
    card.querySelectorAll("[data-ai-view]").forEach(function (button) {
      const selected = (button.dataset.aiView === "before" && split >= 99.5)
        || (button.dataset.aiView === "after" && split <= 0.5);
      button.classList.toggle("is-selected", selected);
    });
  }

  function updateFromPointer(frame, event) {
    const rect = frame.getBoundingClientRect();
    setSplit(frame, ((event.clientX - rect.left) / rect.width) * 100, true);
  }

  document.querySelectorAll("[data-ai-compare]").forEach(function (frame) {
    frame.addEventListener("pointerenter", function (event) {
      if (event.pointerType === "mouse") updateFromPointer(frame, event);
    });
    frame.addEventListener("pointermove", function (event) {
      if (event.pointerType === "mouse" || frame.hasPointerCapture(event.pointerId)) updateFromPointer(frame, event);
    });
    frame.addEventListener("pointerdown", function (event) {
      frame.setPointerCapture(event.pointerId);
      updateFromPointer(frame, event);
    });
    frame.addEventListener("pointerup", function (event) {
      if (frame.hasPointerCapture(event.pointerId)) frame.releasePointerCapture(event.pointerId);
      frame.classList.remove("is-active");
    });
    frame.addEventListener("pointercancel", function () { frame.classList.remove("is-active"); });
    frame.addEventListener("pointerleave", function (event) {
      if (event.pointerType === "mouse") setSplit(frame, 100, false);
    });
    frame.addEventListener("focus", function () { setSplit(frame, 52, false); });
    frame.addEventListener("blur", function () { setSplit(frame, 100, false); });
    frame.addEventListener("keydown", function (event) {
      const current = parseFloat(frame.style.getPropertyValue("--split")) || 0;
      if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
        event.preventDefault();
        setSplit(frame, current + (event.key === "ArrowLeft" ? -5 : 5), false);
      }
      if (event.key === "Home") setSplit(frame, 0, false);
      if (event.key === "End") setSplit(frame, 100, false);
    });
  });

  document.querySelectorAll("[data-ai-view]").forEach(function (button) {
    button.addEventListener("click", function () {
      const frame = button.closest("[data-ai-case]").querySelector("[data-ai-compare]");
      setSplit(frame, button.dataset.aiView === "before" ? 100 : 0, false);
    });
  });

  if (!("IntersectionObserver" in window) || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const demoObserver = new IntersectionObserver(function (entries, observer) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;
      const frame = entry.target.querySelector("[data-ai-compare]");
      if (!frame || frame.dataset.demoPlayed) return;
      frame.dataset.demoPlayed = "true";
      window.setTimeout(function () { setSplit(frame, 48, false); }, 450);
      window.setTimeout(function () { setSplit(frame, 0, false); }, 1450);
      window.setTimeout(function () { setSplit(frame, 100, false); }, 2550);
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.55 });
  document.querySelectorAll("[data-ai-case]").forEach(function (card) { demoObserver.observe(card); });
})();
