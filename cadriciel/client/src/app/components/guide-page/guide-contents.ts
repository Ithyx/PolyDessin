import { SubjectGuide } from '../guide-subject/subject-guide';

// Ce fichier contient les informations du guide, on estime que la limite de ligne n'est pas pertinente pour ce fichier.
// tslint:disable: max-file-line-count

export const GUIDE_CONTENTS: SubjectGuide[] = [
    // Sujet 1
    {
      name: 'Bienvenue',
      id: 1,
      description: `<h1>Bienvenue à PolyDessin! </h1>
                    <hr>
                    <p> PolyDessin est un projet de 2ème année du génie logiciel à Polytechnique Montréal,
                    et consiste en une application web de dessin vectoriel. </p>
                    <p> Vous vous trouvez présentement dans le guide d'utilisation.
                    Celui-ci décrit et explique les différents outils implémentés.</p>
                    <img src="assets/poly.png">`,
      previous: false, next: true
    },
    // Catégorie 1 : Outils
    {
        name: 'Outils',
        description: '',
        previous: false, next: false,
        openCategory: false,
        subSubjects: [
            // Catégorie 2 : Outils de Traçages
            {
                name: 'Traçages',
                description: '',
                previous: false, next: false,
                openCategory: false,
                subSubjects: [
                    // Sujet 2
                    {
                        name: 'Crayon',
                        description: `<h1> Crayon </h1>
                              <hr>
                              <p> Le crayon est l'outil de traçage de base permettant de dessiner de simples traits
                              avec une pointe ronde. L'outil est également accessible en appuyant sur la touche 'c'.</p>
                              <img src="assets/crayon.gif" width="300" height="300">
                              <p> Les paramètres personalisables sont:
                              <li> Épaisseur du trait (en px) </li> </p>`,
                        previous: true, next: true,
                        id: 2
                    },
                    {
                        name: 'Pinceau',
                        description: `<h1> Pinceau </h1>
                              <hr>
                              <p> Le pinceau est très similaire au crayon, mais offre une texture supplémentaire. L'outil est également
                              accessible en appuyant sur la touche 'w'. </p>
                              <img src="assets/pinceau.gif" width="300" height="300">
                              <p> Les paramètres personalisables sont:
                              <li> Épaisseur du trait (en px) </li> <li> Texture du trait </li> </p>`,
                        previous: true, next: true,
                        id: 3
                    },
                    {
                        name: 'Aérosol',
                        description: `<h1> Aérosol </h1>
                                      <hr>
                                      <p> L'aérosol vaporise à des intervalles réguliers des jets de peintures dans un diamètre défini.
                                      L'outil est également accessible en appuyant sur la touche 'a'. Le motif généré est aléatoire à chaque
                                      émission. <p>
                                      <img src="assets/aerosol.gif" width="300" height="300">
                                      <p> Les paramètres personalisables sont:
                                        <li> Diamètre du jet (en px) </li>
                                        <li> Nombre d'émisssion par seconde </li> </p>`,
                        previous: true, next: true,
                        id: 4
                    },
                ]
            },
            // Catégorie 3 : Outils de Formes
            {
                name: 'Formes',
                description: '',
                previous: false, next: false,
                openCategory: false,
                subSubjects: [
                    {
                        name: 'Rectangle',
                        description: `<h1> Rectangle </h1>
                                      <hr>
                                      <p> Après avoir sélectionné l'outil, il suffit à l'utilisateur de "glisser-déposer"
                                      vers la zone de dessin pour créer un rectangle. En maintenant le clic gauche enfoncé,
                                      on peut choisir la forme de notre rectangle en navigant avec la souris. L'outil est également
                                      accessible en appuyant sur la touche '1'. </p>
                                      <img src="assets/rectangle.gif" width="300" height="300">
                                      <p> L'enfoncement de la touche SHIFT transforme le rectangle en cours de création au
                                      carré le plus proche et vice-versa. </p>
                                      <p> Les paramètres personalisables sont:
                                      <li> Épaisseur du trait de coutour (en px) </li> <li> Type de tracé </li> </p>`,
                        previous: true, next: true,
                        id: 5
                    },
                    // Sujet 6
                    {
                        name: 'Ellipse',
                        description: `<h1> Ellipse </h1>
                              <hr>
                              <p> Après avoir sélectionné l'outil, il suffit à l'utilisateur de "glisser-déposer"
                              vers la zone de dessin pour créer une ellipse. En maintenant le clic gauche enfoncé,
                              on peut choisir la forme de notre ellipse en navigant avec la souris. L'outil est également
                              accessible en appuyant sur la touche '2'. </p>
                              <img src="assets/ellipse.gif" width="300" height="300">
                              <p> L'enfoncement de la touche SHIFT transforme l'ellipse en cours de création au
                              cercle le plus proche et vice-versa. </p>
                             <p> Les paramètres personalisables sont:
                                <li> Épaisseur du trait de coutour (en px) </li>
                                <li> Type de tracé </li>
                            </p>`,
                        previous: true, next: true,
                        id: 6
                    },
                    {
                        name: 'Polygone',
                        description: `<h1> Polygone </h1>
                              <hr>
                              <p> Après avoir sélectionné l'outil, il suffit à l'utilisateur de "glisser-déposer"
                              vers la zone de dessin pour créer le polygone. En maintenant le clic gauche enfoncé,
                              on peut choisir la taille en navigant avec la souris. L'outil est également
                              accessible en appuyant sur la touche '3'. </p>
                              <img src="assets/polygon.gif" width="300" height="300">
                              <p> Les paramètres personalisables sont:
                                <li> Épaisseur du trait de coutour (en px) </li>
                                <li> Type de tracé </li>
                                <li> Le nombre de côté (3 à 12) </li>
                              </p>`,
                        previous: true, next: true,
                        id: 7
                    },
                    {
                        name: 'Ligne',
                        description: `<h1> Ligne </h1>
                              <hr>
                              <p> L'outil ligne permet de tracer une ou plusieurs segments d'une ligne. Il suffit, après avoir
                              sélectionné l'outil, de choisir le début de la ligne avec un clic quelque part sur la zone de dessin. Ensuite,
                              chaque nouveau clic fermera le segment en cours pour en débuter un nouveau. Pour terminer la ligne, on
                              effectue un double-clic. L'outil est également accessible en appuyant sur la touche 'l'. </p>
                              <img src="assets/ligne.gif" width="300" height="300">
                              <p> En enfonçant la touche SHIFT, le segment en cours s'aligne avec l'axe des X par rapport à un angle de
                              45 degrés. Il est aussi possible d'annuler la ligne sans son entièreté avec la touche ESPACE. Pour supprimer
                              uniquement le dernier segment (sauf le premier), appuyez sur BACKSPACE.</p>
                              <p> Les paramètres personalisables sont:
                              <li> Épaisseur du trait (en px) </li> <li> Type de jonction </li>
                              <li> Diamètre des jonctions </li></p>`,
                        previous: true, next: true,
                        id: 8
                    },
                ]
            },
            // Catégorie 4 : Outils de Couleurs
            {
                name: 'Couleurs',
                description: '',
                previous: false, next: false,
                openCategory: false,
                subSubjects: [
                    {
                        name: 'Couleur',
                        description: `<h1> Couleur </h1>
                              <hr>
                              <p> L'outil couleur est un paramètre partagé entre tous les outils, il est d'ailleurs disponible dans le
                              panneau paramètre de chacun d'entre eux. Celui-ci offre deux couleurs configurable: la couleur "principale"
                              et la couleur "secondaire" qui sont interversible. </p>
                              <p> Pour choisir une couleur, l'utilisateur peut soit se déplacer sur une palette de couleur ou bien
                              directement marquer des valeurs RGB en hexadécimal de la couleur qu'il souhaite. </p>
                              <p> L'outil se rappelle aussi des 10 dernières couleurs choisis par l'utilisateur. En effectuant un clic droit
                              , l'utilisateur peut changer sa couleur principale et avec un clic gauche, sa couleur secondaire.</p>
                              <p> Les paramètres personalisables sont:
                              <li> Le code RGB </li> <li> L'opacité </li> </p>
                              <img src="assets/couleur1.png" width="300" height="300">
                              <img src="assets/couleur2.png" width="300" height="300">`,
                        previous: true, next: true,
                        id: 9
                    },
                    {
                        name: 'Pipette',
                        description: `<h1> Pipette </h1>
                                      <hr>
                                      <p> L'outil pipette permet de récupérer une couleur déjà présente sur la surface de dessin en
                                      cliquant dessus. La couleur renvoyée est celle-ci du pixel se trouvant sous le pointeur de la souris.
                                      L'outil est également accessible en appuyant sur la touche 'i'. </p>
                                      <p> Si le clic effectué est un clic gauche, la couleur renvoyée sera assignée à la couleur
                                      principale. </p>
                                      <p> Si le clic effectué est un clic droit, la couleur renvoyée sera assignée à la couleur secondaire.
                                      </p>`,
                        previous: true, next: true,
                        id: 10
                    },
                    {
                        name: 'Applicateur de Couleur',
                        description: `<h1> Applicateur de couleur </h1>
                                      <hr>
                                      <p> L'outil applicateur de couleur permet de changer la couleur d'un élément déjà dessiné en cliquant
                                      dessus. L'élément prendra alors la couleur (principale ou secondaire) actuellement en cours.
                                      L'outil est également accessible en appuyant sur la touche 'r'. </p>
                                      <p> Si le clic effectué est un clic gauche, la couleur principale de l'élément sera modifié. </p>
                                      <p> Si le clic effectué est un clic droit, la couleur secondaire de l'élément sera modifié. </p>`
                                      ,
                        previous: true, next: true,
                        id: 11
                    },
                ]
            },
            {
                name: 'Selection',
                description: `<h1> Selection </h1>
                              <hr>
                              <p> L'outil selection permet de sélectionner un ou plusieurs élément dessinés sur la surface de dessin.
                              L'outil est également accessible en appuyant sur la touche 's'. Il y a différentes manières pour sélectionner
                              des éléments:
                                <li> En cliquant sur l'élément à sélectionné</li>
                                <li> En effectuant un glisser-déposé, ce qui créra un rectangle de sélection. Toute boîte englobante des
                                éléments en collision avec ce rectangle sera alors considéré comme sélectionnés.  </li>
                              </p>
                              <p> Un élément sélectionné sera encadré par une boîte de sélection posèdant 4 points de contrôles. </p>
                              <img src="assets/selection.png" width="300" height="300">
                              <p> À noté que les opérations de sélection doit se faire avec le clic gauche.
                              Le clic droit permet d'effectuer une inversion de sélection. Les éléments touchés prennent alors l'état
                              inverse (un élément sélectionné devient non-sélectionné et vice-versa). </p>
                              <p> Il est possible de sélectionner l'ensemble des éléments dessinés avec le raccourci 'CTRL+A'. </p>
                              <p> La sélection permet alors de bouger les éléments à l'aide de soit la souris soit du clavier avec
                              les flèches directionnelles. </p>
                              <img src="assets/selection.gif" width="300" height="300">`,
                previous: true, next: true,
                id: 12
            },
            {
                name: 'Efface',
                description: `<h1> Efface </h1>
                              <hr>
                              <p> L'outil efface permet d'effacer des éléments dessinés. Il est peut-être soit être utilisé comme une
                              brosse ou avec un simple clic. Les éléments qui seront supprimés par l'efface sont mis en évidence à l'aide
                              d'un coutour rouge. L'outil est également accessible en appuyant sur la touche 'e'. </p>
                              <img src="assets/efface.gif" width="300" height="300">
                              <p> Les paramètres personalisables sont:
                              <li> Épaisseur de l'efface  (en px) </li> </p>`,
                previous: true, next: true,
                id: 13
            },
            {
                name: 'Grille',
                description: `<h1> Grille </h1>
                              <hr>
                              <p> Il est possible de faire apparaitre une grille sur l'ensemble de la surface de dessin
                              via l'option "Options de grille" ou encore avec le raccourci 'G'. </p>
                              <p> Les paramètres personalisables sont:
                                <li> Épaisseur du trait (en px) </li>
                                <li> Opacité de la grille (en %) </li>
                                <li> Largeur des cellules de la grille (en px) </li>
                              </p>
                              <p> Deux autres raccourcis sont disponibles pour facilement changer la largeur des cellules
                              de la grille: </p>
                              <p> '+' pour agrandir la largeur de 5 px </p>
                              <p> '-' pour diminuer la largeur de 5 px </p>
                              <img src="assets/grille.png" width="300" height="300">`,
                previous: true, next: true,
                id: 14
            },
            {
                name: 'Sceau de Peinture',
                description: '',
                previous: true, next: true,
                id: 15
            }
        ]
    },
    {
        name: 'Gestion de Dessin',
        description: '',
        previous: false, next: false,
        openCategory: false,
        subSubjects: [
            {
                name: 'Nouveau Dessin',
                description: `<h1> Nouveau Dessin </h1>
                              <hr>
                              <p> Il est possible de créer un nouveau dessin soit à partir de la page d'accueil ou bien la page de dessin
                              via l'option "Nouveau Dessin". Il est également possible d'appeler la fenêtre de création de dessin via le
                              raccourci 'CTRL+O'. La hauteur et la largeur de la surface du nouveau dessin sont paramétrable (les valeurs
                              par défaut seront celle de votre écran). La couleur de l,arrière-plan est elle aussi modifiable. </p>
                              <img src="assets/nouveau dessin.png" width="500" height="300">`,
                previous: true, next: true,
                id: 16
            },
            {
                name: 'Sauvegarde',
                description: `<h1> Sauvegarde </h1>
                              <hr>
                              <p> Il est possible de sauvegarder le dessin dans la galerie via l'option "Sauvegarder le dessin" ou
                              encore avec le raccourci 'CTRL+S'. Un menu de sauvagerde s'ouvrira alors. Pour être sauvegarder, le dessin
                              doit avoir un nom. Afin de pouvoir facilement retrouver le dessin dans la galerie, il est possible d'y
                              accrocher des étiquettes. L'utilisateur peut personalisé ses équittes ou utilisés les étiquettes suivantes:
                                <li> Portrait </li>
                                <li> Paysage </li>
                                <li> Pixel Art </li>
                                <li> Futuriste </li>
                                <li> Minimaliste </li>
                              </p>
                              <img src="assets/sauvegarde.png" width="500" height="300">`,
                previous: true, next: true,
                id: 17
            },
            {
                name: 'Galerie',
                description: `<h1> Galerie </h1>
                              <hr>
                              <p> Les dessins sauvegardés sont stockés dans la galerie. Il est possible d'y accéder soit à partir de la
                              page d'accueil ou bien la page de dessin via l'option "Galerie". Il est également possible d'appeler la
                              fenêtre de galerie via le raccourci 'CTRL+G'. Les dessins peuvent être re-charger ou bien supprimer.
                               Si les dessins ont été sauvegardé avec une étiquette, une option de filtre est disponible de faciliter la
                               rechercher. </p>
                               <img src="assets/galerie.png" width="800" height="300">`,
                previous: true, next: true,
                id: 18
            },
            {
                name: 'Exportation',
                description: `<h1> Exportation </h1>
                              <hr>
                              <p> Il est possible d'exporter son dessin localement via l'option "Exporter le dessin" ou encore avec le
                              raccourci CTRL+E.
                              Un menu d'exportation s'ouvrira alors, contenant le dessin. Le dessin peut-être nommée selon le
                              choix de l'utilisateur. Si aucun nom n'est spécifié, il portera celcui de "téléchargement" par défaut. <p>
                              <p> Trois formats d'exportation sont disponible:
                                    <li> JPEG </li>
                                    <li> PNG </li>
                                    <li> SVG </li></p>
                              </p>
                              <p> Il est également possible d'appliquer un filtre lors de l'exporation du dessin.
                              Cinq filtes sont disponibles:
                                    <li> Noir-et-Blanc </li>
                                    <li> Sépia </li>
                                    <li> Flou </li>
                                    <li> Tache </li>
                                    <li> Tremblant </li></p>
                              </p>`,
                previous: true, next: true,
                id: 19
            },
        ]
      },
      {
          name: 'Fonctionnalités',
          description: '',
          previous: false, next: false,
          openCategory: false,
          subSubjects: [
              {
                  name: 'Presse-Papier',
                  description: '',
                  previous: true, next: true,
                  id: 20
              },
              {
                  name: 'Annuler-Refaire',
                  description: `<h1> Annuler-Refaire </h1>
                                <hr>
                                <p> Il est possible d'annuler refaire les dernières actions convernant l'ajouter, la
                                suppression et la modification des éléments dessinnés </p>
                                <p> Les modifications d'un élément concerne:
                                  <li> Changer la couleur d'un élément </li>
                                  <li> Bouger une sélection </li>
                                </p>
                                <p> Il est possible d'annuler une action avec le raccourci 'CTRL+Z'. </p>
                                <p> Il est possible de refaire une action avec le raccourci 'CTRL+SHIFT+Z'. </p>`,
                  previous: true, next: true,
                  id: 21
              }
          ]
      },
      {
          name: 'Bonus',
          description: '',
          previous: true, next: false,
          id: 22
      }
];
