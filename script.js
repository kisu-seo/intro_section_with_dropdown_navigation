/* ===================================================================
   script.js – Intro Section with Dropdown Navigation
   담당 역할:
     1. 드롭다운 메뉴 토글 (열기/닫기)
     2. 모바일 사이드바 열기/닫기
     3. 외부 클릭 시 드롭다운 자동 닫기
     4. 이벤트 위임(Event Delegation) 패턴 사용으로 메모리 최적화
   =================================================================== */


/* -------------------------------------------------------------------
   상수 (Constants)
   [의도] 코드 내에 뜬금없는 숫자(매직 넘버)가 있으면 나중에 왜 이 숫자가 쓰였는지 파악하기 어렵습니다.
   상단에 상수로 분리해 두면 관리와 변경이 한결 쉬워집니다.
   ------------------------------------------------------------------- */

/** 
 * 데스크톱 전환 기준점 (px)
 * [영향도] 이 값을 변경하면 모바일 사이드바에서 데스크톱 내비게이션으로 전환되는 레이아웃 분기점이 바뀝니다.
 * 반드시 CSS의 `@media (min-width: 1024px)`와 동일한 값을 유지해야 레이아웃이 어긋나지 않습니다.
 * @constant {number}
 */
const BREAKPOINT_DESKTOP = 1024;

/** 
 * 리사이즈 멈춤 감지 대기 시간 (ms)
 * [영향도] 짧게(예: 50) 주면 애니메이션이 빨리 복원되지만, 브라우저가 아직 리사이즈 중이라고 착각해 깜빡임(Flash)이 생길 수 있습니다. 
 * 길게(예: 500) 주면 리사이즈를 끝내도 잠깐 동안 버튼 호버 같은 트랜지션이 동작하지 않고 멈춰있어 버벅이는 듯한 느낌을 줍니다.
 * @constant {number}
 */
const RESIZE_DEBOUNCE_MS = 150;


/* -------------------------------------------------------------------
   DOM 요소 가져오기
   마치 요리 전 재료를 미리 꺼내놓는 것처럼.
   ------------------------------------------------------------------- */

/** 햄버거 버튼: 모바일에서 사이드바를 여는 버튼 */
const hamburgerBtn = document.getElementById('btn-hamburger');

/** 메인 내비게이션: 사이드바 역할을 하는 <nav> 요소 */
const mainNav = document.getElementById('main-nav');

/** 오버레이: 모바일 메뉴 열렸을 때 배경 어둡게 만드는 <div> */
const overlay = document.getElementById('overlay');

/** 사이드바 내부 X 닫기 버튼 */
const navCloseBtn = document.getElementById('btn-nav-close');

/**
 * 드롭다운 버튼 목록 가져오기
 * (이벤트 위임 이후에도 closeAllDropdowns용으로 유지)
 */
const dropdownBtns = document.querySelectorAll('.nav__btn[aria-haspopup="true"]');

/** 메뉴 목록 컨테이너: 이벤트 위임의 기준점 */
const navList = document.querySelector('.nav__list');


/* -------------------------------------------------------------------
   유틸리티 함수 (Utility Functions)
   ------------------------------------------------------------------- */

/**
 * 특정 드롭다운 메뉴를 시각적으로 닫고, 접근성 상태를 업데이트하는 함수
 * @param {HTMLButtonElement} btn - 드롭다운을 토글하는 <button> 요소
 */
function closeDropdown(btn) {
  /* [동적 접근성 업데이트] 메뉴 닫힘 상태를 스크린 리더에게 즉시 알림 */
  btn.setAttribute('aria-expanded', 'false');

  const dropdownId = btn.getAttribute('aria-controls');
  const dropdown = document.getElementById(dropdownId);

  if (dropdown) {
    /* CSS 클래스 제거 → max-height가 0으로 돌아가며 닫힘 */
    dropdown.classList.remove('dropdown--open');
  }
}

/**
 * [방어적 프로그래밍] 화면 상의 열려있는 모든 드롭다운 메뉴를 순회하며 닫는 함수.
 * 클릭한 메뉴를 제외하고 나머지 메뉴를 닫을 때(Accordion 효과) 주로 사용합니다.
 * @param {HTMLButtonElement | null} [exceptBtn=null] - 닫지 않고 예외로 둘 활성화된 버튼 (선택 사항)
 */
function closeAllDropdowns(exceptBtn = null) {
  dropdownBtns.forEach((btn) => {
    if (btn === exceptBtn) return;
    closeDropdown(btn);
  });
}


