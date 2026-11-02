# Jaewon · GitHub Pages Portfolio

장재원의 기존 18개 작품과 우표형 갤러리 디자인을 이어받은 정적 포트폴리오입니다. npm 설치나 서버 데이터베이스가 필요하지 않습니다.

사이트 주소: https://jwjang9088.github.io/
저장소: https://github.com/jwjang9088/jwjang9088.github.io

## 파일 구조

```text
index.html                    공개 화면의 HTML 골격
admin.html                    작품/소개 편집 및 JSON 내보내기
assets/styles.css             공개 화면 디자인
assets/app.js                 공개 화면 동작
assets/admin.css, admin.js    관리 화면 디자인/동작
data/content.json             소개와 작품 기준 데이터
images/projects/shoot-13/     작품별 썸네일/대표/상세 이미지
images/site/                  프로필 이미지
images/figma/                 기존 우표 테두리 SVG
scripts/validate.py           데이터/이미지 경로/용량 검사
scripts/stage.py              검증 후 dist 배포 폴더 구성
.github/workflows/pages.yml   main 커밋 시 검증 및 Pages 배포
```

## 작품 관리

1. `https://jwjang9088.github.io/admin.html` 또는 로컬의 `admin.html`을 엽니다.
2. 작품을 선택해 제목, 설명, 카테고리, 썸네일, 대표 이미지, 상세 이미지, 노출 순서, 공개 여부를 수정합니다. 새 작품은 **작품 추가**로 등록합니다.
3. **초안에 반영**을 누릅니다. 위/아래 버튼으로 목록의 순서도 바꿀 수 있습니다.
4. **JSON 다운로드**를 눌러 받은 파일로 `data/content.json`을 교체합니다.
5. 새 이미지를 `images/projects/작품-id/`에 넣고, JSON과 함께 저장소에 커밋합니다.
6. Actions의 배포 완료 후 사이트를 새로 고칩니다.

관리 화면은 정적 편집 도구입니다. 로그인이나 GitHub 접근 토큰을 저장하지 않습니다. 수정은 현재 탭 메모리에만 있으며, 다운로드/커밋 없이 탭을 닫으면 사라집니다. 다른 방문자는 자신의 탭에서 JSON 초안을 편집할 수 있지만 저장소나 공개 데이터를 바꿀 수 없습니다. 브라우저 localStorage가 공개 JSON을 덮어쓰지 않습니다.

이전 포트폴리오의 브라우저 저장본은 삭제하지 않았습니다. 이전 관리 화면에서만 수정했던 내용이 있다면 그 화면에서 백업을 다운로드해 따로 보관하세요. 새 버전은 실제 저장소의 기준 데이터 18개 작품을 이관했습니다. 이전 형식의 백업은 경로/순서 변환 후 가져와야 합니다.

### 데이터 예시

기존 `projects` 배열에 아래와 같은 객체를 추가하면 HTML 수정 없이 작품이 나타납니다.

```json
{
  "id": "new-work",
  "title": "새 작품 제목",
  "description": "작품 설명",
  "category": "Design",
  "year": "2026",
  "thumbnail": "images/projects/new-work/thumbnail.webp",
  "image": "images/projects/new-work/cover.webp",
  "gallery": [
    "images/projects/new-work/detail-01.webp",
    "images/projects/new-work/detail-02.webp"
  ],
  "order": 190,
  "visible": true,
  "beforeAfter": false,
  "link": ""
}
```

- `id`: 중복 없는 영문 소문자/숫자/하이픈. 수정 중에는 유지하세요.
- `order`: 작은 숫자가 먼저. 중복 없이 10, 20, 30처럼 간격을 두면 끼워 넣기 쉽습니다.
- `category`: 새 분류를 쓰면 메뉴가 자동 생성됩니다.
- `thumbnail`: 목록용 이미지. 비우면 `image`를 사용합니다. 4:5 크롭으로 보입니다.
- `image`: 상세 첫 이미지. `gallery`에는 그 다음 이미지부터 순서대로 적습니다.
- `gallery`: 상세에서는 원래 비율로 표시하고 클릭하면 확대합니다.
- `beforeAfter`: true이면 gallery를 Before/After 쌍으로 표시합니다. 짝수 장이 필요합니다.
- `visible`: false이면 목록/상세 탐색에서 숨깁니다. 저장소에 남아 있는 파일의 접근을 차단하는 기능은 아닙니다.
- 선택 필드 `theme`, `themeInk`, `tag`와 기존 작품 메타데이터를 보존합니다.
- 모든 로컬 경로는 사이트 루트 기준 상대 경로입니다. `/images/...`처럼 앞에 `/`를 붙이지 마세요. 하위 경로의 프로젝트 Pages에서도 동작합니다.
- 외부 이미지는 HTTPS 주소를 쓸 수 있지만 제공자의 가용성에 영향을 받습니다.

