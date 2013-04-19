<?php

defined('SYSPATH') or die('No direct access allowed.');

/**
 * Controller public de la page des scores.
 *
 * @package     Home
 * @author Pasquelin Alban
 * @copyright     (c) 2011
 * @license http://www.openrpg.fr/license.html
 */
class Score_Controller extends Template_Controller
{

    /**
     * Page par qui affiche les scores
     *
     * @param bool Afficher directement ou return la vue
     * @return  void
     */
    public function index()
    {
        $this->css = 'css/score';
        $this->script = array('js/class/helvetiker_regular.typeface', 'js/login');

        $this->template->content = new View('score/index');
        $this->template->content->users = Statistiques_Model::instance()->top_user();
    }

}

?>