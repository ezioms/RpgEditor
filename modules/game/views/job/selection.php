<?php defined( 'SYSPATH' ) OR die( 'No direct access allowed.' ); ?>

<p><?php echo Kohana::lang( 'job.select_desc' ); ?></p>
<?php if( $jobs ): ?>
		<select class="input-select" id="my_job">
				<option value=""><?php echo Kohana::lang( 'job.select_job' ); ?></option>
				<?php foreach( $jobs as $job ) : ?>
						<option title="<?php echo $job->comment; ?>" value="<?php echo $job->id; ?>"><?php echo $job->name; ?></option>
				<?php endforeach ?>
		</select> 
		<input type="button" id="select_job" class="button button_vert" value="<?php echo Kohana::lang( 'job.select_botton' ); ?>"/>
<?php endif; ?>
