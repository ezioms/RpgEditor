<?php defined( 'SYSPATH' ) OR die( 'No direct access allowed.' ); ?>	
<section id="content_loading" ></section>		
<section id="notifications" ></section>		
		

<!-- menu info user -->
<?php if( isset( $info_user ) && $info_user ) echo $info_user; ?>

<!-- la map -->
<section id="noCursor"></section>	
<section id="content_body" ></section>
<section id="alertUser"><img src="<?php echo url::base(); ?>images/template/bg-alert.png" /></section>
<section id="cible" ></section>
<section id="content_action" ></section>

<div id="debugWebGL" ></div>
