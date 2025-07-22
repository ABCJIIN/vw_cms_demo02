// $(document).ready(function () {
//   class FallingBoxesAnimation {
//     constructor() {
//       this.canvas = document.getElementById("fallingBoxesCanvas");
//       console.log("Canvas element:", this.canvas);

//       if (!this.canvas) {
//         console.error("Canvas element not found!");
//         return;
//       }

//       this.ctx = this.canvas.getContext("2d");
//       console.log("Canvas context:", this.ctx);
//       this.boxes = [];
      
//         const baseUrl = window.location.origin;
//         const basePath = window.location.pathname.split("/")[1]; // 저장소 이름
//         const isGithub = window.location.hostname.includes("github.io");

//         // GitHub Pages에서는 저장소명 포함, 로컬에선 생략
//         const prefix = isGithub ? `/${basePath}/assets/images/main/` : `assets/images/main/`;

//         this.images = [
//         `${prefix}falling-item_01.svg`,
//         `${prefix}falling-item_02.svg`,
//         `${prefix}falling-item_03.svg`,
//         `${prefix}falling-item_04.svg`,
//         `${prefix}falling-item_05.svg`,
//         `${prefix}falling-item_06.svg`,
//         `${prefix}falling-item_07.svg`,
//         `${prefix}falling-item_08.svg`,
//         `${prefix}falling-item_09.svg`,
//         `${prefix}falling-item_10.svg`
//         ];

//       this.loadedImages = [];

//       this.gravity = 0.4;
//       this.friction = 0.98;
//       this.bounce = 0.6;
//       this.maxBoxes = this.images.length; // 이미지 개수만큼만 생성
//       this.spawnRate = 300;
//       this.continuousSpawn = false; // 연속 생성 비활성화
//       this.lastSpawnTime = 0;
//       this.isSmallScreen = window.innerWidth <= 768;
//       this.isMediumScreen = window.innerWidth <= 1280 && window.innerWidth > 768;
//       this.scaleFactor = this.isSmallScreen ? 0.5 : this.isMediumScreen ? 0.75 : 1;

//       // 이미지 로드
//       this.loadImages().then(() => {
//         this.init();
//       });
//     }

//     async loadImages() {
//       const promises = this.images.map((src) => {
//         return new Promise((resolve, reject) => {
//           const img = new Image();
//           img.onload = () => resolve(img);
//           img.onerror = reject;
//           img.src = src;
//         });
//       });
//       this.loadedImages = await Promise.all(promises);
//     }

//     init() {
//       console.log("Initializing animation...");
//       this.resizeCanvas();
//       this.createInitialBoxes();
//       this.animate();
//       console.log("Animation initialized successfully!");

//       window.addEventListener("resize", () => {
//         const prevScaleFactor = this.scaleFactor;
//         this.isSmallScreen = window.innerWidth <= 768;
//         this.isMediumScreen = window.innerWidth <= 1280 && window.innerWidth > 768;
//         this.scaleFactor = this.isSmallScreen ? 0.5 : this.isMediumScreen ? 0.75 : 1;
        
//         if (prevScaleFactor !== this.scaleFactor) {
//           // 기존 박스들을 모두 제거
//           this.boxes = [];
//           // 새로운 박스들 생성
//           this.createInitialBoxes();
//         }
//         this.resizeCanvas();
//       });
//     }

//     resizeCanvas() {
//       const rect = this.canvas.getBoundingClientRect();
//       this.canvas.width = rect.width;
//       this.canvas.height = rect.height;
//       console.log("Canvas resized to:", rect.width, "x", rect.height);
//     }

//     createBox(x, y, imageIndex) {
//       const image = this.loadedImages[imageIndex];
//       const width = image.naturalWidth * this.scaleFactor;
//       const height = image.naturalHeight * this.scaleFactor;
//       const size = Math.max(width, height);

