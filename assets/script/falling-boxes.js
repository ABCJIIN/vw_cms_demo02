document.addEventListener("DOMContentLoaded", () => {

    const canvas = document.getElementById("fallingBoxesCanvas");
    const ctx = canvas.getContext("2d");

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }

    resizeCanvas();

    const basePath = window.location.hostname.includes("github.io")
        ? `/${window.location.pathname.split("/")[1]}/assets/images/main/`
        : "assets/images/main/";

    const imagesDesktop = [
        { file: "falling-item_01.svg", x: 0.10, y: 0.5, rotation: -102, delay: 1.2 },
        { file: "falling-item_02.svg", x: 0.17, y: 0.68, rotation: -10, delay: 0.9 },
        { file: "falling-item_03.svg", x: 0.16, y: 0.82, rotation: -12, delay: 0.7 },
        { file: "falling-item_04.svg", x: 0.36, y: 0.83, rotation: -25, delay: 0.5 },
        { file: "falling-item_05.svg", x: 0.45, y: 0.95, rotation: 0, delay: 0 },
        { file: "falling-item_06.svg", x: 0.67, y: 0.88, rotation: -25, delay: 0.6 },
        { file: "falling-item_07.svg", x: 0.75, y: 0.92, rotation: 0, delay: 0.5 },
        { file: "falling-item_08.svg", x: 0.80, y: 0.85, rotation: 20, delay: 0.7 },
        { file: "falling-item_09.svg", x: 0.83, y: 0.77, rotation: -5, delay: 0.8 },
        { file: "falling-item_10.svg", x: 0.85, y: 0.60, rotation: -120, delay: 1.6 },
    ];

    const imagesMobile = [
        { file: "falling-item_01.svg", x: 0.15, y: 0.72, rotation: -110, delay: 1.2, scale: 0.5 },
        { file: "falling-item_02.svg", x: 0.10, y: 0.84, rotation: -10, delay: 0.9, scale: 0.5 },
        { file: "falling-item_03.svg", x: 0.35, y: 0.90, rotation: -12, delay: 0.7, scale: 0.5 },
        { file: "falling-item_05.svg", x: 0.95, y: 0.72, rotation: -15, delay: 0, scale: 0.5 },
        { file: "falling-item_06.svg", x: 0.65, y: 0.94, rotation: -25, delay: 0.6, scale: 0.5 },
        { file: "falling-item_07.svg", x: 0.75, y: 0.98, rotation: 0, delay: 0.5, scale: 0.5 },
        { file: "falling-item_08.svg", x: 0.69, y: 0.81, rotation: 20, delay: 0.7, scale: 0.5 },
        { file: "falling-item_09.svg", x: 0.89, y: 0.79, rotation: -5, delay: 0.8, scale: 0.5 },
    ];

    const boxes = [];
    let currentImageSet = [];

    function getResponsiveImageSet() {
        return window.innerWidth <= 480 ? imagesMobile : imagesDesktop;
    }

    function loadImage(src) {
        return new Promise((resolve) => {
            const img = new Image();
            img.onload = () => resolve(img);
            img.src = src;
        });
    }

    async function init() {
        const width = window.innerWidth;
        const isMobile = width <= 480;
        const isTablet = width > 480 && width <= 1024;

        currentImageSet = getResponsiveImageSet();

        for (let i = 0; i < currentImageSet.length; i++) {
        const data = currentImageSet[i];
        const img = await loadImage(basePath + data.file);
        const scale = isMobile ? data.scale || 1 : isTablet ? 0.75 : 1;

        const box = {
            img,
            x: canvas.width * data.x,
            y: -150,
            targetY: canvas.height * data.y,
            rotation: 0,
            targetRotation: data.rotation * Math.PI / 180,
            delay: data.delay,
            width: img.width,
            height: img.height,
            scale: scale
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
            duration: 3,
            ease: "bounce.out"
        });
    }

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        boxes.forEach((box) => {
            ctx.save();
            ctx.translate(box.x, box.y);
            ctx.rotate(box.rotation);
            ctx.scale(box.scale, box.scale);
            ctx.drawImage(box.img, -box.width / 2, -box.height / 2);
            ctx.restore();
        });
        requestAnimationFrame(animate);
    }

    function debounce(fn, delay) {
        let timer;
        return function () {
            clearTimeout(timer);
            timer = setTimeout(fn, delay);
        };
    }

    function updateBoxPositions() {
        resizeCanvas();

        const width = window.innerWidth;
        const isMobile = width <= 480;
        const isTablet = width > 480 && width <= 1024;

        const imageSet = getResponsiveImageSet();
        currentImageSet = imageSet;

        boxes.forEach((box, i) => {
            const data = imageSet[i];
            box.x = canvas.width * data.x;
            box.targetY = canvas.height * data.y;
            box.scale = isMobile ? data.scale || 1 : isTablet ? 0.75 : 1;
        });
    }

    window.addEventListener("resize", debounce(updateBoxPositions, 200));

    gsap.registerPlugin(ScrollTrigger);
    
    ScrollTrigger.create({
        trigger: ".main-sec.sec04",
        start: "top 70%", // 요소가 뷰포트 30% 지점쯤 도달할 때
        once: true,
        onEnter: () => {
            init();
        }
    });

});