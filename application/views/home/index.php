<?php defined('SYSPATH') OR die('No direct access allowed.'); ?>
<section id="content_loading"></section>
<section id="notifications"></section>


<!-- menu info user -->
<?php if (isset($info_user) && $info_user) echo $info_user; ?>

<!-- la map -->
<section id="noCursor">
    <div id="instructions">
            <span style="font-size:45px">Cliquez pour jouer</span>
        <br/><span style="font-size:16px"><b>Z, Q, S, D ET LES FLECHES</b> = Déplacement</span>
        <br/><span style="font-size:16px"><b>SHIFT</b> = Courrir</span>
            <br/><span style="font-size:16px"><b>ESPACE</b> = Sauter</span>
            <br/><span style="font-size:16px"><b>ENTRER</b> = Permet de faire des actions</span>
        <br/><span style="font-size:16px"><b>SOURIS</b> = Regarder</span>
        <br/><span style="font-size:16px"><b>CLIQUE SOURIS</b> = Sauter</span>
        <br/><span style="font-size:16px"><b>ESC</b> = Réactiver le curseur</span>
        <br/><span style="font-size:16px"><b>ESPACE + Z ou ESPACE + FLECHE HAUT</b> = S'agripper</span>
    </div>
</section>
<section id="content_body"></section>
<section id="alertUser"><img src="<?php echo url::base(); ?>images/template/bg-alert.png"/></section>
<section id="cible"></section>
<section id="content_action"></section>

<div id="debugWebGL"></div>

<div id="editor"><?php echo html::anchor( 'editor', html::image('images/template/editor.png')); ?></div>