//       return {
//         x: x || Math.random() * (this.canvas.width - size) + size / 2,
//         y: y || -size,
//         vx: (Math.random() - 0.5) * 2,
//         vy: Math.random() * 1 + 0.5,
//         width: width,
//         height: height,
//         size: size,
//         image: image,
//         rotation: 2,
//         rotationSpeed: (Math.random() - 0.5) * 0.02,
//         opacity: 1,
//         settled: false,
//         mass: (width * height) / 2500,
//         settledTime: 0,
//         settledCount: 0 // 정착 카운트 추가
//       };
//     }

//     createInitialBoxes() {
//       console.log("Creating initial boxes...");
//       for (let i = 0; i < this.maxBoxes; i++) {
//         setTimeout(() => {
//           this.boxes.push(this.createBox(null, null, i));
//           console.log("Box created, total boxes:", this.boxes.length);
//         }, i * this.spawnRate);
//       }
//     }

//     checkCollision(box1, box2) {
//       const dx = box1.x - box2.x;
//       const dy = box1.y - box2.y;
//       const distance = Math.sqrt(dx * dx + dy * dy);
//       const minDistance = (box1.size + box2.size) / 2;

//       return distance < minDistance;
//     }

//     resolveCollision(box1, box2) {
//       const dx = box1.x - box2.x;
//       const dy = box1.y - box2.y;
//       const distance = Math.sqrt(dx * dx + dy * dy);
//       const minDistance = (box1.size + box2.size) / 2;

//       if (distance < minDistance && distance > 0) {
//         const overlap = minDistance - distance;
//         const separationX = (dx / distance) * overlap * 0.5;
//         const separationY = (dy / distance) * overlap * 0.5;

//         const totalMass = box1.mass + box2.mass;
//         const ratio1 = box2.mass / totalMass;
//         const ratio2 = box1.mass / totalMass;

//         box1.x += separationX * ratio1;
//         box1.y += separationY * ratio1;
//         box2.x -= separationX * ratio2;
//         box2.y -= separationY * ratio2;

//         const relativeVelocityX = box1.vx - box2.vx;
//         const relativeVelocityY = box1.vy - box2.vy;

//         const velocityAlongNormal =
//           relativeVelocityX * (dx / distance) +
//           relativeVelocityY * (dy / distance);

//         if (velocityAlongNormal > 0) return;

//         const restitution = 0.6;
//         const impulse = ((1 + restitution) * velocityAlongNormal) / totalMass;

//         box1.vx -= impulse * box2.mass * (dx / distance) * 0.8;
//         box1.vy -= impulse * box2.mass * (dy / distance) * 0.8;
//         box2.vx += impulse * box1.mass * (dx / distance) * 0.8;
//         box2.vy += impulse * box1.mass * (dy / distance) * 0.8;
//       }
//     }

//     updateBoxes() {
//       this.boxes.forEach((box, index) => {
//         if (box.settled && box.settledCount > 30) return; // 30프레임 이상 정착 상태면 업데이트 중단

//         box.vy += this.gravity;
//         box.vx *= this.friction;
//         box.vy *= 0.999;

//         box.x += box.vx;
//         box.y += box.vy;
//         box.rotation += box.rotationSpeed;

//         if (box.x - box.size / 2 < 0) {
//           box.x = box.size / 2;
//           box.vx *= -this.bounce;
//         }
//         if (box.x + box.size / 2 > this.canvas.width) {
//           box.x = this.canvas.width - box.size / 2;
//           box.vx *= -this.bounce;
//         }

//         if (box.y + box.size / 2 > this.canvas.height) {
//           box.y = this.canvas.height - box.size / 2;
//           box.vy *= -this.bounce;
//           box.vx *= 0.9;

//           if (Math.abs(box.vy) < 0.5 && Math.abs(box.vx) < 0.5) {
//             box.vy = 0;
//             box.vx *= 0.8;
            
//             if (!box.settled) {
//               box.settled = true;
//               box.settledTime = Date.now();
//             }
//             box.settledCount++;
//           }
//         }

