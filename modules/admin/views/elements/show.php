<?php defined( 'SYSPATH' ) OR die( 'No direct access allowed.' ); ?>

<article class="module width_3_quarter">
		<header><h3 class="tabs_involved"><?php echo $row->title; ?></h3>
		</header>
		<div class="module_content">
				<p class="form-line">
						<label for="nom_map" class="form-label"><?php echo Kohana::lang( 'element.name' ); ?> : <span class="p-lower"><?php echo Kohana::lang( 'form.minus' ); ?></span></label>
						<input name="nom_map" id="nom_map" value="<?php echo $row->title; ?>" class="inputbox input-text" type="text" />
				</p>
				<p class="form-line">
						<label class="form-label"><?php echo Kohana::lang( 'element.image' ); ?> :</label>
						<input type="button" id="list_vignette" class="button" value="<?php echo Kohana::lang( 'form.selected_list' ); ?>" />
						<input type="hidden" value="<?php echo $row->image; ?>" id="image" name="image"/>
				</p>
				<p><strong><?php echo Kohana::lang( 'form.add_function' ); ?></strong></p>
				<p><?php echo Kohana::lang( 'element.info_fonction' ); ?></p>
				<?php echo Code_Core::editeur( 'fonction', $row->fonction ? $row->fonction : '<?php ?>', 200 ); ?> <strong class="rouge"><?php echo Kohana::lang( 'form.warning_function' ); ?></strong>
				<pre>if( !$row = Map_Model::instance()-&gt;select_detail( 
				array('region_id' =&gt; $this-&gt;user-&gt;region_id, 
				'x_map' =&gt; $this-&gt;user-&gt;x, 
				'y_map' =&gt; $this-&gt;user-&gt;y, 
				'module_map' =&gt; $this-&gt;module ) ) )<br />	return FALSE;<br />		<br />if(!$row-&gt;action_map || (!$this-&gt;data = @unserialize($row-&gt;action_map) ) )<br />	return FALSE;<br />						<br /><strong class="rouge">&lt;-- <?php echo Kohana::lang( 'form.your_code' ); ?> --&gt;</strong><br />		<br />$this-&gt;data-&gt;id_module = $row-&gt;id_detail;<br />$this-&gt;data-&gt;region_id = $row-&gt;region_id;<br />$this-&gt;data-&gt;x_map = $row-&gt;x_map;<br />$this-&gt;data-&gt;y_map = $row-&gt;y_map;<br />$this-&gt;data-&gt;image = $row-&gt;image;<br />		<br />return $this;</pre>
		</div>
</article>
<article class="module width_quarter">
		<header><h3><?php echo Kohana::lang( 'element.supp_info' ); ?></h3></header>
		<div class="module_content">
				<div class="label">
						<label><?php echo Kohana::lang( 'element.id' ); ?> :</label>
						<span id="idActualite"><?php echo $row->id; ?></span></div>
				<div class="label">
						<label><?php echo Kohana::lang( 'element.image' ); ?> :</label>
						<div class="center" style="margin:10px 0; display:block"> <img src="<?php echo url::base(); ?>../images/modules/<?php echo $row->image ? $row->image : 'no.png'; ?>" width="96" id="imageModule" class="imageModule" /></div>
				</div>
		</div>
</article>
<div class="spacer"></div>
