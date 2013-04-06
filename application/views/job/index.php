<?php defined( 'SYSPATH' ) OR die( 'No direct access allowed.' ); ?>

<img src="<?php echo url::base(); ?>images/job/<?php echo $job->image; ?>" height="80"  class="imgJob"/>
<p><?php echo Kohana::lang( 'job.you_are' ); ?> <b><?php echo $job->name; ?></b></p>
<p><?php echo $job->comment; ?></p>
<div class="clear"></div>
<?php if( $couples ) : ?>
		<table width="100%">
				<?php foreach( $couples as $couple ) : ?>
						<tr>
								<td><img src="<?php echo url::base(); ?>images/items/<?php echo $my_item[$couple->items_id_one]->image; ?>" width="24" height="24" /></td>
								<td><?php echo $couple->nbr_one; ?> <?php echo $my_item[$couple->items_id_one]->name; ?></td>
								<td>+</td>
								<td><img src="<?php echo url::base(); ?>images/items/<?php echo $my_item[$couple->items_id_two]->image; ?>" width="24" height="24" /></td>
								<td><?php echo $couple->nbr_two; ?> <?php echo $my_item[$couple->items_id_two]->name; ?></td>
								<td>=</td>
								<td><img src="<?php echo url::base(); ?>images/items/<?php echo $couple->image; ?>" width="24" height="24" /></td>
								<td><?php echo $couple->name; ?></td>
								<td class="right"><input type="button" class="button button_vert insert_couple" value="<?php echo Kohana::lang( 'job.couple' ); ?>" id="couple_<?php echo $couple->items_link_id; ?>" /></td>
						</tr>
				<?php endforeach; ?>
		</table>
<?php else : ?>
		<p><?php echo Kohana::lang( 'job.no_couple' ); ?></p>
<?php endif; ?>