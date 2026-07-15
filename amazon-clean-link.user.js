// ==UserScript==
// @name         Amazon Clean Link Copy Button
// @namespace    https://github.com/etak64n/userscripts
// @version      1.1.1
// @description  Add a circular copy button (left of the share icon) that copies "title + clean /dp/ URL"
// @author       etak64n
// @match        https://www.amazon.co.jp/*
// @match        https://www.amazon.com/*
// @grant        none
// @run-at       document-idle
// @updateURL    https://raw.githubusercontent.com/etak64n/userscripts/main/amazon-clean-link.user.js
// @downloadURL  https://raw.githubusercontent.com/etak64n/userscripts/main/amazon-clean-link.user.js
// ==/UserScript==

(() => {
  'use strict';

  const BTN_ID = 'clean-link-copy-btn';

  const COPY_SVG =
    '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#0F1111" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>';
  const CHECK_SVG =
    '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#067D62" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6L9 17l-5-5"/></svg>';

  const getAsin = () =>
    location.href.match(/\/(?:dp|gp\/product|gp\/aw\/d)\/([A-Z0-9]{10})/i)?.[1] ||
    document.querySelector('link[rel="canonical"]')?.href.match(/\/dp\/([A-Z0-9]{10})/i)?.[1] ||
    null;

  const injectStyle = () => {
    if (document.getElementById(`${BTN_ID}-style`)) return;
    const style = document.createElement('style');
    style.id = `${BTN_ID}-style`;
    style.textContent = `
      #${BTN_ID} {
        width: 34px; height: 34px; padding: 0;
        display: flex; align-items: center; justify-content: center;
        cursor: pointer; border: 1px solid #D5D9D9; border-radius: 50%;
        background: #fff;
      }
      #${BTN_ID}:hover { background: #F7FAFA; }
      #${BTN_ID}.floated { float: right; margin-right: 10px; }
      #${BTN_ID}.inline { display: inline-flex; margin-left: 12px; vertical-align: middle; }
    `;
    document.head.appendChild(style);
  };

  const addButton = () => {
    const titleEl = document.getElementById('productTitle');
    const asin = getAsin();
    if (!titleEl || !asin || document.getElementById(BTN_ID)) return;

    injectStyle();

    const btn = document.createElement('button');
    btn.id = BTN_ID;
    btn.title = 'タイトルとリンクをコピー';
    btn.innerHTML = COPY_SVG;

    btn.addEventListener('click', async (e) => {
      e.preventDefault();
      e.stopPropagation();
      const text = `${titleEl.textContent.trim()}\n${location.origin}/dp/${asin}`;
      try {
        await navigator.clipboard.writeText(text);
        btn.innerHTML = CHECK_SVG;
      } catch {
        prompt('手動でコピーしてください', text);
        return;
      }
      setTimeout(() => (btn.innerHTML = COPY_SVG), 1500);
    });

    // Preferred spot: left of the share icon (both are float:right, so
    // the later float ends up on the left). Insert AFTER the widget span, not
    // inside it — the span is a-declarative and clicks inside it open the
    // share popup. Fall back to inline after the title.
    const shareWidget = document.getElementById('ssf-primary-widget-desktop');
    if (shareWidget) {
      btn.classList.add('floated');
      shareWidget.insertAdjacentElement('afterend', btn);
    } else {
      const h1 = document.getElementById('title');
      if (!h1) return;
      btn.classList.add('inline');
      h1.appendChild(btn);
    }
  };

  addButton();
  // Amazon partially re-renders the page; watch for the title appearing later
  new MutationObserver(addButton).observe(document.body, { childList: true, subtree: true });
})();