/* -------------------------------------------------------------------
   기능 1: 드롭다운 토글 (이벤트 위임 패턴 적용)
   
   [의도: 이벤트 위임 (Event Delegation)]
   만약 메뉴가 100개라면 버튼 100개에 각각 리스너를 다는 것은 비효율적(메모리 낭비)입니다.
   마치 은행에서 창구마다 직원을 두지 않고, 입구에서 번호표(이름표)를 뽑게 하는 것과 같습니다.
   가장 바깥 부모인 `.nav__list`에만 귀(리스너)를 하나 열어두고, 내부 어딘가 클릭되었을 때 그 클릭된 타겟이 '드롭다운 버튼'인지 확인해서 처리합니다.
   
   [장점] 향후 JS로 메뉴 항목을 새로 추가하더라도 개별적으로 이벤트를 달아줄 필요 없이 부모가 알아서 캐치(Catch)해줍니다.
   ------------------------------------------------------------------- */
if (navList) {
  /**
   * 상단 네비게이션 안에서의 클릭 이벤트를 감지 (이벤트 위임)
   * @param {MouseEvent} event - 클릭 이벤트 객체
   */
  navList.addEventListener('click', (event) => {
    /* 클릭된 요소에서 가장 가까운 드롭다운 버튼을 찾음 */
    const btn = event.target.closest('.nav__btn[aria-haspopup="true"]');

    /* 드롭다운 버튼을 클릭한 것이 아니면 종료 */
    if (!btn) return;

    /* 클릭 이벤트가 document까지 전달되지 않도록 막음
       (외부 클릭 감지 로직과 충돌 방지를 위해 필요) */
    event.stopPropagation();

    /* 현재 버튼이 열려있는지 확인 */
    const isExpanded = btn.getAttribute('aria-expanded') === 'true';

    /* 데스크톱(BREAKPOINT_DESKTOP px 이상): 한 번에 하나의 드롭다운만 열림 */
    const isDesktop = window.matchMedia(`(min-width: ${BREAKPOINT_DESKTOP}px)`).matches;

    if (isDesktop) {
      /* 데스크톱: 현재 버튼을 제외한 나머지 드롭다운 모두 닫기 */
      closeAllDropdowns(btn);
    }
    /* 모바일/태블릿: 여러 드롭다운을 동시에 열 수 있음 (아코디언 비활성) */

    /* 현재 버튼의 드롭다운 id로 해당 드롭다운 찾기 */
    const dropdownId = btn.getAttribute('aria-controls');
    const dropdown = document.getElementById(dropdownId);

    if (!dropdown) return;

    if (isExpanded) {
      /* 이미 열려있으면 → 닫기 */
      btn.setAttribute('aria-expanded', 'false');
      dropdown.classList.remove('dropdown--open');
    } else {
      /* 닫혀있으면 → 열기 */
      btn.setAttribute('aria-expanded', 'true');
      dropdown.classList.add('dropdown--open');
    }
  });
}


/* -------------------------------------------------------------------
   기능 2: 외부 클릭 시 드롭다운 자동 닫기 (데스크톱)
   드롭다운이 열려있을 때 메뉴 밖 영역을 클릭하면 자동으로 닫힘.
   ------------------------------------------------------------------- */

document.addEventListener('click', () => {
  /* 단, 드롭다운 버튼 클릭의 경우 stopPropagation()으로 이미 막았으므로
     이 함수는 "진짜 외부 클릭"에만 실행됨 */
  closeAllDropdowns();
});

/* 드롭다운 영역 자체를 클릭해도 닫히지 않도록 처리 */
document.querySelectorAll('.dropdown').forEach((dropdown) => {
  dropdown.addEventListener('click', (event) => {
    event.stopPropagation();
  });
});


/* -------------------------------------------------------------------
   기능 3: 모바일 사이드바 열기/닫기
   ------------------------------------------------------------------- */

/**
 * 모바일 사이드바를 열고 오버레이를 표시하며 접근성 속성을 변경하는 함수
 * [경고] overflow 숨김 처리 시 다른 스크롤 관련 스크립트(예: 무한 스크롤)에 영향이 없는지 주의해야 함.
 */
function openSidebar() {
  mainNav.classList.add('nav--open');
  overlay.classList.add('overlay--visible');
  /* 배경 스크롤 방지 */
  document.body.style.overflow = 'hidden';

  hamburgerBtn.setAttribute('aria-expanded', 'true');
  hamburgerBtn.setAttribute('aria-label', '메뉴 닫기');
}

