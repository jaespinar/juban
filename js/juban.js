(function () {
  'use strict';

  var pst = document.getElementById('pst-time');
  if (pst) {
    var pstFormat = new Intl.DateTimeFormat('en-PH', { timeZone: 'Asia/Manila', weekday: 'short', year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true });
    pst.title = 'Philippine time (UTC+08:00), based on your device clock.';
    function updatePst() { pst.textContent = pstFormat.format(new Date()); }
    updatePst();
    setInterval(updatePst, 1000);
  }

  var slides = [].slice.call(document.querySelectorAll('.hero-slide'));
  var dots = [].slice.call(document.querySelectorAll('.hero-dots button'));
  var slideIndex = 2;
  var slideTimer = null;
  var nav = document.getElementById('primary-nav');
  var toggle = document.getElementById('menu-toggle');
  var mobile = document.getElementById('mobile-menu');
  var back = document.getElementById('back-to-top');

  document.querySelectorAll('a').forEach(function (link) {
    link.setAttribute('aria-disabled', 'true');
    link.setAttribute('tabindex', '-1');
    link.addEventListener('click', function (event) {
      event.preventDefault();
      event.stopImmediatePropagation();
    }, true);
  });

  document.querySelectorAll('button').forEach(function (button) {
    var isAllowedControl = button.matches('#menu-toggle, #back-to-top, .hero-arrow, .news-arrow');
    button.disabled = !isAllowedControl;
    if (isAllowedControl) {
      button.removeAttribute('aria-disabled');
      button.removeAttribute('tabindex');
    } else {
      button.setAttribute('aria-disabled', 'true');
      button.setAttribute('tabindex', '-1');
    }
  });

  function showSlide(nextIndex) {
    if (!slides.length) return;
    slideIndex = (nextIndex + slides.length) % slides.length;
    slides.forEach(function (slide, index) {
      slide.classList.toggle('is-active', index === slideIndex);
    });
    dots.forEach(function (dot, index) {
      dot.classList.toggle('is-active', index === slideIndex);
    });
  }

  function restartSlides() {
    clearInterval(slideTimer);
    slideTimer = setInterval(function () { showSlide(slideIndex + 1); }, 6500);
  }

  var heroPrev = document.querySelector('.hero-prev');
  var heroNext = document.querySelector('.hero-next');
  if (heroPrev) heroPrev.addEventListener('click', function () { showSlide(slideIndex - 1); restartSlides(); });
  if (heroNext) heroNext.addEventListener('click', function () { showSlide(slideIndex + 1); restartSlides(); });

  dots.forEach(function (dot) {
    dot.addEventListener('click', function () {
      showSlide(parseInt(this.getAttribute('data-go'), 10) || 0);
      restartSlides();
    });
  });

  if (toggle) {
    toggle.addEventListener('click', function () {
      var open = nav.classList.toggle('menu-open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
  }

  if (mobile) {
    mobile.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        nav.classList.remove('menu-open');
        toggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  var newsTrack = document.querySelector('.news-track');
  var newsCards = [].slice.call(document.querySelectorAll('.news-card'));
  var newsPrev = document.querySelector('.news-prev');
  var newsNext = document.querySelector('.news-next');
  var newsIndex = 0;

  function visibleNewsCards() {
    if (window.innerWidth <= 680) return 1;
    if (window.innerWidth <= 940) return 2;
    return 3;
  }

  function moveNews(direction) {
    if (!newsTrack || !newsCards.length) return;
    var maxIndex = Math.max(0, newsCards.length - visibleNewsCards());
    newsIndex += direction;
    if (newsIndex > maxIndex) newsIndex = 0;
    if (newsIndex < 0) newsIndex = maxIndex;
    var gap = parseFloat(getComputedStyle(newsTrack).gap) || 0;
    var step = newsCards[0].getBoundingClientRect().width + gap;
    newsTrack.style.transform = 'translateX(-' + (newsIndex * step) + 'px)';
  }

  if (newsPrev) newsPrev.addEventListener('click', function () { moveNews(-1); });
  if (newsNext) newsNext.addEventListener('click', function () { moveNews(1); });
  window.addEventListener('resize', function () {
    newsIndex = 0;
    if (newsTrack) newsTrack.style.transform = 'translateX(0)';
  });

  window.addEventListener('scroll', function () {
    if (back) back.style.display = window.scrollY > 450 ? 'flex' : 'none';
  });
  if (back) back.addEventListener('click', function () { window.scrollTo({ top: 0, behavior: 'smooth' }); });

  showSlide(2);
  restartSlides();
}());
