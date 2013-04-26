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


        $elements = $modules = $items = FALSE;

        if (($rows = Map_Model::instance()->select(array(
            'region_id' => $this->region->id), FALSE)) !== FALSE
        ) {
            $prenoms = Name_Model::instance()->select();

            $listName = array();
            foreach ($prenoms as $prenom)
                $listName[] = ucfirst(mb_strtolower($prenom->prenom));

            $images = file::listing_dir(DOCROOT . 'images/character');

            foreach ($rows as $row) {
                if (!$row->module_map && !$row->bot)
                    $elements[] = '{"x" : ' . $row->x . ', "z" : ' . $row->z . ', "y" : ' . $row->y . ', "materials" : [ "' . $row->background_px . '", "' . $row->background_nx . '", "' . $row->background_py . '", "' . $row->background_ny . '", "' . $row->background_pz . '", "' . $row->background_nz . '"	] }';
                else {
                    $data = @unserialize($row->action_map);
                    $action = json_encode($data);

                    if ($row->module_map == 'article') {
                        $article = Article_Model::instance()->select(array(
                            'id_article' => $data->id_article,
                            'article_category_id' => 2,
                            'status' => 1), 1);
                        $modules[] = '{"x" : ' . $row->x . ', "z" : ' . $row->z . ', "y" : ' . $row->y . ', "data" : ' . $action . ', "article" : ' . json_encode($article->article) . ' }';
                    } elseif ($row->module_map == 'bot' || $row->bot) {
                        $v = new stdClass;
                        $v->id = 0;
                        $v->name = $row->bot ? $row->title : $listName[array_rand($listName)];
                        $v->x = $row->x - 1;
                        $v->y = $row->y - 1;
                        $v->z = $row->z - 1;
                        $v->region_id = $row->region_id;
                        $v->user_id = $this->user->id;
                        $v->image = 'character/' . $images[array_rand($images)];
                        $v->hp_max = 100;
                        $v->hp = 100;
                        $v->leak = 0;
                        $v->fixe = $row->bot ? 0 : 1;
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
            'region_id' => $this->region->id,
            'article_category_id' => 2,
            'status' => 1));

        $articlesList = null;
        if ($articles)
            foreach ($articles as $row)
                $articlesList[] = json_encode($row->reponse ? $row->article . '<div class="reponse">' . $row->reponse . '</div>' : $row->article);

        $this->region->map = new stdClass;
        $this->region->map->region = $this->region;
        $this->region->map->elements = $elements ? implode(',', $elements) : FALSE;
        $this->region->map->modules = $modules ? implode(',', $modules) : FALSE;
        $this->region->map->articles = $articlesList ? implode(',', $articlesList) : FALSE;
        $this->region->map->region->bots = $this->botFixe;

        $json->region = $this->region;

        return $json->render($render);
    }

}

?>