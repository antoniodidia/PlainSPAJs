# PlainSPAJs

Extremely easy Javascript framework to create simple websites in Single Page Application (SPA).

## Create a Modern Single Page Application Website in Minutes

Upload the project files to your empty web space root (IIS or Apache) and start modifying the `index.html` file, which serves as the template for the website.

The PlainSPAJs library needs to be referenced only in the index.html file, before closing the body tag, like this:

```<script src="/js/plainspa/0.9.2/plainspa.js"></script>```

Then, create the subpages and place them in the `/pages` folder.

Each subpage can also contain `<title>` and `<meta name="description" content="">` tags.

## Create your links with relative URL e `plainspa` class

Finally, create __relative links__ between the pages using this example:

```html
<a href="/contact" class="plainspa">Contact Us</a>
```

The above example assumes that there is a `contact.html` file in the `/pages` folder.

__IMPORTANT__. You need to add the `plainspa` class to the internal links, if you don't want the browser to reload the page.

You can also create relative links to a subdirectory and also pass parameters to the url this way:

```html
<a href="/subfolder/aboutus?value1=c&value2=d" class="plainspa">About Us</a>
```

The above example assumes that there is a `aboutus.html` file in the `/pages/subfolder` folder.

The content of the initial "page" must always be in file `/pages/home.html`.

You can link to your home page using this example:

```html
<a href="/" class="plainspa">Home</a>
```

## Other information

The content of the various pages will be dynamically loaded into the ```<div id="plainspa-content"></div>``` of the index.html file.

For better SEO, you can specify title, description, and canonical tags directly on the sub-pages, and these will be dynamically loaded as the user browses the pages.

Remember to configure the rewrite rules to `index.html` in your hosting setting (you can use the example `web.config` and `.htaccess` files from this project).

It is recommended to first practice in a test and isolated web space.
