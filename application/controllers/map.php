<?php

defined('SYSPATH') or die('No direct access allowed.');
/**
 * Controller public de la map. Pour afficher la map.
 *
 * @package     Map
 * @author Pasquelin Alban
 * @copyright     (c) 2011
 * @license http://www.openrpg.fr/license.html
 */
class Map_Controller extends Authentic_Controller
{

    private $region = FALSE;
    private $botFixe;

    public function __construct()
    {
        parent::__construct();
        parent::login();

        $this->auto_render = FALSE;

        if (!request::is_ajax())
            return FALSE;
    }

    /**
     * Générer un JSON
     *
     * @return void
     */
    public function index($render = TRUE)
    {
        $json = new View('map/json');
        $json->my = $this->user;

        if (!($this->region = Region_Model::instance()->select(array('id' => $this->user->region_id), 1)))
            return FALSE;

        $prenoms = Name_Model::instance()->select();
        $images = file::listing_dir(DOCROOT . 'images/character');

        $this->region->map = $this->_dataMap($this->region, $images);
        $this->region->bots = $this->_dataBots($prenoms, $images);
        $json->region = $this->region;

        return $json->render($render);
    }

    /**
     * Data de la map.
     *
     * @return  object
     */
    private function _dataMap($regionCurrent, $image)
    {
        $elements = $modules = $items = FALSE;

        if (($rows = Map_Model::instance()->select(array(
            'region_id' => $this->region->id), FALSE)) !== FALSE
        ) {
            foreach ($rows as $row) {
                if (!$row->module_map)
                    $elements[] = '{"x" : ' . $row->x . ', "z" : ' . $row->z . ', "y" : ' . $row->y . ', "materials" : [ "' . $row->background_px . '", "' . $row->background_nx . '", "' . $row->background_py . '", "' . $row->background_ny . '", "' . $row->background_pz . '", "' . $row->background_nz . '"	] }';
                else {
                    $data = @unserialize($row->action_map);
                    $action = json_encode($data);

                    $article = '';
                    if ($row->module_map == 'article') {
                        $article = Article_Model::instance()->select(array(
                            'id_article' => $data->id_article,
                            'article_category_id' => 2,
                            'status' => 1), 1);
                        $modules[] = '{"x" : ' . $row->x . ', "z" : ' . $row->z . ', "y" : ' . $row->y . ', "data" : ' . $action . ', "article" : ' . json_encode($article->article) . ' }';
                    } elseif ($row->module_map == 'bot') {
                        $v = new stdClass;
                        $v->id = 0;
                        $v->name = '';
                        $v->x = $data->x - 1;
                        $v->y = $data->y;
                        $v->z = $data->z - 1;
                        $v->region_id = $data->region_id;
                        $v->user_id = $this->user->id;
                        $v->image = 'character/' . $image[array_rand($image)];
                        $v->hp_max = 100;
                        $v->hp = 100;
                        $v->leak = 0;
                        $v->fixe = 1;
                        $v->argent = 1000;
                        $v->xp = 10;
                        $v->niveau = 0;

                        $this->botFixe[] = $v;
                    } else
                        $modules[] = '{"x" : ' . $row->x . ', "z" : ' . $row->z . ', "y" : ' . $row->y . ', "data" : ' . $action . ', "article" : "" }';
                }
            }
        }

        $articles = Article_Model::instance()->select(array(
            'region_id' => $regionCurrent->id,
            'article_category_id' => 2,
            'status' => 1));

        $articlesList = null;
        if ($articles)
            foreach ($articles as $row)
                $articlesList[] = json_encode($row->reponse ? $row->article . '<div class="reponse">' . $row->reponse . '</div>' : $row->article);

        $v = new stdClass;
        $v->region = $this->region;
        $v->elements = $elements ? implode(',', $elements) : FALSE;
        $v->modules = $modules ? implode(',', $modules) : FALSE;
        $v->articles = $articlesList ? implode(',', $articlesList) : FALSE;

        return $v;
    }

    /**
     * Data des bots.
     *
     * @return  object
     */
    private function _dataBots($prenoms, $image)
    {
        $this->bot = Bot_Model::instance();

        // TODO Voir les armes bots

        $number_bot = rand($this->region->bot_nbr_min, $this->region->bot_nbr_max);

        $listName = array();
        foreach ($prenoms as $prenom)
            $listName[] = ucfirst(mb_strtolower($prenom->prenom));

        for ($n = 0; $n < $number_bot; $n++)
            if (rand(0, 100) > Kohana::config('bot.pourcent_no_generate_bot')) {
                $hp = rand($this->region->bot_hp_min, $this->region->bot_hp_max);

                if (!$hp)
                    continue;

                $v = new stdClass;
                $v->id = $n;
                $v->name = $listName[array_rand($listName)];
                $v->x = rand(1, $this->region->x - 1);
                $v->y = rand(1, $this->region->y - 1);
                $v->z = rand(1, $this->region->z - 1);
                $v->region_id = $this->user->region_id;
                $v->user_id = $this->user->id;
                $v->image = 'character/' . $image[array_rand($image)];
                $v->hp_max = $hp;
                $v->hp = $hp;
                $v->leak = rand(0, 100) > 90 ? 1 : 0;
                $v->fixe = 0;
                $v->argent = rand($this->region->bot_argent_min, $this->region->bot_argent_max);
                $v->xp = rand($this->region->bot_xp_min, $this->region->bot_xp_max);
                $v->niveau = $this->region->bot_niveau;

                $this->botFixe[] = $v;
            }

        return $this->botFixe;
    }

}

?>