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
          overflow: hidden;
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
      gap: {
        type: Number,
        value: 5,
      }
    };
  }

  update() {
    if (this.page == 1) {
      this._pageChanged(1);
    } else {
      this.page = 1;
    }
  }

  _pageChanged(page) {
    let rectWidth = this.getBoundingClientRect().width;
    this.$.goLeft.style.display = 'block';
    this.$.goRight.style.display = 'block';
    rectWidth -= this.$.goLeft.getBoundingClientRect().width +
      this.$.goRight.getBoundingClientRect().width;
    if (rectWidth == 0) {
      return;
    }
    let items = this.childNodes;
    let unitWidth = 0;
    let width = 0;
    this.$.container.style.overflow = 'visible';
    for (let i in items) {
      if (!items[i].getBoundingClientRect) {
        continue;
      }
      let aRect = items[i].getBoundingClientRect();
      width += aRect.width + this.gap;
    }
    this.$.container.style.overflow = 'hidden';
    this.lastPage = Math.ceil(width / rectWidth);
    let aPage = page;
    if (aPage > this.lastPage) {
      // this.page = -1 * lastPage - 1;
      return;
    }
    if (page == 1) {
      this.$.goLeft.style.display = "none";
    } else {
      this.$.goLeft.style.display = "block";
    }
    if (aPage == this.lastPage) {
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
}

window.customElements.define('boo-land-row', BooLandRow);
