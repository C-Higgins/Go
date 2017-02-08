/**
 * Created by chhiggin on 2/8/17.
 */
$(document).on('ready', function () {
    $('body').on('click', '.debug_dump', function (e) {
        $('#modal').remove();
        history.replaceState(null, null, '/');
    })
})