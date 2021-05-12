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
	store.set(settings)
		.then(() => {
			console.log("Settings saved")
			document.querySelector("#ok").textContent = `Settings saved.`

		})
		.catch(error =>{
			document.querySelector("#err").textContent = `storage.local.set failed: ${error}`
			console.log("Problem saving settings:", error)
		})

}

async function loadOptions() {

	try {
		const settings = await store.get()
		const {
			server,
			token,
			sendUrl,
			sendContents,
		} = settings
		document.querySelector("#server").value = server || ""
		document.querySelector("#token").value = token || ""
		document.querySelector("#sendUrl").checked = sendUrl == true
		document.querySelector("#sendContents").checked = sendContents == true
	} catch (error) {
		console.log(`Store get failed: ${error}`)
		document.querySelector("#err").textContent = `storage.local.get failed: ${error}`
	}
}

document.addEventListener("DOMContentLoaded", loadOptions)
document.querySelector("form").addEventListener("submit", saveOptions)
