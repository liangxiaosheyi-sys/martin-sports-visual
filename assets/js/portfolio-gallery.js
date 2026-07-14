(function () {
  const items = {
    cycling: [
      ["DSC00136", "cycling-dsc00136.webp", 1800, 1013], ["DSC00686", "cycling-dsc00686.webp", 1200, 1800],
      ["DSC00741", "cycling-dsc00741.webp", 1012, 1800], ["DSC00812", "cycling-dsc00812.webp", 1800, 1012],
      ["DSC01218", "cycling-dsc01218.webp", 1200, 1800], ["DSC01331", "cycling-dsc01331.webp", 1200, 1800],
      ["DSC09912", "cycling-dsc09912.webp", 1800, 1013], ["DSC099092", "cycling-dsc099092.webp", 1800, 1200],
      ["LIN08343", "cycling-lin08343.webp", 1800, 1200], ["DSC06999", "cycling-dsc06999.webp", 1800, 1012],
      ["DSC09392", "cycling-dsc09392.webp", 1200, 1800], ["DSC08824", "cycling-dsc08824.webp", 1200, 1800],
      ["1234", "cycling-night-rider-1234.webp", 1200, 1800], ["DSC02253", "cycling-dsc02253.webp", 1800, 1013],
      ["DSC02283", "cycling-dsc02283.webp", 1800, 1725], ["DSC00626", "cycling-dsc00626.webp", 1200, 1800],
      ["DSC00131", "cycling-dsc00131.webp", 1800, 1200], ["DSC09531", "cycling-dsc09531.webp", 1800, 1200],
      ["2c25f65818a651fd2b4c6b699f4bd984", "cycling-road-session-2c25f658.webp", 1800, 1200]
    ],
    hyrox: [
      ["DSC06097", "hyrox-dsc06097.webp", 1013, 1800], ["DSC00119", "hyrox-dsc00119.webp", 1200, 1800],
      ["DSC00293", "hyrox-dsc00293.webp", 1200, 1800], ["DSC05368", "hyrox-dsc05368.webp", 1013, 1800],
      ["DSC05515", "hyrox-dsc05515.webp", 1013, 1800], ["DSC05714", "hyrox-dsc05714.webp", 1013, 1800],
      ["DSC05607", "hyrox-dsc05607.webp", 1013, 1800],
      ["DSC06329", "hyrox-dsc06329.webp", 1800, 1013], ["DSC09754", "hyrox-dsc09754.webp", 1800, 1200],
      ["DSC05838", "hyrox-dsc05838.webp", 1013, 1800], ["DSC05950", "hyrox-dsc05950.webp", 1800, 1012],
      ["DSC09064", "hyrox-dsc09064.webp", 1200, 1800], ["DSC09463", "hyrox-dsc09463.webp", 1800, 1200],
      ["DSC05289", "hyrox-dsc05289.webp", 1800, 1200], ["DSC04723", "hyrox-dsc04723.webp", 1800, 1800],
      ["DSC04873", "hyrox-dsc04873.webp", 1200, 1800], ["DSC05103", "hyrox-dsc05103.webp", 1012, 1800],
      ["DSC05247", "hyrox-dsc05247.webp", 1013, 1800]
    ]
  };

  const labels = { cycling: "Cycling", hyrox: "HYROX & Fitness" };

  function getRatioClass(width, height) {
    const ratio = width / height;
    if (ratio >= 1.45) return "portfolio-is-wide";
    if (ratio <= 0.78) return "portfolio-is-portrait";
    return "portfolio-is-balanced";
  }

  document.querySelectorAll("[data-portfolio-gallery]").forEach(function (gallery) {
    const category = gallery.dataset.portfolioGallery;
    const isDesktop = gallery.dataset.portfolioLayout === "desktop";
    const categoryItems = items[category] || [];
    const assetPath = "./assets/images/portfolio/" + category + "/";

    gallery.innerHTML = categoryItems.map(function (item, index) {
      const id = item[0];
      const filename = item[1];
      const width = item[2];
      const height = item[3];
      const caption = id + " · " + labels[category];
      const ratioClass = getRatioClass(width, height);
      const ratioStyle = ' style="--media-ratio: ' + width + ' / ' + height + ';"';
      const frameClass = isDesktop
        ? "shot portfolio-shot " + ratioClass + (index === 0 ? " portfolio-lead" : index === 1 ? " portfolio-support" : "")
        : "photo-frame portfolio-frame " + ratioClass + (index === 0 ? " portfolio-frame--lead" : "");
      return '<figure class="' + frameClass + ' media-reveal" role="button" tabindex="0" data-stagger-item data-caption="' + caption + '"' + ratioStyle + '>'
        + '<span class="portfolio-media">'
        + '<img src="' + assetPath + filename + '" data-full="' + assetPath + filename + '" alt="' + caption + '" loading="lazy" decoding="async">'
        + '</span>'
        + '</figure>';
    }).join("");
  });
})();
