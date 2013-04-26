Enigma Cube
========
[Site officiel](http://www.enigmacube.com) — [Documentation](http://docs.openrpg.fr) — [Forum](http://www.openrpg.fr/forums/85-enigma-cube)

#### Jeu en javascript et PHP ####

Enigma Cube est un jeu en WebGL s'appyant sur les frameworks THREE et sur KOHANA.

[Site officiel de THREE](http://threejs.org/) — [Documentation de THREE](http://threejs.org/docs/) — [Site officiel de KOHANA](http://kohanaframework.org/) — [Documentation de KOHANA](http://docs.openrpg.fr/creer-son-jeu)

Vous devrez résoudre des enigmes pour évoluer dans un monde n'utilisant que des cubes dans le principe de Minecraft et du PixelArt.
Vous aurez aussi l'occassion de discuter avec des habitants qui vous posseront des questions ou vous donneront des informations plus ou moins interressantes.
Il vous faudra donc accomplir des petits défis pour augmenter votre score et figurer dans le top 10 qui se trouve sur la page d'accueil.

### Administration ###

Une administration qui reste dans le principe de tous les CMS mais avec un éditeur 3D pour construire vos différentes carte et y placer des modules tel que la possibilité de changer de carte, placer un défi ou un simple checkpoint.

### Usage ###

Télécharger le script ou se connecter au repository
Vérifier que le fichier de configuration n'est pas présent :

```html
/System/config/database.php
```

Si c'est le cas, veuillez le supprimer

Lancer la page web index.php et vous serez redirectionné vers l'installateur qui s'occupera de faire la configuration de votre jeu.

Vous avez aussi la possibilité de lancer votre server node pour le multi-joueur qui est en cours de création.


### Change log ###


26 avril 2013 - **r8**

* Ajout du clique continu pour l'éditeur admin/public
* Admin + editor du jeu amélioré et prise en charge du bouton ESC pour déplacement de caméra
* Prise en compte de module uniquement pour placer les bots (fini le aléatoire)
* Ajout d'un champ réponse dans la partie article
* Amélioration visuel et éditorial
* Correctif de lien


22 avril 2013 - **r7**

* Read Me
* Mise en place d'un nouvelle position du personnage quand t'il s'agrippe.
* Correctif du grab
* Correctif de l'affichage


21 avril 2013 - **r6**

* Correction bug JUMP
* Correction déplacement
* Calcul différent pour collision entre bots


21 avril 2013 - **r5**

* Variables avec Math.PI
* Loader
* Retrait du gamepad car inutile à mon gout pour le moment (evite de polluer le code)
* Mise à jour SQL
* Correction wording


20 avril 2013 - **r4**

* Correction UI
* Score UI
* Gestion des scores
* Mise à jour des commentaires dans le code


19 avril 2013 - **r3**

* Mise a jour login et browser + mise en place de JQuery 2


17 avril 2013 - **r2**

* Refonte global de la page de login
* optimisation variables


8 avril 2013 - **r1**

* Refonte changement carte
* Réorganisation des fichiers


** Mise en ligne **