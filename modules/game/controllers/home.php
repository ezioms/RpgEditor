<?php

defined( 'SYSPATH' ) or die( 'No direct access allowed.' );

/**
 * Controller public de la page par défaut (homepage).
 *
 * @package	 Home
 * @author Pasquelin Alban
 * @copyright	 (c) 2011
 * @license http://www.openrpg.fr/license.html
 */
class Home_Controller extends Template_Controller {

		public function __construct()
		{
				parent::__construct();
		}

		/**
		 * Page par défaut du jeu (homepage).
		 *
		 * @param bool Afficher directement ou return la vue
		 * @return  void
		 */
		public function index()
		{
				if( !$this->user )
				{
						Router_Core::$controller = 'logger';
						return Logger_Controller::index();
				}
				
				foreach( file::listing_dir( DOCROOT.'js/class' ) as $row )
						if( is_file( DOCROOT.'js/class/'.$row ) )
								$this->script[] = 'js/class/'.str_replace( '.js', '', $row );

				foreach( file::listing_dir( DOCROOT.'js' ) as $row )
						if( is_file( DOCROOT.'js/'.$row ) && $row != 'logger.js' )
								$this->script[] = 'js/'.str_replace( '.js', '', $row );

				$this->template->content = new View( 'home/index' );
				$this->template->content->admin = in_array( 'admin', $this->role->name );

				$this->template->content->info_user = new View( 'user/information' );
				$this->template->content->info_user->user = $this->user;
		}

}

?>