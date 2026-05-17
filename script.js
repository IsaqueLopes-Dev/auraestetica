const header = document.querySelector("[data-header]");
const menuButton = document.querySelector("[data-menu-button]");
const nav = document.querySelector("[data-nav]");
const mobileCarousel = document.querySelector("[data-mobile-carousel]");
const reviewsCarousel = document.querySelector("[data-reviews-carousel]");

function syncHeader() {
  header.classList.toggle("is-scrolled", window.scrollY > 24);
}

menuButton.addEventListener("click", () => {
  const isOpen = nav.classList.toggle("is-open");
  header.classList.toggle("is-open", isOpen);
  menuButton.setAttribute("aria-label", isOpen ? "Fechar menu" : "Abrir menu");
});

nav.addEventListener("click", (event) => {
  if (event.target.closest("a")) {
    nav.classList.remove("is-open");
    header.classList.remove("is-open");
    menuButton.setAttribute("aria-label", "Abrir menu");
  }
});

window.addEventListener("scroll", syncHeader, { passive: true });
syncHeader();

if (
  mobileCarousel &&
  window.matchMedia("(max-width: 900px)").matches &&
  !window.matchMedia("(prefers-reduced-motion: reduce)").matches
) {
  const cards = Array.from(mobileCarousel.children);
  let index = 0;
  let intervalId;
  let resumeId;

  function syncCarouselIndex() {
    const currentLeft = mobileCarousel.scrollLeft;
    index = cards.reduce((closestIndex, card, cardIndex) => {
      const closestDistance = Math.abs(cards[closestIndex].offsetLeft - currentLeft);
      const cardDistance = Math.abs(card.offsetLeft - currentLeft);
      return cardDistance < closestDistance ? cardIndex : closestIndex;
    }, 0);
  }

  function goToNextCard() {
    if (!cards.length) return;
    syncCarouselIndex();
    index = (index + 1) % cards.length;
    mobileCarousel.scrollTo({
      left: cards[index].offsetLeft,
      behavior: "smooth",
    });
  }

  function startCarousel() {
    window.clearInterval(intervalId);
    intervalId = window.setInterval(goToNextCard, 2600);
  }

  function pauseCarousel() {
    window.clearInterval(intervalId);
    window.clearTimeout(resumeId);
    resumeId = window.setTimeout(startCarousel, 3200);
  }

  mobileCarousel.addEventListener("pointerdown", pauseCarousel, { passive: true });
  mobileCarousel.addEventListener("wheel", pauseCarousel, { passive: true });
  startCarousel();
  window.setTimeout(goToNextCard, 900);
}

function startLoopCarousel(carousel, interval = 3600) {
  const items = Array.from(carousel.children);
  let index = 0;
  let intervalId;
  let resumeId;

  function syncIndex() {
    const currentLeft = carousel.scrollLeft;
    index = items.reduce((closestIndex, item, itemIndex) => {
      const closestDistance = Math.abs(items[closestIndex].offsetLeft - currentLeft);
      const itemDistance = Math.abs(item.offsetLeft - currentLeft);
      return itemDistance < closestDistance ? itemIndex : closestIndex;
    }, 0);
  }

  function next() {
    if (!items.length) return;
    syncIndex();
    index = (index + 1) % items.length;
    carousel.scrollTo({
      left: items[index].offsetLeft,
      behavior: "smooth",
    });
  }

  function start() {
    window.clearInterval(intervalId);
    intervalId = window.setInterval(next, interval);
  }

  function pause() {
    window.clearInterval(intervalId);
    window.clearTimeout(resumeId);
    resumeId = window.setTimeout(start, 4200);
  }

  carousel.addEventListener("pointerdown", pause, { passive: true });
  carousel.addEventListener("wheel", pause, { passive: true });
  start();
  window.setTimeout(next, 1200);
}

if (
  reviewsCarousel &&
  !window.matchMedia("(prefers-reduced-motion: reduce)").matches
) {
  startLoopCarousel(reviewsCarousel, 3600);
}
