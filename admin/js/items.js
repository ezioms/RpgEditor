$(function() {
	
		$('#form').validate({
				rules: {
						name: {
								required: true,
								minlength: 2,
								maxlength: 50
						},
						comment: {
								required: true,
								minlength: 10,
								maxlength: 200
						},
						image: {
								required: true
						},
						prix: {
								required: true,
								number: true,
								max: 999999999
						},
						hp: {
								number: true,
								max: 999999999
						},
						mp: {
								number: true,
								max: 999999999
						}
				},
				messages: {
						name: {
								required: name_required,
								minlength: name_minlength,
								maxlength: name_maxlength
						},
						comment: {
								required: comment_required,
								minlength: comment_minlength,
								maxlength: comment_maxlength
						},
						image: {
								required: image_required
						},
						prix: {
								required: prix_required,
								max: prix_max,
								number: prix_number
						},
						hp: {
								min: hp_min,
								max: hp_max,
								number: hp_number
						},
						mp: {
								min: mp_min,
								max: mp_max,
								number: mp_number
						}
				}
		});
	
		$('.vign_mod').live('click', function() {
				$('#imageItem').attr('src', dir_script+'../images/items/'+this.id);
				$('#image').val(this.id);
		});
	
		$('#list_vignette, #imageItem').click(function() {
				$.facebox({
						ajax: url_script+'items/vignette/'+$('#image').val()
				});
		});

		$('#protect').change(function() {
				affiche_option_objet( this );
		});
});

function affiche_option_objet( obj )
{
		if( $(obj).val() == 0 )
				$('#option_objet').hide();
		else
				$('#option_objet').show();
}
