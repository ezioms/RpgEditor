<?php

defined( 'SYSPATH' ) OR die( 'No direct access allowed.' );

class Mapping_Controller extends Template_Controller {

		public function __construct()
		{
				parent::__construct();
				parent::access( 'mapping' );
		}

		/**
		 * Méthode : pour empêcher un utilisateur d'accéder directement à ce controller
		 */
		public function index()
		{
				return self::redirection( Kohana::lang( 'logger.no_acces' ) );
		}

		/**
		 * Méthode : pour afficher la zone de travail
		 */
		public function panel( $id )
		{
				if( !( $region = Region_Model::instance()->select( array( 'id' => $id ), 1 ) ) )
						self::index();

				$elements = FALSE;

				if( ($rows = Map_Model::instance()->select( array( 'region_id' => $id ) ) ) !== FALSE )
				{
						foreach( $rows as $row )
								$listOptimise[$row->x][$row->y][$row->z] = true;

						foreach( $rows as $row )
								if( !isset( $listOptimise[$row->x + 1][$row->y][$row->z] )
												|| !isset( $listOptimise[$row->x - 1][$row->y][$row->z] )
												|| !isset( $listOptimise[$row->x][$row->y + 1][$row->z] )
												|| !isset( $listOptimise[$row->x][$row->y - 1][$row->z] )
												|| !isset( $listOptimise[$row->x][$row->y][$row->z + 1] )
												|| !isset( $listOptimise[$row->x][$row->y][$row->z - 1] ) )
										$elements[] = '{"x" : "'.$row->x.'", "z" : "'.$row->z.'", "y" : "'.$row->y.'", "materials" : [ "'.$row->background_px.'", "'.$row->background_nx.'", "'.$row->background_py.'", "'.$row->background_ny.'", "'.$row->background_pz.'", "'.$row->background_nz.'"	] }';
								else
										Map_Model::instance()->delete( (array) $row );
				}

				$this->script = array( 'js/lib/three.min', 'js/lib/three.control', 'js/lib/detector', 'js/mapping', 'js/lib/jquery.facebox', 'js/stats' );

				$this->css = array( 'facebox', 'mapping' );

				$this->template->contenu = new View( 'mapping/index' );
				$this->template->contenu->region = json_encode( $region );
				$this->template->contenu->elements = $elements ? implode( ','."\n", $elements ) : FALSE;
		}

		/**
		 * Page qui affiche les choix pour le material
		 * 
		 * @return  void
		 */
		public function listing_material()
		{
				$this->auto_render = FALSE;

				if( !request::is_ajax() )
						return FALSE;

				$v = new View( 'mapping/material' );
				$v->material = file::listing_dir( DOCROOT.'../images/background/' );
				$v->render( TRUE );
		}

		/**
		 * Gestion add bloc
		 * 
		 * @return  void
		 */
		public function add()
		{
				$this->auto_render = FALSE;

				if( !request::is_ajax() )
						return FALSE;

				$value = $this->input->post();
				$value['background_px'] = $value['materials'][0];
				$value['background_nx'] = $value['materials'][1];
				$value['background_py'] = $value['materials'][2];
				$value['background_ny'] = $value['materials'][3];
				$value['background_pz'] = $value['materials'][4];
				$value['background_nz'] = $value['materials'][5];
				unset( $value['materials'] );

				Map_Model::instance()->insert( $value );
		}

		/**
		 * Gestion remove bloc
		 * 
		 * @return  void
		 */
		public function remove()
		{
				$this->auto_render = FALSE;

				if( !request::is_ajax() )
						return FALSE;

				$value = $this->input->post();
				unset( $value['materials'] );

				Map_Model::instance()->delete( $value );
		}

		/**
		 * Methode : affiche le formulaire en overlay pour edit
		 */
		public function form( $id_region, $x, $y, $z )
		{
				$this->auto_render = FALSE;

				if( !request::is_ajax() )
						return;

				$view = new View( 'mapping/form' );
				$view->x = $x;
				$view->y = $y;
				$view->z = $z;
				$view->region_id = $id_region;
				$view->type = 'add';
				
				if( ($view->row = Map_Model::instance()->select( array( 'region_id' => $id_region, 'x' => $x, 'y' => $y, 'z' => $z, 'module_map IS NOT' => NULL ), 1 ) ) )
				{
						$view->type = 'edit';
						$view->id = $view->row->id;
						$view->row = unserialize( $view->row->action_map );
				}

				$view->actions = file::listing_dir( MODPATH.'/plugins/views' );
				$view->render( true );
		}

		/**
		 * Gestion add module
		 * 
		 * @return  void
		 */
		public function add_module()
		{
				$this->auto_render = FALSE;

				if( !request::is_ajax() || !($value = $this->input->post()) )
						return;

				$array['x'] = $value['x'];
				$array['y'] = $value['y'];
				$array['z'] = $value['z'];
				$array['background_px'] = $array['background_nx'] = $array['background_py'] = $array['background_ny'] = $array['background_pz'] = $array['background_nz'] = 'images/background/module.png';
				$array['title'] = $value['title'];
				$array['bot'] = $value['bot'];
				$array['region_id'] = $value['region_id'];
				$array['image'] = isset( $value['image'] ) ? $value['image'] : FALSE;
				$array['module_map'] = $value['module'];
				$array['action_map'] = $value['module'] ? serialize( (object) $value ) : FALSE;
				$array['fonction'] = isset( $value['fonction'] ) ? $value['fonction'] : FALSE;

				Map_Model::instance()->insert( $array );
		}

		/**
		 * Gestion edit module
		 * 
		 * @return  void
		 */
		public function edit_module()
		{
				$this->auto_render = FALSE;

				if( !request::is_ajax() || !($value = $this->input->post()) )
						return;

				$array = array( );
				$array['x'] = $value['x'];
				$array['y'] = $value['y'];
				$array['z'] = $value['z'];
				$array['background_px'] = $array['background_nx'] = $array['background_py'] = $array['background_ny'] = $array['background_pz'] = $array['background_nz'] = 'images/background/module.png';
				$array['title'] = $value['title'];
				$array['bot'] = $value['bot'];
				$array['region_id'] = $value['region_id'];
				$array['image'] = isset( $value['image'] ) ? $value['image'] : FALSE;
				$array['module_map'] = $value['module'];
				$array['action_map'] = $value['module'] ? serialize( (object) $value ) : FALSE;
				$array['fonction'] = isset( $value['fonction'] ) ? $value['fonction'] : FALSE;

				Map_Model::instance()->update( $array, array( 'id' => $value['id'] ) );
		}

}

?>