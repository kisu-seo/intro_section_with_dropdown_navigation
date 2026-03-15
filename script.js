/* ===================================================================
   script.js – Intro Section with Dropdown Navigation
   담당 역할:
     1. 드롭다운 메뉴 토글 (열기/닫기)
     2. 모바일 사이드바 열기/닫기
     3. 외부 클릭 시 드롭다운 자동 닫기
   =================================================================== */

/* -------------------------------------------------------------------
   DOM 요소 가져오기 (HTML에서 조작할 요소들을 변수에 담아둠)
   마치 요리 전 재료를 미리 꺼내놓는 것처럼.
   ------------------------------------------------------------------- */

/** 햄버거 버튼: 모바일에서 사이드바를 여는 버튼 */
const hamburgerBtn = document.getElementById('btn-hamburger');

/** 메인 내비게이션: 사이드바 역할을 하는 <nav> 요소 */
const mainNav = document.getElementById('main-nav');

/** 오버레이: 모바일 메뉴 열렸을 때 배경 어둡게 만드는 <div> */
const overlay = document.getElementById('overlay');

/** 사이드바 내부 X 닫기 버튼: 모바일 사이드바 안에 있는 닫기 버튼 */
const navCloseBtn = document.getElementById('btn-nav-close');

/**
 * 드롭다운 버튼 목록 가져오기
 * querySelectorAll: 조건에 맞는 요소를 "모두" 가져옴 (배열처럼 사용)
 * '[aria-haspopup="true"]' → aria-haspopup="true" 속성을 가진 버튼만 선택
 */
const dropdownBtns = document.querySelectorAll('.nav__btn[aria-haspopup="true"]');


/* -------------------------------------------------------------------
   유틸리티 함수 (Utility Functions)
   자주 쓰는 동작을 함수로 묶어서 재사용하기 편하게 만듦.
   ------------------------------------------------------------------- */

/**
 * 특정 드롭다운을 닫는 함수
 * @param {HTMLButtonElement} btn - 드롭다운을 열고 닫는 버튼
 */
function closeDropdown(btn) {
  /* 버튼의 aria-expanded를 "false"로 바꿔서 스크린 리더에게 "닫혔다"고 알림 */
  btn.setAttribute('aria-expanded', 'false');

  /* 버튼이 제어하는 드롭다운 id를 가져와서 해당 요소 찾기 */
  const dropdownId = btn.getAttribute('aria-controls');
  const dropdown = document.getElementById(dropdownId);

  if (dropdown) {
    /* CSS 클래스 제거 → max-height가 0으로 돌아가며 닫힘 */
    dropdown.classList.remove('dropdown--open');
  }
}

/**
 * 열려있는 모든 드롭다운을 닫는 함수
 * "현재 버튼 제외"처럼 예외를 둘 수도 있음.
 * @param {HTMLButtonElement|null} exceptBtn - 닫지 않을 버튼 (선택 사항)
 */
function closeAllDropdowns(exceptBtn = null) {
  /* dropdownBtns를 하나씩 순회하며 닫기 */
  dropdownBtns.forEach((btn) => {
    /* exceptBtn이 있고 현재 버튼과 같다면 건너뜀 */
    if (btn === exceptBtn) return;
    closeDropdown(btn);
  });
}


/* -------------------------------------------------------------------
   기능 1: 드롭다운 토글
   버튼 클릭 → 드롭다운 열기/닫기
   ------------------------------------------------------------------- */

/**
 * 모든 드롭다운 버튼에 클릭 이벤트 연결
 * forEach: 배열의 각 요소에 같은 동작을 반복 실행
 */