/**
 * 모바일 사이드바를 닫고 초기 상태로 되돌리는 함수
 * 열려 있던 하위 드롭다운까지 한꺼번에 정리(Reset)하는 역할도 함께 수행함.
 */
function closeSidebar() {
  mainNav.classList.remove('nav--open');
  overlay.classList.remove('overlay--visible');
  /* 배경 스크롤 복구 */
  document.body.style.overflow = '';

  hamburgerBtn.setAttribute('aria-expanded', 'false');
  hamburgerBtn.setAttribute('aria-label', '메뉴 열기');

  /* 사이드바가 닫힐 때 열려있던 드롭다운도 함께 닫기 */
  closeAllDropdowns();
}

/* 햄버거 버튼 클릭: 사이드바 열기 */
hamburgerBtn.addEventListener('click', openSidebar);

/* 오버레이 클릭: 사이드바 닫기 */
overlay.addEventListener('click', closeSidebar);

/* 사이드바 내부 X 버튼 클릭: 사이드바 닫기 */
if (navCloseBtn) {
  navCloseBtn.addEventListener('click', closeSidebar);
}


/* -------------------------------------------------------------------
   기능 4: 화면 크기가 데스크톱으로 바뀔 때 사이드바 초기화
   창 크기를 조절해 BREAKPOINT_DESKTOP px 이상이 되면 모바일 상태를 리셋.
   ------------------------------------------------------------------- */

/**
 * matchMedia: 미디어 쿼리를 자바스크립트에서 감지하는 API
 * CSS의 @media (min-width: 1024px)와 동일한 역할
 */
const desktopQuery = window.matchMedia(`(min-width: ${BREAKPOINT_DESKTOP}px)`);

/**
 * 미디어 쿼리 변화 시 실행되는 함수
 * @param {MediaQueryListEvent} event
 */
function handleMediaChange(event) {
  if (event.matches) {
    /* 데스크톱 크기가 됐을 때: 모바일 전용 상태 정리 */
    closeSidebar();
  }
}

/* 화면 크기 변화 감지 등록 */
desktopQuery.addEventListener('change', handleMediaChange);


/* -------------------------------------------------------------------
   기능 5: 리사이즈 중 애니메이션 정지 (Resize Animation Stopper)

   [문제 상황] 브라우저 창 크기를 줄일 때 모바일 사이드바가 스르륵 하고 화면에 나타나는(깜빡이는) 버그를 막습니다.
   
   [의도: 디바운스(Debounce) 패턴]
   마우스로 창 크기를 조절(Resize)하면 1초에 수십 번 이벤트가 발생합니다.
   그때마다 연산을 하거나 애니메이션을 끄고 켜면 컴퓨터가 엄청난 과부하를 겪게 됩니다. (자동차 브레이크를 1초에 100번 밟는 것과 같습니다!)
   따라서 '마지막으로 움직임이 멈춘 후' 특정 시간이 지났을 때만 단 한 번 최종 로직을 실행하도록 제어(Debounce)하는 것입니다.
   ------------------------------------------------------------------- */

/**
 * 리사이즈 멈춤을 판단하기 위한 타이머 변수
 * @type {number | undefined} setTimeout의 ID
 */
let resizeTimer;

/**
 * 브라우저 창 크기가 변할 때(resize) 발생하는 이벤트 리스너
 */
window.addEventListener('resize', () => {
  /* body에 stopper 클래스 추가 → CSS에서 모든 transition/animation 즉시 차단 */
  document.body.classList.add('resize-animation-stopper');

  /* 이전에 등록된 타이머가 있으면 취소 (리사이즈가 계속되는 동안 타이머를 초기화) */
  clearTimeout(resizeTimer);

  /* 리사이즈가 멈춘 뒤 지정된 시간이 지나면 클래스 제거 → 애니메이션 복구 */
  resizeTimer = setTimeout(() => {
    document.body.classList.remove('resize-animation-stopper');
  }, RESIZE_DEBOUNCE_MS);
});


/* -------------------------------------------------------------------
   기능 6: ESC 키로 드롭다운 & 사이드바 닫기 (키보드 접근성)
   ------------------------------------------------------------------- */

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') {
    /* 열려있는 드롭다운 모두 닫기 */
    closeAllDropdowns();
    /* 모바일 사이드바가 열려있으면 닫기 */
    if (mainNav.classList.contains('nav--open')) {
      closeSidebar();
    }
  }
});
