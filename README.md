# PlainSPAJs

Extremely easy Javascript framework to create simple websites in Single Page Application (SPA).

## Create a Modern Single Page Application Website in Minutes

Upload your project files to your empty web space (IIS or Apache) and start modifying the `index.html` file, which serves as the template for the website.

Then, create the subpages and place them in the `/pages` subfolder.

Finally, create links between the pages using this example:

```html
<a href="javascript:{};" onclick="plainspaNavigateTo('contact')">Contact Us</a>
```

The above example assumes that there is a contact.html file in the /pages subfolder.

The content of the various pages will be dynamically loaded into the <div id="plainspa-content"></div> of the index.html file.

It is recommended to first practice in a test and isolated web space.
