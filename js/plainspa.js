// Copyright (c) Antonio Di Dia.  All Rights Reserved. Licensed under the MIT License. See LICENSE in the project root for license information.

var requestPage = plainspaGetPath();

if (requestPage.length == 0 || requestPage == "index.html") {
	requestPage = "home";
}

plainspaNavigateTo(requestPage);

function plainspaGetPath() {
	var urlCompleto = window.location.pathname;

	if (urlCompleto.charAt(0) === '/') {
		urlCompleto = urlCompleto.slice(1);
	}

	return urlCompleto;
}

window.addEventListener('popstate', function (event) {
	if (event.state && event.state.page) {
		plainspaLoadPage(event.state.page);
	}
});

function plainspaNavigateTo(page) {
	plainspaLoadPage(page);

	var pageBar = page;
	if (pageBar == "home") { pageBar = ""; }
	window.history.pushState({ page: page }, null, `/` + pageBar);
}

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

		plainspaAddProgressBar();
		var progressBar = document.getElementById('plainspa-progress-bar');

		xhr.open('GET', '/pages/' + fileName + '.html', true);

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
					plainspaExecuteScripts(xhr.responseText);
					var result = plainspaExtractHtmlElements(xhr.responseText);
					plainspaUpdateTitle(result.title);
					plainspaUpdateMetaDescription(result.metaDescription);
					resolve(result.styles + result.body);
				} else {
					progressBar.remove();
					reject(new Error(xhr.statusText));
				}
			}
		};

		xhr.send();
	});
}

function plainspaExecuteScripts(htmlContent) {
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
		document.body.appendChild(script);
	}
}

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

function plainspaUpdateTitle(newTitle) {
	if (typeof newTitle !== 'string') {
		return;
	}

	document.title = newTitle;
}

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
