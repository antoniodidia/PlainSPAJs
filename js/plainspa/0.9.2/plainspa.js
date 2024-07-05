// Copyright (c) Antonio Di Dia. All Rights Reserved. Licensed under the MIT License. See LICENSE in the project root for license information.

const indexFileName = "index.html";
const pagesFileExtension = ".html";

// on first load or refresh, analyze the browser URL and get pathname and querystring

var requestPage = window.location.pathname.toString();

if (requestPage.charAt(0) === '/') {
	requestPage = requestPage.substring(1);
}

if (requestPage.length == 0 || requestPage == indexFileName) {
	requestPage = "home";
}

var parameterQuery = plainspaSanitizeQueryString(window.location.search.toString());

if (parameterQuery == "?") {
	parameterQuery = "";
}

plainspaCheckDivContent();
plainspaNavigateTo(requestPage, parameterQuery, false);

// adds the page container if it is not present
function plainspaCheckDivContent() {
	if (!document.getElementById('plainspa-content')) {
		var plainspaContent = document.createElement('div');
		plainspaContent.id = 'plainspa-content';
		document.body.appendChild(plainspaContent);
	}
}

// listen to the click event of the 'A' tags
document.addEventListener('click', function (event) {
	const link = event.target.closest('a');

	if (link) {
		var hrefValue = link.getAttribute('href');

		if (hrefValue && hrefValue.trim() !== '') {
			if (link.classList.contains('plainspa') && hrefValue.indexOf('http') == -1) {
				event.preventDefault();
				if (hrefValue.charAt(0) === '/') { hrefValue = hrefValue.substring(1); }
				var [requestPageLink, parameterQueryLink] = plainspaSplitUrl(hrefValue);

				if (requestPageLink.length == 0 || requestPageLink == indexFileName) {
					requestPageLink = "home";
				}

				plainspaNavigateTo(requestPageLink, parameterQueryLink)
			}
		}
	}
});

// split the link url and get pathname and querystring
function plainspaSplitUrl(url) {
	const index = url.indexOf('?');

	if (index !== -1) {
		var path = url.substring(0, index);
		var queryString = plainspaSanitizeQueryString(url.substring(index));
		return [path, queryString];
	} else {
		var path = url;
		return [path, ''];
	}
}

// page change management when you press the "Back" or "Forward" button in the browser
window.addEventListener('popstate', function (event) {
	if (event.state && event.state.page) {
		plainspaLoadPage(event.state.page, parameterQuery);
	}
});

// go to the requested page
function plainspaNavigateTo(page, pQuery = '', scroll = true) {
	plainspaLoadPage(page, pQuery);

	// simulate the page change and update the URL
	var pageBar = page;
	if (pageBar == "home") { pageBar = ""; }
	window.history.pushState({ page: page }, null, `/` + pageBar + pQuery);

	if (scroll) { plainspaScrollToTop(); }
	return false;
}

function plainspaScrollToTop() {
	setTimeout(() => {
		window.scrollTo({
			top: 0,
			behavior: 'smooth'
		});
	}, 100);
}

// load the contents of the page
function plainspaLoadPage(page, pQuery) {
	const contentDiv = document.getElementById('plainspa-content');

	plainspaReadHtmlFile(page, pQuery)
		.then(content => { contentDiv.innerHTML = content; setTimeout(() => { plainspaRemoveProgressBar(); }, 500); })
		.catch(error => { contentDiv.innerHTML = "page loading error"; plainspaRemoveProgressBar(); });
}

function plainspaAddProgressBar() {
	progressBar = document.createElement('div');
	progressBar.id = 'plainspa-progress-bar';
	document.body.appendChild(progressBar);
}

function plainspaRemoveProgressBar() {
	var progressBar = document.getElementById('plainspa-progress-bar');
	if (progressBar) {
		progressBar.parentNode.removeChild(progressBar);
	}
}

function plainspaReadHtmlFile(fileName, pQuery) {
	return new Promise((resolve, reject) => {
		var xhr = new XMLHttpRequest();

		plainspaRemoveProgressBar();
		plainspaAddProgressBar();
		var progressBar = document.getElementById('plainspa-progress-bar');

		xhr.open('GET', '/pages/' + fileName + pagesFileExtension + pQuery, true);
		progressBar.style.width = '7%';

		xhr.onreadystatechange = function () {
			if (xhr.readyState === 0) {
				progressBar.style.width = '25%';
			} else if (xhr.readyState === 1) {
				progressBar.style.width = '50%';
			} else if (xhr.readyState === 3) {
				progressBar.style.width = '75%';
			} else if (xhr.readyState === 4) {
				if (xhr.status === 200) {
					progressBar.style.width = '100%';
					plainspaLaunchJs(xhr.responseText);
					var result = plainspaExtractHtmlElements(xhr.responseText);
					plainspaUpdateTitle(result.title);
					plainspaUpdateMetaDescription(result.metaDescription);
					plainspaUpdateLinkCanonical(result.canonical);
					resolve(result.styles + plainspaRemoveJs(result.body));
				} else {
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

	var linkCanonical = '';
	var linkTags = tempHtml.getElementsByTagName('link');
	for (var i = 0; i < linkTags.length; i++) {
		if (linkTags[i].getAttribute('rel') === 'canonical') {
			linkCanonical = linkTags[i].getAttribute('href');
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
		title: titleContent,
		canonical: linkCanonical
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

// update the canonical url
function plainspaUpdateLinkCanonical(newHref) {
	if (typeof newHref !== 'string') {
		return;
	}

	const linkCanonical = document.querySelector('link[rel="canonical"]');

	if (linkCanonical) {
		linkCanonical.setAttribute('href', newHref);
	} else {
		const newLinkCanonical = document.createElement('link');
		newLinkCanonical.rel = 'canonical';
		newLinkCanonical.href = newHref;
		document.head.appendChild(newLinkCanonical);
	}
}

function plainspaSanitizeQueryString(queryString) {
	queryString = queryString.startsWith('?') ? queryString.substring(1) : queryString;

	const params = new URLSearchParams(queryString);

	const sanitizedParams = [];

	params.forEach((value, key) => {
		sanitizedParams.push(`${encodeURIComponent(plainspaSanitize(key))}=${encodeURIComponent(plainspaSanitize(value))}`);
	});

	return '?' + sanitizedParams.join('&');
}

function plainspaSanitize(str) {
	if (str) {
		return str.replace(/[&<>"'/]/g, function (match) {
			const escapeMap = {
				'&': '',
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
