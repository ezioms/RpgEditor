<?php	defined(	'SYSPATH'	)	OR	die(	'No direct access allowed.'	);	?>

<div class="titreForm"><?php	echo	Kohana::lang(	'logger.please_login'	);	?></div>
<div class="contentForm">
		<p><?php	echo	Kohana::lang(	'logger.session_kill'	);	?></p>
		<form method="post" action="login" id="formAuth" target="_top">
				<table border="0" cellspacing="0" cellpadding="0" class="contener-form" align="center">
						<tr>
								<td><label for="username"><?php	echo	Kohana::lang(	'logger.label_identify'	);	?></label></td>
								<td><label for="password"><?php	echo	Kohana::lang(	'logger.label_password'	);	?></label></td>
								<td>&nbsp;</td>
						</tr>
						<tr>
								<td><input name="username" id="username" class="input-text" type="text" size="25" /></td>
								<td><input name="password" id="password" class="input-text" type="password" size="25" /></td>
								<td><input type="submit" value="<?php	echo	Kohana::lang(	'logger.label_connexion'	);	?>" class="buttonAuth"/></td>
						</tr>
				</table>
		</form>
</div>
<div class="footerForm">
		<input type="button" class="buttonAuth close" value="<?php	echo	Kohana::lang(	'form.close'	);	?>"/>
</div>
