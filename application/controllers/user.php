<?php

defined('SYSPATH') or die('No direct access allowed.');
/**
 * Controller public des users.
 *
 * @package Action
 * @author Pasquelin Alban
 * @copyright     (c) 2011
 * @license http://www.openrpg.fr/license.html
 */
class User_Controller extends Template_Controller
{

    public function __construct()
    {
        parent::__construct();
        parent::login();

        $this->auto_render = FALSE;
    }

    public function update($noScript = false)
    {
        $this->user->positionX = $this->input->get('positionX', $this->user->positionX);
        $this->user->positionY = $this->input->get('positionY', $this->user->positionY);
        $this->user->positionZ = $this->input->get('positionZ', $this->user->positionZ);
        $this->user->region_id = $this->input->get('region', $this->user->region_id);
        $this->user->currentdirection_x = $this->input->get('currentdirection_x', $this->user->currentdirection_x);
        $this->user->gravity = $this->input->get('gravity', $this->user->gravity);
        $this->user->speed = $this->input->get('speed', $this->user->speed);
        $this->user->hp_max = $this->input->get('hpMax', $this->user->hp_max);
        $this->user->hp = $this->input->get('hp', $this->user->hp);
        $this->user->niveau = $this->input->get('niveau', $this->user->niveau);
        $this->user->xp = $this->input->get('xp', $this->user->xp);
        $this->user->argent = $this->input->get('argent', $this->user->xp);
        $this->user->update();

        if (!$noScript) {
            echo 'app.hero.getCamera().position.x = ' . $this->user->positionX . ';' . "\n";
            echo 'app.hero.getCamera().position.y = ' . $this->user->positionY . ';' . "\n";
            echo 'app.hero.getCamera().position.z = ' . $this->user->positionZ . ';' . "\n";
            echo 'app.hero.region = ' . $this->user->region_id . ';' . "\n";
            echo 'app.hero.argent = ' . $this->user->argent . ';' . "\n";
            echo 'app.hero.gravity = ' . $this->user->gravity . ';' . "\n";
            echo 'app.hero.speed = ' . $this->user->speed . ';' . "\n";
            echo 'app.hero.hp = ' . $this->user->hp . ';' . "\n";
            echo 'app.hero.hp_max = ' . $this->user->hp_max . ';' . "\n";
            echo 'app.hero.niveau = ' . $this->user->niveau . ';' . "\n";
            echo 'app.hero.xp = ' . $this->user->xp . ';' . "\n";
        }
    }

}

?>