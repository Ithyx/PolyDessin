import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogModule } from '@angular/material';
import { By } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';

import { GestionnaireOutilsService, OutilDessin } from 'src/app/services/outils/gestionnaire-outils.service';
import { GuideSujetComponent } from '../guide-sujet/guide-sujet.component';
import { OutilDessinComponent } from '../outil-dessin/outil-dessin.component';
import { PageGuideComponent } from '../page-guide/page-guide.component';
import { BarreOutilsComponent } from './barre-outils.component';

/* Service stub pour réduire les dépendances */
const outilTestActif: OutilDessin = {
  nom: 'stubActif',
  estActif: true,
  ID: 0,
  parametres: [{type: 'number', nom: 'Épaisseur', valeur: 5}]
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
  outilActif: outilTestActif
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

  it("#onChange ne devrait pas changer la valeur du paramètre[0](épaisseur) si l'évènement qui lui est donné n'est pas un chiffre", () => {
    const element = fixture.debugElement.query(By.css('input[name="Épaisseur"]')).nativeElement;
    element.value = 'c';
    element.dispatchEvent(new Event('input')); // onChange appelée implicitement
    expect(component.outils.listeOutils[0].parametres[0].valeur).toBe(5);
  });

  // TESTS onSelect

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
    spyOn(component, 'onChampFocus');
    component.avertissementNouveauDessin();
    expect(component.onChampFocus).toHaveBeenCalled();
  });
});
