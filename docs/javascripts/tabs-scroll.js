(function () {
  function initTabScroll() {
    var tabs = document.querySelector(".md-tabs");
    var list = document.querySelector(".md-tabs__list");
    if (!tabs || !list) return;

    if (tabs.querySelector(".md-tabs-scroll-btn")) return;

    var leftBtn = document.createElement("button");
    leftBtn.className = "md-tabs-scroll-btn md-tabs-scroll-btn--left";
    leftBtn.setAttribute("aria-label", "Scroll tabs left");
    leftBtn.innerHTML = "&#9664;";
    leftBtn.hidden = true;

    var rightBtn = document.createElement("button");
    rightBtn.className = "md-tabs-scroll-btn md-tabs-scroll-btn--right";
    rightBtn.setAttribute("aria-label", "Scroll tabs right");
    rightBtn.innerHTML = "&#9654;";
    rightBtn.hidden = true;

    tabs.style.position = "relative";
    tabs.appendChild(leftBtn);
    tabs.appendChild(rightBtn);

    function updateIndicators() {
      var scrollLeft = list.scrollLeft;
      var maxScroll = list.scrollWidth - list.clientWidth;
      var threshold = 5;

      var atStart = scrollLeft <= threshold;
      var atEnd = scrollLeft >= maxScroll - threshold;
      var isScrollable = maxScroll > threshold;

      if (atStart) {
        tabs.classList.remove("scrolled-right");
      } else {
        tabs.classList.add("scrolled-right");
      }

      if (atEnd || !isScrollable) {
        tabs.classList.add("scrolled-end");
      } else {
        tabs.classList.remove("scrolled-end");
      }

      leftBtn.hidden = atStart || !isScrollable;
      rightBtn.hidden = atEnd || !isScrollable;
    }

    leftBtn.addEventListener("click", function () {
      list.scrollBy({ left: -300, behavior: "smooth" });
    });

    rightBtn.addEventListener("click", function () {
      list.scrollBy({ left: 300, behavior: "smooth" });
    });

    list.addEventListener("scroll", updateIndicators);
    window.addEventListener("resize", updateIndicators);

    updateIndicators();

    if (!rightBtn.hidden) {
      rightBtn.classList.add("hint-pulse");
      rightBtn.addEventListener("animationend", function () {
        rightBtn.classList.remove("hint-pulse");
      });
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initTabScroll);
  } else {
    initTabScroll();
  }

  if (typeof document$ !== "undefined") {
    document$.subscribe(function () {
      initTabScroll();
    });
  }
})();
