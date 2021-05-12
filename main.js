const store = browser.storage.local
let backend = browser.runtime.connect({name:"portyMcPortface"})
backend.onMessage.addListener(async function(message) {
	
	const {msg, payload} = JSON.parse(message)

	if(msg === "notification") {
		createNotification(payload.text, payload.fadeOut)
	}

	if(msg === "marshal") {
		const response = {}
		const settings = await store.get()
		const {sendUrl, sendContents} = settings
		if(sendUrl) response.url = window.location.href	
		if(sendContents) {
			const body =
			'<head>' +
			document.getElementsByTagName('head')[0].innerHTML +
			'</head>' +
			'<body>' +
			document.body.innerHTML +
			'</body>';
			response.contents = body
		}
		backend.postMessage(JSON.stringify({
			msg: "send",
			payload: response,
		}));
	}

});
