import { async, ComponentFixture, TestBed } from '@angular/core/testing';
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
  parametres: []
};
const outilTestInactif: OutilDessin = {
  nom: 'stubInactif',
  estActif: false,
  ID: 1,
  parametres: []
};
const GestionnaireOutilServiceStub: Partial<GestionnaireOutilsService> = {
  listeOutils: [
    outilTestActif,
    outilTestInactif
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
    ])]
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
    service.listeOutils[0].estActif = true;
    service.listeOutils[1].estActif = false;
  })

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('#onClick devrait changer d\'outil', () => {
    // on lui demande de changer à l'outil 2
    component.onClick(service.listeOutils[1]);
    // on vérifie que l'outil actif est bien le deuxième
    expect(service.outilActif).toBe(service.listeOutils[1]);
  });

  it('#onClick devrait mettre le nouvel outil sélectionné comme actif', () => {
    // on lui demande de changer à l'outil 2
    component.onClick(service.listeOutils[1]);
    // on vérifie que le nouvel outil est bien "actif"
    expect(service.listeOutils[1].estActif).toBe(true);
  })

});
