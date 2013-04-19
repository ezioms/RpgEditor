<?php defined('SYSPATH') OR die('No direct access allowed.'); ?>

<div id="container"></div>

<div id="logo">
    <img src="<?php echo url::base(); ?>images/template/logo.png" width="964" height="119"/>
</div>

<table>
    <tbody>
    <?php foreach ($users as $user) : ?>
        <?php if (!$user->argent) continue ?>
        <tr>
            <td class="left"><?php echo $user->username; ?></td>
            <td class="right"><?php echo $user->argent; ?> pts</td>
        </tr>
    <?php endforeach ?>
    </tbody>
</table>

