<?php defined( 'SYSPATH' ) OR die( 'No direct access allowed.' ); ?>

<div class="list_user_item">
		<div class="close_list"></div>
		<div class="title_item"><?php echo $title; ?></div>
		<div class="global_item" id="global_item_<?php echo $id_js; ?>" >
				<?php for( $i = 0; $i < 16; $i++ ) : ?>
						<div id="inventaire_<?php echo $id_js.'_'.$i; ?>" class="content-item">
								<?php if( isset( $items[$i] ) && ( $item = $items[$i] ) ) : ?>
										<div id="elementInventaire_<?php echo $item->item_id; ?>" class="element-item <?php echo ($item->using ? 'actif' : 'no_actif').' position_'.$item->position; ?>" >
												<div class="delete-item jaune ">x</div>		
												<?php if( $item->nbr && $item->nbr > 1 ) : ?>
														<div class="nombre jaune"><?php echo $item->nbr; ?></div>
												<?php endif ?>
												<img src="<?php echo url::base(); ?>images/items/<?php echo $item->image; ?>" width="24" height="24" title="<?php echo $item->name; ?><br/><?php echo Kohana::lang( 'user.hp' ); ?> : <?php echo number_format( $item->hp ); ?> pt(s)<br/><?php echo Kohana::lang( 'user.mp' ); ?> : <?php echo number_format( $item->mp ); ?> pt(s)" class="img_item" />
										</div>
								<?php endif ?>
						</div>
				<?php endfor ?>
		</div>
</div>