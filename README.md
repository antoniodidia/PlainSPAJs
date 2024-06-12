# PlainSPAJs

Extremely easy Javascript framework to create simple websites in Single Page Application (SPA).

## Create a Modern Single Page Application Website in Minutes

Upload the project files to your empty web space root (IIS or Apache) and start modifying the `index.html` file, which serves as the template for the website.

Then, create the subpages and place them in the `/pages` folder.

Each subpage can also contain `<title>` and `<meta name="description" content="">` tags.

Finally, create links between the pages using this example:

```html
<a href="/contact" onclick="return plainspaNavigateTo('contact')">Contact Us</a>
```

The above example assumes that there is a `contact.html` file in the `/pages` folder.

You can also create links to a subdirectory and also pass parameters to the url this way:

```html
<li><a href="/subfolder/aboutus?value1=c&value2=d" onclick="return plainspaNavigateTo('subfolder/aboutus', '?value1=c&value2=d')">About Us</a></li>
```

The above example assumes that there is a `aboutus.html` file in the `/pages/subfolder` folder.

The content of the various pages will be dynamically loaded into the ```<div id="plainspa-content"></div>``` of the index.html file.

It is recommended to first practice in a test and isolated web space.
