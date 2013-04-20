<?php

defined('SYSPATH') OR die('No direct access allowed.');

class Graphisme_Core
{

    /**
     * Methode : barre graphique represente valeur X
     */
    public function BarreGraphique($valeur = 0, $max_valeur = 0, $taille = 180, $title = false)
    {
        return '<div id="ConteneurGraphique" ' . ($taille ? 'style="width:' . $taille . 'px"' : '') . '>'
            . ($title ? '<div id="infoGraphique">' . ($title !== false ? $title . ' : <span id="valueMoyenneGraph">' . $valeur . '</span>/<span id="valueMaxGraph">' . $max_valeur . '</span>' : '') . '</div>' : false)
            . '<div id="ContenuGraphique" style="width:' . round(100 - (($max_valeur - $valeur) / $max_valeur * 100)) . '%">'
            . '</div>'
            . '</div>';
    }

}