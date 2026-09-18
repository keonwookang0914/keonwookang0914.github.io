/**
 * 다크/라이트 테마 버튼을 관리하고 선택을 localStorage에 저장한다.
 * DOM 요소를 생성자로 주입받는다(의존관계 역전) — 버튼/아이콘/라벨이 어디 있는지는
 * 호출부(main.js)가 결정하고, 이 클래스는 "그 요소들을 어떻게 갱신할지"만 안다.
 */
export class ThemeToggle {
  constructor({ button, icon, label } = {}) {
    this.button = button;
    this.icon = icon;
    this.label = label;
  }

  start() {
    this.paint();
    window.__paintTheme = () => this.paint();   // 다른 스크립트가 테마 변경 후 재도색할 수 있게
    if (this.button) {
      this.button.addEventListener('click', () => this._toggle());
    }
  }

  paint() {
    const theme = document.documentElement.getAttribute('data-theme');
    if (this.icon) this.icon.textContent = theme === 'dark' ? '☀️' : '🌙';
    if (this.label) this.label.textContent = theme === 'dark' ? 'Dark' : 'Light';
  }

  _toggle() {
    const current = document.documentElement.getAttribute('data-theme');
    const next = current === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    try { localStorage.setItem('theme', next); } catch (e) {}
    this.paint();
  }
}
