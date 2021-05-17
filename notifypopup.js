console.log("notifypopup.js")

function createNotification(text, fadeOut=true) {
	const popup = document.createElement("div")
	popup.setAttribute("id", "notifyPopup")
	document.body.append(popup)
	popup.innerHTML = `
	<div id="notifyPopupContainer">
		<div id="notifyPopupMessage">
			${text}
		</div>
		<button type="button" id="notifyPopupDismissButton">Dismiss</button>
	</div>
	`
	const dismissButton = document.getElementById("notifyPopupDismissButton")
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