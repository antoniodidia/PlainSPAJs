function isElementCreated(elId, callback) {
    const intervalId = setInterval(() => {
        if (document.getElementById(elId)) {
            clearInterval(intervalId);
            callback(true);
        }
    }, 200);
}

isElementCreated('parameterExample', (result) => {
	if (result) {

		var url = window.location.href;
		var value1 = new URL(url).searchParams.get('value1');
		var value2 = new URL(url).searchParams.get('value2');
		if (value1.length > 0) {
            document.getElementById("parameterExample").innerHTML = "<b>Parameters URL: value1=" + sanitize(value1) + "; " + "value2=" + sanitize(value2) + "</b>";
		}
	}
});

function sanitize(str) {
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
