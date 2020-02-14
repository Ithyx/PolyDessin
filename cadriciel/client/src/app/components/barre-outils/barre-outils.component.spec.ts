import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogConfig, MatDialogModule } from '@angular/material';
import { By } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';

import { GestionnaireOutilsService, OutilDessin } from 'src/app/services/outils/gestionnaire-outils.service';
import { AvertissementNouveauDessinComponent } from '../avertissement-nouveau-dessin/avertissement-nouveau-dessin.component';
import { GuideSujetComponent } from '../guide-sujet/guide-sujet.component';
import { OutilDessinComponent } from '../outil-dessin/outil-dessin.component';
import { PageGuideComponent } from '../page-guide/page-guide.component';
import { BarreOutilsComponent } from './barre-outils.component';

/* Service stub pour réduire les dépendances */
const outilTestActif: OutilDessin = {
  nom: 'stubActif',
  estActif: true,
  ID: 0,
  parametres: [{type: 'number', nom: 'Épaisseur', valeur: 5},
               {type: 'select', nom: 'Type', options: ['A', 'B'], optionChoisie: 'A'}]
};

const outilTestInactif: OutilDessin = {
  nom: 'stubInactif',
  estActif: false,
  ID: 1,
  parametres: []
};

const rectangle: OutilDessin = {
  nom: 'stubRectangle',
  estActif: false,
  ID: 2,
  parametres: []
};

const GestionnaireOutilServiceStub: Partial<GestionnaireOutilsService> = {
  listeOutils: [
    outilTestActif,
    outilTestInactif,
    rectangle
  ],
  outilActif: outilTestActif,
  trouverIndexParametre(nomParametre) {
    return (nomParametre === 'Épaisseur') ? 0 : 1;
  }
}

