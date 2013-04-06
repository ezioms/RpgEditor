<?php

defined( 'SYSPATH' ) or die( 'No direct access allowed.' );
/**
 * Controller public des users.
 *
 * @package Action
 * @author Pasquelin Alban
 * @copyright	 (c) 2011
 * @license http://www.openrpg.fr/license.html
 */
class User_Controller extends Template_Controller {

		public function __construct()
		{
				parent::__construct();
				parent::login();

				$this->auto_render = FALSE;
		}

		public function update( $noScript = false )
		{
				if( ($x = $this->input->get( 'x' ) ) )
						$this->user->x = $x - 1;
				if( ($y = $this->input->get( 'y' ) ) )
						$this->user->y = $y - 1;
				if( ($z = $this->input->get( 'z' ) ) )
						$this->user->z = $z - 1;
				
				$this->user->region_id = $this->input->get( 'region', $this->user->region_id );
				$this->user->currentdirection_x = $this->input->get( 'currentdirection_x', $this->user->currentdirection_x );
				$this->user->gravity = $this->input->get( 'gravity', $this->user->gravity );
				$this->user->speed = $this->input->get( 'speed', $this->user->speed );
				$this->user->hp_max = $this->input->get( 'hpMax', $this->user->hp_max );
				$this->user->hp = $this->input->get( 'hp', $this->user->hp );
				$this->user->mp_max = $this->input->get( 'mpMax', $this->user->mp_max );
				$this->user->mp = $this->input->get( 'mp', $this->user->mp );
				$this->user->niveau = $this->input->get( 'niveau', $this->user->niveau );
				$this->user->xp = $this->input->get( 'xp', $this->user->xp );
				$this->user->argent = $this->input->get( 'argent', $this->user->xp );
				$this->user->update();

				if( !$noScript )
				{
						echo '{};';
						echo 'scene.data.my.x = '.$this->user->x.';'."\n";
						echo 'scene.data.my.y = '.$this->user->y.';'."\n";
						echo 'scene.data.my.z = '.$this->user->z.';'."\n";
						echo 'scene.data.my.region = '.$this->user->region_id.';'."\n";
						echo 'scene.data.my.argent = '.$this->user->argent.';'."\n";
						echo 'scene.data.my.gravity = '.$this->user->gravity.';'."\n";
						echo 'scene.data.my.speed = '.$this->user->speed.';'."\n";
						echo 'scene.data.my.hp = '.$this->user->hp.';'."\n";
						echo 'scene.data.my.hp_max = '.$this->user->hp_max.';'."\n";
						echo 'scene.data.my.mp = '.$this->user->mp.';'."\n";
						echo 'scene.data.my.mp_max = '.$this->user->mp_max.';'."\n";
						echo 'scene.data.my.niveau = '.$this->user->niveau.';'."\n";
						echo 'scene.data.my.xp = '.$this->user->xp.';'."\n";
						echo 'scene.data.my.xpMax = '.$this->user->niveau_suivant().';'."\n";
				}
		}

}

?>