//         for (let j = index + 1; j < this.boxes.length; j++) {
//           const otherBox = this.boxes[j];
//           if (this.checkCollision(box, otherBox)) {
//             this.resolveCollision(box, otherBox);
//           }
//         }

//         if (
//           Math.abs(box.vx) < 0.1 &&
//           Math.abs(box.vy) < 0.1 &&
//           box.y > this.canvas.height - box.size * 1.1
//         ) {
//           if (!box.settled) {
//             box.settled = true;
//             box.settledTime = Date.now();
//           }
//           box.settledCount++;
//         }
//       });
//     }

//     drawBoxes() {
//       this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

//       this.boxes.forEach((box) => {
//         this.ctx.save();
//         this.ctx.globalAlpha = box.opacity;
//         this.ctx.translate(box.x, box.y);
//         this.ctx.rotate(box.rotation);

//         this.ctx.shadowColor = "rgba(0, 0, 0, 0.2)";
//         this.ctx.shadowBlur = 5;
//         this.ctx.shadowOffsetX = 2;
//         this.ctx.shadowOffsetY = 2;

//         this.ctx.drawImage(
//           box.image,
//           -box.width / 2,
//           -box.height / 2,
//           box.width,
//           box.height
//         );

//         this.ctx.restore();
//       });
//     }

//     animate() {
//       this.boxes = this.boxes.filter((box) => {
//         return box.y < this.canvas.height + 100 && box.opacity > 0.01;
//       });

//       this.updateBoxes();
//       this.drawBoxes();
//       requestAnimationFrame(() => this.animate());
//     }
//   }

//   function initFallingBoxes() {
//     console.log("initFallingBoxes called");

//     const canvas = document.getElementById("fallingBoxesCanvas");
//     if (!canvas) return;

//     const observer = new IntersectionObserver(
//       (entries) => {
//         entries.forEach((entry) => {
//           if (entry.isIntersecting && entry.intersectionRatio >= 0.2) {
//             if (document.readyState === "loading") {
//               document.addEventListener("DOMContentLoaded", () => {
//                 new FallingBoxesAnimation();
//               });
//             } else {
//               new FallingBoxesAnimation();
//             }
//             observer.disconnect();
//           }
//         });
//       },
//       {
//         threshold: 0.2,
//       }
//     );

//     observer.observe(canvas);
//   }

//   console.log("falling-boxes.js loaded successfully");
//   initFallingBoxes();
// });


// $(document).ready(function () {
//   class FallingBoxesAnimation {
// constructor() {
//   this.canvas = document.getElementById("fallingBoxesCanvas");
//   if (!this.canvas) return;

//   this.ctx = this.canvas.getContext("2d");
//   this.boxes = [];

//   const basePath = window.location.pathname.split("/")[1];
//   const isGithub = window.location.hostname.includes("github.io");
//   const prefix = isGithub ? `/${basePath}/assets/images/main/` : `assets/images/main/`;

