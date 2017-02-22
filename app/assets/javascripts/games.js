// # Place all the behaviors and hooks related to the matching controller here.
// # All this logic will automatically be available in application.js.
function createGame(user) {
	setTimeout(function () { // Necessary to allow the form to exist until it posts
		$('#modal').remove();
		if (!App.cable.subscriptions.subscriptions.find((s) => {
				return JSON.parse(s.identifier).channel == 'WaitingChannel'
			})) {
			waitSubscribe(user);
		}
	}, 0)

}


