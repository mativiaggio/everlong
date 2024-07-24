var totalSlides = document.querySelectorAll(".nav-for-slider .swiper-slide").length;

// Ajuste slidesPerView si hay menos de 5 diapositivas
var slidesPerView = totalSlides < 5 ? totalSlides : 5;

var swiperThumbs = new Swiper(".nav-for-slider", {
  loop: totalSlides >= slidesPerView,
  spaceBetween: 10,
  slidesPerView: slidesPerView,
  freeMode: true,
  watchSlidesProgress: true,
});

var swiperMain = new Swiper(".main-slide-carousel", {
  loop: totalSlides >= slidesPerView,
  spaceBetween: 10,
  thumbs: {
    swiper: swiperThumbs,
  },
});
