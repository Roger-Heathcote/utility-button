const store = browser.storage.local
let frontends = {};

async function onCreated() {
	console.log("Utility Button is active.")
}

function connected(port){
	frontends[port.sender.tab.id] = port
	port.onMessage.addListener(messageHandler)
}
browser.runtime.onConnect.addListener(connected);

function notify(tabId, type, text, fadeOut=true){
	if(tabId in frontends) {
		frontends[tabId].postMessage(JSON.stringify({
			msg: "notification",
			payload: {type, fadeOut, text}
		}))
	} else {
		console.log(`No content script we can to talk to on this tab :/`)
	}
}

browser.browserAction.onClicked.addListener(tab=>{
	const tabId = tab.id
	if(tabId in frontends) {
		frontends[tabId].postMessage(JSON.stringify({msg: "marshal"}))
	} else {
		console.log(`No content script we can to talk to on this tab :/`)
	}
})

async function messageHandler(encodedMsg, sender) {

	const {msg, payload} = JSON.parse(encodedMsg)

	if(msg==="send"){

		const settings = await store.get()
		const {server, token, sendUrl, sendContents} = settings
		const tabId = sender.sender.tab.id

		if(!settings.server) {
			err = "No server specified. Please visit about:addons and set one."
			notify(tabId, "bad", err, false)
			return console.log(err)
		}
	
		const post = (sendUrl || sendContents) == true
		const params = token ? { headers: {"Authorization": `Bearer ${token}`} } : {}

		if(post) { // Do a POST request

			if(!params.headers) params.headers = {}
			params.headers["content-type"] = "application/json"
			params.method = "POST"
		
			// If only sendUrl is selected just send that raw, not in an object
			if(sendUrl && !sendContents) params.body = payload.url
			
			// If only sendContents is selected just send that raw, not in an object
			else if(!sendUrl && sendContents) params.body = payload.contents

			// Both must be selected, send both in an object, assuming a payload value is available
			else {
				const paramObj = {}
				if(sendUrl && payload.url) paramObj.url = payload.url
				if(sendContents && payload.contents) paramObj.contents = payload.contents
				params.body = JSON.stringify(paramObj)
			}
		}

		fetch(server, params)
			.then(response => {
				if (response.status !== 200){
					throw new Error(`Error Code ${response.status}`)
				}
			})
			.then(payload => {
				notify(tabId, "good","OK")
			})
			.catch(err => {
				console.log("FETCH ERROR", err.message)
				notify(tabId, "bad", ["Not OK", err.message], false)
			})

	}
}
