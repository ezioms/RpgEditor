<?php defined( 'SYSPATH' ) or die( 'No direct access allowed.' ); ?>

<form id="formInscript" method="post" action="<?php echo url::site( 'register' ); ?>" >
		<div class="contentForm">
				<p><?php echo Kohana::lang( 'logger.desc_subscribe' ); ?></p>
				<table class="contener-content">
						<tr>
								<td><label for="usernameInscript"><?php echo Kohana::lang( 'logger.name_character' ); ?></label></td>
								<td class="right"><input name="usernameInscript" type="text" class="input-text" id="usernameInscript" value="<?php echo cookie::get( 'usernameInscript' ); ?>" size="44"/></td>
						</tr>
						<tr>
								<td><label for="passwordInscript"><?php echo Kohana::lang( 'logger.label_password' ); ?></label></td>
								<td class="right"><input name="passwordInscript" id="passwordInscript" value="" type="password" class="input-text" size="44"/></td>
						</tr>
						<tr>
								<td><label for="password2Inscript"><?php echo Kohana::lang( 'logger.rewrite_password' ); ?></label></td>
								<td class="right"><input name="password2Inscript" id="password2Inscript" value="" type="password" class="input-text" size="44"/></td>
						</tr>
						<tr>
								<td><label for="emailInscript"><?php echo Kohana::lang( 'logger.email' ); ?></label></td>
								<td class="right"><input name="emailInscript" id="emailInscript" value="<?php echo cookie::get( 'emailInscript' ); ?>" type="email" class="input-text" size="44"/></td>
						</tr>
						<tr>
								<td><?php echo $captcha; ?></td>
								<td class="right"><b class="rouge"><?php echo Kohana::lang( 'logger.label_captcha' ); ?></b>
										<input name="captcha_response" id="captcha_response" value="" maxlength="4" type="text" class="input-text"/></td>
						</tr>
				</table>
		</div>
		<div class="footerForm" id="footerForm">
				<input type="button" class="buttonAuth close" value="<?php echo Kohana::lang( 'form.close' ); ?>"/>
				<?php if( Kohana::config( 'game.registerUser' ) ) : ?>
						<input name="submitInscript" id="submitInscript" value="<?php echo Kohana::lang( 'logger.subscribe' ); ?>" type="submit" class="buttonAuth"/>
				<?php else : ?>
						<input type="button" class="buttonAuth close" value="<?php echo Kohana::lang( 'form.maintenance' ); ?>"/>
				<?php endif ?>
		</div>
</form>
<script>
		$('#formInscript').validate({
				rules: {
						usernameInscript: {
								required: true,
								minlength: 2,
								maxlength: 255
						},
						passwordInscript: {
								required: true,
								minlength: 5
						},
						password2Inscript: {
								required: true,
								minlength: 5,
								equalTo: '#passwordInscript'
						},
						emailInscript: {
								required: true,
								email: true
						}
				},
				messages: {
						usernameInscript: {
								required: username_required,
								minlength: username_minlength,
								maxlength: username_maxlength
						},
						passwordInscript: {
								required: password_required,
								minlength: password_minlength
						},
						password2Inscript: {
								required: password_required,
								minlength: password_minlength,
								equalTo: email_equalTo
						},
						emailInscript: email_required
				}
		});
</script>