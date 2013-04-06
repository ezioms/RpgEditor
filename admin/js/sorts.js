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
						prix: {
								required: true,
								number: true,
								min: 5,
								max: 999999999
						},
						mp: {
								required: true,
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
						prix: {
								required: prix_required,
								min: prix_min,
								max: prix_max,
								number: prix_number
						},
						mp: {
								required: mp_required,
								max: mp_max,
								number: mp_number
						}
				}
		});
	
		$('#LookAnimate').click(function() {
				animation( $('#effect').val() );
		});
	
		$('#effect').change(function() {
				$('#vignetteAnimate').css({
						'background-image' : 'url("'+dir_script+'../images/sorts_animate/'+$(this).val()+'")'
				});
		});
	
		$('#image').change(function() {
				$('#boutonSort').attr('src', dir_script+'../images/sorts/'+$(this).val());
		});
	
		$('.vign_mod').live('click', function() {
				$('#boutonSort').attr('src', dir_script+'../images/sorts/'+this.id);
				$('#image').val(this.id);
		});
	
		$('#list_vignette, #boutonSort').click(function() {
				$.facebox({
						ajax: url_script+'sorts/vignette/'+$('#image').val()
				});
		});

});

var n = 0;

function animation( image )
{	
		if(image == '')
				return;
		
		var nbr = image.replace('.png','').split('_');
		nbr = nbr[1];
	
		if(n == 0)	
				$('#vignetteAnimate').css({
						'background-image' : 'url("'+dir_script+'../images/sorts_animate/'+image+'")'
				});
		else
		{
				var verifActif = false,
				col = 1,
				row = 0;
		
				for( var i = 1; i < nbr; i++)
				{
						if(n == i)
						{				
								$('#vignetteAnimate').css('background-position', '-'+(col * 64)+'px -'+(row * 64)+'px');
								verifActif = true;
								break;
						}
				
						if( col == 4 )
						{
								row++;
								col = 0;
						}
						else
								col++;
				}
		
				if(!verifActif)
						$('#vignetteAnimate').css({
								'background-position' : '0px 0px'
						});
		}
			
		if( n >= nbr)
		{	
				n = 0;
				clearTimeout(window['time_'+image]);
		}
		else
		{
				n++;
				window['time_'+image] = setTimeout( "animation('"+image+"')" , 100 );
		}
}