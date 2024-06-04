const scrollSections = document.querySelectorAll('[data-scrollpage]');
const milkaScrollBlock = document.querySelector('[data-scrollpage]');
const milkaScrolldownBtn = document.querySelector('.milka-scrolldown');
const main = document.querySelector('main');

const scrollSet = {
  timing: 1000,
  loading: true,
  duration: 'down',
  mousePosition: 0,
  inside: false,
};

let scrollTimeout;

const handleScrollSettings = (event, element) => {
  scrollSet.duration = event.deltaY > 0 ? 'down' : 'up';
  const slides = element.querySelectorAll('[data-slide]');
  let currentSlide = Number(element.dataset.start);

  // Условие блокировки тела
  const shouldLockBody =
    (scrollSet.duration === 'down' && currentSlide < slides.length) ||
    (scrollSet.duration === 'up' && currentSlide > 1);

  if (shouldLockBody && scrollSet.loading === true) {
    scrollSet.loading = false;

    // INCREMENT/DECREMENT
    if (scrollSet.duration === 'down' && currentSlide < slides.length) {
      currentSlide += 1;
    } else if (scrollSet.duration === 'up' && currentSlide > 1) {
      currentSlide -= 1;
    }

    if (shouldLockBody) {
      bodyLocked();
    } else {
      bodyUnlocked();
    }

    element.dataset.start = currentSlide;

    handleScrollChange(element, currentSlide);

    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(() => {
      scrollSet.loading = true;
      bodyUnlocked();
    }, scrollSet.timing);
  }
};

const bodyLocked = () => {
  document.body.style.overflowY = 'hidden';
  main.style.overflowY = 'scroll';
};

const bodyUnlocked = () => {
  document.body.style.overflowY = '';
  main.style.overflowY = '';
};

scrollSections.forEach(scrollBlock => {
  scrollBlock.addEventListener(
    'wheel',
    function (e) {
      const currentEl = e.currentTarget;
      const slides = currentEl.querySelectorAll('[data-slide]');
      let currentSlide = Number(currentEl.dataset.start);

      const shouldLockBody =
        (e.deltaY > 0 && currentSlide < slides.length) || (e.deltaY < 0 && currentSlide > 1);

      if (shouldLockBody) {
        e.preventDefault();
      }

      handleScrollSettings(e, currentEl);
    },
    { passive: false }
  );
});

const handleScrollChange = (element, slide) => {
  element.dataset.start = slide;
  const index = Number(slide - 1);
  const wayBox = element.querySelector('[data-rails]');
  const slides = element.querySelectorAll('[data-slide]');
  wayBox.style.transition = `${scrollSet.timing}ms ease 0s`;
  const elementHeight = element.offsetHeight;
  const way = elementHeight * (slide - 1);
  wayBox.style.transform = `translate(0px, -${way}px)`;

  slides.forEach(slide => {
    slide.classList.remove('active');
  });
  slides[index].classList.add('active');

  if (index > 0) {
    milkaScrolldownBtn.classList.remove('down');
    milkaScrolldownBtn.classList.add('up');
  } else {
    milkaScrolldownBtn.classList.remove('up');
    milkaScrolldownBtn.classList.add('down');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
};

milkaScrolldownBtn.addEventListener('click', function () {
  const btn = this;
  if (btn.classList.contains('down')) {
    btn.classList.remove('down');
    btn.classList.add('up');
    handleScrollChange(milkaScrollBlock, 2);
    return;
  }
  window.scrollTo({ top: 0, behavior: 'smooth' });
  btn.classList.remove('up');
  btn.classList.add('down');
  handleScrollChange(milkaScrollBlock, 1);
});
