const store = browser.storage.local

/* Basic firefox plugin options/prefs page page for us to enter server, pwd etc */

function saveOptions(e) {

	e.preventDefault()
	document.querySelector("#err").innerHTML = ""
	document.querySelector("#ok").innerHTML = ""

	const settings = {
		server: document.querySelector("#server").value,
		token: document.querySelector("#token").value,
		sendUrl: document.querySelector("#sendUrl").checked,
		sendContents: document.querySelector("#sendContents").checked
	}
	console.log("SAVING SETTINGS:", settings)
	store.set(settings)
		.then(() => {
			console.log("Settings saved")
		})
		.catch(error => console.log("Problem saving settings:", error))

}

async function loadOptions() {

	console.log("Loading settings")

	try {
		const settings = await store.get()
		const {
			server,
			token,
			sendUrl,
			sendContents,
		} = settings
		console.log("LOADING SETTINGS:", settings)
		document.querySelector("#server").value = server || ""
		document.querySelector("#token").value = token || ""
		document.querySelector("#sendUrl").checked = sendUrl == true
		document.querySelector("#sendContents").checked = sendContents == true
	} catch (error) {
		console.log(`Error: ${error}`)
		document.querySelector("#err").textContent = `Error: ${error}`
		throw error
	}
}

document.addEventListener("DOMContentLoaded", loadOptions)
document.querySelector("form").addEventListener("submit", saveOptions)
