gsap.registerPlugin(ScrollTrigger);

const canvas = document.getElementById("sequence-canvas");
if (canvas) {
  const context = canvas.getContext("2d");

  // Set canvas dimensions to window size
  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    render();
  }
  window.addEventListener("resize", resizeCanvas);

  const frameCount = 300;
  // Helper to get image path (1-based index, padded to 3 digits)
  const currentFrame = index => (
    `assets/images/ezgif-frame-${(index + 1).toString().padStart(3, '0')}.jpg`
  );

  const images = [];
  const sequence = {
    frame: 0
  };

  // Preload images to prevent flickering
  let loadedImages = 0;
  for (let i = 0; i < frameCount; i++) {
    const img = new Image();
    img.onload = () => {
      loadedImages++;
      // Once the first image is loaded, render it and initialize canvas size
      if (i === 0) {
        resizeCanvas();
      }
    };
    img.src = currentFrame(i);
    images.push(img);
  }

  // Render the current frame to the canvas
  function render() {
    const img = images[sequence.frame];

    if (!img || !img.complete) return;

    // Clear canvas
    context.clearRect(0, 0, canvas.width, canvas.height);

    // Calculate aspect ratio and dimensions for object-fit: cover equivalent
    const hRatio = canvas.width / img.width;
    const vRatio = canvas.height / img.height;
    const ratio = Math.max(hRatio, vRatio);
    const centerShift_x = (canvas.width - img.width * ratio) / 2;
    const centerShift_y = (canvas.height - img.height * ratio) / 2;

    // Draw image centered and covering the canvas
    context.drawImage(
      img,
      0, 0, img.width, img.height,
      centerShift_x, centerShift_y, img.width * ratio, img.height * ratio
    );
  }

  // Use GSAP ScrollTrigger to tie the frame index to the scroll position
  gsap.to(sequence, {
    frame: frameCount - 1,
    snap: "frame",
    ease: "none",
    scrollTrigger: {
      trigger: ".spacer",
      start: "top top",
      end: "bottom bottom",
      scrub: 0.5
    },
    onUpdate: render
  });
}

// --- Menu Toggle Logic ---
const menuToggle = document.getElementById('menu-toggle');
const menuOverlay = document.getElementById('menu-overlay');

if (menuToggle && menuOverlay) {
  menuToggle.addEventListener('click', () => {
    menuToggle.classList.toggle('active');
    menuOverlay.classList.toggle('active');

    const navbar = document.getElementById('navbar');
    if (navbar) navbar.classList.toggle('active');
  });
}

// --- Hero Text Animation ---
const heroContent = document.getElementById("hero-content");
if (heroContent) {
  gsap.to(heroContent, {
    y: 0,
    opacity: 1,
    duration: 1,
    ease: "power3.out",
    delay: 0.5
  });

  gsap.to(heroContent, {
    y: "-150%",
    opacity: 0,
    ease: "power1.inOut",
    scrollTrigger: {
      trigger: ".spacer",
      start: "top top",
      end: "top -50%",
      scrub: true,
    }
  });
}

// --- Modus Operandi Tabs ---
const operandiTabs = document.querySelectorAll('.operandi-tab');
const operandiImage = document.getElementById('operandi-image');

if (operandiTabs.length > 0 && operandiImage) {
  operandiTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      // Remove active class from all tabs
      operandiTabs.forEach(t => t.classList.remove('active'));

      // Add active class to clicked tab
      tab.classList.add('active');

      // Swap image with a quick fade
      const newImgSrc = tab.getAttribute('data-img');
      operandiImage.style.opacity = 0;

      setTimeout(() => {
        operandiImage.src = newImgSrc;
        operandiImage.style.opacity = 1;
      }, 300); // Wait 300ms for fade out, then swap and fade in
    });
  });
}

// --- Mouse Image Trail Effect ---
const trailImagesList = [
  "assets/home page/69c6966f2dafbf9dd9efcd56_Modus Projects Image 07.avif",
  "assets/home page/69c6966f34c63231710098dc_Modus Projects Image 03.avif",
  "assets/home page/69c6966f6079c5f5265d1f7a_Modus Projects Image 04.avif",
  "assets/home page/69c6966f625e14c6ede0a2bc_Modus Projects Image 05.avif",
  "assets/home page/69c6966fdb8a281d401d95f3_Modus Projects Image 06.avif",
  "assets/home page/69c6966fe7c5b30801c1aff9_Modus Projects Image 09.avif",
  "assets/home page/69c6966ff959545dee6f21d2_Modus Projects Image 01.avif",
  "assets/home page/69c69c173165c9cc3816e429_Modus Projects Image 02.avif",
  "assets/home page/69c69c264f53b6c4722c0204_Modus Projects Image 08.avif",
  "assets/home page/69c69c20f91d5cdfa11afbac_Modus Projects Image 10.avif"
];

const trailContainer = document.getElementById('trail-container');
const infoSection = document.getElementById('info-section');

let lastMousePos = { x: 0, y: 0 };
let imgIndex = 0;
const distanceThreshold = 80;

if (infoSection && trailContainer) {
  infoSection.addEventListener('mousemove', (e) => {
    const dx = e.clientX - lastMousePos.x;
    const dy = e.clientY - lastMousePos.y;
    const dist = Math.sqrt(dx * dx + dy * dy);

    if (dist > distanceThreshold) {
      lastMousePos.x = e.clientX;
      lastMousePos.y = e.clientY;

      const rect = infoSection.getBoundingClientRect();
      const relX = e.clientX - rect.left;
      const relY = e.clientY - rect.top;

      spawnTrailImage(relX, relY);
    }
  });
}