//   // ✅ 여기다가 imageMeta 삽입!
// this.imageMeta = [
//   {
//     src: `${prefix}falling-item_01.svg`,
//     xPercent: 0,
//     yPercent: 0.8,
//     delay: 3,
//     rotation: -100,
//     scale: 1,
//     startY: -100
//   },
//   {
//     src: `${prefix}falling-item_02.svg`,
//     xPercent: 0.15,
//     yPercent: 0.8,
//     delay: 3,
//     rotation: -10,
//     scale: 1,
//     startY: -110
//   },
//   {
//     src: `${prefix}falling-item_03.svg`,
//     xPercent: 0.2,
//     yPercent: 1,
//     delay: 2,
//     rotation: -10,
//     scale: 1,
//     startY: -90
//   },
//   {
//     src: `${prefix}falling-item_04.svg`,
//     xPercent: 0.3,
//     yPercent: 1.1,
//     delay: 1,
//     rotation: -20,
//     scale: 1,
//     startY: -80
//   },
//   {
//     src: `${prefix}falling-item_05.svg`,
//     xPercent: 0.5,
//     yPercent: 1.2,
//     delay: 0,
//     rotation: 0,
//     scale: 1,
//     startY: -60
//   },
//   {
//     src: `${prefix}falling-item_06.svg`,
//     xPercent: 0.6,
//     yPercent: 0.9,
//     delay: 1,
//     rotation: -15,
//     scale: 1,
//     startY: -70
//   },
//   {
//     src: `${prefix}falling-item_07.svg`,
//     xPercent: 0.7,
//     yPercent: 1,
//     delay: 0,
//     rotation: 0,
//     scale: 1,
//     startY: -60
//   },
//   {
//     src: `${prefix}falling-item_08.svg`,
//     xPercent: 0.95,
//     yPercent: 1,
//     delay: 2,
//     rotation: 20,
//     scale: 1,
//     startY: -80
//   },
//   {
//     src: `${prefix}falling-item_09.svg`,
//     xPercent: 0.8,
//     yPercent: 1,
//     delay: 3,
//     rotation: -5,
//     scale: 1,
//     startY: -90
//   },
//   {
//     src: `${prefix}falling-item_10.svg`,
//     xPercent: 0.95,
//     yPercent: 0.8,
//     delay: 4,
//     rotation: -120,
//     scale: 1,
//     startY: -110
//   },
// ];


//   this.loadedImages = [];
//   this.gravity = 0.4;
//   this.friction = 0.98;
//   this.bounce = 0.6;
//   this.spawnRate = 300;
//   this.scaleFactor = window.innerWidth <= 768 ? 0.5 : window.innerWidth <= 1280 ? 0.75 : 1;

//   this.loadImages().then(() => {
//     this.init();
//   });

//   window.addEventListener("resize", () => this.onResize());
// }


// async loadImages() {
//   const promises = this.imageMeta.map((meta) => {
//     return new Promise((resolve, reject) => {
//       const img = new Image();
//       img.onload = () => {
//         meta.image = img;
//         resolve(img);
//       };
//       img.onerror = reject;
//       img.src = meta.src;
//     });
//   });
//   await Promise.all(promises);
// }



//     init() {
//       this.resizeCanvas();
//       this.createInitialBoxes();
//       this.animate();
//     }

//     onResize() {
//       const prevScaleFactor = this.scaleFactor;
//       this.scaleFactor = window.innerWidth <= 768 ? 0.5 : window.innerWidth <= 1280 ? 0.75 : 1;

//       if (prevScaleFactor !== this.scaleFactor) {
//         this.boxes = [];
//         this.createInitialBoxes();
//       }

//       this.resizeCanvas();
//     }

//     resizeCanvas() {
//       const rect = this.canvas.getBoundingClientRect();
//       this.canvas.width = rect.width;
//       this.canvas.height = rect.height;
//     }

// createBox(meta) {
//   const image = meta.image;
//   const baseWidth = image.naturalWidth * this.scaleFactor * (meta.scale || 1);
//   const baseHeight = image.naturalHeight * this.scaleFactor * (meta.scale || 1);
//   const size = Math.max(baseWidth, baseHeight);

//   return {
//     x: this.canvas.width * meta.xPercent,
//     y: meta.startY || -size,
//     vx: (Math.random() - 0.5) * 3,
//     vy: 0.5,
//     width: baseWidth,
//     height: baseHeight,
//     size,
//     image,
//     rotation: (meta.rotation || 0) * (Math.PI / 180),
//     rotationSpeed: 0,
//     opacity: 1,
//     settled: false,
//     mass: (baseWidth * baseHeight) / 2500,
//     settledTime: 0,
//     settledCount: 0,
//     targetY: this.canvas.height * (meta.yPercent || 0.9) // ← 추가!
//   };
// }


// createInitialBoxes() {
//   this.imageMeta.forEach((meta) => {
//     setTimeout(() => {
//       this.boxes.push(this.createBox(meta));
//     }, meta.delay * this.spawnRate);
//   });
// }




