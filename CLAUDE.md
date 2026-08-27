# MP3Editor 프로젝트 안내 (Claude용)

## 사용자에 대해
- 소유자는 **개발자가 아님**. 모든 설명은 한국어로, 전문 용어는 쉽게 풀어서 답한다.
- 기능 요청 → 구현 → 자동 테스트 → 커밋/푸시까지가 한 사이클. 푸시를 빠뜨리지 말 것.

## 프로젝트 개요
- 설치 없이 브라우저에서 실행되는 오디오 편집기. 모든 처리는 클라이언트(브라우저) 안에서만 이루어지며 파일을 서버로 보내지 않는다.
- 배포: GitHub Pages → https://kicksground.github.io/MP3Editor/ (푸시하면 1~2분 내 자동 반영)
- 작업 브랜치: `claude/macbook-audio-editor-nkzcg6` (이 저장소의 기본 브랜치이자 Pages 소스)

## 파일 구조
- `index.html` — 앱 전체 (HTML + CSS + JS가 한 파일). 외부 의존성은 lame.min.js뿐.
- `lame.min.js` — MP3 인코더 (lamejs, LGPL). index.html과 같은 폴더에 있어야 함.
- `README.md` — 사용자용 한국어 설명서. 기능을 추가하면 여기 사용법 표도 갱신할 것.
- `lamejs-LICENSE.txt` — lamejs 라이선스.

## 코드 구조 (index.html 내부)
- `WaveEditor` 클래스: 파형 하나(캔버스·선택·재생·확대/축소·미니맵·편집·undo/redo)를 담당하는 재사용 부품.
  - 인스턴스: 원본(`main`) 1개 + 동적으로 생성되는 클립들(`clipEntries`의 `editor`).
- 클립: `createClip(chs, sr, base, kind, origin)`으로 생성. 클립마다 색상(`CLIP_COLORS`), 이름 변경(✏️), 출처 표시, 드래그 순서 변경(⠿), '이어 붙이기 포함' 체크박스.
- 이어 붙이기: 체크된 클립을 화면 순서대로 연결, `#joingap` 값만큼 사이 무음 삽입.
- 저장: `saveAudio()` — Chrome은 `showSaveFilePicker`(폴더 선택), 미지원 브라우저는 다운로드 폴백. MP3는 인코딩 전에 저장 위치를 먼저 물어야 함(사용자 제스처 만료 문제).
- 녹음: `toggleRecord()` — MediaRecorder 사용. 파일 없으면 main으로, 편집 중이면 클립으로. 마이크 선택(`micId`), 녹음 중 실시간 파형 패널(`#recpanel`, AnalyserNode).
- 주의: 볼륨 적용 시 클리핑 감지·경고, 파형에 클리핑 구간 빨간색 표시 유지할 것.

## 테스트 방법 (푸시 전 필수)
- Playwright 스모크 테스트를 헤드리스 Chromium으로 실행한다. 과거 스크립트는 세션 스크래치패드에 있었으므로 새 세션에서는 다시 작성해야 할 수 있음.
- 요령:
  - `playwright-core` 설치 후 `executablePath: '/opt/pw-browsers/chromium'` 사용.
  - 테스트용 WAV는 파이썬 wave 모듈로 생성 (2초 440Hz 스테레오면 충분).
  - 저장 테스트는 `delete window.showSaveFilePicker`로 다운로드 폴백 경로를 사용.
  - 녹음 테스트는 크로뮴 플래그 `--use-fake-device-for-media-stream --use-fake-ui-for-media-stream`.
  - UI 배치 변경 시 스크린샷을 찍어 툴바가 한 줄에 들어가는지 확인 (본문 max-width 1240px 기준).

## 작업 규칙
- UI 문구는 모두 한국어. 커밋 메시지도 한국어로 작성.
- 새 기능은 README.md의 사용법 표와 index.html 하단 '사용 팁'(#hint)에도 반영.
- 외부 CDN 의존 금지 (오프라인 더블클릭 실행을 지원해야 함).
- 이 저장소는 공개(public)이므로 개인정보·비밀키를 절대 넣지 말 것.
