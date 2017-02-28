/**
 * Created by chhiggin on 2/8/17.
 */
$(document).on('ready', function () {
	$('body').on('click', '#modal-close', function (e) {
		$('#modal').remove();
		//$('.game-creation-button').removeClass('selected');
		history.replaceState(null, null, '/');
	})
})