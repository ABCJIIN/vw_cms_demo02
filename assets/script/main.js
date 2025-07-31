$(function () {

    //skipnav
    $('#skipnav a').click(function() {
        var skipTo="#"+this.href.split('#')[1];
        $(skipTo).attr('tabindex', -1).on('blur focusout', function() {
            $(this).removeAttr('tabindex');
        }).focus();
        return false;
    });
    
    $('.location > ul > li').hover(function(){
        $(this).children('a').siblings('ul').toggle();
    });  

    // Top 이동 버튼
    $(".top-btn").hide();
    $(window).scroll(function () {
        if ($(this).scrollTop() > 250) {
            $(".top-btn").fadeIn();
        } else {
            $(".top-btn").fadeOut();
        }
    }); // 버튼 클릭시
    $(".top-btn").click(function () {
        $("html, body").animate(
            {
                scrollTop: 0, // 0 까지 animation 이동합니다.
            },
            400
        ); // 속도 400
        return false;
    });

    
    // vh 단위 보정 (모바일 Safari 대응)
    function setVhUnit() {
        const vh = window.innerHeight * 0.01;
        document.documentElement.style.setProperty('--vh', `${vh}px`);
    }
    window.addEventListener('resize', setVhUnit);
    setVhUnit();


    if ($("section").hasClass("main-sec") || $("section").hasClass("service")) {
        $("header").removeClass("convert");
    } else {
        $("header").addClass("convert");
    }


    // Header 스크롤시 색상 변경
    $(window).on("scroll", function () {
        if ($(window).scrollTop() > 50) {
            $("header").addClass("scrolled");
        } else {
            $("header").removeClass("scrolled");
        }
    });


    // MO header 슬라이드
    const menuBtn = $("header .menu-btn");
    var moInner = $("header .inner.mo");
    const closeBtn = $("header .close-btn");
    const maxMobileWidth = 768;

    function isMobile() {
        return window.innerWidth <= maxMobileWidth;
    }

    menuBtn.on("click", function () {
        if (isMobile()) {
            $("header .inner.mo").addClass("on");
        }
    });

    closeBtn.on("click", function () {
        if (isMobile()) {
            $("header .inner.mo").removeClass("on");
        }
    });

    $(window).on("resize", function () {
        if (!isMobile()) {
            $("header .inner.mo").removeClass("on");
            $("header .inner.mo").hide();
        } else {
            $("header .inner.mo").show();
        }
    });

    // MO header 키보드 탭
    function enableTabindex() {
        moInner
        .find(
            'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
        )
        .each(function () {
            $(this).attr("tabindex", "-1");
        });
    }
    enableTabindex();

    function disableTabindex() {
        moInner
        .find(
            'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
        )
        .each(function () {
            $(this).removeAttr("tabindex");
        });
    }

    menuBtn.on("click", function () {
        disableTabindex();
        $("header .inner.mo .logo a").focus();
    });

    closeBtn.on("click", function () {
        enableTabindex();
        menuBtn.focus();
    });

    // 768px 이하에서 footer 배경 컬러 제어
    function setFooterBgColor() {
        const pathname = window.location.pathname;
        const isMobile = $(window).width() <= 768;

        if (isMobile) {
            if (pathname.includes("template.html") || pathname.includes("policy.html")) {
                $("footer").css("background-color", "#ffffff");
            } else if (pathname.includes("apply.html") || pathname.includes("contact.html")) {
                $("footer").css("background-color", "#F8F9FB");
            }
            } else {
            // PC 화면으로 돌아올 경우 기본 색상으로 초기화
            $("footer").css("background-color", "");
        }
    }

    // 최초 실행
    setFooterBgColor();

    // 리사이즈 시 재검사
    $(window).on("resize", function () {
        setFooterBgColor();
    });

    // 자주 묻는 질문
    $(".qna .q-wrap").on("click", function () {
        if ($(this).hasClass("on") == false) {
        $(this).addClass("on");
        $(this).siblings(".a-wrap").slideDown();
        } else {
        $(this).removeClass("on");
        $(this).siblings(".a-wrap").slideUp();
        }
    });

    $(".main-sec.sec01 > .inner").addClass("fade-up-end");
    $(".sub-sec.visual > .inner").addClass("fade-up-end");

    // fade 인터렉션
    function fadeUpMotion(classname) {
        const $targets = $("." + classname).not(
            ".main-visual > .inner, .sub-sec.visual > .inner"
        );
        const st = $(window).scrollTop();
        const winH = window.innerHeight;

        $targets.each(function () {
            const $el = $(this);
            const elTop = $el.offset().top;
            const elBottom = elTop + $el.outerHeight();

            const isVisible = elTop < st + winH && elBottom > st;
            const isBelowAndNotVisible = elTop > st + winH;

            if (isVisible) {
                $el.addClass("fade-up-end");
            } else if (isBelowAndNotVisible) {
                $el.removeClass("fade-up-end");
            }
        });
    }

    $(window).on("load resize scroll", function () {
        fadeUpMotion("fade-up");
        $(".main-sec.sec01 > .inner").addClass("fade-up-end");
        $(".sub-sec.visual > .inner").addClass("fade-up-end");
    });

    // 메인화면 .sec01 번 변경
    function changeBun() {
        const $bunInside = $(".main-sec.sec01 > .inner .bun-inside");
        const $bunInsideRow01 = $bunInside.find(".inside-01 .inside-item");
        const $bunInsideRow02 = $bunInside.find(".inside-02 .inside-item");
        const $bunInsideRow03 = $bunInside.find(".inside-03 .inside-item");

        // 각 row별 설정
        const rowConfigs = [
        {
            elements: $bunInsideRow01,
            prefix: "item-01",
            interval: 1000,
            initialClasses: ["item-01-01", "item-01-02", "item-01-03"],
        },
        {
            elements: $bunInsideRow02,
            prefix: "item-02",
            interval: 1800,
            initialClasses: ["item-02-01", "item-02-02", "item-02-03"],
        },
        {
            elements: $bunInsideRow03,
            prefix: "item-03",
            interval: 1400,
            initialClasses: ["item-03-01", "item-03-02", "item-03-03"],
        },
        ];

        // 초기 클래스 설정
        rowConfigs.forEach((config) => {
        config.elements.each(function (index) {
            $(this).addClass(config.initialClasses[index]);
        });
        });

        // 각 row별 애니메이션 시작
        rowConfigs.forEach((config) => {
        let currentStep = 0;

        setInterval(() => {
            currentStep = (currentStep + 1) % 3; // 0, 1, 2 순환

            config.elements.each(function (index) {
            const $item = $(this);
            // 기존 클래스 제거
            $item.removeClass(config.initialClasses.join(" "));

            // 새로운 클래스 추가 (순환 로직)
            const newIndex = (index + currentStep) % 3;
            $item.addClass(config.initialClasses[newIndex]);
            });
        }, config.interval);
        });
    }
    changeBun();

    // 메인화면 .sec02 버티컬 슬라이드
    function verticalSlide() {
        const $slideWrap = $(".sec02 .list-wrap .list-inner");
        const $originSlideItems = $(".sec02 .list-wrap .list-inner .list-item");

        function setTransition(set) {
            $slideWrap.css("transition", set);
            $slideWrap.find(".list-item").each(function () {
                $(this).css("transition", set);
                $(this).find("p").css("transition", set);
            });
        }

        function init() {
            // 처음 세개는 뒤에, 마지막 두개는 앞에 추가
            const firstItems = $originSlideItems.slice(0, 3);
            const lastTwoItems = $originSlideItems.slice(-2);
            lastTwoItems.clone().prependTo($slideWrap);
            firstItems.clone().appendTo($slideWrap);

            setTransition("all 0.5s ease");
        }

        function activeSlide(index) {
            const $slideItems = $slideWrap.find(".list-item");
            $slideItems.removeClass("active prev next");
            $slideItems.eq(index).addClass("active");
            $slideItems.eq(index).prev().addClass("prev");
            $slideItems.eq(index).next().addClass("next");
        }

        init();
        activeSlide(2);

        // 현재 슬라이드 인덱스 (2번째 슬라이드부터 시작)
        let currentIndex = 2;
        // 마지막 애니메이션 실행 시간
        let lastTime = 0;
        // 슬라이드 전환 간격 (2초)
        const interval = 1500;

        // 슬라이드 애니메이션 함수
        function animate(currentTime) {
        // 첫 실행시 lastTime 초기화
        if (!lastTime) lastTime = currentTime;

        // 마지막 애니메이션으로부터 경과 시간 계산
        const elapsed = currentTime - lastTime;

        // 설정된 간격보다 경과 시간이 크면 다음 슬라이드로 전환
        if (elapsed > interval) {
            // 부드러운 전환을 위한 트랜지션 설정
            setTransition("all 0.5s ease");
            lastTime = currentTime;

            // 다음 슬라이드로 이동
            currentIndex++;

            // 이전/다음 슬라이드 표시 초기화
            activeSlide(currentIndex);

            // 슬라이드 위치 이동 (desktop : 86px 간격, tablet : 50px 간격)
            const slideGap = window.innerWidth <= 768 ? 40.4 : 86;
            $slideWrap.css(
            "transform",
            `translateY(-${(currentIndex - 2) * slideGap}px)`
            );
            const $slideItems = $slideWrap.find(".list-item");

            // 마지막 이후 첫 슬라이드 도달시 처음으로 순간 이동
            if (currentIndex >= $slideItems.length - 2) {
            requestAnimationFrame(() => {
                currentIndex = 2; // 초기 위치로
                setTransition("none"); // 부드러운 전환 효과 제거
                $slideWrap.css("transform", "translateY(0)"); // 처음 위치로 이동

                // 슬라이드 상태 초기화
                activeSlide(currentIndex);

                // 다음 프레임에서 트랜지션 다시 활성화
                requestAnimationFrame(() => {
                setTransition("all 0.5s ease");
                });
            });
            }
        }

        requestAnimationFrame(animate);
        }

        requestAnimationFrame(animate);
    }
    verticalSlide();

    // 메인화면 .sec03 타이핑 효과
    let hasTyped = false;
    const text = "마크롱에서 도와드릴게요!";
    let index = 0;
    let speed = 100;

    function typeWriter() {
        if (index < text.length) {
            $("#text").text($("#text").text() + text.charAt(index));
            index++;
            setTimeout(typeWriter, speed);
        }
    }

    $(window).on("scroll", function () {
        if (hasTyped) return;

        const $sec03 = $(".main-sec.sec03");
        if ($sec03.length === 0) return; // 요소 없으면 중단

        const scrollTop = $(window).scrollTop();
        const windowHeight = $(window).height();
        const triggerPoint = scrollTop + windowHeight * 0.2;

        const sec03Top = $sec03.offset().top;

        if (triggerPoint >= sec03Top) {
            hasTyped = true;
            typeWriter();
        }
    });

    // 메인화면 .sec09 슬라이드
    var storySlide = new Swiper('.dynamic-swiper', {
        effect: 'coverflow',
        slidesPerView: 1.2, // 모바일 기준
        centeredSlides: true,
        loop: false,
        coverflowEffect: {
            rotate: 0,
            stretch: 80,
            depth: 0,
            modifier: 1,
            slideShadows: false,
        },
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
        },
        breakpoints: {
            700: {
                slidesPerView: 2,
                centeredSlides: false,
                loop: false,
                autoplay: false
            },
            1070: {
                slidesPerView: 3,
                centeredSlides: false,
                loop: false,
                autoplay: false
            }
        }
    });

    // 서비스 소개 sec02
    function handleScroll() {
        if ($(window).width() <= 768) return; // 768 이하일 때는 무시

        const windowHeight = $(window).height();

        $(".manage-card-wrap > ul > li").each(function () {
            const elementTop = $(this).offset().top;
            const scrollTop = $(window).scrollTop();
            const elementVisible = elementTop < (scrollTop + windowHeight * 0.8); // 80% 이상 보이면

            if (elementVisible) {
                $(this).addClass("on");
            }
        });
    }

    $(window).on("scroll resize load", function () {
        handleScroll();
    });

    // 서비스 소개 sec04
    function checkItemsOnScroll() {
        let windowHeight = $(window).height();
        let scrollTop = $(window).scrollTop();
        let viewportCenter = scrollTop + windowHeight / 2;

        $(".sec04 .process ul li").each(function () {
            let $item = $(this);
            let offset = $item.offset().top;
            let height = $item.outerHeight();
            let itemCenter = offset + height / 2;

            if (Math.abs(viewportCenter - itemCenter) < height) {
                $item.addClass("on");
            }
        });
    }

    $(window).on("scroll resize", checkItemsOnScroll);
    checkItemsOnScroll();


    // 커스텀 select
    function selectCustom() {
        $(".select-item").on("click", function (e) {
            e.preventDefault();
            if ($(this).hasClass("on")) {
                $(this).removeClass("on");
                $(this).siblings(".option-list").slideUp();
            } else {
                $(".select-item").removeClass("on").next(".option-list").slideUp();
                $(this).addClass("on");
                $(this).siblings(".option-list").slideDown();
            }
        });

        $(".option-list li").on("click", function (e) {
            e.preventDefault();
            const value = $(this).text();

            if (!$(this).hasClass("on")) {
                $(this).siblings("li").removeClass("on");
                $(this).addClass("on");
            }

            $(this)
                .parents(".option-list")
                .siblings(".select-item")
                .html(value)
                .css("color", "#000");
            $(this)
                .parents(".option-list")
                .slideUp()
                .siblings(".select-item")
                .removeClass("on");
            $(this)
                .parents(".option-list")
                .siblings(".direct-input")
                .removeClass("on");
        });
    }
    selectCustom();

    // 문의하기 페이지 select
    $(".contact .option-list li").on("click", function (e) {
        e.preventDefault();
        if ($(this).hasClass("template") == true) {
            $(".input-cont.template-select").addClass("on");
        } else {
            $(".input-cont.template-select").removeClass("on");
        }
    });

    // 가격안내 -> 서비스 신청하기 페이지 이동
    // 1단계: 버튼 클릭 → 페이지 이동
    $(".btn-wrap.apply button").on("click", function () {
        const grade = $(this).data("grade");
        // const url = `./html/apply.html?grade=${grade}`;
        const url = `../html/apply.html?grade=${grade}`;
        window.location.href = url;
    });

    // 2단계: 이동한 페이지에서 grade 파라미터 반영
    const urlParams = new URLSearchParams(window.location.search);
    const grade = urlParams.get("grade");

    if (grade && $(".choice").length > 0) {
        const gradeLabels = {
        light: "Light",
        standard: "Standard",
        pro: "Pro",
        premium: "Premium"
        };

        const $choiceSpan = $(".choice").find("span");

        $choiceSpan
        .removeClass()
        .addClass(grade)
        .text(gradeLabels[grade] || grade);
    }

    // 파일명 불러오기
    $("input[type=file]").change(function (e) {
        $(this).siblings(".input-name").val(e.target.files[0].name);
    });

    const scrollPositions = {
        pc: 0,
        mb: 0,
    };

    // 가격 안내 스크롤 안내
    $(".scroll-guide").on("mousedown", function(){
        $(this).hide();
    });

    // 가격 안내 모달 토글
    function toggleModal(type) {
        const $modal = $(".modal-wrap");
        const modalState = $modal.attr("aria-modal");

        type && $modal.attr("data-type", type);

        const $scrollArea = $modal.find(".modal_body .inner");

        if (modalState == "true") {
            $modal.attr("aria-modal", "false");
            $("body").css("overflow", "auto");
        } else {
            $modal.attr("aria-modal", "true");
            $("body").css("overflow", "hidden");

            // 🔁 스크롤 위치 초기화
            scrollPositions.pc = 0;
            scrollPositions.mb = 0;

            $scrollArea.scrollTop(0);
        }
    }

    // 모달 이미지 소스 매핑
    // clickType = business, hospital, education, interior
    // setMode = pc, mb
    function mappedImageSrc(clickType, setMode) {
    const $modal = $(".modal-wrap");
    const $modalInner = $modal.find(".modal_body .inner");
    const type = clickType || $modal.attr("data-type");

    if (setMode) {
        $modal.attr("data-mode", setMode);
    }

    const mode = $modal.attr("data-mode");
    const $img = $modalInner.find("img");
    const newSrc = `../assets/images/price/${mode}_${type}.png`;

    // 이미지 깜빡임 방지용: 일단 비워줬다가 다시 설정
    $img.attr("src", "").attr("src", newSrc);
    }


    function changeMode() {
        const $modal = $(".modal-wrap");
        const isMobile = window.innerWidth <= 500;

        let mode = $modal.attr("data-mode");

        if (isMobile) {
            $modal.attr("data-mode", "mb");
        } else {
            $modal.attr("data-mode", mode); // 기본값 pc 추가
        }

        const $modalTab = $modal.find(
            ".modal_header .center_header .btn_wrap .tabs"
        );
        $modalTab.each(function () {
            const $item = $(this);
            const itemMode = $item.attr("data-mode");
            $item.attr(
                "aria-selected",
                itemMode === (isMobile ? "mb" : $modal.attr("data-mode"))
            );
        });
        mappedImageSrc();
    }

    window.addEventListener("resize", changeMode);

    // 가격 안내 카드 or 템플릿 버튼 클릭
    function clickPriceCardDetail() {
        const $cardBtns = $(".price-card-wrap .card button, .sec01.template .list-wrap button:not(.contact-btn)"); // 가격안내 + 템플릿 페이지용

        const $modal = $(".modal-wrap");

        $cardBtns.on("click", function (e) {
            e.preventDefault();

            const $btn = $(this);
            const type =
                $btn.closest(".card").data("type") ||
                $btn.closest("li").data("type");

            // 버튼 클래스 기반 모드 판별
            let mode = "pc"; // 기본값
            if ($btn.hasClass("mo-btn")) mode = "mb";
            else if ($btn.hasClass("pc-btn")) mode = "pc";
            else mode = window.innerWidth <= 500 ? "mb" : "pc";

            $modal.attr("data-mode", mode);
            // $("html, body").animate({ scrollTop: 0 }, 400);
            $modal.find(".modal_body .inner").scrollTop(0);

            changeMode(); // 내부 탭 aria-selected 상태 갱신
            toggleModal(type);
            mappedImageSrc(type, mode);
        });
    }
    clickPriceCardDetail();

    // 가격 안내 or 템플릿 모달 닫기
    function clickModalClose() {
        $(".modal-wrap .modal_header .close_btn").on("click", function (e) {
            e.preventDefault();
            toggleModal();
        });
    }
    clickModalClose();

    function handleModalTabClick() {
        const $modal = $(".modal-wrap");
        const $tabButtons = $modal.find(".center_header .btn_wrap .tabs");
        const $scrollArea = $modal.find(".modal_body .inner");

        $tabButtons.on("click", function (e) {
            e.preventDefault();

            const prevMode = $modal.attr("data-mode");
            const newMode = $(this).attr("data-mode");

            if (prevMode === newMode) return; // 같은 탭 다시 누른 경우 무시

            // 1. 현재 탭의 스크롤 위치 저장
            scrollPositions[prevMode] = $scrollArea.scrollTop();

            // 2. 탭 전환
            $modal.attr("data-mode", newMode);
            $tabButtons.attr("aria-selected", false);
            $(this).attr("aria-selected", true);

            // 3. 이미지 변경
            mappedImageSrc();

            // 4. 전환한 탭의 스크롤 위치 복원 (기억된 값 없으면 0)
            $scrollArea.scrollTop(scrollPositions[newMode] || 0);
        });
    }

    handleModalTabClick();

    // 가격 안내 설명 툴팁
    $(".tooltip-wrap .info-icon").on("mouseenter", function(){
        $(this).next(".tooltip").stop().fadeIn();
    });

    $(".tooltip-wrap .info-icon").on("mouseleave", function(){
        $(this).next(".tooltip").stop().fadeOut();
    });

    // 가격 안내 테이블 슬라이드
    var storySlide = new Swiper('.tb-swiper', {
        centeredSlides: true,
        loop: false,
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
        },
    });

    // PC환경 마우스 터치 스크롤
    function bindDragScroll(selector) {
        const elements = document.querySelectorAll(selector);

        elements.forEach((el) => {
        let isDown = false;
        let startX;
        let scrollLeft;

        // 마우스 이벤트
        el.addEventListener("mousedown", (e) => {
            isDown = true;
            el.classList.add("dragging");
            startX = e.pageX - el.offsetLeft;
            scrollLeft = el.scrollLeft;
        });

        el.addEventListener("mouseleave", () => {
            isDown = false;
            el.classList.remove("dragging");
        });

        el.addEventListener("mouseup", () => {
            isDown = false;
            el.classList.remove("dragging");
        });

        el.addEventListener("mousemove", (e) => {
            if (!isDown) return;
            e.preventDefault();
            const x = e.pageX - el.offsetLeft;
            const walk = x - startX; // 드래그 거리
            el.scrollLeft = scrollLeft - walk;
        });

        // 터치 이벤트
        el.addEventListener("touchstart", (e) => {
            startX = e.touches[0].pageX - el.offsetLeft;
            scrollLeft = el.scrollLeft;
        });

        el.addEventListener("touchmove", (e) => {
            const x = e.touches[0].pageX - el.offsetLeft;
            const walk = x - startX;
            el.scrollLeft = scrollLeft - walk;
        });
        });
    }
    bindDragScroll(".main-sec.sec04 .detail ul");
    bindDragScroll(".main-sec.sec05 .list-wrap ul");
    // bindDragScroll(".sub-sec.service .manage-card-wrap > ul");
    bindDragScroll(".sub-sec.service .icon-card-wrap > div");
    bindDragScroll(".sub-sec.price .tb-wrap");

    $("img").on("dragstart", function (e) {
        e.preventDefault();
    });

    // textarea 자동 높이조절
    $("textarea").on("keydown", function () {
        $(this).css("height", "auto");

        const offset = window.innerWidth <= 786 ? 28 : 46;
        $(this).height(this.scrollHeight - offset);
    });

    // 탭 메뉴
    $(".tab-menu").each(function () {
        const $tabMenu = $(this);
        const $tabList = $tabMenu.find(".tab-list > li");
        const $tabCont = $tabMenu.find(".tab-cont > div");
        const $currentTab = $tabList.filter(".on");
        const initIndex = $tabList.index($currentTab);
        const $initPanel = $tabCont.eq(initIndex);

        $tabCont.removeClass("on");
        $initPanel.addClass("on");

        // 클릭 이벤트
        $tabList.on("click", function () {
            const $newTab = $(this);
            const tabIndex = $tabList.index(this);
            const $newPanel = $tabCont.eq(tabIndex);

            $tabList.removeClass("on");
            $tabCont.removeClass("on");

            $newTab.addClass("on");
            $newPanel.addClass("on");

            setTimeout(() => {
                if (typeof window.updateBarWidths === 'function') {
                    window.updateBarWidths();
                }
            }, 0);
        });
    });
});
