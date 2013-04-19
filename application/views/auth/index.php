<?php defined('SYSPATH') OR die('No direct access allowed.'); ?>

<div id="alert"><?php echo $alert; ?></div>
<div id="container"></div>

<div id="logo">
    <img src="<?php echo url::base(); ?>images/template/logo.png" width="964" height="119"/>
</div>

<form method="post" action="<?php echo url::site('login'); ?>" id="form">
    <div id="formBg"><img src="<?php echo url::base(); ?>images/template/form.png" width="370" height="186"/></div>
    <div id="formButton"><img src="<?php echo url::base(); ?>images/template/button.png" width="244" height="244"/></div>
    <input name="username" id="username" type="text"/>
    <input name="password" id="password" type="password"/>
    <input name="send" id="send" type="button" data-action="<?php echo url::site('send'); ?>"/>
</form>

<div id="score">
    <a href="<?php echo url::site('score'); ?>"><img src="<?php echo url::base(); ?>images/template/score.png" width="291" height="37"/></a>
</div>