소개는 같은 파일의 `profile`에서 수정합니다. 미제공 이메일은 비워 두었습니다.

## 이미지와 원본

이번 배포본은 사용자 승인에 따라 만든 WebP 사본입니다. 상세는 긴 변 최대 2560px, 목록 썸네일은 최대 1000px, quality 90으로 제작했습니다. 18개 작품의 프로젝트 이미지 159개가 약 44MiB입니다. 기존 작업 폴더의 원본은 변경하지 않았습니다. 배포본에 대용량 원본은 포함하지 않습니다.

새 이미지는 jpg/png/webp 등 브라우저 지원 파일을 그대로 넣어도 됩니다. 파일명은 영문 소문자/숫자/하이픈을 권장합니다. 이미지 파일을 추가했다면 JSON 경로의 대소문자까지 일치시켜 주세요. GitHub Pages 게시 사이트는 1GB 제한입니다.

## 로컬 확인

이 폴더에서 실행합니다.

```sh
python3 -m http.server 8765 --bind 127.0.0.1
```

http://127.0.0.1:8765/ 에서 사이트를, http://127.0.0.1:8765/admin.html 에서 관리 화면을 확인합니다. HTML을 더블 클릭하는 file:// 방식은 JSON fetch가 차단될 수 있습니다.

검증:

```sh
python3 scripts/validate.py
node --check assets/app.js
node --check assets/admin.js
```

## 최초 업로드와 자동 배포

기존 저장소의 main 브랜치에 **이 폴더의 내용**을 넣습니다. 상위 `jaewon-portfolio` 폴더를 통째로 넣지 마세요. 루트에 `index.html`, `data`, `assets`, `images`가 있어야 합니다. 기존 index.html은 새 index.html로 교체합니다. `.github/workflows/pages.yml`과 `.nojekyll`도 포함합니다.

Git을 사용한다면 해당 저장소를 복제한 폴더에 파일을 복사한 뒤 아래를 실행합니다.

```sh
python3 scripts/validate.py
git add index.html admin.html assets data images scripts .github .gitignore .nojekyll README.md
git commit -m "Separate portfolio content and add project management"
git push origin main
```

GitHub 저장소의 **Settings → Pages → Build and deployment → Source → GitHub Actions**를 선택합니다. **Actions → Publish portfolio → Run workflow**로 첫 배포를 실행할 수 있습니다. 이후 main에 커밋할 때마다 누락 이미지/JSON/용량을 검사한 뒤 배포합니다. 잘못된 데이터는 배포를 중단하므로 기존 배포가 유지됩니다. Actions에서 초록 체크와 배포 URL을 확인하세요.

### GitHub 웹 화면으로만 올리는 경우

저장소의 **Add file → Upload files**에서 index.html, admin.html, assets, data, images 등의 내용을 올리고 커밋하세요. Finder에서 숨김 폴더는 `Command + Shift + .`로 표시할 수 있습니다. `.github` 업로드가 빠졌다면 **Add file → Create new file**에서 `.github/workflows/pages.yml`을 만들고 이 패키지의 같은 파일 내용을 붙여 넣으세요. Source는 GitHub Actions로 설정합니다.

대안으로 워크플로 없이 **Deploy from a branch → main → /(root)**를 사용할 수도 있습니다. 이 방식도 커밋마다 자동 게시되지만 검증 작업은 로컬에서 직접 실행해야 합니다. 두 방식을 동시에 운영하지 마세요.

## 복원과 운영

- 수정 전 JSON을 다운로드해 보관하거나 Git 변경 이력을 사용합니다.
- 잘못된 변경은 해당 커밋을 Revert하면 이전 데이터와 이미지로 다시 배포할 수 있습니다.
- 파일명 변경과 JSON 경로 수정은 같은 커밋에 포함하세요.
- 원본 이미지는 별도 보관하고 필요한 경우 웹 사본만 갱신하세요.
- 사이트가 깨지면 Actions 로그 → JSON 문법 → 이미지 경로 → 대소문자 순서로 확인하세요.

공식 참고: [Pages 배포 설정](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site), [Pages 용량 제한](https://docs.github.com/en/pages/getting-started-with-github-pages/github-pages-limits).
