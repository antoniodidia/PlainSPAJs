// on first load or refresh, it analyzes the browser URL

var requestPage = plainspaGetPath();

if (requestPage.length == 0 || requestPage == "index.html") {
	requestPage = "home";
}

plainspaNavigateTo(requestPage);

function plainspaGetPath() {
	// get the full URL of the page
	var urlCompleto = window.location.pathname;

	// remove the leading slash, if present
	if (urlCompleto.charAt(0) === '/') {
		urlCompleto = urlCompleto.slice(1);
	}

	// return the path after the domain name
	return urlCompleto;
}

// page change management when you press the "Back" or "Forward" button in the browser
window.addEventListener('popstate', function (event) {
	if (event.state && event.state.page) {
		plainspaLoadPage(event.state.page);
	}
});

// simulate the page change and update the URL
function plainspaNavigateTo(page) {
	// change the page (simulation)
	plainspaLoadPage(page);

	// update the URL in the browser bar
	var pageBar = page;
	if (pageBar == "home") { pageBar = ""; }
	window.history.pushState({ page: page }, null, `/` + pageBar);
}

// load the contents of the page
function plainspaLoadPage(page) {
	const contentDiv = document.getElementById('plainspa-content');
	contentDiv.innerHTML = '';

	plainspaReadHtmlFile(page)
		.then(content => { contentDiv.innerHTML = content; })
		.catch(error => { contentDiv.innerHTML = "page loading error"; });
}

function plainspaAddProgressBar() {
	var progressBar = document.createElement('div');
	progressBar.id = 'plainspa-progress-bar';
	document.body.appendChild(progressBar);
}

function plainspaReadHtmlFile(fileName) {
	return new Promise((resolve, reject) => {
		var xhr = new XMLHttpRequest();

		// add progress bar dynamically
		plainspaAddProgressBar();
		var progressBar = document.getElementById('plainspa-progress-bar');

		xhr.open('GET', '/pages/' + fileName + '.html', true);

		xhr.onreadystatechange = function () {
			if (xhr.readyState === 1) {
				// request is opened
				progressBar.style.width = '0%';
			} else if (xhr.readyState === 3) {
				// request is loading
				progressBar.style.width = '50%';
			} else if (xhr.readyState === 4) {
				if (xhr.status === 200) {
					progressBar.style.width = '100%';
					setTimeout(() => {
						progressBar.remove();
					}, 500);
					plainspaExecuteScripts(xhr.responseText); // extracts all the scripts and adds them to the document
					var result = plainspaExtractHtmlElements(xhr.responseText);
					plainspaUpdateTitle(result.title);
					plainspaUpdateMetaDescription(result.metaDescription);
					resolve(result.styles + result.body); // resolves the Promise with the HTML content
				} else {
					console.error(`Error reading file ${fileName}:`, xhr.statusText);
					progressBar.remove();
					reject(new Error(xhr.statusText)); // reject the Promise in case of error
				}
			}
		};

		xhr.send();
	});
}

function plainspaExecuteScripts(htmlContent) {
	var tempHtml = document.createElement('div');
	tempHtml.innerHTML = htmlContent;

	// extract all the scripts and add them to the document
	var scripts = tempHtml.getElementsByTagName('script');
	for (var i = 0; i < scripts.length; i++) {
		var script = document.createElement('script');
		if (scripts[i].src) {
			script.src = scripts[i].src;
		} else {
			script.text = scripts[i].text;
		}
		document.body.appendChild(script);
	}
}

function plainspaExtractHtmlElements(htmlContent) {
	// creates a temporary div to parse HTML content
	var tempHtml = document.createElement('html');
	tempHtml.innerHTML = htmlContent;

	// extract the contents of the <body> tag
	var bodyContent = '';
	var bodyTag = tempHtml.getElementsByTagName('body')[0];
	if (bodyTag) {
		bodyContent = bodyTag.innerHTML;
	}

	// extract the contents of the <style> tag
	var stylesContent = '';
	var styleTags = tempHtml.getElementsByTagName('style');
	for (var i = 0; i < styleTags.length; i++) {
		stylesContent += styleTags[i].outerHTML;
	}

	// extract the contents of the <meta name="description"> tag
	var metaDescriptionContent = '';
	var metaTags = tempHtml.getElementsByTagName('meta');
	for (var i = 0; i < metaTags.length; i++) {
		if (metaTags[i].getAttribute('name') === 'description') {
			metaDescriptionContent = metaTags[i].getAttribute('content');
			break;
		}
	}

	// extract the contents of the <title> tag
	var titleContent = '';
	var titleTag = tempHtml.getElementsByTagName('title')[0];
	if (titleTag) {
		titleContent = titleTag.innerHTML;
	}

	return {
		body: bodyContent,
		styles: stylesContent,
		metaDescription: metaDescriptionContent,
		title: titleContent
	};
}

function plainspaUpdateTitle(newTitle) {
	// checks if newTitle is a string
	if (typeof newTitle !== 'string') {
		console.error('The parameter passed is not a string.');
		return;
	}

	// modifies the content of the <title> tag with the value of the passed string
	document.title = newTitle;
}

function plainspaUpdateMetaDescription(newDescription) {
	// checks if newDescription is a string
	if (typeof newDescription !== 'string') {
		console.error('The parameter passed is not a string.');
		return;
	}

	// find the tag <meta name="description">
	const metaDescription = document.querySelector('meta[name="description"]');

	// if the <meta name="description"> tag exists, update the content property
	if (metaDescription) {
		metaDescription.setAttribute('content', newDescription);
	} else {
		// if the <meta name="description"> tag does not exist, creates a new <meta> tag and adds it to the document
		const newMeta = document.createElement('meta');
		newMeta.name = 'description';
		newMeta.content = newDescription;
		document.head.appendChild(newMeta);
	}
}