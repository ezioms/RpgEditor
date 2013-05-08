$(function () {
	$('body')
		.on('click', '#score', function () {
			$('#contentLogin').hide();
			$('#contentScores').show();
		})
		.on('click', '#return', function () {
			$('#contentLogin').show();
			$('#contentScores').hide();
		})
		.on('click', '#formButton', function () {
			$('form').submit();
		})
		.on('click', '#send', function () {
			$('form').attr('action', $(this).data('action')).submit();
		});
	$(window).keyup(function (e) {
		if (e.keyCode == 13) {
			if ($('#username').val() != '' && $('#password').val() != '')
				$('form').submit();
		}
	});


	if ($('#alert').length)
		$('#alert').delay(3000).fadeOut(2000);

	var audio = document.getElementById('audio');
	audio.volume = 0.4;
});