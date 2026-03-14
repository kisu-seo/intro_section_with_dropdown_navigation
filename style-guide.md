# Front-end Style Guide

## Layout

The designs were created to the following widths:

- Mobile: 375px
- Tablet: 768px
- Desktop: 1024px

> 💡 These are just the design sizes. Ensure content is responsive and meets WCAG requirements by testing the full range of screen sizes from 320px to large screens.

---

## Colors

### Neutral (무채색 계열)

| 이름       | HEX       | RGB               | HSL              |
|------------|-----------|-------------------|------------------|
| White      | `#FFFFFF` | 255, 255, 255     | 0°, 100%, 100%   |
| Black      | `#000000` | 0, 0, 0           | 0°, 0%, 0%       |
| Gray 950   | `#151515` | 21, 21, 21        | 0°, 0%, 8%       |
| Gray 500   | `#686868` | 104, 104, 104     | 0°, 0%, 41%      |
| Gray 400   | `#ADADAD` | 173, 173, 173     | 0°, 0%, 68%      |
| Gray 200   | `#D8D8D8` | 216, 216, 216     | 0°, 0%, 85%      |
| Gray 50    | `#FAFAFA` | 250, 250, 250     | 0°, 0%, 98%      |

### Accent (포인트 컬러 계열)

| 이름        | HEX       | RGB            | HSL              |
|-------------|-----------|----------------|------------------|
| Blue 400    | `#4BB1DA` | 75, 177, 218   | 197°, 66%, 57%   |
| Violet 500  | `#726CE8` | 114, 108, 238  | 243°, 79%, 68%   |
| Yellow 300  | `#EDD556` | 237, 213, 86   | 50°, 81%, 63%    |
| Purple 600  | `#8E4CB6` | 142, 76, 182   | 277°, 42%, 51%   |

---

## Typography (타이포그래피)

### Font Family (글꼴)

- **Family**: [Epilogue](https://fonts.google.com/specimen/Epilogue)
- **Weights**: 500 (Medium), 700 (Bold)

### Text Presets (텍스트 프리셋)

| 프리셋       | 굵기          | 크기   | 행간(Line Height) | 자간(Letter Spacing) |
|--------------|---------------|--------|-------------------|----------------------|
| Preset 1     | Epilogue Bold | 80px   | 100%              | -1px                 |
| Preset 2     | Epilogue Bold | 64px   | 100%              | -1px                 |
| Preset 3     | Epilogue Bold | 36px   | 100%              | -1px                 |
| Preset 4 Bold   | Epilogue Bold   | 18px   | 155%              | -0.25px              |
| Preset 4 Medium | Epilogue Medium | 18px   | 155%              | 0px                  |
| Preset 5 Bold   | Epilogue Bold   | 16px   | 155%              | -0.25px              |
| Preset 5 Medium | Epilogue Medium | 16px   | 155%              | 0px                  |
| Preset 6     | Epilogue Medium | 14px   | 115%              | 0px                  |

> 💡 **사용 가이드**: Preset 1~3은 주로 대형 헤딩(제목)에, Preset 4~5는 본문(Body) 텍스트에, Preset 6은 작은 캡션·라벨에 활용하세요.

---

## Spacing (간격 시스템)

| 이름          | 픽셀값  |
|---------------|---------|
| spacing-0     | 0px     |
| spacing-100   | 8px     |
| spacing-200   | 16px    |
| spacing-300   | 24px    |
| spacing-400   | 32px    |
| spacing-500   | 40px    |
| spacing-600   | 48px    |
| spacing-700   | 56px    |
| spacing-800   | 64px    |
| spacing-900   | 72px    |

> 💡 **사용 가이드**: 간격 시스템은 8px 단위로 구성되어 있어요. 일관된 리듬감을 위해 임의의 px 대신 위 스케일을 사용하세요.

---

## CSS Variables 적용 예시 (권장)

```css
:root {
  /* ── 컬러: 무채색 ── */
  --color-white:      #FFFFFF;
  --color-black:      #000000;
  --color-gray-950:   #151515;
  --color-gray-500:   #686868;
  --color-gray-400:   #ADADAD;
  --color-gray-200:   #D8D8D8;
  --color-gray-50:    #FAFAFA;

  /* ── 컬러: 포인트 ── */
  --color-blue-400:   #4BB1DA;
  --color-violet-500: #726CE8;
  --color-yellow-300: #EDD556;
  --color-purple-600: #8E4CB6;

  /* ── 타이포그래피 ── */
  --font-family:      'Epilogue', sans-serif;
  --font-weight-medium: 500;
  --font-weight-bold:   700;

  /* ── 간격(Spacing) ── */
  --spacing-0:   0px;
  --spacing-100: 8px;
  --spacing-200: 16px;
  --spacing-300: 24px;
  --spacing-400: 32px;
  --spacing-500: 40px;
  --spacing-600: 48px;
  --spacing-700: 56px;
  --spacing-800: 64px;
  --spacing-900: 72px;
}
```