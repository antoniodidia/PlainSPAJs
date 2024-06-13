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
            document.getElementById("parameterExample").innerHTML = "<b>Parameters URL: value1=" + value1 + "; " + "value2=" + value2 + "</b>";
		}
	}
});
