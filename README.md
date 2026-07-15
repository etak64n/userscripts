# userscripts

Personal userscripts for Tampermonkey / Greasemonkey.

## How to install

Open the raw URL of a `*.user.js` file below — Tampermonkey will show the install dialog.
Scripts auto-update via `@updateURL`, so you only need to install once.

## Scripts

| Script | Description | Install |
| --- | --- | --- |
| [amazon-clean-link.user.js](amazon-clean-link.user.js) | Adds a button next to the Amazon product title that copies "title + clean `/dp/` URL" (tracking params stripped) | [Install](https://raw.githubusercontent.com/etak64n/userscripts/main/amazon-clean-link.user.js) |

## Development

- This repository is the source of truth. Do not edit scripts in the Tampermonkey editor.
- Bump `@version` on every change so installed clients pick up the update.
