<?php defined( 'SYSPATH' ) OR die( 'No direct access allowed.' ); ?>

<div class="panel">
		<div class="content_stat_user">
				<div class="row_stat_user">
						<div class="title_stat_user"><?php echo Kohana::lang( 'user.nb_item' ); ?> :</div> 
						<div class="badge_stat_user"><?php echo badge::img( 'nb_using_item', $stats->nb_using_item ); ?></div>
						<div class="score_stat_user"><?php echo $stats->nb_using_item; ?></div>
						<div class="spacer"></div>
				</div>
				<div class="row_stat_user">
						<div class="title_stat_user"><?php echo Kohana::lang( 'user.nb_shop' ); ?> : </div> 
						<div class="badge_stat_user"><?php echo badge::img( 'nb_shop', $stats->nb_shop ); ?></div>
						<div class="score_stat_user"><?php echo $stats->nb_shop; ?></div>
						<div class="spacer"></div>
				</div>
				<div class="row_stat_user">
						<div class="title_stat_user"><?php echo Kohana::lang( 'user.nb_quete' ); ?> : </div> 
						<div class="badge_stat_user"><?php echo badge::img( 'nb_quete_valide', $stats->nb_quete_valide ); ?></div>
						<div class="score_stat_user"><?php echo $stats->nb_quete_valide; ?></div>
						<div class="spacer"></div>
				</div>
				<div class="row_stat_user">
						<div class="title_stat_user"><?php echo Kohana::lang( 'user.nb_victory' ); ?> : </div> 
						<div class="badge_stat_user"><?php echo badge::img( 'nb_victory_bot_module', $stats->nb_victory_bot_module ); ?></div>
						<div class="score_stat_user"><?php echo $stats->nb_victory_bot_module; ?></div>
						<div class="spacer"></div>
				</div>
				<div class="row_stat_user">
						<div class="title_stat_user"><?php echo Kohana::lang( 'user.nb_bor' ); ?> : </div> 
						<div class="badge_stat_user"><?php echo badge::img( 'nb_victory_bot', $stats->nb_victory_bot ); ?></div>
						<div class="score_stat_user"><?php echo $stats->nb_victory_bot; ?></div>
						<div class="spacer"></div>
				</div>
				<div class="row_stat_user">
						<div class="title_stat_user"><?php echo Kohana::lang( 'user.nb_sort' ); ?> : </div> 
						<div class="badge_stat_user"><?php echo badge::img( 'nb_sorts', $stats->nb_sorts ); ?></div>
						<div class="score_stat_user"><?php echo $stats->nb_sorts; ?></div>
						<div class="spacer"></div>
				</div>
				<div class="row_stat_user">
						<div class="title_stat_user"><?php echo Kohana::lang( 'user.nb_stuff' ); ?> : </div> 
						<div class="badge_stat_user"><?php echo badge::img( 'nb_stuff', $stats->nb_stuff ); ?></div>
						<div class="score_stat_user"><?php echo $stats->nb_stuff; ?></div>
						<div class="spacer"></div>
				</div>
		</div>
</div>
<div class="center"><input type="button" value="<?php echo Kohana::lang( 'user.return_index' ); ?>" onclick="overlay.load('user' )" class="button" /></div>