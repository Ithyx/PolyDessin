import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterModule } from '@angular/router';

import { MatDialogModule } from '@angular/material';
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
  parametres: []
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

    /*raccourcis.outils = {outilActif: service.listeOutils[0], trouverIndexParametre: service.trouverIndexParametre,
      listeOutils: service.listeOutils, changerOutilActif: service.changerOutilActif};
    raccourcis.dessinRectangle = {rectangleEnCours: raccourcis.dessinRectangle.rectangleEnCours,
      initial: ({x: 0, y: 0}), base: ({x: 0, y: 0}), baseCalculee: ({x: 0, y: 0}), largeur: 0, hauteur: 0, largeurCalculee: 0,
    hauteurCalculee: 0, stockageSVG: 0, }
    raccourcis.dessinLigne*/
  })

  it('should create', () => {
    expect(component).toBeTruthy();
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
    component.onClick(service.listeOutils[2]); // on sélectionne l'outil 2
    expect(component.raccourcis.viderSVGEnCours).toHaveBeenCalled();
  });
});
