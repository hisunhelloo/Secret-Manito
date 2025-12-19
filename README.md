# 🎁 Secret Manito (비밀 마니또)

친구, 동료들과 함께 즐길 수 있는 **비밀 마니또(Secret Santa)** 웹 서비스입니다.  
별도의 서버 구축 없이 **Firebase**를 활용하여 데이터 저장과 실시간 연동을 지원합니다.

---

## 📂 프로젝트 구조

깔끔하게 분리된 React + TypeScript 프로젝트 구조입니다.

```bash
Secret-Manito/
├── docs/                 # 📄 프로젝트 가이드 문서
│   ├── 설계및사용가이드.md
│   ├── 로컬가이드.md
│   └── 배포가이드.md
├── src/
│   ├── components/       # 🧩 UI 컴포넌트
│   │   ├── Landing.tsx   # 메인/로그인 화면
│   │   ├── RoomAdmin.tsx # 방장 관리 화면 (생성/배정)
│   │   └── ResultView.tsx# 결과 확인 화면
│   ├── config/           # ⚙️ 설정 파일
│   │   └── firebase.ts   # Firebase 인증/DB 설정
│   ├── types/            # 📝 타입 정의 (Member, Room)
│   ├── App.tsx           # 🚦 메인 라우팅 로직
│   └── index.css         # 🎨 스타일 (Tailwind CSS)
├── public/               # 정적 파일
└── package.json          # 의존성 관리
```

---
### 🖥️ 메인 페이지
<img src="https://github.com/user-attachments/assets/b378def1-f1b2-4a79-91c1-7550c55d9b71" width="100%" alt="Main Page">

<br>

### 🔍 상세 페이지 (기능별 화면)
| 상세 01 | 상세 02 | 상세 03 |
| :---: | :---: | :---: |
| <img src="https://github.com/user-attachments/assets/60b9d214-c805-405a-b1f9-1be63324c678" width="320"> | <img src="https://github.com/user-attachments/assets/e478791b-e893-42b6-9026-4a96d018750c" width="320"> | <img src="https://github.com/user-attachments/assets/7f2fa664-2682-40b8-9844-993b840a5055" width="320"> |

<br>

### 💟 마니또 전달
<img src="https://github.com/user-attachments/assets/3d951d67-34f4-4cc8-8328-9656630cbbdc" width="100%" alt="Manitto Delivery">

---

## 🚀 시작하기

### 1. 설정 (Configuration)
`src/config/firebase.ts` 파일에 본인의 Firebase 프로젝트 설정값을 입력해야 합니다.  
(이미 입력되어 있다면 건너뛰셔도 됩니다.)

### 2. 실행 (Run)
터미널에서 아래 명령어로 로컬 개발 서버를 실행합니다.

```bash
npm run dev
```

실행 후 **http://localhost:5174** (또는 터미널에 뜬 주소)로 접속하세요.

### 3. 배포 (Deploy)
친구들과 실제로 사용하려면 Firebase Hosting으로 배포할 수 있습니다.
자세한 내용은 `docs/배포가이드.md`를 참고하세요.

```bash
npx firebase login
npm run deploy
```

---

## 🛠 기술 스택
- **Frontend**: React, TypeScript, Vite
- **Styling**: Tailwind CSS, Lucide React (Icons)
- **Backend**: Firebase (Authentication, Firestore)

---

## 🧐 상세 파일 가이드 (File Structure Details)

프로젝트 루트에 위치한 설정 파일들의 역할에 대한 설명입니다.

| 파일명 | 설명 |
|---|---|
| **`package.json`** | 프로젝트의 **신분증**이자 **영수증**입니다. 프로젝트 이름, 버전 정보와 함께 어떤 라이브러리(React, Firebase 등)를 설치했는지 기록되어 있습니다. |
| **`vite.config.ts`** | **배송 기사님(build tool) 설정**입니다. Vite라는 도구가 이 프로젝트를 어떻게 실행하고 빌드(포장)할지 결정합니다. |
| **`tsconfig.json`** | **TypeScript 번역 규칙**입니다. 브라우저는 TypeScript를 모르기 때문에, 이를 자바스크립트로 번역할 때 엄격하게 할지, 느슨하게 할지 정해줍니다. |
| **`tailwind.config.js`** | **스타일(CSS) 팔레트**입니다. Tailwind CSS에서 사용할 색상, 폰트 등을 커스텀할 때 사용합니다. |
| **`postcss.config.js`** | **CSS 후처리기**입니다. 만들어진 CSS 코드가 구형 브라우저에서도 잘 작동하도록(접두사 붙이기 등) 도와줍니다. |
| **`eslint.config.js`** | **코드 문법 검사기**입니다. "여기 세미콜론 빠졌어요!", "이 변수는 안 쓰는데요?" 하고 잔소리해주는 친구 설정입니다. |
| **`index.html`** | 웹사이트의 **대문**입니다. 브라우저가 가장 먼저 읽는 파일이며, 여기서 React 앱(`src/main.tsx`)을 불러와 실행합니다. |
