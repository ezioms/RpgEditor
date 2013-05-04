<?php defined( 'SYSPATH' ) OR die( 'No direct access allowed.' ); ?>
<div id="user_hp"><?php echo graphisme::BarreGraphique( $user->hp, $user->hp_max, 250, Kohana::lang( 'user.hp' ) ); ?></div>

<div id="user_argent"><?php echo Kohana::lang( 'user.money' ); ?> : <?php echo number_format( $user->argent ).' pt'.($user->argent > 1 ? 's' : ''); ?></span></div>