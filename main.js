const browser = chrome || browser
const store = browser.storage.local
browser.runtime.onMessage.addListener(msgHandler)
	
async function msgHandler(message, sender, sendResponse){
	
	const {msg, payload} = JSON.parse(message)

	if(msg === "notification") {
		createNotification(payload.text, payload.fadeOut)
		return
	}

	if(msg === "marshal") {
		const response = {}
		const {sendUrl, sendContents} = payload
		if(sendUrl) response.url = window.location.href	
		if(sendContents) {
			const body =
			'<head>' +
			document.getElementsByTagName('head')[0].innerHTML +
			'</head>' +
			'<body>' +
			document.body.innerHTML +
			'</body>'
			response.contents = body
		}
		sendResponse(JSON.stringify({
			msg: "OK",
			payload: response,
		}))
		return
	}

	sendResponse(JSON.stringify({
		msg: `No instruction by the name ${msg}`
	}))

}
