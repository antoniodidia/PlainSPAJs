// Copyright (c) Antonio Di Dia. All Rights Reserved. Licensed under the MIT License. See LICENSE in the project root for license information.

var indexFileName = "index.html";
var pagesFileExtension = ".html";

// on first load or refresh, it analyzes the browser URL

var requestPage = plainspaGetPath();
var parameterQuery = plainspaGetUrlParameters(window.location);

if (requestPage.length == 0 || requestPage == indexFileName) {
	requestPage = "home";
}

if (parameterQuery == "?") {
	parameterQuery = "";
}

plainspaNavigateTo(requestPage, parameterQuery);

// return the path after the domain name
function plainspaGetPath() {
	var urlCompleto = window.location.pathname;

	if (urlCompleto.charAt(0) === '/') {
		urlCompleto = urlCompleto.slice(1);
	}

	return urlCompleto;
}

// get url parameters in a string
function plainspaGetUrlParameters(url) {
	const params = new URLSearchParams(url.search);
	const paramArray = Array.from(params.entries());
	const paramString = paramArray.map(([key, value]) => `${plainspaSanitize(key)}=${plainspaSanitize(value)}`).join('&');
	return `?${paramString}`;
}

// page change management when you press the "Back" or "Forward" button in the browser
window.addEventListener('popstate', function (event) {
	if (event.state && event.state.page) {
		plainspaLoadPage(event.state.page, parameterQuery);
	}
});

function plainspaNavigateTo(page, pQuery = '') {
	plainspaScrollToTop();
	plainspaLoadPage(page, pQuery);

	// simulate the page change and update the URL
	var pageBar = page;
	if (pageBar == "home") { pageBar = ""; }
	window.history.pushState({ page: page }, null, `/` + pageBar + pQuery);

	return false;
}

function plainspaScrollToTop() {
	window.scrollTo({
		top: 0,
		behavior: 'smooth'
	});
}

// load the contents of the page
function plainspaLoadPage(page, pQuery) {
	const contentDiv = document.getElementById('plainspa-content');

	plainspaReadHtmlFile(page, pQuery)
		.then(content => { contentDiv.innerHTML = content; })
		.catch(error => { contentDiv.innerHTML = "page loading error"; });
}

function plainspaAddProgressBar() {
	var progressBar = document.getElementById('plainspa-progress-bar');
	if (progressBar) {
		progressBar.parentNode.removeChild(progressBar);
	}

	progressBar = document.createElement('div');
	progressBar.id = 'plainspa-progress-bar';
	document.body.appendChild(progressBar);
}

function plainspaReadHtmlFile(fileName, pQuery) {
	return new Promise((resolve, reject) => {
		var xhr = new XMLHttpRequest();

		plainspaAddProgressBar();
		var progressBar = document.getElementById('plainspa-progress-bar');

		xhr.open('GET', '/pages/' + fileName + pagesFileExtension + pQuery, true);

		xhr.onreadystatechange = function () {
			if (xhr.readyState === 1) {
				progressBar.style.width = '0%';
			} else if (xhr.readyState === 3) {
				progressBar.style.width = '50%';
			} else if (xhr.readyState === 4) {
				if (xhr.status === 200) {
					progressBar.style.width = '100%';
					setTimeout(() => {
						progressBar.remove();
					}, 500);
					plainspaLaunchJs(xhr.responseText);
					var result = plainspaExtractHtmlElements(xhr.responseText);
					plainspaUpdateTitle(result.title);
					plainspaUpdateMetaDescription(result.metaDescription);
					resolve(result.styles + plainspaRemoveJs(result.body));
				} else {
					progressBar.remove();
					reject(new Error(xhr.statusText));
				}
			}
		};

		xhr.send();
	});
}

// extract all the js and add them to the document
function plainspaLaunchJs(htmlContent) {

	var elDivJsContainer = document.getElementById('plainspa-jscontainer');
	if (elDivJsContainer) {
		elDivJsContainer.parentNode.removeChild(elDivJsContainer);
	}

	var tempHtml = document.createElement('div');
	tempHtml.innerHTML = htmlContent;

	var scripts = tempHtml.getElementsByTagName('script');
	for (var i = 0; i < scripts.length; i++) {
		var script = document.createElement('script');
		if (scripts[i].src) {
			script.src = scripts[i].src;
		} else {
			script.text = scripts[i].text;
		}

		elDivJsContainer = document.createElement('div');

		elDivJsContainer.id = 'plainspa-jscontainer';
		elDivJsContainer.appendChild(script);
		document.body.appendChild(elDivJsContainer);

	}
}

// extract some html element
function plainspaExtractHtmlElements(htmlContent) {
	var tempHtml = document.createElement('html');
	tempHtml.innerHTML = htmlContent;

	var bodyContent = '';
	var bodyTag = tempHtml.getElementsByTagName('body')[0];
	if (bodyTag) {
		bodyContent = bodyTag.innerHTML;
	}

	var stylesContent = '';
	var styleTags = tempHtml.getElementsByTagName('style');
	for (var i = 0; i < styleTags.length; i++) {
		stylesContent += styleTags[i].outerHTML;
	}

	var metaDescriptionContent = '';
	var metaTags = tempHtml.getElementsByTagName('meta');
	for (var i = 0; i < metaTags.length; i++) {
		if (metaTags[i].getAttribute('name') === 'description') {
			metaDescriptionContent = metaTags[i].getAttribute('content');
			break;
		}
	}

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

// remove js that are no longer needed
function plainspaRemoveJs(html) {
	var tempDiv = document.createElement('div');
	tempDiv.innerHTML = html;

	var scripts = tempDiv.getElementsByTagName('script');

	while (scripts.length > 0) {
		scripts[0].parentNode.removeChild(scripts[0]);
	}

	return tempDiv.innerHTML;
}

// update the page Title
function plainspaUpdateTitle(newTitle) {
	if (typeof newTitle !== 'string') {
		return;
	}

	document.title = newTitle;
}

// update the description page meta tag
function plainspaUpdateMetaDescription(newDescription) {
	if (typeof newDescription !== 'string') {
		return;
	}

	const metaDescription = document.querySelector('meta[name="description"]');

	if (metaDescription) {
		metaDescription.setAttribute('content', newDescription);
	} else {
		const newMeta = document.createElement('meta');
		newMeta.name = 'description';
		newMeta.content = newDescription;
		document.head.appendChild(newMeta);
	}
}

function plainspaSanitize(str) {
	if (str) {
		return str.replace(/[&<>"'/]/g, function (match) {
			const escapeMap = {
				'&': '&amp;',
				'<': '&lt;',
				'>': '&gt;',
				'"': '&quot;',
				"'": '&#x27;',
				'/': '&#x2F;'
			};
			return escapeMap[match];
		});
	}
	return str;
}
