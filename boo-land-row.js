import {html, PolymerElement} from '@polymer/polymer/polymer-element.js';
import '@polymer/iron-flex-layout/iron-flex-layout.js';

/**
 * `boo-land-row`
 * a row with more pager button
 *
 * @customElement
 * @polymer
 * @demo demo/index.html
 */
class BooLandRow extends PolymerElement {

  static get template() {
    return html`
      <style>
        :host {
          display: block;
          position: relative;
          height: var(--boo-lan-row-height, 64px);
          @apply --layout-horizontal;
          @apply --layout-center;
        }
        #wrapper {
          white-space: nowrap;
          transition: all .2s ease-in-out;
        }
        #fabWrapperLeft {
          top: 0px;
          left: 0px;
          background: linear-gradient(to right, var(--boo-land-row-back-color, #ffffff),rgba(255,255,255,0));
          position: absolute;
          z-index: 1;
          @apply --boo-land-row-to-left;
        }
        #fabWrapperRight {
          top: 4px;
          right: 0px;
          background: linear-gradient(to left,var(--boo-land-row-back-color, #ffffff),rgba(255,255,255,0));
          position: absolute;
          z-index: 1;
          @apply --boo-land-row-to-right;
        }
        :host([button-static]) #fabWrapperLeft,
        :host([button-static]) #fabWrapperRight {
          top: 0px;
          position: relative;
        }
      </style>
      <div id="fabWrapperLeft" on-click="_toLeft">
        <div id="goLeft"><slot name="to-left"></slot></div>
      </div>
      <div id="container">
        <div id="wrapper">
          <slot name="content"></slot>
        </div>
      </div>
      <div id="fabWrapperRight" on-click="_toRight">
        <div id="goRight"><slot name="to-right"></slot></div>
      </div>
    `;
  }

  static get properties() {
    return {
      page: {
        type: Number,
        value: 1,
        reflectToAttribute: true,
        observer: "_pageChanged"
      },
      lastPage: {
        type: Number,
        reflectToAttribute: true,
        notify: true
      },
      x0: {
        type: Number,
        value: 0
      },
    };
  }

  connectedCallback() {
    super.connectedCallback();
    this.$.wrapper.addEventListener('mousedown', this.lock.bind(this), false);
    this.$.wrapper.addEventListener('touchstart', this.lock.bind(this), false);
    this.$.wrapper.addEventListener('mouseup', this.move.bind(this), false);
    this.$.wrapper.addEventListener('touchend', this.move.bind(this), false);
  }

  update() {
    if (this.page == 1) {
      this._pageChanged(1);
    } else {
      this.page = 1;
    }
  }

  _pageChanged(page) {
    if (page < 1) {
      this.page = 1
      return;
    }
    let rectWidth = this.getBoundingClientRect().width;
    this.$.goLeft.style.display = 'block';
    this.$.goRight.style.display = 'block';
    rectWidth -= this.$.goLeft.getBoundingClientRect().width + this.$.goRight.getBoundingClientRect().width;
    if (rectWidth == 0) {
      return;
    }
    let items = this.childNodes;
    this.$.container.style.overflow = 'visible';
    let width = this.$.wrapper.getBoundingClientRect().width;
    this.$.container.style.overflow = 'hidden';
    this.lastPage = Math.ceil(width / rectWidth);
    if (page > this.lastPage) {
      this.page = this.lastPage;
      return;
    }
    if (page == 1) {
      this.$.goLeft.style.display = "none";
    } else {
      this.$.goLeft.style.display = "block";
    }
    if (page == this.lastPage) {
      this.$.goRight.style.display = "none";
    } else {
      this.$.goRight.style.display = "block";
    }
    let w = Math.max(width - rectWidth, 0);
    this.$.wrapper.style.marginLeft = -1 * Math.max(-1 * w, ((page - 1) * rectWidth)) + 'px';
  }

  _toRight() {
    this.page++;
  }
  _toLeft() {
    this.page--;
  }

  move(e) {
    let dx = this.unify(e).clientX - this.x0;
    if (Math.abs(dx) < 5) {
      return;
    }
    if (dx > 0) {
      this._toLeft();
    } else {
      this._toRight();
    }
  };

  lock(e) {
    this.x0 = this.unify(e).clientX;
  };

  unify(e) {
    return e.changedTouches ? e.changedTouches[0] : e;
  };
}

window.customElements.define('boo-land-row', BooLandRow);
