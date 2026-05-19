document.addEventListener("DOMContentLoaded", function () {
  var inner = document.querySelector(".md-tabs__inner");
  var list = document.querySelector(".md-tabs__list");
  if (!inner || !list) return;

  // Create scroll arrow buttons
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

  inner.style.position = "relative";
  inner.appendChild(leftBtn);
  inner.appendChild(rightBtn);

  function updateIndicators() {
    var scrollLeft = list.scrollLeft;
    var maxScroll = list.scrollWidth - list.clientWidth;
    var threshold = 5;

    var atStart = scrollLeft <= threshold;
    var atEnd = scrollLeft >= maxScroll - threshold;
    var isScrollable = maxScroll > threshold;

    // Toggle fade gradients
    if (atStart) {
      inner.classList.remove("scrolled-right");
    } else {
      inner.classList.add("scrolled-right");
    }

    if (atEnd || !isScrollable) {
      inner.classList.add("scrolled-end");
    } else {
      inner.classList.remove("scrolled-end");
    }

    // Toggle arrow buttons
    leftBtn.hidden = atStart || !isScrollable;
    rightBtn.hidden = atEnd || !isScrollable;
  }

  // Scroll by ~3 tab widths on click
  leftBtn.addEventListener("click", function () {
    list.scrollBy({ left: -300, behavior: "smooth" });
  });

  rightBtn.addEventListener("click", function () {
    list.scrollBy({ left: 300, behavior: "smooth" });
  });

  list.addEventListener("scroll", updateIndicators);
  window.addEventListener("resize", updateIndicators);

  // Initial check
  updateIndicators();

  // Add a subtle pulse on the right arrow to draw attention on first load
  if (!rightBtn.hidden) {
    rightBtn.classList.add("hint-pulse");
    rightBtn.addEventListener("animationend", function () {
      rightBtn.classList.remove("hint-pulse");
    });
  }
});
