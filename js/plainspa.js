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
