$(function () {

    // 전체 공통
    // vh 단위 보정 (모바일 Safari 대응)
    // function setVhUnit() {
    //     const vh = window.innerHeight * 0.01;
    //     document.documentElement.style.setProperty('--vh', `${vh}px`);
    // }
    // window.addEventListener('resize', setVhUnit);
    // setVhUnit();


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

  // 번 변경
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

  // 버티컬 슬라이드
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

    // function checkIsMobile() {
    //     const isMobile = window.innerWidth <= 768;
    //     return isMobile;
    // }

    // let swiper = null;

    // // 메인 슬라이드
    // var Swiper = new Swiper('.dynamic-swiper', {
    //     slidesPerView: 3,
    //     navigation: {
    //         nextEl: '.dynamic-next',
    //         prevEl: '.dynamic-prev'
    //     },
    //     autoplay: {
    //         delay: 3000, // 3초마다 자동 재생
    //         disableOnInteraction: false // 사용자 상호 작용 후에도 자동 재생 유지
    //     },
    //     effect: 'fade', // 페이드 인/아웃 효과
    //     direction: 'horizontal', // 슬라이드 방향 (수평)
    //     touchRatio: 1, // 슬라이드 드래그 감도
    //     mousewheel: true, // 마우스 휠로 슬라이드 이동 가능
    //     centeredSlides: true, // 슬라이드 중앙 정렬
    //     watchOverflow: true // 슬라이드가 화면을 넘어갈 때의 처리 설정
    // });

    // function dynamicSlide() {
    //     // 모바일 환경에서만 실행, desktop > mobile > desktop 시에, swiper 초기화 필요
    //     if (checkIsMobile()) {
    //     if (!swiper) {
    //         swiper = new Swiper(".sec09 .dynamic-swiper", {
    //         slidesPerView: 3,
    //         centeredSlides: true,
    //         });
    //     }
    //     } else {
    //     if (swiper) {
    //         swiper.destroy();
    //         swiper = null;
    //     }
    //     }
    // }
    // dynamicSlide();

    // $(window).on("resize", function () {
    //     dynamicSlide();
    // });

  // 서비스 소개
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


    // 가격안내 -> 서비스 신청하기 페이지 이동
    // 1단계: 버튼 클릭 → 페이지 이동
    $(".btn_wrap.apply button").on("click", function () {
        const grade = $(this).data("grade");
        const url = `./html/apply.html?grade=${grade}`;
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

        // 가격안내 페이지 select
        $(".select-box.type01 .option-list li").on("click", function (e) {
        e.preventDefault();
        const searchWrap = $(this).closest(".search-wrap");
        const tbWrap = $(this).closest(".sub-sec").find(".tb-wrap");
        const colors = ["green", "purple", "pink", "orange"];

        // 현재 li에 있는 색상 클래스를 찾아서 적용
        const selectedColor = colors.find((color) => $(this).hasClass(color));

        if (selectedColor) {
            searchWrap.removeClass(colors.join(" ")).addClass(selectedColor);
            tbWrap.removeClass(colors.join(" ")).addClass(selectedColor);
        }
        });

        // 문의하기 페이지 select
        $(".contact .option-list li").on("click", function (e) {
        e.preventDefault();
        if ($(this).hasClass("portfolio") == true) {
            $(".input-cont.portfolio-select").addClass("on");
        } else {
            $(".input-cont.portfolio-select").removeClass("on");
        }
        });
    }
    selectCustom();

  // 파일명 불러오기
  $("input[type=file]").change(function (e) {
    $(this).siblings(".input-name").val(e.target.files[0].name);
  });

  // 가격 안내 모달 토글
  function toggleModal(type) {
    const $modal = $(".modal-wrap");
    const modalState = $modal.attr("aria-modal");

    type && $modal.attr("data-type", type); // business, hospital, education, interior

    if (modalState == "true") {
      $modal.attr("aria-modal", "false");
      $("body").css("overflow", "auto");
    } else {
      $modal.attr("aria-modal", "true");
      $("body").css("overflow", "hidden");
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

    $modalInner
      .find("img")
      .attr(
        "src",
        `../assets/images/price/${mode}_${type}.png`
      );
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

  // 가격 안내 카드 버튼 클릭
  function clickPriceCardDetail() {
    const $cardBtns = $(".price-card-wrap .card button");
    const $modal = $(".modal-wrap");

    
    $cardBtns.on("click", function (e) {
      e.preventDefault();
      
      const type = $(this).closest(".card").attr("data-type");
      const mode = window.innerWidth <= 500 ? "mb" : "pc"; // 현재 화면 크기에 따라 모드 설정
      $modal.attr("data-mode", mode);
      $("html, body").animate({ scrollTop: 0 }, 400); // 모달 오픈 시 페이지 상단으로 이동
      
      changeMode();
      toggleModal(type);
      mappedImageSrc(type, mode);
    });
  }

  clickPriceCardDetail();

  // 가격 안내 모달 닫기
  function clickModalClose() {
    $(".modal-wrap .modal_header .close_btn").on("click", function (e) {
      e.preventDefault();
      toggleModal();
    });
  }

  clickModalClose();

  function handleModalTabClick() {
    const $tabButtons = $(".modal-wrap .center_header .btn_wrap .tabs");

    $tabButtons.on("click", function (e) {
      e.preventDefault();
      // 모든 탭 비활성화
      $tabButtons.attr("aria-selected", false);
      // 클릭한 탭만 활성화
      $(this).attr("aria-selected", true);

      const mode = $(this).attr("data-mode");
      $(".modal-wrap").attr("data-mode", mode);
      mappedImageSrc();
    });
  }

  handleModalTabClick();

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
});
