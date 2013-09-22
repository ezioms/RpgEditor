var confirm_delete = "<?php echo Kohana::lang( 'js_core.valid_delete' ); ?>",
error_controler = "<?php echo Kohana::lang( 'js_core.error_control' ); ?>",
loading_traitement = "<?php echo Kohana::lang( 'js_core.loading_traitement' ); ?>",
compte_game = url_script = "<?php echo url::base( TRUE ); ?>",
dir_script = "<?php echo url::base(); ?>",
url_websocket = "<?php echo Kohana::config( 'url.websocket_user' ); ?>",
port_websocket = "<?php echo Kohana::config( 'url.websocket_port' ); ?>",
debug = <?php echo Kohana::config( 'game.debug' ) ? 'true' : 'false'; ?>,
volume_sound = <?php echo str_replace( ',', '.', (string) (Kohana::config( 'map.sound_map' ) / 100) ); ?>,
showText = "<?php echo Kohana::lang( 'form.aff' ); ?>",
hideText = "<?php echo Kohana::lang( 'form.masq' ); ?>";

window.dir_script = dir_script;
window.url_script = url_script;