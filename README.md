# keonwookang0914.github.io

- 배포 주소: https://keonwookang0914.github.io
- 스택: Jekyll 4.3 + 플러그인 2종(`jekyll-seo-tag` / `jekyll-sitemap`). 무거운 의존성이 없어 윈도우 네이티브로 바로 빌드된다.
- 글은 이 저장소가 아니라 [Velog](https://velog.io/@prid1306)에 쓴다. 사이트는 포트폴리오 역할만 한다.

## 로컬 미리보기

```bash
bundle install   # 처음 한 번만
bundle exec jekyll serve --port 8080 --host 127.0.0.1 --watch --force_polling
# → http://127.0.0.1:8080/
```

- LiveReload가 없어 저장 후 브라우저는 **직접 새로고침(F5)**.
- `_config.yml`을 고치면 서버를 **껐다 켠다**(설정은 부팅 시 한 번만 읽힌다).

## 구조

- `index.html` — 섹션 include를 순서대로 조립하기만 한다. 내용은 여기가 아니라 아래 파일을 고친다.
- `_includes/sections/` — 섹션 하나당 파일 하나(hero / timeline / skills / projects / project-modals).
- `_data/*.yml` — 페이지를 채우는 데이터. 타임라인·스킬·프로젝트·소셜을 반복문으로 찍는다.
  프로젝트를 추가하려면 `projects.yml`에 항목만 더하면 된다.
- `_layouts/default.html`, `_includes/` — 페이지 껍데기와 조각(head · nav · footer).
- `assets/css/` — `main.scss`는 `@use`로 partial을 모으기만 하고, 실제 규칙은 `_tokens` · `_hero` ·
  `_timeline` 처럼 화면 영역별 partial에 들어 있다.
- `assets/js/` — 번들러 없이 쓰는 ES 모듈. 기능 하나당 클래스 하나이며
  (`ScrollReveal` · `CardTilt` · `Modal` · `ThemeToggle` · `BackToTop`) `main.js`가 이들을 초기화한다.

## 배포

`main` 브랜치에 push하면 GitHub Actions(`.github/workflows/deploy.yml`)가 빌드해 `gh-pages`
브랜치로 게시한다. 저장소 **Settings → Pages 소스를 `gh-pages` 브랜치**로 지정해야 반영된다.
