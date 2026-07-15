// ==UserScript==
// @name         Amazon Clean Link Copy Button
// @namespace    https://github.com/etak64n/userscripts
// @version      1.0.0
// @description  Add a button next to the product title that copies "title + clean /dp/ URL"
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

  const getAsin = () =>
    location.href.match(/\/(?:dp|gp\/product|gp\/aw\/d)\/([A-Z0-9]{10})/i)?.[1] ||
    document.querySelector('link[rel="canonical"]')?.href.match(/\/dp\/([A-Z0-9]{10})/i)?.[1] ||
    null;

  const addButton = () => {
    const h1 = document.getElementById('title');
    const titleEl = document.getElementById('productTitle');
    const asin = getAsin();
    if (!h1 || !titleEl || !asin || document.getElementById('clean-link-copy-btn')) return;

    const btn = document.createElement('button');
    btn.id = 'clean-link-copy-btn';
    btn.textContent = '📋 リンクをコピー';
    btn.style.cssText = [
      'margin-left: 12px',
      'padding: 4px 10px',
      'font-size: 13px',
      'vertical-align: middle',
      'cursor: pointer',
      'border: 1px solid #888c8c',
      'border-radius: 8px',
      'background: #fff',
      'white-space: nowrap',
    ].join(';');

    btn.addEventListener('click', async (e) => {
      e.preventDefault();
      const text = `${titleEl.textContent.trim()}\n${location.origin}/dp/${asin}`;
      try {
        await navigator.clipboard.writeText(text);
        btn.textContent = '✅ コピーしました';
      } catch {
        prompt('手動でコピーしてください', text);
        btn.textContent = '📋 リンクをコピー';
        return;
      }
      setTimeout(() => (btn.textContent = '📋 リンクをコピー'), 1500);
    });

    h1.appendChild(btn);
  };

  addButton();
  // Amazon partially re-renders the page; watch for the title appearing later
  new MutationObserver(addButton).observe(document.body, { childList: true, subtree: true });
})();
