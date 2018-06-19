import {html, PolymerElement} from '@polymer/polymer/polymer-element.js';

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
          min-height: 61px;
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
        observer: "_pageChanged"
      },
      lastPage: {
        type: Number,
      },
      buttonStatic: {
        type: Boolean,
        reflectToAttribute: true
      }
    };
  }

  update() {
    this._pageChanged(this.page);
  }

  _pageChanged(page) {
    let rectWidth = this.getBoundingClientRect().width;
    rectWidth -= this.$.fabWrapperLeft.getBoundingClientRect().width;
    rectWidth -= this.$.fabWrapperRight.getBoundingClientRect().width;
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
      width += aRect.width + 5;
    }
    this.$.container.style.overflow = 'hidden';
    let lastPage = Math.ceil(width / rectWidth);
    let aPage = -1 * page + 1;
    if (aPage > lastPage) {
      this.page = -1 * lastPage - 1;
      return;
    }
    if (page == 1) {
      this.$.goLeft.style.display = "none";
    } else {
      this.$.goLeft.style.display = "block";
    }
    if (aPage == lastPage - 1) {
      this.$.goRight.style.display = "none";
    } else {
      this.$.goRight.style.display = "block";
    }
    let w = Math.max(width - rectWidth, 0);
    this.$.wrapper.style.marginLeft = Math.max(-1 * w, ((page - 1) * rectWidth)) + 'px';
  }

  _toRight() {
    this.page--;
  }
  _toLeft() {
    this.page++;
  }
}

window.customElements.define('boo-land-row', BooLandRow);
