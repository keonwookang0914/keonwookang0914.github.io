/**
 * 모달 하나의 열림/닫힘 상태와 DOM 조작만 캡슐화한다(단일 책임).
 * ModalController는 이 인터페이스(open/close)만 알면 되고, 모달이 몇 개든
 * 어떤 내용을 담든 신경 쓰지 않는다(리스코프 치환 — 모든 Modal 인스턴스는 동일하게 다뤄진다).
 */
export class Modal {
  constructor(element) {
    this.element = element;
  }

  open() {
    this.element.classList.add('is-open');
    this.element.setAttribute('aria-hidden', 'false');
    const closeBtn = this.element.querySelector('.modal__close');
    if (closeBtn) closeBtn.focus();
  }

  close() {
    this.element.classList.remove('is-open');
    this.element.setAttribute('aria-hidden', 'true');
  }

  /** 모달 안에서 Tab으로 이동할 수 있는 요소들(포커스 가둘 범위) */
  focusables() {
    return Array.from(
      this.element.querySelectorAll('a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])')
    );
  }
}

/**
 * data-modal-open / data-modal-close 속성으로 선언된 모달들을 조율한다.
 * 단일 책임: "어떤 모달을 열고 닫을지"와 포커스 복귀·배경 스크롤 잠금 같은 공통 절차만 담당하고,
 * 모달 하나하나의 내부 동작은 Modal에 위임한다(의존관계 역전 — 구체적인 DOM 구조 대신
 * Modal의 open/close 인터페이스에만 의존한다).
 */
export class ModalController {
  constructor({ openSelector = '[data-modal-open]', closeSelector = '[data-modal-close]' } = {}) {
    this.openSelector = openSelector;
    this.closeSelector = closeSelector;
    this.modals = new Map();
    this.active = null;
    this.lastFocused = null;
  }

  start() {
    const openers = document.querySelectorAll(this.openSelector);
    if (!openers.length) return;

    openers.forEach((el) => {
      const id = el.getAttribute('data-modal-open');
      el.addEventListener('click', () => this._openById(id));
      el.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          this._openById(id);
        }
      });
    });
    document.querySelectorAll(this.closeSelector).forEach((el) => {
      el.addEventListener('click', () => this.close());
    });
    document.addEventListener('keydown', (e) => {
      if (!this.active) return;
      if (e.key === 'Escape') this.close();
      else if (e.key === 'Tab') this._trapFocus(e);
    });
  }

  /** 열린 모달 안에서만 Tab이 순환하게 한다 — 뒤쪽 페이지로 빠져나가지 않도록 */
  _trapFocus(e) {
    const items = this.active.focusables();
    if (!items.length) return;
    const first = items[0];
    const last = items[items.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  }

  close() {
    if (!this.active) return;
    this.active.close();
    document.body.classList.remove('modal-open');
    if (this.lastFocused && this.lastFocused.focus) this.lastFocused.focus();
    this.active = null;
  }

  _openById(id) {
    const modal = this._resolve(id);
    if (!modal) return;
    this.lastFocused = document.activeElement;
    modal.open();
    document.body.classList.add('modal-open');
    this.active = modal;
  }

  _resolve(id) {
    if (this.modals.has(id)) return this.modals.get(id);
    const element = document.getElementById(id);
    if (!element) return null;
    const modal = new Modal(element);
    this.modals.set(id, modal);
    return modal;
  }
}
