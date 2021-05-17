const browser = chrome || browser
const store = browser.storage.local

function notify(tabId, text, fadeOut=true){
	responseHandler = response => {
		if(browser.runtime.lastError) { console.log(
			"error displaying notification:", 
			browser.runtime.lastError?.message || "No error message :/"
		)}
	}
	messagePayload = JSON.stringify({
		msg: "notification",
		payload: {fadeOut,	text}
	})
	browser.tabs.sendMessage(tabId, messagePayload, responseHandler)
}

browser.action.onClicked.addListener(tab=>{
	store.get(["sendUrl", "sendContents"], payload=>{
		responseHandler = response => {
			if(browser.runtime.lastError) {
				notify(tab.id, browser.runtime.lastError?.message || "No error message :/")
			} else {
				messageHandler(response, tab.id)
			}
		}
		messagePayload = JSON.stringify({
			msg: "marshal",
			payload
		})
		browser.tabs.sendMessage(tab.id, messagePayload, responseHandler)
	})
})

async function messageHandler(encodedMsg, tabId) {
	
	const {msg, payload} = JSON.parse(encodedMsg)
	if(msg !== "OK") return console.log("Not a valid command:", msg)

	store.get(null, settings => {
		
		const {server, token, sendUrl, sendContents} = settings	
		if(!settings.server) {
			err = "No server specified. Please visit about:addons and set one."
			notify(tabId, err, false)
			return console.log(err)
		}
		const params = token ? { headers: {"Authorization": `Bearer ${token}`} } : {}

		const post = (sendUrl || sendContents) == true
		if(post) {
			if(!params.headers) params.headers = {}
			params.method = "POST"
			params.headers["content-type"] = "application/json"
		
			// If only sendUrl is selected just send that raw, not in an object
			if(sendUrl && !sendContents) params.body = payload.url
			
			// If only sendContents is selected just send that raw, not in an object
			else if(!sendUrl && sendContents) params.body = payload.contents
	
			// Both must be selected, send both in an object, assuming a payload value is available
			else {
				const postBody = {}
				if(sendUrl && payload.url) postBody.url = payload.url
				if(sendContents && payload.contents) postBody.contents = payload.contents
				params.body = JSON.stringify(postBody)
			}
		}
	
		fetch(server, params)
			.then(response => {
				if (response.status !== 200){
					throw new Error(`Error Code ${response.status}`)
				}
			})
			.then(payload => {
				notify(tabId, "OK <span class='green'>&check;</span>")
			})
			.catch(err => {
				console.log("FETCH ERROR", err.message)
				notify(tabId, `Not OK <span class='red'>&cross;</span><br>${err.message}`, false)
			})	
	})
}