function spawnTrailImage(x, y) {
  const img = document.createElement('img');
  img.src = trailImagesList[imgIndex];
  img.classList.add('trail-image');

  imgIndex = (imgIndex + 1) % trailImagesList.length;

  trailContainer.appendChild(img);

  const rotation = (Math.random() - 0.5) * 30;

  gsap.set(img, {
    x: x,
    y: y,
    xPercent: -50,
    yPercent: -50,
    rotation: rotation,
    scale: 0.5,
    opacity: 0
  });

  gsap.to(img, {
    scale: 1,
    opacity: 1,
    duration: 0.4,
    ease: "power2.out",
    onComplete: () => {
      gsap.to(img, {
        opacity: 0,
        scale: 0.8,
        duration: 0.4,
        delay: 0.8,
        ease: "power2.in",
        onComplete: () => img.remove()
      });
    }
  });
}

// --- Projects Carousel Logic ---
const carouselTrack = document.getElementById('carousel-track');
const prevBtn = document.getElementById('carousel-prev');
const nextBtn = document.getElementById('carousel-next');

if (carouselTrack && prevBtn && nextBtn) {
  const carouselSlides = Array.from(carouselTrack.children);
  if (carouselSlides.length > 0) {
    let currentIndex = 0;

    function updateCarousel() {
      carouselSlides.forEach((slide, index) => {
        slide.classList.remove('active');
        if (index === currentIndex) {
          slide.classList.add('active');
        }
      });
      // Move track
      const slideWidth = 60; // 60vw for active slide
      const gap = 2; // 2vw gap
      const offset = -(currentIndex * (slideWidth + gap)) + 20; // 20vw to center it initially
      carouselTrack.style.transform = `translateX(${offset}vw)`;
    }

    prevBtn.addEventListener('click', () => {
      currentIndex = (currentIndex > 0) ? currentIndex - 1 : carouselSlides.length - 1;
      updateCarousel();
    });

    nextBtn.addEventListener('click', () => {
      currentIndex = (currentIndex < carouselSlides.length - 1) ? currentIndex + 1 : 0;
      updateCarousel();
    });

    // Initialize
    updateCarousel();
  }
}

// --- Over Ons Sequence Logic ---
const overOnsCanvas = document.getElementById('over-ons-canvas');
if (overOnsCanvas) {
  const context = overOnsCanvas.getContext('2d');
  const wrapper = document.getElementById('over-ons-wrapper');

  overOnsCanvas.width = wrapper.clientWidth;
  overOnsCanvas.height = wrapper.clientHeight;

  const frameCount = 180;
  const currentFrame = index => (
    `assets/over-ons pages/ezgif-frame-${(index + 1).toString().padStart(3, '0')}.jpg`
  );

  const images = [];
  const sequence = { frame: 0 };

  for (let i = 0; i < frameCount; i++) {
    const img = new Image();
    img.onload = () => {
      if (i === 0) renderOverOns();
    };
    img.src = currentFrame(i);
    images.push(img);
  }

  function renderOverOns() {
    const img = images[sequence.frame];
    if (!img || !img.complete) return;
    context.clearRect(0, 0, overOnsCanvas.width, overOnsCanvas.height);

    // Fit cover logic
    const hRatio = overOnsCanvas.width / img.width;
    const vRatio = overOnsCanvas.height / img.height;
    const ratio = Math.max(hRatio, vRatio);
    const centerShift_x = (overOnsCanvas.width - img.width * ratio) / 2;
    const centerShift_y = (overOnsCanvas.height - img.height * ratio) / 2;

    context.drawImage(img, 0, 0, img.width, img.height,
      centerShift_x, centerShift_y, img.width * ratio, img.height * ratio);
  }

  window.addEventListener('resize', () => {
    overOnsCanvas.width = wrapper.clientWidth;
    overOnsCanvas.height = wrapper.clientHeight;
    renderOverOns();
  });

  gsap.to(sequence, {
    frame: frameCount - 1,
    snap: "frame",
    ease: "none",
    scrollTrigger: {
      trigger: ".over-ons-sequence",
      start: "top top+=15%", // Start when the top of the wrapper hits 15% from top of screen (below navbar)
      end: "bottom bottom",
      scrub: 0.5,
      pin: ".over-ons-canvas-wrapper"
    },
    onUpdate: renderOverOns
  });
  document.addEventListener('DOMContentLoaded', () => {
    const menuToggle = document.querySelector('.menu-toggle');
    const dropdownMenu = document.querySelector('.dropdown-menu');

    if (menuToggle && dropdownMenu) {
      menuToggle.addEventListener('click', (e) => {
        e.stopPropagation();
        dropdownMenu.classList.toggle('is-active');
        menuToggle.setAttribute(
          'aria-expanded',
          dropdownMenu.classList.contains('is-active')
        );
      });

      // Close dropdown when clicking outside
      document.addEventListener('click', (e) => {
        if (!dropdownMenu.contains(e.target) && !menuToggle.contains(e.target)) {
          dropdownMenu.classList.remove('is-active');
          menuToggle.setAttribute('aria-expanded', 'false');
        }
      });
    }
  });
}
