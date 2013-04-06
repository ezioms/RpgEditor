THREE.Overlay = function() {

		this.global = $('#overlay_global');
		
		this.loadData = false;
		
		this.close = function ( )	
		{
				if( !this.show() )
						return;
				
				this.global.fadeOut(function() {
						$('#overlay_content').empty();
				});
		};

		this.edit = function ( data, close, hide )	
		{
				if( data == '' )
						return;
				
				$('#overlay_content').html( data );
				
				if( hide )
						this.global.hide();
				else
						this.global.show();
				
				this.size();
		};

		this.load = function ( url, callback )	
		{
				var _this = this;
				var hideOverlay = false;
				var action = url.split('?')[0];
				this.loadData = true;

				if(action.substring(action.length - 4) ==  'move' )
						hideOverlay = true;
				
				
				$.get(url_script+url, function(data) {
						
						if( data )
								_this.edit(data, true, hideOverlay);
						
						if( callback && typeof(callback) === 'function')
								callback( data );
						
						_this.loadData = false;
				});
		};
		
		this.size = function ()	
		{
				if( this.show() )
						this.global.css({
								'left' : ( $(window).width() - this.global.width() ) / 2,
								'top' : 150
						});
		};

		this.show = function ( )	
		{
				if( this.global.is(':visible') )
						return true;
				
				return false;
		};
}