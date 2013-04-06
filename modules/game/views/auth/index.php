<?php defined( 'SYSPATH' ) OR die( 'No direct access allowed.' ); ?>
<div class="contener-form-auth">
		<?php if( $msg ) : ?>
				<div id="errorAuth"><?php echo $msg; ?></div>
		<?php endif ?>
		<?php if( Kohana::config( 'game.loginUser' ) ) : ?>
				<form method="post" action="<?php echo url::site( 'login' ); ?>" id="formAuth">
						<div><input name="username" id="username" class="input-text-auth" type="text" value="<?php echo Kohana::lang( 'logger.label_identify' ); ?>" /></div>
						<div><input id="password_mask" class="input-text-auth" type="text" value="<?php echo Kohana::lang( 'logger.label_password' ); ?>"/>
								<input name="password" id="password" class="input-text-auth" style="display: none" type="password" /></div>
						<div><a href="javascript:;" id="mdp"><img src="<?php echo url::base(); ?>images/template/password.png" width="128" height="17" /></a><input type="submit" value="&nbsp;" class="button-auth"/></div>
				</form>
		<?php endif ?>
		<?php if( Kohana::config( 'game.registerUser' ) ) : ?>
				<a href="javascript:;" id="subscribe"><img src="<?php echo url::base(); ?>images/template/button-subcribe.png" width="243" height="36" /></a>
		<?php endif ?>
		<div class="description"><?php echo Kohana::config( 'game.description' ); ?></div>
</div>
<script>
		var username_required = "<?php echo Kohana::lang( 'form.name_required' ); ?>",
		username_minlength = "<?php echo Kohana::lang( 'form.name_minlength' ); ?>",
		username_maxlength = "<?php echo Kohana::lang( 'form.name_maxlength' ); ?>",
		password_required = "<?php echo Kohana::lang( 'form.password_required' ); ?>",
		password_minlength = "<?php echo Kohana::lang( 'form.password_minlength' ); ?>",
		email_required = "<?php echo Kohana::lang( 'form.email_required' ); ?>",
		email_equalTo = "<?php echo Kohana::lang( 'form.email_equalTo' ); ?>";
</script> 
