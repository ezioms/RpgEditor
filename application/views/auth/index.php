<?php defined('SYSPATH') OR die('No direct access allowed.'); ?>
<div id="barTop"></div>
<h1>Enigma Cube</h1>
<div id="contentLogin">

    <div id="alert"><?php echo $alert; ?></div>

    <div id="logo">
        <img src="<?php echo url::base(); ?>images/template/logo.png" width="964" height="119"/>
    </div>

    <form method="post" action="<?php echo url::site('login'); ?>" id="form">
        <div id="formBg"><img src="<?php echo url::base(); ?>images/template/form.png" width="370" height="186"/></div>
        <div id="formButton"><img src="<?php echo url::base(); ?>images/template/button.png" width="244" height="244"/>
        </div>
        <input name="username" id="username" type="text"/>
        <input name="password" id="password" type="password"/>
        <input name="send" id="send" type="button" data-action="<?php echo url::site('send'); ?>"/>
    </form>

    <div id="instruction"><b>Aucune inscription !</b> Il vous suffit de mettre votre E-mail et un mot de passe.
        <div id="score">Voir les scores</div>
    </div>

</div>


<div id="contentScores">
    <table>
        <tbody>
        <?php foreach ($users as $user) : ?>
            <tr>
                <td class="left"><?php echo ucfirst(strtolower($user->username)); ?></td>
                <td class="right"><?php echo number_format($user->argent); ?> pts</td>
            </tr>
        <?php endforeach ?>
        </tbody>
    </table>
    <div id="return">
        <img src="<?php echo url::base(); ?>images/template/return.png" width="40" height="42"/>
    </div>

</div>
<div id="barBottom"></div>


<audio autoplay="autoplay" id="audio">
    <source src="<?php echo url::base(); ?>audios/ambiance/home.mp3" type="audio/mpeg">
</audio>