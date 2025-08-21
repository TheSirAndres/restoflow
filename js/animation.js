// animations.js

// Función para animar las tarjetas de orden
export function animateOrderCards() {
  const orderCards = document.querySelectorAll(".order-card");

  orderCards.forEach((card, index) => {
    anime.remove(card);

    anime({
      targets: card,
      translateY: [1, 0],
      opacity: [0, 1],
      scale: [0.995, 1],
      duration: 1600,
      delay: index * 100,
      easing: "easeOutElastic(1, .8)",
    });

    anime({
      targets: card,
      translateY: [
        { value: -1, duration: 1500, easing: "easeInOutSine" },
        { value: 0, duration: 1500, easing: "easeInOutSine" },
      ],
      scale: [
        { value: 1.01, duration: 1500, easing: "easeInOutSine" },
        { value: 1, duration: 1500, easing: "easeInOutSine" },
      ],
      loop: true,
      delay: index * 200,
    });

    const statusElement = card.querySelector(".order-status");
    if (statusElement) {
      animateOrderStatus(statusElement);
    }
  });
}

// Función para animar el estado de la orden
export function animateOrderStatus(statusElement) {
  const status = statusElement.textContent.trim().toLowerCase();

  const animations = {
    pending: {
      backgroundColor: ["#fff3cd", "#ffecb5"],
      color: ["#856404", "#664d03"],
      loop: true,
      direction: "alternate",
      duration: 1500,
      easing: "easeInOutSine",
    },
    preparing: {
      backgroundColor: ["#cce5ff", "#b3d7ff"],
      color: ["#004085", "#002752"],
      loop: true,
      direction: "alternate",
      duration: 1200,
      easing: "easeInOutSine",
    },
    ready: {
      backgroundColor: ["#d4edda", "#c3e6cb"],
      color: ["#155724", "#0f4018"],
      loop: true,
      direction: "alternate",
      duration: 1000,
      easing: "easeInOutSine",
    },
  };

  if (animations[status]) {
    anime({
      targets: statusElement,
      ...animations[status],
    });
  }
}

// Animaciones para transiciones entre secciones
export function animateSectionTransition(section, callback) {
  const allSections = document.querySelectorAll(".section");
  const currentSection = Array.from(allSections).find(
    (sec) => sec.style.display === "block"
  );

  if (currentSection) {
    anime({
      targets: currentSection,
      opacity: 0,
      translateX: -100,
      duration: 400,
      easing: "easeInOutQuad",
      complete: function () {
        allSections.forEach((sec) => (sec.style.display = "none"));
        section.style.display = "block";

        anime({
          targets: section,
          opacity: [0, 1],
          translateX: [100, 0],
          duration: 600,
          easing: "easeOutElastic(1, .8)",
          complete: callback,
        });
      },
    });
  } else {
    allSections.forEach((sec) => (sec.style.display = "none"));
    section.style.display = "block";
    anime({
      targets: section,
      opacity: [0, 1],
      translateX: [100, 0],
      duration: 600,
      easing: "easeOutElastic(1, .8)",
      complete: callback,
    });
  }
}

// Animaciones para productos
export function animateProductCard(card, index) {
  anime({
    targets: card,
    opacity: [0, 1],
    translateY: [4, 0],
    scale: [1, 1],
    duration: 800,
    delay: index * 100,
    easing: "easeOutElastic(1, .8)",
  });

  anime({
    targets: card,
    translateY: [
      { value: -0.01, duration: 2000, easing: "easeInOutSine" },
      { value: 0, duration: 2000, easing: "easeInOutSine" },
    ],
    loop: true,
    delay: index * 150,
  });
}

// Animaciones para el modal
export function animateModal(modalElement) {
  anime({
    targets: modalElement,
    scale: [0.8, 1],
    opacity: [0, 1],
    translateY: [50, 0],
    duration: 600,
    easing: "easeOutElastic(1, .8)",
  });
}

// Animaciones para elementos del modal
export function animateModalItem(element, index) {
  anime({
    targets: element,
    opacity: [0, 1],
    translateX: [-30, 0],
    duration: 400,
    delay: index * 100,
    easing: "easeOutQuad",
  });
}

// Animaciones para botones
export function setupButtonAnimations() {
  const primaryButtons = document.querySelectorAll(".btn-primary");
  primaryButtons.forEach((btn) => {
    btn.addEventListener("mouseenter", () => {
      anime({
        targets: btn,
        scale: 1.05,
        duration: 200,
        easing: "easeOutQuad",
      });
    });

    btn.addEventListener("mouseleave", () => {
      anime({
        targets: btn,
        scale: 1,
        duration: 200,
        easing: "easeOutQuad",
      });
    });
  });

  const floatingButtons = document.querySelectorAll(
    ".add-btn, .floating-action"
  );
  floatingButtons.forEach((btn) => {
    btn.addEventListener("mouseenter", () => {
      anime({
        targets: btn,
        scale: 1.2,
        rotate: "1turn",
        duration: 400,
        easing: "easeOutElastic(1, .8)",
      });
    });

    btn.addEventListener("mouseleave", () => {
      anime({
        targets: btn,
        scale: 1,
        rotate: 0,
        duration: 400,
        easing: "easeOutElastic(1, .8)",
      });
    });
  });

  setInterval(() => {
    anime({
      targets: "#submit-order",
      scale: [1, 1.03, 1],
      duration: 1500,
      easing: "easeInOutSine",
    });
  }, 3000);
}

// Animaciones de fondo
export function createBackgroundAnimations() {
  anime({
    targets: ".floating-element",
    translateX: function () {
      return anime.random(-100, 100);
    },
    translateY: function () {
      return anime.random(-50, 50);
    },
    scale: function () {
      return anime.random(0.8, 1.2);
    },
    rotate: function () {
      return anime.random(-180, 180);
    },
    duration: function () {
      return anime.random(8000, 15000);
    },
    easing: "easeInOutQuad",
    direction: "alternate",
    loop: true,
  });

  const backgroundAnimation = document.querySelector(".background-animation");
  for (let i = 0; i < 10; i++) {
    const particle = document.createElement("div");
    particle.className = "floating-particle";
    particle.style.cssText = `
            position: absolute;
            width: ${anime.random(5, 15)}px;
            height: ${anime.random(5, 15)}px;
            background: ${i % 2 === 0 ? "var(--primary)" : "var(--accent)"};
            border-radius: 50%;
            top: ${anime.random(0, 100)}%;
            left: ${anime.random(0, 100)}%;
            opacity: ${anime.random(0.1, 0.3)};
        `;
    backgroundAnimation.appendChild(particle);

    anime({
      targets: particle,
      translateX: function () {
        return anime.random(-200, 200);
      },
      translateY: function () {
        return anime.random(-100, 100);
      },
      scale: [0, anime.random(0.5, 1.5), 0],
      rotate: function () {
        return anime.random(0, 360);
      },
      duration: function () {
        return anime.random(5000, 10000);
      },
      easing: "easeInOutQuad",
      loop: true,
      direction: "alternate",
      delay: function () {
        return anime.random(0, 2000);
      },
    });
  }
}