//     checkCollision(box1, box2) {
//       const dx = box1.x - box2.x;
//       const dy = box1.y - box2.y;
//       const distance = Math.sqrt(dx * dx + dy * dy);
//       const minDistance = (box1.size + box2.size) / 2;
//       return distance < minDistance;
//     }

//     resolveCollision(box1, box2) {
//       const dx = box1.x - box2.x;
//       const dy = box1.y - box2.y;
//       const distance = Math.sqrt(dx * dx + dy * dy);
//       const minDistance = (box1.size + box2.size) / 2;

//       if (distance < minDistance && distance > 0) {
//         const overlap = minDistance - distance;
//         const separationX = (dx / distance) * overlap * 0.5;
//         const separationY = (dy / distance) * overlap * 0.5;

//         const totalMass = box1.mass + box2.mass;
//         const ratio1 = box2.mass / totalMass;
//         const ratio2 = box1.mass / totalMass;

//         box1.x += separationX * ratio1;
//         box1.y += separationY * ratio1;
//         box2.x -= separationX * ratio2;
//         box2.y -= separationY * ratio2;

//         const relativeVelocityX = box1.vx - box2.vx;
//         const relativeVelocityY = box1.vy - box2.vy;
//         const velocityAlongNormal =
//           relativeVelocityX * (dx / distance) +
//           relativeVelocityY * (dy / distance);

//         if (velocityAlongNormal > 0) return;

//         const restitution = 0.6;
//         const impulse = ((1 + restitution) * velocityAlongNormal) / totalMass;

//         box1.vx -= impulse * box2.mass * (dx / distance) * 0.8;
//         box1.vy -= impulse * box2.mass * (dy / distance) * 0.8;
//         box2.vx += impulse * box1.mass * (dx / distance) * 0.8;
//         box2.vy += impulse * box1.mass * (dy / distance) * 0.8;
//       }
//     }

//     updateBoxes() {
//       this.boxes.forEach((box, index) => {
//         if (box.settled && box.settledCount > 30) return;

//         box.vy += this.gravity;
//         box.vx *= this.friction;
//         box.vy *= 0.999;

//         box.x += box.vx;
//         box.y += box.vy;
//         box.rotation += box.rotationSpeed;

//         if (box.x - box.size / 2 < 0) {
//           box.x = box.size / 2;
//           box.vx *= -this.bounce;
//         }
//         if (box.x + box.size / 2 > this.canvas.width) {
//           box.x = this.canvas.width - box.size / 2;
//           box.vx *= -this.bounce;
//         }

//         if (box.y + box.size / 2 > box.targetY) {
//           box.y = box.targetY - box.size / 2;
//           box.vy *= -this.bounce;
//           box.vx *= 0.9;

//           if (Math.abs(box.vy) < 0.5 && Math.abs(box.vx) < 0.5) {
//             box.vy = 0;
//             box.vx *= 0.8;
//             if (!box.settled) {
//               box.settled = true;
//               box.settledTime = Date.now();
//             }
//             box.settledCount++;
//           }
//         }

//         for (let j = index + 1; j < this.boxes.length; j++) {
//           const otherBox = this.boxes[j];
//           if (this.checkCollision(box, otherBox)) {
//             this.resolveCollision(box, otherBox);
//           }
//         }

//         if (
//           Math.abs(box.vx) < 0.1 &&
//           Math.abs(box.vy) < 0.1 &&
//           box.y > this.canvas.height - box.size * 1.1
//         ) {
//           if (!box.settled) {
//             box.settled = true;
//             box.settledTime = Date.now();
//           }
//           box.settledCount++;
//         }
//       });
//     }

