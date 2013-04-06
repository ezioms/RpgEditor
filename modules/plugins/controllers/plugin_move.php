<?php

defined( 'SYSPATH' ) or die( 'No direct access allowed.' );

/**
 * Changement de carte sur la map.
 *
 * @package Action_move
 * @author Pasquelin Alban
 * @copyright (c) 2011
 * @license http://www.openrpg.fr/license.html
 */
class Plugin_Move_Controller extends Action_Controller {

		/**
		 * Gestion du changement de carte.
		 * 
		 * @return  void
		 */
		public function index()
		{
				$this->json = FALSE;
				if( isset( $this->data->action_map->item ) && $this->data->action_map->item && (!$obj = Item_Model::instance()->select( $this->user->id, $this->data->action_map->item, 1 ) ) )
				{
						echo 'no';
						return;
				}
				if( $this->data->action_map->prix && is_numeric( $this->data->action_map->prix ) && $this->user->argent >= $this->data->action_map->prix )
						$this->user->argent -= $this->data->action_map->prix;

				if( !$this->data->action_map->prix || $this->user->argent >= $this->data->action_map->prix )
				{
						$this->user->x = $this->data->action_map->x_move;
						$this->user->y = $this->data->action_map->y_move;
						$this->user->z = $this->data->action_map->z_move;
						$this->user->region_id = $this->data->action_map->id_region_move;
						$this->user->update();

						History_Model::instance()->user_insert( $this->user->id, $this->data->id, $this->data->action_map->id_region_move, 'change_map' );

						echo '<script>';
						echo 'scene.data.my.x = '.$this->data->action_map->x_move.';';
						echo 'scene.data.my.y = '.$this->data->action_map->y_move.';';
						echo 'scene.data.my.z = '.$this->data->action_map->z_move.';';
						echo 'scene.hero.setPosition('.$this->data->action_map->x_move.','.$this->data->action_map->y_move.','.$this->data->action_map->z_move.');';
						echo 'scene.data.my.region = '.$this->user->region_id.';';
						echo 'scene.data.my.argent = '.$this->user->argent.';';
						echo 'reloadMap();';
						echo '</script>';
				}
		}

}

?>