<?php defined('SYSPATH') OR die('No direct access allowed.') ?>

<!-- la map -->
<section id="noCursor">
    <div id="instructions">
        <span style="font-size:45px">Cliquez pour pivoter la caméra</span>
        <br/><span style="font-size:16px"><b>ESC</b> = Activer / désactiver le mouvement de la caméra</span>
        <br/><span style="font-size:16px"><b>P</b> = Capture écran</span>
        <br/><span style="font-size:16px"><b>G</b> = Afficher / masquer la grille</span>
    </div>
</section>

<div id="selectAction">
    <input type="button" value="Simple visite" data-action="no"/>

    <div class="spacerMenu"></div>
    <input type="button" value="Ajouter des cubes" data-action="add"/>
    <input type="button" value="Ajouter des modules" data-action="mod"/>
    <input type="button" value="Editer les modules" data-action="edit"/>
    <input type="button" value="supprimer les cubes/modules" data-action="del"/>

    <div class="spacerMenu"></div>
    <input type="button" value="Manipuler les objets" data-action="obj"/>
    <input type="button" value="Ajouter cet objet ->" id="addModel"/>

    <select name="selectModel" id="selectModel">
        <?php if ($models) : ?>
            <?php foreach ($models as $model) : ?>
                <option value="<?php echo $model; ?>"><?php echo $model; ?></option>
            <?php endforeach ?>
        <?php endif ?>
    </select>
</div>
<div id="controlCube">
    <img id="bloc_1" class="cubeBackground" src="<?php echo url::base(); ?>../images/background/grass.png"/>
    <img id="bloc_2" class="cubeBackground" src="<?php echo url::base(); ?>../images/background/grass_dirt.png"/>
    <img id="bloc_3" class="cubeBackground" src="<?php echo url::base(); ?>../images/background/grass_dirt.png"/>
    <img id="bloc_4" class="cubeBackground" src="<?php echo url::base(); ?>../images/background/grass_dirt.png"/>
    <img id="bloc_5" class="cubeBackground" src="<?php echo url::base(); ?>../images/background/grass_dirt.png"/>
    <img id="bloc_6" class="cubeBackground" src="<?php echo url::base(); ?>../images/background/dirt.png"/>

    <div id="allCube">Appliquer à tous <br/><img id="bloc_all" class="cubeBackground" src="<?php echo url::base(); ?>../images/background/dirt.png"/></div>
</div>
<div id="containerMapping"></div>
<div id="gui-container">
    <div id="map-gui-container"></div>
    <div id="my-gui-container"></div>
</div>
<input type="hidden" id="actionCurrent" val="no"/>
<script>
    var urlReplace = '<?php echo str_replace('admin/','', url::base()); ?>';

    var dataRegion = <?php echo $region; ?>;
    dataRegion.x = parseInt(dataRegion.x);
    dataRegion.y = parseInt(dataRegion.y);
    dataRegion.z = parseInt(dataRegion.z);

    var dataElements = [<?php echo $elements; ?>];

    <?php echo str_replace('\'obj/', '\'dir_script+ \'../obj/', $data->fonction); ?>
</script>

