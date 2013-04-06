<?php defined( 'SYSPATH' ) OR die( 'No direct access allowed.' ); ?>
<!DOCTYPE html>
<html lang="fr">
		<head>
				<meta http-equiv="Content-Type" content="text/html; charset=UTF-8"/>
				<meta name="viewport" content="width=device-width, user-scalable=no, minimum-scale=1.0, maximum-scale=1.0">
				<title><?php echo Kohana::config( 'game.name' ); ?></title>
				<?php echo isset( $css ) ? $css : FALSE; ?>
		</head>
		<body id="body">
				<?php echo isset( $content ) ? $content : FALSE; ?>
				<?php echo isset( $script ) ? $script : FALSE; ?>
		</body>
</html>
<!-- Rendered in {execution_time} seconds, using {memory_usage} of memory -->