//     drawBoxes() {
//       this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
//       this.boxes.forEach((box) => {
//         this.ctx.save();
//         this.ctx.globalAlpha = box.opacity;
//         this.ctx.translate(box.x, box.y);
//         this.ctx.rotate(box.rotation);
//         this.ctx.shadowColor = "rgba(0, 0, 0, 0.2)";
//         this.ctx.shadowBlur = 5;
//         this.ctx.shadowOffsetX = 2;
//         this.ctx.shadowOffsetY = 2;
//         this.ctx.drawImage(
//           box.image,
//           -box.width / 2,
//           -box.height / 2,
//           box.width,
//           box.height
//         );
//         this.ctx.restore();
//       });
//     }

//     animate() {
//       this.boxes = this.boxes.filter((box) => {
//         return box.y < this.canvas.height + 100 && box.opacity > 0.01;
//       });

//       this.updateBoxes();
//       this.drawBoxes();
//       requestAnimationFrame(() => this.animate());
//     }
//   }

//   function initFallingBoxes() {
//     const canvas = document.getElementById("fallingBoxesCanvas");
//     if (!canvas) return;

//     const observer = new IntersectionObserver(
//       (entries) => {
//         entries.forEach((entry) => {
//           if (entry.isIntersecting && entry.intersectionRatio >= 0.2) {
//             new FallingBoxesAnimation();
//             observer.disconnect();
//           }
//         });
//       },
//       {
//         threshold: 0.2,
//       }
//     );

//     observer.observe(canvas);
//   }

//   initFallingBoxes();
// });



document.addEventListener("DOMContentLoaded", () => {
  const canvas = document.getElementById("fallingBoxesCanvas");
  const ctx = canvas.getContext("2d");

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resizeCanvas();
  window.addEventListener("resize", resizeCanvas);

  const basePath = window.location.hostname.includes("github.io")
    ? `/${window.location.pathname.split("/")[1]}/assets/images/main/`
    : "assets/images/main/";

  const images = [
    { file: "falling-item_01.svg", x: 0.10, y: 0.5, rotation: -102, delay: 1 },
    { file: "falling-item_02.svg", x: 0.17, y: 0.68, rotation: -10, delay: 0.7 },
    { file: "falling-item_03.svg", x: 0.16, y: 0.82, rotation: -12, delay: 0.5 },
    { file: "falling-item_04.svg", x: 0.36, y: 0.83, rotation: -25, delay: 0.3 },
    { file: "falling-item_05.svg", x: 0.45, y: 0.95, rotation: 0, delay: 0 },
    { file: "falling-item_06.svg", x: 0.67, y: 0.88, rotation: -25, delay: 0.4 },
    { file: "falling-item_07.svg", x: 0.75, y: 0.92, rotation: 0, delay: 0.3 },
    { file: "falling-item_08.svg", x: 0.80, y: 0.85, rotation: 20, delay: 0.5 },
    { file: "falling-item_09.svg", x: 0.83, y: 0.77, rotation: -5, delay: 0.6 },
    { file: "falling-item_10.svg", x: 0.85, y: 0.60, rotation: -120, delay: 1.4 },
  ];

  const boxes = [];

  function loadImage(src) {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.src = src;
    });
  }

  async function init() {
    for (let data of images) {
      const img = await loadImage(basePath + data.file);
      const box = {
        img,
        x: canvas.width * data.x,
        y: -150,
        targetY: canvas.height * data.y,
        rotation: 0,
        targetRotation: data.rotation * Math.PI / 180,
        delay: data.delay,
        width: img.width,
        height: img.height
      };
      boxes.push(box);
      animateBox(box);
    }
    animate();
  }

  function animateBox(box) {
    gsap.to(box, {
      y: box.targetY,
      rotation: box.targetRotation,
      delay: box.delay,
      duration: 1.8,
      ease: "bounce.out"
    });
  }

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    boxes.forEach((box) => {
      ctx.save();
      ctx.translate(box.x, box.y);
      ctx.rotate(box.rotation);
      ctx.drawImage(box.img, -box.width / 2, -box.height / 2);
      ctx.restore();
    });
    requestAnimationFrame(animate);
  }

  init();
});
