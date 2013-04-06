<?php defined( 'SYSPATH' ) or die( 'No direct access allowed.' ); ?>

<form id="formMDP"  method="post" action="<?php echo url::site( 'send' ); ?>">
		<div class="contentForm">
				<p><?php echo Kohana::lang( 'logger.desc_password' ); ?></p>
				<table class="contener-content">
						<tr>
								<td><label for="emailMDP"><?php echo Kohana::lang( 'logger.mail_user' ); ?></label></td>
								<td class="right"><input name="emailMDP" type="email" class="input-text" id="emailMDP" value="" size="44"/></td>
						</tr>
						<tr>
								<td><?php echo $captcha; ?></td>
								<td class="right"><b class="rouge"><?php echo Kohana::lang( 'logger.label_captcha' ); ?></b>
										<input name="captcha_response" id="captcha_response" value="" type="text" maxlength="4" class="input-text"/></td>
						</tr>
				</table>

		</div>
		<div class="footerForm" id="footerForm">
				<input type="button" class="buttonAuth close" value="<?php echo Kohana::lang( 'form.close' ); ?>"/>
				<input name="submitMDP" id="submitMDP" value="<?php echo Kohana::lang( 'logger.button_send_mail' ); ?>" type="submit" class="buttonAuth"/>
		</div>
</form>
<script>
		$(function(){
				$('#formMDP').validate({
						rules: {
								emailMDP: {
										required: true,
										email: true
								}
						},
						messages: {
								emailMDP: email_required
						}
				});		
		});
</script>