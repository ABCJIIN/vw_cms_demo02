"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

$(document).ready(function () {
  var FallingBoxesAnimation =
  /*#__PURE__*/
  function () {
    function FallingBoxesAnimation() {
      var _this = this;

      _classCallCheck(this, FallingBoxesAnimation);

      this.canvas = document.getElementById("fallingBoxesCanvas");
      console.log("Canvas element:", this.canvas);

      if (!this.canvas) {
        console.error("Canvas element not found!");
        return;
      }

      this.ctx = this.canvas.getContext("2d");
      console.log("Canvas context:", this.ctx);
      this.boxes = [];
      this.images = ["../../assets/images/main/falling-item_01.svg", "../../assets/images/main/falling-item_02.svg", "../../assets/images/main/falling-item_03.svg", "../../assets/images/main/falling-item_04.svg", "../../assets/images/main/falling-item_05.svg", "../../assets/images/main/falling-item_06.svg", "../../assets/images/main/falling-item_07.svg", "../../assets/images/main/falling-item_08.svg", "../../assets/images/main/falling-item_09.svg", "../../assets/images/main/falling-item_10.svg"];
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
      this.scaleFactor = this.isSmallScreen ? 0.5 : this.isMediumScreen ? 0.75 : 1; // 이미지 로드

      this.loadImages().then(function () {
        _this.init();
      });
    }

    _createClass(FallingBoxesAnimation, [{
      key: "loadImages",
      value: function loadImages() {
        var promises;
        return regeneratorRuntime.async(function loadImages$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                promises = this.images.map(function (src) {
                  return new Promise(function (resolve, reject) {
                    var img = new Image();

                    img.onload = function () {
                      return resolve(img);
                    };

                    img.onerror = reject;
                    img.src = src;
                  });
                });
                _context.next = 3;
                return regeneratorRuntime.awrap(Promise.all(promises));

              case 3:
                this.loadedImages = _context.sent;

              case 4:
              case "end":
                return _context.stop();
            }
          }
        }, null, this);
      }
    }, {
      key: "init",
      value: function init() {
        var _this2 = this;

        console.log("Initializing animation...");
        this.resizeCanvas();
        this.createInitialBoxes();
        this.animate();
        console.log("Animation initialized successfully!");
        window.addEventListener("resize", function () {
          var prevScaleFactor = _this2.scaleFactor;
          _this2.isSmallScreen = window.innerWidth <= 768;
          _this2.isMediumScreen = window.innerWidth <= 1280 && window.innerWidth > 768;
          _this2.scaleFactor = _this2.isSmallScreen ? 0.5 : _this2.isMediumScreen ? 0.75 : 1;

          if (prevScaleFactor !== _this2.scaleFactor) {
            // 기존 박스들을 모두 제거
            _this2.boxes = []; // 새로운 박스들 생성

            _this2.createInitialBoxes();
          }

          _this2.resizeCanvas();
        });
      }
    }, {
      key: "resizeCanvas",
      value: function resizeCanvas() {
        var rect = this.canvas.getBoundingClientRect();
        this.canvas.width = rect.width;
        this.canvas.height = rect.height;
        console.log("Canvas resized to:", rect.width, "x", rect.height);
      }
    }, {
      key: "createBox",
      value: function createBox(x, y, imageIndex) {
        var image = this.loadedImages[imageIndex];
        var width = image.naturalWidth * this.scaleFactor;
        var height = image.naturalHeight * this.scaleFactor;
        var size = Math.max(width, height);
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
          mass: width * height / 2500,
          settledTime: 0,
          settledCount: 0 // 정착 카운트 추가

        };
      }
    }, {
      key: "createInitialBoxes",
      value: function createInitialBoxes() {
        var _this3 = this;

        console.log("Creating initial boxes...");

        var _loop = function _loop(i) {
          setTimeout(function () {
            _this3.boxes.push(_this3.createBox(null, null, i));

            console.log("Box created, total boxes:", _this3.boxes.length);
          }, i * _this3.spawnRate);
        };

        for (var i = 0; i < this.maxBoxes; i++) {
          _loop(i);
        }
      }
    }, {
      key: "checkCollision",
      value: function checkCollision(box1, box2) {
        var dx = box1.x - box2.x;
        var dy = box1.y - box2.y;
        var distance = Math.sqrt(dx * dx + dy * dy);
        var minDistance = (box1.size + box2.size) / 2;
        return distance < minDistance;
      }
    }, {
      key: "resolveCollision",
      value: function resolveCollision(box1, box2) {
        var dx = box1.x - box2.x;
        var dy = box1.y - box2.y;
        var distance = Math.sqrt(dx * dx + dy * dy);
        var minDistance = (box1.size + box2.size) / 2;

        if (distance < minDistance && distance > 0) {
          var overlap = minDistance - distance;
          var separationX = dx / distance * overlap * 0.5;
          var separationY = dy / distance * overlap * 0.5;
          var totalMass = box1.mass + box2.mass;
          var ratio1 = box2.mass / totalMass;
          var ratio2 = box1.mass / totalMass;
          box1.x += separationX * ratio1;
          box1.y += separationY * ratio1;
          box2.x -= separationX * ratio2;
          box2.y -= separationY * ratio2;
          var relativeVelocityX = box1.vx - box2.vx;
          var relativeVelocityY = box1.vy - box2.vy;
          var velocityAlongNormal = relativeVelocityX * (dx / distance) + relativeVelocityY * (dy / distance);
          if (velocityAlongNormal > 0) return;
          var restitution = 0.6;
          var impulse = (1 + restitution) * velocityAlongNormal / totalMass;
          box1.vx -= impulse * box2.mass * (dx / distance) * 0.8;
          box1.vy -= impulse * box2.mass * (dy / distance) * 0.8;
          box2.vx += impulse * box1.mass * (dx / distance) * 0.8;
          box2.vy += impulse * box1.mass * (dy / distance) * 0.8;
        }
      }
    }, {
      key: "updateBoxes",
      value: function updateBoxes() {
        var _this4 = this;

        this.boxes.forEach(function (box, index) {
          if (box.settled && box.settledCount > 30) return; // 30프레임 이상 정착 상태면 업데이트 중단

          box.vy += _this4.gravity;
          box.vx *= _this4.friction;
          box.vy *= 0.999;
          box.x += box.vx;
          box.y += box.vy;
          box.rotation += box.rotationSpeed;

          if (box.x - box.size / 2 < 0) {
            box.x = box.size / 2;
            box.vx *= -_this4.bounce;
          }

          if (box.x + box.size / 2 > _this4.canvas.width) {
            box.x = _this4.canvas.width - box.size / 2;
            box.vx *= -_this4.bounce;
          }

          if (box.y + box.size / 2 > _this4.canvas.height) {
            box.y = _this4.canvas.height - box.size / 2;
            box.vy *= -_this4.bounce;
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

          for (var j = index + 1; j < _this4.boxes.length; j++) {
            var otherBox = _this4.boxes[j];

            if (_this4.checkCollision(box, otherBox)) {
              _this4.resolveCollision(box, otherBox);
            }
          }

          if (Math.abs(box.vx) < 0.1 && Math.abs(box.vy) < 0.1 && box.y > _this4.canvas.height - box.size * 1.1) {
            if (!box.settled) {
              box.settled = true;
              box.settledTime = Date.now();
            }

            box.settledCount++;
          }
        });
      }
    }, {
      key: "drawBoxes",
      value: function drawBoxes() {
        var _this5 = this;

        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.boxes.forEach(function (box) {
          _this5.ctx.save();

          _this5.ctx.globalAlpha = box.opacity;

          _this5.ctx.translate(box.x, box.y);

          _this5.ctx.rotate(box.rotation);

          _this5.ctx.shadowColor = "rgba(0, 0, 0, 0.2)";
          _this5.ctx.shadowBlur = 5;
          _this5.ctx.shadowOffsetX = 2;
          _this5.ctx.shadowOffsetY = 2;

          _this5.ctx.drawImage(box.image, -box.width / 2, -box.height / 2, box.width, box.height);

          _this5.ctx.restore();
        });
      }
    }, {
      key: "animate",
      value: function animate() {
        var _this6 = this;

        this.boxes = this.boxes.filter(function (box) {
          return box.y < _this6.canvas.height + 100 && box.opacity > 0.01;
        });
        this.updateBoxes();
        this.drawBoxes();
        requestAnimationFrame(function () {
          return _this6.animate();
        });
      }
    }]);

    return FallingBoxesAnimation;
  }();

  function initFallingBoxes() {
    console.log("initFallingBoxes called");
    var canvas = document.getElementById("fallingBoxesCanvas");
    if (!canvas) return;
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting && entry.intersectionRatio >= 0.2) {
          if (document.readyState === "loading") {
            document.addEventListener("DOMContentLoaded", function () {
              new FallingBoxesAnimation();
            });
          } else {
            new FallingBoxesAnimation();
          }

          observer.disconnect();
        }
      });
    }, {
      threshold: 0.2
    });
    observer.observe(canvas);
  }

  console.log("falling-boxes.js loaded successfully");
  initFallingBoxes();
});