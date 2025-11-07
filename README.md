# PlainSPAJs

**PlainSPAJs** is an extremely simple JavaScript framework to build lightweight Single Page Application (SPA) websites, with **no dependencies** and **no need to write JavaScript**.

📌 Requires URL rewriting to work properly. Host the files on a test Apache or IIS server before trying the library.

---

## Quick Start

### Option 1 » Use via CDN (recommended)
Add the following script before the closing `</body>` tag in your `index.html`:

```html
<script src="https://unpkg.com/plainspajs@1.0.0/js/plainspa/1.0.0/plainspa.js"></script>
````

That's all you need to start using PlainSPAJs.

---

### Option 2 » Install via npm

If you prefer to include it locally or in a build process:

```bash
mkdir my-project
cd my-project
npm init -y
npm install plainspajs
```

Then reference it in your project:

```html
<script src="./node_modules/plainspajs/js/plainspa/1.0.0/plainspa.js"></script>
```

Or import it in JavaScript:

```js
import 'plainspajs/js/plainspa/1.0.0/plainspa.js';
```

---

## Create Links

Use **relative links** with the `plainspa` class to enable SPA navigation:

```html
<a href="/contact" class="plainspa">Contact Us</a>
```

* `/contact` loads `/pages/contact.html`
* `/` loads `/pages/home.html`
* You can include query parameters or subfolders:

```html
<a href="/subfolder/aboutus?value1=c&value2=d" class="plainspa">About Us</a>
```

---

## Page Content & SEO

Each page is dynamically loaded into:

```html
<div id="plainspa-content"></div>
```

You can include in each subpage:

```html
<title>My Page</title>
<meta name="description" content="Page description here">
```

These will be dynamically updated for better SEO and crawler compatibility.

---

## ⚙️ Server Configuration

Make sure your hosting rewrites all routes to `index.html`. Example files are provided:

* `.htaccess` (Apache)
* `web.config` (IIS)

---

## Features

* No dependencies
* Fast and lightweight
* Simple SPA structure (HTML-only)
* SEO-friendly (dynamic meta handling)
* Works with Apache/IIS static hosting

---

## Installation Summary

| Method     | Command / URL                                          | Description                       |
| ---------- | ------------------------------------------------------ | --------------------------------- |
| **CDN**    | `<script src="https://unpkg.com/plainspajs"></script>` | Always latest version             |
| **NPM**    | `npm install plainspajs`                               | Install locally for custom builds |
| **Manual** | Copy `/js/plainspa/1.0.0/plainspa.js`                  | Direct file include               |

---

## License

MIT © [Antonio Di Dia](https://github.com/antoniodidia)

---

## Useful Links

* **NPM:** [https://www.npmjs.com/package/plainspajs](https://www.npmjs.com/package/plainspajs)
* **GitHub:** [https://github.com/antoniodidia/PlainSPAJs](https://github.com/antoniodidia/PlainSPAJs)
