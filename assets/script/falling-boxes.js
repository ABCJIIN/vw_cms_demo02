$(document).ready(function () {
  class FallingBoxesAnimation {
    constructor() {
      this.canvas = document.getElementById("fallingBoxesCanvas");
      console.log("Canvas element:", this.canvas);

      if (!this.canvas) {
        console.error("Canvas element not found!");
        return;
      }

      this.ctx = this.canvas.getContext("2d");
      console.log("Canvas context:", this.ctx);
      this.boxes = [];
      this.images = [
        "/humanframe/theme/vintwire/assets/images/main/falling-item_01.svg",
        "/humanframe/theme/vintwire/assets/images/main/falling-item_02.svg",
        "/humanframe/theme/vintwire/assets/images/main/falling-item_03.svg",
        "/humanframe/theme/vintwire/assets/images/main/falling-item_04.svg",
        "/humanframe/theme/vintwire/assets/images/main/falling-item_05.svg",
        "/humanframe/theme/vintwire/assets/images/main/falling-item_06.svg",
        "/humanframe/theme/vintwire/assets/images/main/falling-item_07.svg",
        "/humanframe/theme/vintwire/assets/images/main/falling-item_08.svg",
        "/humanframe/theme/vintwire/assets/images/main/falling-item_09.svg",
        "/humanframe/theme/vintwire/assets/images/main/falling-item_10.svg",
      ];
      this.loadedImages = [];

      this.gravity = 0.4;
      this.friction = 0.98;
      this.bounce = 0.6;
      this.maxBoxes = this.images.length; // 이미지 개수만큼만 생성
      this.spawnRate = 300;
      this.continuousSpawn = false; // 연속 생성 비활성화
      this.lastSpawnTime = 0;
      this.isSmallScreen = window.innerWidth <= 768;
      this.isMediumScreen = window.innerWidth <= 1280 && window.innerWidth > 768;
      this.scaleFactor = this.isSmallScreen ? 0.5 : this.isMediumScreen ? 0.75 : 1;

      // 이미지 로드
      this.loadImages().then(() => {
        this.init();
      });
    }

    async loadImages() {
      const promises = this.images.map((src) => {
        return new Promise((resolve, reject) => {
          const img = new Image();
          img.onload = () => resolve(img);
          img.onerror = reject;
          img.src = src;
        });
      });
      this.loadedImages = await Promise.all(promises);
    }

    init() {
      console.log("Initializing animation...");
      this.resizeCanvas();
      this.createInitialBoxes();
      this.animate();
      console.log("Animation initialized successfully!");

      window.addEventListener("resize", () => {
        const prevScaleFactor = this.scaleFactor;
        this.isSmallScreen = window.innerWidth <= 768;
        this.isMediumScreen = window.innerWidth <= 1280 && window.innerWidth > 768;
        this.scaleFactor = this.isSmallScreen ? 0.5 : this.isMediumScreen ? 0.75 : 1;
        
        if (prevScaleFactor !== this.scaleFactor) {
          // 기존 박스들을 모두 제거
          this.boxes = [];
          // 새로운 박스들 생성
          this.createInitialBoxes();
        }
        this.resizeCanvas();
      });
    }

    resizeCanvas() {
      const rect = this.canvas.getBoundingClientRect();
      this.canvas.width = rect.width;
      this.canvas.height = rect.height;
      console.log("Canvas resized to:", rect.width, "x", rect.height);
    }

    createBox(x, y, imageIndex) {
      const image = this.loadedImages[imageIndex];
      const width = image.naturalWidth * this.scaleFactor;
      const height = image.naturalHeight * this.scaleFactor;
      const size = Math.max(width, height);

      return {
        x: x || Math.random() * (this.canvas.width - size) + size / 2,
        y: y || -size,
        vx: (Math.random() - 0.5) * 2,
        vy: Math.random() * 1 + 0.5,
        width: width,
        height: height,
        size: size,
        image: image,
        rotation: 2,
        rotationSpeed: (Math.random() - 0.5) * 0.02,
        opacity: 1,
        settled: false,
        mass: (width * height) / 2500,
        settledTime: 0,
        settledCount: 0 // 정착 카운트 추가
      };
    }

    createInitialBoxes() {
      console.log("Creating initial boxes...");
      for (let i = 0; i < this.maxBoxes; i++) {
        setTimeout(() => {
          this.boxes.push(this.createBox(null, null, i));
          console.log("Box created, total boxes:", this.boxes.length);
        }, i * this.spawnRate);
      }
    }

    checkCollision(box1, box2) {
      const dx = box1.x - box2.x;
      const dy = box1.y - box2.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      const minDistance = (box1.size + box2.size) / 2;

      return distance < minDistance;
    }

    resolveCollision(box1, box2) {
      const dx = box1.x - box2.x;
      const dy = box1.y - box2.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      const minDistance = (box1.size + box2.size) / 2;

      if (distance < minDistance && distance > 0) {
        const overlap = minDistance - distance;
        const separationX = (dx / distance) * overlap * 0.5;
        const separationY = (dy / distance) * overlap * 0.5;

        const totalMass = box1.mass + box2.mass;
        const ratio1 = box2.mass / totalMass;
        const ratio2 = box1.mass / totalMass;

        box1.x += separationX * ratio1;
        box1.y += separationY * ratio1;
        box2.x -= separationX * ratio2;
        box2.y -= separationY * ratio2;

        const relativeVelocityX = box1.vx - box2.vx;
        const relativeVelocityY = box1.vy - box2.vy;

        const velocityAlongNormal =
          relativeVelocityX * (dx / distance) +
          relativeVelocityY * (dy / distance);

        if (velocityAlongNormal > 0) return;

        const restitution = 0.6;
        const impulse = ((1 + restitution) * velocityAlongNormal) / totalMass;

        box1.vx -= impulse * box2.mass * (dx / distance) * 0.8;
        box1.vy -= impulse * box2.mass * (dy / distance) * 0.8;
        box2.vx += impulse * box1.mass * (dx / distance) * 0.8;
        box2.vy += impulse * box1.mass * (dy / distance) * 0.8;
      }
    }

    updateBoxes() {
      this.boxes.forEach((box, index) => {
        if (box.settled && box.settledCount > 30) return; // 30프레임 이상 정착 상태면 업데이트 중단

        box.vy += this.gravity;
        box.vx *= this.friction;
        box.vy *= 0.999;

        box.x += box.vx;
        box.y += box.vy;
        box.rotation += box.rotationSpeed;

        if (box.x - box.size / 2 < 0) {
          box.x = box.size / 2;
          box.vx *= -this.bounce;
        }
        if (box.x + box.size / 2 > this.canvas.width) {
          box.x = this.canvas.width - box.size / 2;
          box.vx *= -this.bounce;
        }

        if (box.y + box.size / 2 > this.canvas.height) {
          box.y = this.canvas.height - box.size / 2;
          box.vy *= -this.bounce;
          box.vx *= 0.9;

          if (Math.abs(box.vy) < 0.5 && Math.abs(box.vx) < 0.5) {
            box.vy = 0;
            box.vx *= 0.8;
            
            if (!box.settled) {
              box.settled = true;
              box.settledTime = Date.now();
            }
            box.settledCount++;
          }
        }

        for (let j = index + 1; j < this.boxes.length; j++) {
          const otherBox = this.boxes[j];
          if (this.checkCollision(box, otherBox)) {
            this.resolveCollision(box, otherBox);
          }
        }

        if (
          Math.abs(box.vx) < 0.1 &&
          Math.abs(box.vy) < 0.1 &&
          box.y > this.canvas.height - box.size * 1.1
        ) {
          if (!box.settled) {
            box.settled = true;
            box.settledTime = Date.now();
          }
          box.settledCount++;
        }
      });
    }

    drawBoxes() {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

      this.boxes.forEach((box) => {
        this.ctx.save();
        this.ctx.globalAlpha = box.opacity;
        this.ctx.translate(box.x, box.y);
        this.ctx.rotate(box.rotation);

        this.ctx.shadowColor = "rgba(0, 0, 0, 0.2)";
        this.ctx.shadowBlur = 5;
        this.ctx.shadowOffsetX = 2;
        this.ctx.shadowOffsetY = 2;

        this.ctx.drawImage(
          box.image,
          -box.width / 2,
          -box.height / 2,
          box.width,
          box.height
        );

        this.ctx.restore();
      });
    }

    animate() {
      this.boxes = this.boxes.filter((box) => {
        return box.y < this.canvas.height + 100 && box.opacity > 0.01;
      });

      this.updateBoxes();
      this.drawBoxes();
      requestAnimationFrame(() => this.animate());
    }
  }

  function initFallingBoxes() {
    console.log("initFallingBoxes called");

    const canvas = document.getElementById("fallingBoxesCanvas");
    if (!canvas) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio >= 0.2) {
            if (document.readyState === "loading") {
              document.addEventListener("DOMContentLoaded", () => {
                new FallingBoxesAnimation();
              });
            } else {
              new FallingBoxesAnimation();
            }
            observer.disconnect();
          }
        });
      },
      {
        threshold: 0.2,
      }
    );

    observer.observe(canvas);
  }

  console.log("falling-boxes.js loaded successfully");
  initFallingBoxes();
});