describe('BarreOutilsComponent', () => {
  let component: BarreOutilsComponent;
  let fixture: ComponentFixture<BarreOutilsComponent>;
  let service: GestionnaireOutilsService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PageGuideComponent, BarreOutilsComponent, OutilDessinComponent, GuideSujetComponent ],
      providers: [ {provide: GestionnaireOutilsService, useValue: GestionnaireOutilServiceStub} ],
      imports: [ RouterModule.forRoot([
        {path: 'guide', component : PageGuideComponent}
    ]), MatDialogModule]
    })
    .compileComponents();
  }));
  beforeEach(() => {
    fixture = TestBed.createComponent(BarreOutilsComponent);
    component = fixture.componentInstance;
    service = fixture.debugElement.injector.get(GestionnaireOutilsService);
    fixture.detectChanges();
  });
  beforeEach(() => {
    service.listeOutils[0].estActif = true; // outil crayon
    service.listeOutils[1].estActif = false; // outil pinceau
    service.listeOutils[2].estActif = false; // outil rectangle
  })

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // TESTS ngOnDestroy

  it('#ngOnDestroy devrait appeler la fonction unsubscribe', () => {
    spyOn(component, 'avertissementNouveauDessin');
    component.ngOnDestroy();  // unsubscribe est appelée ici

    const toucheEnfoncee = new KeyboardEvent('keypress', { key: 'o', ctrlKey: true});
    component.raccourcis.traiterInput(toucheEnfoncee);

    // on teste que avertissementNouveauDessin n'est plus lié aux raccourcis
    expect(component.avertissementNouveauDessin).not.toHaveBeenCalled();
  });

  it('#ngOnDestroy devrait appeler la fonction next avec un booleen true comme paramètre', () => {
    spyOn(component.raccourcis.emitterNouveauDessin, 'next');
    component.ngOnDestroy();
    expect(component.raccourcis.emitterNouveauDessin.next).toHaveBeenCalledWith(true);
  });

  // TESTS onClick

  it('#onClick devrait changer d\'outil', () => {
    component.onClick(service.listeOutils[1]); // on sélectionne l'outil 2
    expect(service.outilActif).toBe(service.listeOutils[1]); // on vérifie que l'outil actif est bien le deuxième
  });

  it('#onClick devrait mettre le nouvel outil sélectionné comme actif', () => {
    component.onClick(service.listeOutils[1]); // on sélectionne l'outil 2
    expect(service.listeOutils[1].estActif).toBe(true); // on vérifie que le nouvel outil est bien "actif"
  });

  it('#onClick devrait appeler la fonction viderSVGEnCours', () => {
    spyOn(component.raccourcis, 'viderSVGEnCours');
    component.onClick(service.listeOutils[2]); // on sélectionne l'outil 2 (rectangle)
    expect(component.raccourcis.viderSVGEnCours).toHaveBeenCalled();
  });

  // TESTS onChange

  it("#onChange ne devrait pas changer la valeur de l'épaisseur si l'évènement qui lui est donné n'est pas un chiffre", () => {
    const element = fixture.debugElement.query(By.css('input[name="Épaisseur"]')).nativeElement;
    element.value = 'c';
    element.dispatchEvent(new Event('input')); // onChange appelée implicitement
    expect(component.outils.outilActif.parametres[0].valeur).toBe(5);
  });

  it('#onChange devrait changer la valeur de l\'épaisseur si l\'évènement qui lui est donné est un chiffre', () => {
    const element = fixture.debugElement.query(By.css('input[name="Épaisseur"]')).nativeElement;
    element.value = '1';
    element.dispatchEvent(new Event('change')); // onChange appelée implicitement
    expect(component.outils.outilActif.parametres[0].valeur).toBe(1);
  });

  it('#onChange devrait changer la valeur de l\'épaisseur à 1 si l\'évènement qui lui est donné est inférieur à 1', () => {
    const element = fixture.debugElement.query(By.css('input[name="Épaisseur"]')).nativeElement;
    element.value = '0';
    element.dispatchEvent(new Event('change')); // onChange appelée implicitement
    expect(component.outils.outilActif.parametres[0].valeur).toBe(1);
  });

  // TESTS onSelect

  it('#onSelect ne devrait pas changer la valeur du paramètre si l\'évènement qui lui est donné n\'est pas un string', () => {
    const element = fixture.debugElement.query(By.css('select[name="Type"]')).nativeElement;
    element.dispatchEvent(new Event('change')); // onSelect appelée implicitement
    expect(component.outils.outilActif.parametres[1].optionChoisie).toBe('A');
  });

  it('#onSelect devrait changer la valeur du paramètre si l\'évènement qui lui est donné est un string', () => {
    const element = fixture.debugElement.query(By.css('select[name="Type"]')).nativeElement;
    element.value = 'B';
    element.dispatchEvent(new Event('change')); // onSelect appelée implicitement
    expect(component.outils.outilActif.parametres[1].optionChoisie).toBe('B');
  });

  // TESTS onChampFocus

  it('#onChampFocus devrait assigner vrai à champDeTexteEstFocus', () => {
    component.raccourcis.champDeTexteEstFocus = false;
    component.onChampFocus();
    expect(component.raccourcis.champDeTexteEstFocus).toBe(true);
  });

  // TESTS onChampBlur

  it('#onChampBlur devrait assigner faux à champDeTexteEstFocus', () => {
    component.raccourcis.champDeTexteEstFocus = true;
    component.onChampBlur();
    expect(component.raccourcis.champDeTexteEstFocus).toBe(false);
  });

  // TESTS avertissementNouveauDessin

  it('#avertissementNouveauDessin devrait appeler onChampFocus', () => {
    spyOn(component.dialog, 'open');
    spyOn(component, 'onChampFocus');
    component.avertissementNouveauDessin();
    expect(component.onChampFocus).toHaveBeenCalled();
  });

  it('#avertissementNouveauDessin devrait appeler open avec AvertissementNouveauDessinComponent et dialogConfig comme paramètres', () => {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '60%';
    spyOn(component.dialog, 'open');
    component.avertissementNouveauDessin();
    expect(component.dialog.open).toHaveBeenCalledWith(AvertissementNouveauDessinComponent, dialogConfig);
  });

  // TESTS selectionCouleur

  // TESTS selectionDerniereCouleurPrimaire

  it('#selectionDerniereCouleurPrimaire devrait assigner sa couleur en paramètre à couleurPrincipale', () => {
    component.couleur.couleurPrincipale = 'rgba(0, 0, 0, ';
    component.selectionDerniereCouleurPrimaire('rgba(1, 1, 1, ');
    expect(component.couleur.couleurPrincipale).toEqual('rgba(1, 1, 1, ');
  });

  // TESTS selectionDerniereCouleurSecondaire

  it('#selectionDerniereCouleurSecondaire devrait assigner sa couleur en paramètre à couleurSecondaire', () => {
    component.couleur.couleurSecondaire = 'rgba(0, 0, 0, ';
    component.selectionDerniereCouleurSecondaire('rgba(1, 1, 1, ', new MouseEvent ('click'));
    expect(component.couleur.couleurSecondaire).toEqual('rgba(1, 1, 1, ');
  });

  it("#selectionDerniereCouleurSecondaire devrait s'assurer que preventDefault est appelé", () => {
    const evenement = new MouseEvent ('click');
    spyOn(evenement, 'preventDefault')
    component.selectionDerniereCouleurSecondaire('rgba(1, 1, 1, ', evenement);
    expect(evenement.preventDefault).toHaveBeenCalled();
  });

  // TESTS appliquerOpacitePrincipale

  it("#appliquerOpacitePrincipale ne devrait pas changer l'opacité si l'évènement "
    + 'qui lui est donné n\'est pas un nombre', () => {
    const element = fixture.debugElement.query(By.css('input[name="opacite-principale"]')).nativeElement;
    element.value = 'test';
    element.dispatchEvent(new Event('input')); // appliquerOpacitePrincipale appelée implicitement
    expect(component.couleur.opacitePrincipale).toBe(0.5);
  });

  it("#appliquerOpacitePrincipale devrait changer l'opacité si l'évènement "
    + 'qui lui est donné est un nombre', () => {
    const element = fixture.debugElement.query(By.css('input[name="opacite-principale"]')).nativeElement;
    element.value = '0.1';
    element.dispatchEvent(new Event('input')); // appliquerOpacitePrincipale appelée implicitement
    expect(component.couleur.opacitePrincipale).toBe(0.1);
  });

  it("#appliquerOpacitePrincipale devrait changer l'opacité à 0 si la valeur "
    + 'qui lui est donnée est négative', () => {
    const element = fixture.debugElement.query(By.css('input[name="opacite-principale"]')).nativeElement;
    element.value = '-0.1';
    element.dispatchEvent(new Event('input')); // appliquerOpacitePrincipale appelée implicitement
    expect(component.couleur.opacitePrincipale).toBe(0);
  });

  it("#appliquerOpacitePrincipale devrait changer l'opacité à 1 si la valeur "
    + 'qui lui est donnée est supérieure à 1', () => {
    const element = fixture.debugElement.query(By.css('input[name="opacite-principale"]')).nativeElement;
    element.value = '1.1';
    element.dispatchEvent(new Event('input')); // appliquerOpacitePrincipale appelée implicitement
    expect(component.couleur.opacitePrincipale).toBe(1);
  });

  it('#appliquerOpacitePrincipale devrait changer l\'opacité d\'affichage '
  + 'si la valeur entree est conforme', () => {
    const element = fixture.debugElement.query(By.css('input[name="opacite-principale"]')).nativeElement;
    element.value = '0.75';
    element.dispatchEvent(new Event('input')); // appliquerOpacitePrincipale appelée implicitement
    expect(component.couleur.opacitePrincipaleAffichee).toBe(75);
  });

  // TESTS appliquerOpaciteSecondaire

  it("#appliquerOpaciteSecondaire ne devrait pas changer l'opacité si l'évènement "
    + 'qui lui est donné n\'est pas un nombre', () => {
    const element = fixture.debugElement.query(By.css('input[name="opacite-secondaire"]')).nativeElement;
    element.value = 'test';
    element.dispatchEvent(new Event('input')); // appliquerOpaciteSecondaire appelée implicitement
    expect(component.couleur.opaciteSecondaire).toBe(0.5);
  });

  it("#appliquerOpaciteSecondaire devrait changer l'opacité si l'évènement "
    + 'qui lui est donné est un nombre', () => {
    const element = fixture.debugElement.query(By.css('input[name="opacite-secondaire"]')).nativeElement;
    element.value = '0.1';
    element.dispatchEvent(new Event('input')); // appliquerOpaciteSecondaire appelée implicitement
    expect(component.couleur.opaciteSecondaire).toBe(0.1);
  });

  it("#appliquerOpaciteSecondaire devrait changer l'opacité à 0 si la valeur "
    + 'qui lui est donnée est négative', () => {
    const element = fixture.debugElement.query(By.css('input[name="opacite-secondaire"]')).nativeElement;
    element.value = '-0.1';
    element.dispatchEvent(new Event('input')); // appliquerOpaciteSecondaire appelée implicitement
    expect(component.couleur.opaciteSecondaire).toBe(0);
  });

  it("#appliquerOpaciteSecondaire devrait changer l'opacité à 1 si la valeur "
    + 'qui lui est donnée est supérieure à 1', () => {
    const element = fixture.debugElement.query(By.css('input[name="opacite-secondaire"]')).nativeElement;
    element.value = '1.1';
    element.dispatchEvent(new Event('input')); // appliquerOpaciteSecondaire appelée implicitement
    expect(component.couleur.opaciteSecondaire).toBe(1);
  });

  it('#appliquerOpaciteSecondaire devrait changer l\'opacité d\'affichage '
  + 'si la valeur entree est conforme', () => {
    const element = fixture.debugElement.query(By.css('input[name="opacite-secondaire"]')).nativeElement;
    element.value = '0.75';
    element.dispatchEvent(new Event('input')); // appliquerOpaciteSecondaire appelée implicitement
    expect(component.couleur.opaciteSecondaireAffichee).toBe(75);
  });
});
