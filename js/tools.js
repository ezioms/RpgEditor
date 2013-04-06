var PI = Math.PI;
var PI_2 = Math.PI / 2;

function bind( scope, fn ) {
		return function () {
				fn.apply( scope, arguments );
		};
}

function aleatoire(i) 
{
		return parseInt(Math.round(Math.random()*(!i ? 100 : i)));
}

function random(min, max)
{		
		var randomNum = Math.random() * (max-min); 
		return(Math.round(randomNum) + min); 
}

function HTMLentities(texte) 
{
		texte = texte.replace(/"/g,'&quot;'); // 34 22
		texte = texte.replace(/&/g,'&amp;'); // 38 26
		texte = texte.replace(/\'/g,'&#39;'); // 39 27
		texte = texte.replace(/</g,'&lt;'); // 60 3C
		texte = texte.replace(/>/g,'&gt;'); // 62 3E
		texte = texte.replace(/\^/g,'&circ;'); // 94 5E
		return texte;
}

function log( txt ) 
{
		if( debug )
				console.log(txt);
}

function info( txt ) 
{
		if( debug )
				console.info(txt);
}

function round32( n )
{
		return Math.round( n / 32 ) * 32;
}

function end (arr) {
		this.php_js = this.php_js || {};
		this.php_js.pointers = this.php_js.pointers || [];
		var indexOf = function (value) {
				for (var i = 0, length = this.length; i < length; i++) {
						if (this[i] === value) {
								return i;
						}
				}
				return -1;
		};
		var pointers = this.php_js.pointers;
		if (!pointers.indexOf) {
				pointers.indexOf = indexOf;
		}
		if (pointers.indexOf(arr) === -1) {
				pointers.push(arr, 0);
		}
		var arrpos = pointers.indexOf(arr);
		if (Object.prototype.toString.call(arr) !== '[object Array]') {
				var ct = 0;
				for (var k in arr) {
						ct++;
						var val = arr[k];
				}
				if (ct === 0) {
						return false; // Empty
				}
				pointers[arrpos + 1] = ct - 1;
				return val;
		}
		if (arr.length === 0) {
				return false;
		}
		pointers[arrpos + 1] = arr.length - 1;
		return arr[pointers[arrpos + 1]];
}

function redirect( url ) {
		location.href = url;
}


function set_barre( id, value )
{
		var max_valeur = parseInt($(id).find('.valueMaxGraph').html());

		$(id).find('.valueMoyenneGraph').html( value );
		$(id).find('.ContenuGraphique').width( ( Math.round( 100 - ( (max_valeur - value) / max_valeur * 100 ) ) )+'%' );
}

function number_format (number, decimals, dec_point, thousands_sep) {
		number = (number + '').replace(/[^0-9+\-Ee.]/g, '');
		var n = !isFinite(+number) ? 0 : +number,
		prec = !isFinite(+decimals) ? 0 : Math.abs(decimals),
		sep = (typeof thousands_sep === 'undefined') ? ',' : thousands_sep,
		dec = (typeof dec_point === 'undefined') ? '.' : dec_point,
		s = '',
		toFixedFix = function (n, prec) {
				var k = Math.pow(10, prec);
				return '' + Math.round(n * k) / k;
		};
		// Fix for IE parseFloat(0.55).toFixed(0) = 0;
		s = (prec ? toFixedFix(n, prec) : '' + Math.round(n)).split('.');
		if (s[0].length > 3) {
				s[0] = s[0].replace(/\B(?=(?:\d{3})+(?!\d))/g, sep);
		}
		if ((s[1] || '').length < prec) {
				s[1] = s[1] || '';
				s[1] += new Array(prec - s[1].length + 1).join('0');
		}
		return s.join(dec);
}

function array_rand (input, num_req) {
		var indexes = [];
		var ticks = num_req || 1;
		var checkDuplicate = function (input, value) {
				var exist = false,
				index = 0,
				il = input.length;
				while (index < il) {
						if (input[index] === value) {
								exist = true;
								break;
						}
						index++;
				}
				return exist;
		};

		if (Object.prototype.toString.call(input) === '[object Array]' && ticks <= input.length) {
				while (true) {
						var rand = Math.floor((Math.random() * input.length));
						if (indexes.length === ticks) {
								break;
						}
						if (!checkDuplicate(indexes, rand)) {
								indexes.push(rand);
						}
				}
		} else {
				indexes = null;
		}

		return ((ticks == 1) ? indexes.join() : indexes);
}
