const scrollSections = document.querySelectorAll('[data-scrollpage]');
const milkaScrollBlock = document.querySelector('[data-scrollpage]');
const milkaScrolldownBtn = document.querySelector('.milka-scrolldown');
const milkaScrolldownTabletBtn = document.querySelector('.milka-scrolldown--tablet');
const main = document.querySelector('main');
const eventListeners = new Map(); // Для хранения ссылок на обработчики

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

const handleScroll = function (e) {
  const currentEl = e.currentTarget;
  const slides = currentEl.querySelectorAll('[data-slide]');
  let currentSlide = Number(currentEl.dataset.start);

  const shouldLockBody = (e.deltaY > 0 && currentSlide < slides.length) || (e.deltaY < 0 && currentSlide > 1);

  if (shouldLockBody) {
    e.preventDefault();
  }

  handleScrollSettings(e, currentEl);
};

let startY;

const handleTouchStart = function (e) {
  const touch = e.touches[0];
  startY = touch.clientY;
};

const handleTouchMove = function (e) {
  const touch = e.touches[0];
  const touchEl = e.target;
  const currentY = touch.clientY;
  const deltaY = startY - currentY;
  const customEvent = {
    deltaY,
  };
  if (deltaY > 0) {
    console.log('Тянем вверх');
  } else {
    console.log('Тянем вниз');
  }
  const currentEl = touchEl.closest('[data-scrollpage]');

  const slides = currentEl.querySelectorAll('[data-slide]');
  let currentSlide = Number(currentEl.dataset.start);

  const shouldLockBody =
    (customEvent.deltaY > 0 && currentSlide < slides.length) || (customEvent.deltaY < 0 && currentSlide > 1);

  if (shouldLockBody) {
    e.preventDefault();
  }

  handleScrollSettings(customEvent, currentEl);
};

const scrollPageInit = () => {
  scrollSections.forEach(scrollBlock => {
    scrollBlock.addEventListener('wheel', handleScroll, { passive: false });
    scrollBlock.addEventListener('touchstart', handleTouchStart, { passive: true });
    scrollBlock.addEventListener('touchmove', handleTouchMove, { passive: false });
    eventListeners.set(scrollBlock, { handleScroll, handleTouchStart, handleTouchMove }); // Сохраняем обработчики для этого элемента
  });
};

const removeScrollEventListeners = () => {
  eventListeners.forEach((handlers, scrollBlock) => {
    scrollBlock.removeEventListener('wheel', handlers.handleScroll);
    scrollBlock.removeEventListener('touchstart', handlers.handleTouchStart);
    scrollBlock.removeEventListener('touchmove', handlers.handleTouchMove);
  });
  eventListeners.clear(); // Очищаем Map после удаления обработчиков
};

// Проверка медиазапроса
function checkMediaQuery() {
  const mediaQuery = window.matchMedia(
    '(max-width: 1023px), (min-width: 1024px) and (orientation: portrait)'
  );
  return !mediaQuery.matches; // Возвращает true, если медиазапрос НЕ истинный
}

function handleResizeOrLoad() {
  if (checkMediaQuery()) {
    scrollPageInit();
  } else {
    removeScrollEventListeners();
  }
}

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
  if (checkMediaQuery()) {
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
  } else {
    const aboutSection = document.querySelector('.section-about');
    aboutSection.scrollIntoView({ behavior: 'smooth' });
  }
});

milkaScrolldownTabletBtn.addEventListener('click', function () {
  const aboutSection = document.querySelector('.section-about');
  aboutSection.scrollIntoView({ behavior: 'smooth' });
});

window.addEventListener('load', handleResizeOrLoad);
window.addEventListener('resize', handleResizeOrLoad);
