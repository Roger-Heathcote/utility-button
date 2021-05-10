function createNotification(text, fadeOut=true) {
	console.log("Creating notify popup")
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
	if(popup) popup.classList.add("notifyPopupOneSecondFade")
	console.log("Fade set")
}

function destroyNotifyPopup() {
	console.log("Destroying notification")
	const popup = document.getElementById("notifyPopup")
	if(popup) popup.parentNode.removeChild(popup)
	console.log("Notification destroyed")
}