// # Place all the behaviors and hooks related to the matching controller here.
// # All this logic will automatically be available in application.js.
function createGame() {
	$('input[type="range"]').rangeslider('destroy');
	$('#modal').remove();
	waitSubscribe();
}


