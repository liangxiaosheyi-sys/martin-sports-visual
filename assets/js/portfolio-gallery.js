(function () {
  const items = {
    cycling: [
      ["DSC00136", "cycling-dsc00136.webp"], ["DSC00686", "cycling-dsc00686.webp"],
      ["DSC00741", "cycling-dsc00741.webp"], ["DSC00812", "cycling-dsc00812.webp"],
      ["DSC01218", "cycling-dsc01218.webp"], ["DSC01331", "cycling-dsc01331.webp"],
      ["DSC09912", "cycling-dsc09912.webp"], ["DSC099092", "cycling-dsc099092.webp"],
      ["LIN08343", "cycling-lin08343.webp"], ["DSC06999", "cycling-dsc06999.webp"],
      ["DSC09392", "cycling-dsc09392.webp"], ["DSC08824", "cycling-dsc08824.webp"],
      ["1234", "cycling-night-rider-1234.webp"], ["DSC02253", "cycling-dsc02253.webp"],
      ["DSC02283", "cycling-dsc02283.webp"], ["DSC00626", "cycling-dsc00626.webp"],
      ["DSC00131", "cycling-dsc00131.webp"], ["DSC09531", "cycling-dsc09531.webp"],
      ["2c25f65818a651fd2b4c6b699f4bd984", "cycling-road-session-2c25f658.webp"]
    ],
    hyrox: [
      ["DSC06097", "hyrox-dsc06097.webp"], ["DSC00119", "hyrox-dsc00119.webp"],
      ["DSC00293", "hyrox-dsc00293.webp"], ["DSC05368", "hyrox-dsc05368.webp"],
      ["DSC05515", "hyrox-dsc05515.webp"], ["DSC05714", "hyrox-dsc05714.webp"],
      ["DSC06329", "hyrox-dsc06329.webp"], ["DSC09754", "hyrox-dsc09754.webp"],
      ["DSC05838", "hyrox-dsc05838.webp"], ["DSC05950", "hyrox-dsc05950.webp"],
      ["DSC09064", "hyrox-dsc09064.webp"], ["DSC09463", "hyrox-dsc09463.webp"],
      ["DSC05289", "hyrox-dsc05289.webp"], ["DSC04723", "hyrox-dsc04723.webp"],
      ["DSC04873", "hyrox-dsc04873.webp"], ["DSC05103", "hyrox-dsc05103.webp"],
      ["DSC05247", "hyrox-dsc05247.webp"]
    ]
  };

  const labels = { cycling: "Cycling", hyrox: "HYROX & Fitness" };

  document.querySelectorAll("[data-portfolio-gallery]").forEach(function (gallery) {
    const category = gallery.dataset.portfolioGallery;
    const isDesktop = gallery.dataset.portfolioLayout === "desktop";
    const categoryItems = items[category] || [];
    const assetPath = "./assets/images/portfolio/" + category + "/";

    gallery.innerHTML = categoryItems.map(function (item, index) {
      const id = item[0];
      const filename = item[1];
      const caption = id + " · " + labels[category];
      const frameClass = isDesktop
        ? "shot" + (index === 0 ? " portfolio-lead" : index === 1 ? " portfolio-support" : "")
        : "photo-frame portfolio-frame" + (index === 0 ? " portfolio-frame--lead" : "");
      return '<figure class="' + frameClass + '" role="button" tabindex="0" data-caption="' + caption + '">'
        + '<img src="' + assetPath + 'thumbs/' + filename + '" data-full="' + assetPath + filename + '" alt="' + caption + '" loading="lazy" decoding="async">'
        + '<span class="' + (isDesktop ? "badge" : "photo-badge") + '">' + id + '</span>'
        + '</figure>';
    }).join("");
  });
})();
