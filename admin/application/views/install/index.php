<?php defined( 'SYSPATH' ) OR die( 'No direct access allowed.' ) ?>
<?php if( $chmod ) : ?>
		<?php echo $chmod; ?>
<?php else : ?>
		<article class="module width_full relative">
				<form method="POST" action="<?php echo url::base( TRUE ); ?>install/zip" enctype="multipart/form-data">
						<header>
								<h3 class="tabs_involved"><?php echo Kohana::lang( 'install.title' ); ?></h3>
						</header>
						<div class="module_content">
								<fieldset>
										<label><?php echo Kohana::lang( 'install.label_zip' ); ?></label>
										<div class="clear"></div>
										<input name="zip" type="file" size="50" />
								</fieldset>
								<div class="clear"></div>
						</div>
						<footer>
								<div class="submit_link">
										<input type="reset" value="<?php echo Kohana::lang( 'form.reset' ); ?>">
										<input type="submit" value="<?php echo Kohana::lang( 'install.submit' ); ?>" class="alt_btn">
								</div>
						</footer>
				</form>
				<div class="clear"></div>
		</article>
<?php endif ?>
<article class="module width_full relative">
		<header>
				<h3 class="tabs_involved"><?php echo Kohana::lang( 'install.mod_install' ); ?></h3>
		</header>
		<table id="json_items" class="datatable" cellspacing="0">
				<tbody>
						<?php
						$n = 0;
						foreach( $modules as $key => $row ):
								$class = $n % 2 == 0 ? 'odd' : 'even';
								?>
								<tr class="<?php echo $class; ?>">
										<td width="300"><strong><?php echo Kohana::lang( 'plg_'.$row.'.title' ); ?></strong></td>
										<td><strong><?php echo $row; ?></strong></td>
										<td><?php echo str_replace( '../modules/', '', dir( DOCROOT.'../modules/plugins/views/'.$row )->path ); ?></td>
										<?php if( !$chmod ) : ?>
												<td class="right"><?php echo html::anchor( 'install/delete/'.$row, Kohana::lang( 'form.delete' ) ); ?></td>
								<?php endif ?>
								</tr>
								<?php
								$n++;
						endforeach
						?>
				</tbody>
		</table>
		<div class="clear"></div>
</article>