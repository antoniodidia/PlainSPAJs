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
					console.error(`Error reading file ${fileName}:`, xhr.statusText);
					progressBar.remove();
					reject(new Error(xhr.statusText));
				}
			}
		};

		xhr.send();
	});
}
