/*
Usage: 
  <s-idebar to="right">
    <p>Main content</p>
    <div>Content intended as sidebar</div>
  </s-idebar>
Attributes: 
  - gap [-5 to 10 or none] (default: 'none')
  - on [where the sidebar is: 'left' or 'right'] (default: 'left')
  - width [CSS width value] (default: '15rem')
*/

export default class Sidebar extends HTMLElement {
  constructor() {
    super();

    if (this.children.length > 2) {
      console.error('Each <s-idebar> component needs to have just two child elements; one intended as a sidebar and one as its accompanying content');
      return;
    }

    this.width = this.getAttribute('width') || '15rem';
    this.on = this.getAttribute('on') === 'right' ? 'right' : 'left';
    this.gap = this.getAttribute('gap') || '1';

    this.attachShadow({ mode: 'open' });
    this.shadowRoot.innerHTML = `
      <style>
        .inner {
          display: flex;
          flex-wrap: wrap;
          margin: calc((var(--s${this.gap}) * 0.5) * -1) !important;
          overflow: hidden;
        }

        ::slotted(*) {
          flex: 1 1 ${this.width};
          margin: calc(var(--s${this.gap}) * 0.5) !important;
        }

        ::slotted(.not-sidebar) {
          flex-grow: 9999;
          min-width: 50%;
        }
      </style>
      <div class="inner">
        <slot></slot>
      </div>
    `;

    const not = this.on === 'left' ? 1 : 0;
    this.children[not].classList.add('not-sidebar');
  }

  connectedCallback() {
    const childAmount = this.children.length;
    this.setAttribute('role', 'group');
    this.setAttribute('aria-label', `Content with a ${this.to} sidebar`);
  }
}

customElements.define('s-idebar', Sidebar);