dropdownBtns.forEach((btn) => {
  btn.addEventListener('click', (event) => {
    /* 클릭 이벤트가 document까지 전달되지 않도록 막음
       (외부 클릭 감지 로직과 충돌 방지를 위해 필요) */
    event.stopPropagation();

    /* 현재 버튼이 열려있는지 확인 */
    const isExpanded = btn.getAttribute('aria-expanded') === 'true';

    /* ─────────────────────────────────────────────────────────────────
       핵심 분기 처리:
       - 데스크톱(1024px 이상): 한 번에 하나의 드롭다운만 열림
         → 새 버튼 클릭 시 나머지 드롭다운 모두 닫기
       - 모바일/태블릿(1024px 미만, 사이드바 사용 환경):
         → 여러 드롭다운을 동시에 열 수 있음 (아코디언 해제)
         → closeAllDropdowns를 호출하지 않음
       ───────────────────────────────────────────────────────────────── */
    const isDesktop = window.matchMedia('(min-width: 1024px)').matches;

    if (isDesktop) {
      /* 데스크톱: 현재 버튼 제외한 나머지 드롭다운 모두 닫기 */
      closeAllDropdowns(btn);
    }
    /* 모바일/태블릿: 이 블록을 건너뜀 → 다른 드롭다운 유지 */

    /* 현재 버튼의 드롭다운 id로 해당 드롭다운 찾기 */
    const dropdownId = btn.getAttribute('aria-controls');
    const dropdown = document.getElementById(dropdownId);

    if (!dropdown) return; /* 드롭다운 요소가 없으면 종료 */

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
});


/* -------------------------------------------------------------------
   기능 2: 외부 클릭 시 드롭다운 자동 닫기 (데스크톱)
   드롭다운이 열려있을 때 메뉴 밖 영역을 클릭하면 자동으로 닫힘.
   마치 메뉴판을 열었다가 다른 곳을 보면 자동으로 닫히는 것처럼.
   ------------------------------------------------------------------- */

document.addEventListener('click', () => {
  /* document 어딘가를 클릭했을 때, 열린 드롭다운 모두 닫기 */
  /* 단, 드롭다운 버튼 클릭의 경우 stopPropagation()으로 이미 막았으므로
     이 함수는 "진짜 외부 클릭"에만 실행됨 */
  closeAllDropdowns();
});

/* 드롭다운 영역 자체를 클릭해도 닫히지 않도록 처리 */
document.querySelectorAll('.dropdown').forEach((dropdown) => {
  dropdown.addEventListener('click', (event) => {
    /* 드롭다운 내부 클릭은 document로 전파하지 않음 */
    event.stopPropagation();
  });
});


/* -------------------------------------------------------------------
   기능 3: 모바일 사이드바 열기/닫기
   ------------------------------------------------------------------- */

/**
 * 사이드바를 여는 함수
 * 햄버거 버튼 클릭 시 실행
 */
function openSidebar() {
  /* 사이드바 슬라이드 인 */
  mainNav.classList.add('nav--open');
  /* 오버레이(배경 어둡게) 표시 */
  overlay.classList.add('overlay--visible');
  /* 배경 스크롤 방지: body가 스크롤되지 않도록 막음 */
  document.body.style.overflow = 'hidden';

  /* 접근성: 햄버거 버튼의 aria-expanded를 "true"로 업데이트 */
  hamburgerBtn.setAttribute('aria-expanded', 'true');
  /* 접근성: 햄버거 버튼 레이블을 "메뉴 닫기"로 변경 */
  hamburgerBtn.setAttribute('aria-label', '메뉴 닫기');
}

/**
 * 사이드바를 닫는 함수
 * 닫기 버튼 또는 오버레이 클릭 시 실행
 */
function closeSidebar() {
  /* 사이드바 슬라이드 아웃 */
  mainNav.classList.remove('nav--open');
  /* 오버레이 숨기기 */
  overlay.classList.remove('overlay--visible');
  /* 배경 스크롤 복구 */
  document.body.style.overflow = '';

  /* 접근성: 상태 원래대로 복구 */
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
   창 크기를 조절해 1024px 이상이 되면 모바일 상태를 깔끔하게 리셋.
   ------------------------------------------------------------------- */

/**
 * matchMedia: 미디어 쿼리를 자바스크립트에서 감지하는 API
 * CSS의 @media (min-width: 1024px)와 동일한 역할
 */
const desktopQuery = window.matchMedia('(min-width: 1024px)');

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
   기능 5: ESC 키로 드롭다운 & 사이드바 닫기 (키보드 접근성)
   ------------------------------------------------------------------- */

document.addEventListener('keydown', (event) => {
  /* ESC 키를 눌렀을 때 */
  if (event.key === 'Escape') {
    /* 열려있는 드롭다운 모두 닫기 */
    closeAllDropdowns();
    /* 모바일 사이드바가 열려있으면 닫기 */
    if (mainNav.classList.contains('nav--open')) {
      closeSidebar();
    }
  }
});
