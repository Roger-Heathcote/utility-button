function createNotification(type, text, fadeOut=true) {
	const popup = document.createElement("div")
	popup.setAttribute("id", "notifyPopup")
	document.body.append(popup)
	
	const container = document.createElement("div")
	container.setAttribute("id", "notifyPopupContainer")
	popup.append(container)

	const message = document.createElement("div")
	message.setAttribute("id", "notifyPopupMessage")
	container.append(message)

	const msgText = document.createElement("span")
	msgText.textContent = (Array.isArray(text)) ? text.shift() : text
	message.append(msgText)
	
	const msgType = document.createElement("span")
	if(type==="good"){
		msgType.setAttribute("class", "green")
		msgType.textContent = " ✓"
	} else if (type==="bad") {
		msgType.setAttribute("class", "red")
		msgType.textContent = " ✗"
	}
	message.append(msgType)

	let el
	while(Array.isArray(text) && text.length){
		message.append(document.createElement("br"))
		el = document.createElement("span")
		el.textContent = text.shift()
		message.append(el)
	}
	
	message.append(document.createElement("br"))

	const dismissButton = document.createElement("button")
	dismissButton.textContent = "Dismiss"
	message.append(dismissButton)

	dismissButton.addEventListener("click", destroyNotifyPopup)
	if(fadeOut){
		setTimeout(doFadeOut, 2000)
		setTimeout(destroyNotifyPopup, 3000 + 100)
	}
}

function doFadeOut() {
	const popup = document.getElementById("notifyPopup")
	if(popup) popup.classList.add("notifyPopupTwoSecondFade")
}

function destroyNotifyPopup() {
	const popup = document.getElementById("notifyPopup")
	if(popup) popup.parentNode.removeChild(popup)
}