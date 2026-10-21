# Dear Postcard – AR

AR postcards and stickers by Anamika Shrivastava. One QR code on every card opens this site. After scanning, people can switch between **Normal** (animations on the card) and **3D pop-up** (the card rises up like a window) with the buttons at the top.

## Setup (repository: `dear-postcard-2d`)

1. Delete the old files in the repository, then upload everything in this folder: **Add file → Upload files → Commit changes**.
2. On a laptop, open `https://anamikashr04.github.io/dear-postcard-2d/make-targets.html`, wait until all 20 images show ✓, and click **Build targets.mind**.
3. Upload the downloaded `targets.mind` to the main folder of the repository.
4. On your phone, open `https://anamikashr04.github.io/dear-postcard-2d/` (or scan the QR on a card back), tap **Start camera**, and point it at a card.

The `dear-postcard-3d` repository is no longer needed.

## Files

| File | What it does |
|---|---|
| `index.html` | The AR page the QR code opens, with the Normal / 3D switch |
| `ar.js` | Every card's animation, in both modes |
| `sound.js` | Thunder, rain, flute and crickets, made live in the browser (speaker button turns it on/off) |
| `preview.html` | Plays each animation over its card image in a browser |
| `make-targets.html` | Builds `targets.mind`, which lets phones recognise the cards |
| `targets/` | One image per printed card or sticker |
| `assets/` | Extra layers (cat hands, CSMT background patch) |

If a design changes, replace its image in `targets/` and rebuild `targets.mind`.
