const store = browser.storage.local || chrome.storage.local
let frontend;

async function onCreated() {
	console.log("Utility Button is active.")
}

function connected(port){
	frontend = port
	frontend.onMessage.addListener(messageHandler)
}
browser.runtime.onConnect.addListener(connected);

function notify(tabId, text, fadeOut=true){
	console.log("Notifying:", tabId)
	if(frontend) {
		frontend.postMessage(JSON.stringify({
			msg: "notification",
			payload: {fadeOut,	text}
		}))
	} else {
		console.log("frontend ain't defined", frontend)
	}
}

browser.browserAction.onClicked.addListener(event=>{
	console.log("WELL BROWSER ACTION CLICK WAS RECV IN BACKGROUND")
	const tabId = event.index
	console.log("Marshalling:", tabId)
	if(frontend) {
		frontend.postMessage(JSON.stringify({msg: "marshal"}))
	} else {
		console.log("frontend ain't defined", frontend)
	}
})


async function messageHandler(encodedMsg, sender) {

	// console.log("In backend message handler")

	const {msg, payload} = JSON.parse(encodedMsg)

	if(msg==="send"){

		const settings = await store.get()
		const {server, token, sendUrl, sendContents} = settings
		const tabId = sender.sender.tab.id

		if(!settings.server) {
			msg = "No server specified. Please visit about:addons and set one."
			notify(tabId, msg, false)
			return console.log("msg")
		}
	
		const post = (sendUrl || sendContents) == true
		const params = token ? {"Authorization": `Bearer ${token}`} : {}

		if(!post) { // Do a POST request

			params.headers = { "content-type": "application/json" }
			params.method = "POST"
		
			// If only sendUrl is selected just send that raw, not in an object
			if(sendUrl && !sendContents){
				params.body = payload.url
			}
			
			// If only sendContents is selected just send that raw, not in an object
			else if(!sendUrl && sendContents){
				params.body = payload.contents
			}

			// Both must be selected, send both in an object, assuming a payload value is available
			else {
				if(sendUrl && payload.url) paramObj.url = payload.url
				if(sendContents && payload.contents) paramObj.contents = payload.contents
				params.body = JSON.stringify(paramObj)
			}
		}

		fetch(server, params)
			.then(result => {
				console.log("GOT REPLY")
				notify(tabId, "OK <span class='green'>&check;</span>")
			})
			.catch(err => {
				console.log("FETCH ERROR", err.message)
				notify(tabId, `Not OK <span class='red'>&cross;</span>`, false)
			})

		console.log("Fetch request started")

	}
}
