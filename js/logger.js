$(function(){
				
		$('#subscribe').click(function () {
				$.facebox({
						ajax: url_script+'subscribe'
				});
		});

		$('#mdp').click(function () {
				$.facebox({
						ajax: url_script+'mdp'
				});
		});
				
		$('#username').focus(function () {
				$(this).val('');
		});
		
		$('#password_mask').focus(function () {
				$(this).remove();
				$('#password').show().focus();
		});
		
		if($('#errorAuth').length)
				$('#errorAuth').delay(3000).fadeOut(2000);
				
});
      