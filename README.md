# Coming Soon — Travel Agency
### Built by Syntrix PH

---

## Folder Structure

```
coming-soon/
│
├── index.html              ← Main HTML markup
│
├── css/
│   └── style.css           ← All styles (colors, layout, animations)
│
├── js/
│   └── main.js             ← Countdown timer + notify form logic
│
├── assets/
│   └── images/
│       ├── syntrix-logo.png        ← Place Syntrix PH logo here
│       ├── client-logo.png         ← Place client's logo here (see step 2)
│       ├── chocolate-hills.jpg     ← (Optional) local image for Chocolate Hills
│       ├── kawasan-falls.jpg       ← (Optional) local image for Kawasan Falls
│       ├── malapascua.jpg          ← (Optional) local image for Malapascua
│       ├── panglao.jpg             ← (Optional) local image for Panglao Beach
│       └── oslob.jpg               ← (Optional) local image for Oslob
│
└── README.md               ← This file
```

---

## Quick Setup

### 1. Add the Syntrix PH Logo
Download the logo and save it as:
```
assets/images/syntrix-logo.png
```
The HTML already falls back to the live URL if the local file is missing.

---

### 2. Add the Client Logo
Once you have the client's logo, save it to:
```
assets/images/client-logo.png
```

Then in `index.html`, find this comment block:
```html
<!-- REPLACE: swap the placeholder div below with an <img> tag once you have the logo -->
```

Replace the `<div class="logo-box">` block with:
```html
<img src="assets/images/client-logo.png" alt="Client Logo" class="client-logo-img" />
```

---

### 3. Add Local Destination Images (Optional)
The cards currently use Wikipedia/Unsplash CDN images.
If you want to use your own photos, drop them in `assets/images/` and update
the `src` attribute in each `.dest-card` inside `index.html`.
The comments in the HTML tell you exactly which file name to use.

---

### 4. Set the Launch Date
Open `js/main.js` and find the CONFIG section at the top:
```js
const LAUNCH_DATE = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
```

Change it to your actual launch date:
```js
const LAUNCH_DATE = new Date('2026-06-30T00:00:00');
```

---

### 5. Hook Up the Email Form
In `js/main.js`, find the `// TODO` comment inside `handleNotify()` and
replace it with your actual form submission (Mailchimp, ConvertKit, custom API, etc.)

---

## Customizing Colors
All brand colors live in `css/style.css` under `:root { }`.
The primary yellow variables are:
```css
--yellow:       #FFD60A;
--yellow-warm:  #FFBE00;
--yellow-deep:  #CC9900;
```

---

*Syntrix PH © 2026*
