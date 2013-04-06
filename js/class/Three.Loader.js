THREE.Loader = function() {
		
		this.datas = false;

		this.maps = null;

		this.map = null;

		this.my = null;

		this.bots = null;

		this.nbrBot = 0;

		this.nbrMap= 0;

		this.nbrElements= 0;

		this.completedImage = 0;

		this.noCompletedImage = 0;

		this.stateLoad = 'Chargement des données';
		
		this.listImg = {};


		this.getCompleted = function() {
				
				if(	!this.datas )
						return false;
				
				this.maps = this.datas.maps;
				this.my = this.datas.my;
				
				if( !this.completedImage ){
						// hero
						this.completedImage += 1;
				
						for( var keyMap in this.maps ) {
								var region = this.maps[keyMap];
								
								// bots
								this.completedImage += region.bots.list.length;
								this.nbrBot += region.bots.list.length;
								
								// map
								this.completedImage += 2; // baground + wall
								for( var keyElement in region.map.elements)	{							
										if( Object.prototype.toString.apply( region.map.elements[keyElement].materials ) === '[object Array]' )
												for( keyImg in region.map.elements[keyElement].materials )
														this.completedImage++;
										else if ( region.map.elements[keyElement].materials )
												this.completedImage++;
										
										this.nbrElements++;
								}
								
								this.nbrMap++;
						}
				}
				
				this.noCompletedImage = this.completedImage;
				
				var stat = function ( a, b) {
						var valid = a - b;
						var pourcentage =Math.floor( valid/a * 100 );
						return  '<br/> '+number_format(valid) +' / '+ number_format(a) +' ('+pourcentage+'%)';
				};
				
				if( !this.getMyCompleted() ) 
						this.stateLoad = 'Chargement du héro '+stat(this.completedImage, this.noCompletedImage);
				else if( !this.getMapCompleted() )
						this.stateLoad = 'Chargement des images pour les régions '+stat(this.completedImage, this.noCompletedImage);
				else if( !this.getBotCompleted() )
						this.stateLoad = 'Chargement des images pour les habitants '+stat(this.completedImage, this.noCompletedImage);
				else {
						this.setMapCurrent();
						this.stateLoad = 'Chargement fini '+stat(this.completedImage, this.noCompletedImage);
						return true;
				}
				
				return false;
		};
		
		
		/*
		 * Hero
		 */
		this.getMyCompleted = function() {
				var noComplete = 0;
				
				if(  typeof this.my.img =='string')
						this.my.img = this.loadImage( dir_script+'images/character/'+this.my.img );
				
				if( !this.my.img.complete )
						noComplete++;
				else
						this.noCompletedImage--;
				
				return noComplete ? false : true;
		};

		
		
		/*
		 * Map
		 */
		this.getMapCompleted = function() {
				var noComplete = 0;
				
				for( var keyMap in this.maps ) {
						var region = this.maps[keyMap];
						
						for( key in region.map.elements)
						{
								var row = region.map.elements[key].materials;
								
								if( Object.prototype.toString.apply( row ) === '[object Array]' ) {
										for( keyImg in row ){
												if(  typeof row[keyImg] =='string')
														row[keyImg] = this.loadImage( dir_script+'images/background/'+row[keyImg] );
										
												if( !row[keyImg].complete )
														noComplete++;
												else
														this.noCompletedImage--;
										}
								}
								else if ( row ){
										if(  typeof row =='string')
												row = this.loadImage( dir_script+row );
										
										if( !row.complete )
												noComplete++;
										else
												this.noCompletedImage--;
								}
						}
				
						if(  typeof region.map.materials =='string')
								region.map.materials = this.loadImage( dir_script+'images/background/'+region.map.materials );

						if( !region.map.materials.complete )
								noComplete++;
						else
								this.noCompletedImage--;
				
						if(  typeof region.map.univers =='string')
								region.map.univers = this.loadImage( dir_script+region.map.univers );
										
						if( !region.map.univers.complete )
								noComplete++;
						else
								this.noCompletedImage--;
								
				}
				return noComplete ? false : true;
		};
		
		
		
		/*
		 * Bots
		 */
		this.getBotCompleted = function() {
				var noComplete = 0;
				
				for( var keyMap in this.maps ) {
						var region = this.maps[keyMap];
						for( key in region.bots.list)
						{
								if(  typeof region.bots.list[key].img =='string' )
										region.bots.list[key].img = this.loadImage( dir_script+'images/'+region.bots.list[key].img );
				
								if( !region.bots.list[key].img.complete )
										noComplete++;
								else
										this.noCompletedImage--;
						}
				}
				return noComplete ? false : true;
		};
		

		/*
		 * Cache image
		 */
		this.loadImage = function( path ) {
				if( this.listImg[path] !== undefined  )
						return this.listImg[path];

				this.listImg[path] = new Image();
				this.listImg[path].src = path;
				
				return this.listImg[path];
		};		

		/*
		 * On charge les donnée de la map current
		 */
		this.setMapCurrent = function ( callback ) {
				this.map = this.maps['region_'+ this.my.region].map;
				this.bots = this.maps['region_'+ this.my.region].bots;
				
				if( callback && typeof(callback) === 'function')
						callback();
		}

		this.request = function( url, type, params, callback  ) {
				
				var http;
				
				if (window.XMLHttpRequest || window.ActiveXObject) {
						if (window.ActiveXObject) {
								try {
										http = new ActiveXObject('Msxml2.XMLHTTP');
								} catch(e) {
										http = new ActiveXObject('Microsoft.XMLHTTP');
								}
						} 
						else
								http = new XMLHttpRequest(); 
		
						if( !type || type == 'GET' ) {
								if( params )
										url += "?"+params;
								
								http.open('GET', url_script+url, false);
								http.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
								http.send(null);
						} else {
								http.open('POST', url_script+url, false);
								http.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
								http.setRequestHeader("Content-length", params.length);
								http.setRequestHeader("Connection", "close");
								http.send(params);
						}
						
						if(http.readyState != 4 || (http.status != 200 && http.status != 0))
								throw new Error( 'Code HTTP : ' + http.status );
						else	{
								var result = null;
								if(http.responseText)
										eval('result = '+http.responseText);
								
								return result;
						}
				} 
				else
						log('Error XMLHTTPRequest');
				
				return null;
		};
		
		
		this.datas = this.request( 'map' );
}