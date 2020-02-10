import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogModule } from '@angular/material';
import { RouterModule } from '@angular/router';

import { GestionnaireOutilsService, OutilDessin } from 'src/app/services/outils/gestionnaire-outils.service';
import { InterfaceOutils } from 'src/app/services/outils/interface-outils';
import { BarreOutilsComponent } from '../barre-outils/barre-outils.component';
import { GuideSujetComponent } from '../guide-sujet/guide-sujet.component';
import { OutilDessinComponent } from '../outil-dessin/outil-dessin.component';
import { PageGuideComponent } from '../page-guide/page-guide.component';
import { SurfaceDessinComponent } from '../surface-dessin/surface-dessin.component';
import { PageDessinComponent } from './page-dessin.component';

/* Service stub pour réduire les dépendances */
const outilTestActif: OutilDessin = {
  nom: 'stubComplet',
  estActif: true,
  ID: 0,
  parametres: []
};
const outilTestInactif: OutilDessin = {
  nom: 'stubVide',
  estActif: false,
  ID: 1,
  parametres: []
};
const outilTestInexistant: OutilDessin = {
  nom: 'stubInexistant',
  estActif: false,
  ID: 2,
  parametres: []
};
const GestionnaireOutilServiceStub: Partial<GestionnaireOutilsService> = {
  listeOutils: [
    outilTestActif,
    outilTestInactif,
    outilTestInexistant
  ],
  outilActif: outilTestActif
}
class StubOutil implements InterfaceOutils {
  sourisDeplacee(evenement: MouseEvent) {/**/}
  sourisRelachee(evenement: MouseEvent) {/**/}
  sourisEnfoncee(evenement: MouseEvent) {/**/}
  sourisCliquee(evenement: MouseEvent) {/**/}
  sourisSortie(evenement: MouseEvent) {/**/}
  sourisEntree(evenement: MouseEvent) {/**/}
  sourisDoubleClic(evenement: MouseEvent) {/**/}
}

describe('PageDessinComponent', () => {
  let component: PageDessinComponent;
  let fixture: ComponentFixture<PageDessinComponent>;
  let service: GestionnaireOutilsService;
  const stubOutilActif = new StubOutil();

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ MatDialogModule, RouterModule.forRoot([
        {path: 'dessin', component: PageDessinComponent},
        {path: 'guide', component : PageGuideComponent}
      ])],
      providers: [ {provide: GestionnaireOutilsService, useValue: GestionnaireOutilServiceStub} ],
      declarations: [ PageDessinComponent, PageGuideComponent, BarreOutilsComponent,
        OutilDessinComponent, SurfaceDessinComponent, GuideSujetComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PageDessinComponent);
    component = fixture.componentInstance;
    service = fixture.debugElement.injector.get(GestionnaireOutilsService);
    fixture.detectChanges();
    service.listeOutils[0].estActif = true;
    service.listeOutils[1].estActif = false;
    service.outilActif = service.listeOutils[0];
    component.lexiqueOutils.set('stubComplet', stubOutilActif)
                           .set('stubVide', {});
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // TESTS RACCOURCIS CLAVIER

  it("#toucheEnfoncee devrait passer l'evenement au gestionnaire de raccourcis", () => {
    spyOn(component.raccourcis, 'traiterInput');
    const evenement = new KeyboardEvent('keydown', {key: 'test'});
    component.toucheEnfoncee(evenement);
    expect(component.raccourcis.traiterInput).toHaveBeenCalledWith(evenement);
  });
  it("#toucheRelachee devrait passer l'evenement au gestionnaire de raccourcis", () => {
    spyOn(component.raccourcis, 'traiterToucheRelachee');
    const evenement = new KeyboardEvent('keyup', {key: 'test'});
    component.toucheRelachee(evenement);
    expect(component.raccourcis.traiterToucheRelachee).toHaveBeenCalledWith(evenement);
  });

  // TESTS SOURIS CLIQUEE

  it("#sourisCliquee devrait appeler sourisCliquee de l'outil actif si cette fonction existe", () => {
    spyOn(stubOutilActif, 'sourisCliquee');
    const evenement = new MouseEvent('click', { clientX: 0, clientY: 0 });
    component.sourisCliquee(evenement);
    expect(stubOutilActif.sourisCliquee).toHaveBeenCalledWith(evenement);
  });
  it('#sourisCliquee ne devrait rien faire si la fonction sourisCliquee' +
    " de l'outil actif n'existe pas", () => {
    spyOn(stubOutilActif, 'sourisCliquee');
    service.outilActif = service.listeOutils[1];
    component.sourisCliquee(new MouseEvent('click'));
    expect(stubOutilActif.sourisCliquee).not.toHaveBeenCalled();
  });
  it("#sourisCliquee ne devrait rien faire si l'outil actif n'exsite pas" +
    " dans le lexique d'outils", () => {
    spyOn(stubOutilActif, 'sourisCliquee');
    service.outilActif = service.listeOutils[2];
    component.sourisCliquee(new MouseEvent('click'));
    expect(stubOutilActif.sourisCliquee).not.toHaveBeenCalled();
  });

  // TESTS SOURIS DEPLACEE

  it("#sourisDeplacee devrait appeler sourisDeplacee de l'outil actif si cette fonction existe", () => {
    spyOn(stubOutilActif, 'sourisDeplacee');
    const evenement = new MouseEvent('mousemove', { clientX: 0, clientY: 0 });
    component.sourisDeplacee(evenement);
    expect(stubOutilActif.sourisDeplacee).toHaveBeenCalledWith(evenement);
  });
  it('#sourisDeplacee ne devrait rien faire si la fonction sourisDeplacee' +
    " de l'outil actif n'existe pas", () => {
    spyOn(stubOutilActif, 'sourisDeplacee');
    service.outilActif = service.listeOutils[1];
    component.sourisDeplacee(new MouseEvent('mousemove'));
    expect(stubOutilActif.sourisDeplacee).not.toHaveBeenCalled();
  });
  it("#sourisDeplacee ne devrait rien faire si l'outil actif n'exsite pas" +
    " dans le lexique d'outils", () => {
    spyOn(stubOutilActif, 'sourisDeplacee');
    service.outilActif = service.listeOutils[2];
    component.sourisDeplacee(new MouseEvent('mousemove'));
    expect(stubOutilActif.sourisDeplacee).not.toHaveBeenCalled();
  });

  // TESTS SOURIS ENFONCEE

  it("#sourisEnfoncee devrait appeler sourisEnfoncee de l'outil actif si cette fonction existe", () => {
    spyOn(stubOutilActif, 'sourisEnfoncee');
    const evenement = new MouseEvent('mousedown', { clientX: 0, clientY: 0 });
    component.sourisEnfoncee(evenement);
    expect(stubOutilActif.sourisEnfoncee).toHaveBeenCalledWith(evenement);
  });
  it('#sourisEnfoncee ne devrait rien faire si la fonction sourisEnfoncee' +
    " de l'outil actif n'existe pas", () => {
    spyOn(stubOutilActif, 'sourisEnfoncee');
    service.outilActif = service.listeOutils[1];
    component.sourisEnfoncee(new MouseEvent('mousedown'));
    expect(stubOutilActif.sourisEnfoncee).not.toHaveBeenCalled();
  });
  it("#sourisEnfoncee ne devrait rien faire si l'outil actif n'exsite pas" +
    " dans le lexique d'outils", () => {
    spyOn(stubOutilActif, 'sourisEnfoncee');
    service.outilActif = service.listeOutils[2];
    component.sourisEnfoncee(new MouseEvent('mousedown'));
    expect(stubOutilActif.sourisEnfoncee).not.toHaveBeenCalled();
  });

  // TESTS SOURIS RELACHEE

  it("#sourisRelachee devrait appeler sourisRelachee de l'outil actif si cette fonction existe", () => {
    spyOn(stubOutilActif, 'sourisRelachee');
    const evenement = new MouseEvent('mouseup', { clientX: 0, clientY: 0 });
    component.sourisRelachee(evenement);
    expect(stubOutilActif.sourisRelachee).toHaveBeenCalledWith(evenement);
  });
  it('#sourisRelachee ne devrait rien faire si la fonction sourisRelachee' +
    " de l'outil actif n'existe pas", () => {
    spyOn(stubOutilActif, 'sourisRelachee');
    service.outilActif = service.listeOutils[1];
    component.sourisRelachee(new MouseEvent('mouseup'));
    expect(stubOutilActif.sourisRelachee).not.toHaveBeenCalled();
  });
  it("#sourisRelachee ne devrait rien faire si l'outil actif n'exsite pas" +
    " dans le lexique d'outils", () => {
    spyOn(stubOutilActif, 'sourisRelachee');
    service.outilActif = service.listeOutils[2];
    component.sourisRelachee(new MouseEvent('mouseup'));
    expect(stubOutilActif.sourisRelachee).not.toHaveBeenCalled();
  });

  // TESTS SOURIS SORTIE

  it("#sourisSortie devrait appeler sourisSortie de l'outil actif si cette fonction existe", () => {
    spyOn(stubOutilActif, 'sourisSortie');
    const evenement = new MouseEvent('mouseleave', { clientX: 0, clientY: 0 });
    component.sourisSortie(evenement);
    expect(stubOutilActif.sourisSortie).toHaveBeenCalledWith(evenement);
  });
  it('#sourisSortie ne devrait rien faire si la fonction sourisSortie' +
    " de l'outil actif n'existe pas", () => {
    spyOn(stubOutilActif, 'sourisSortie');
    service.outilActif = service.listeOutils[1];
    component.sourisSortie(new MouseEvent('mouseleave'));
    expect(stubOutilActif.sourisSortie).not.toHaveBeenCalled();
  });
  it("#sourisSortie ne devrait rien faire si l'outil actif n'exsite pas" +
    " dans le lexique d'outils", () => {
    spyOn(stubOutilActif, 'sourisSortie');
    service.outilActif = service.listeOutils[2];
    component.sourisSortie(new MouseEvent('mouseleave'));
    expect(stubOutilActif.sourisSortie).not.toHaveBeenCalled();
  });

  // TESTS SOURIS ENTREE

  it("#sourisEntree devrait appeler sourisEntree de l'outil actif si cette fonction existe", () => {
    spyOn(stubOutilActif, 'sourisEntree');
    const evenement = new MouseEvent('mouseenter', { clientX: 0, clientY: 0 });
    component.sourisEntree(evenement);
    expect(stubOutilActif.sourisEntree).toHaveBeenCalledWith(evenement);
  });
  it('#sourisEntree ne devrait rien faire si la fonction sourisEntree' +
    " de l'outil actif n'existe pas", () => {
    spyOn(stubOutilActif, 'sourisEntree');
    service.outilActif = service.listeOutils[1];
    component.sourisEntree(new MouseEvent('mouseenter'));
    expect(stubOutilActif.sourisEntree).not.toHaveBeenCalled();
  });
  it("#sourisEntree ne devrait rien faire si l'outil actif n'exsite pas" +
    " dans le lexique d'outils", () => {
    spyOn(stubOutilActif, 'sourisEntree');
    service.outilActif = service.listeOutils[2];
    component.sourisEntree(new MouseEvent('mouseenter'));
    expect(stubOutilActif.sourisEntree).not.toHaveBeenCalled();
  });

  // TESTS SOURIS DOUBLE CLIC

  it("#sourisDoubleClic devrait appeler sourisDoubleClic de l'outil actif si cette fonction existe", () => {
    spyOn(stubOutilActif, 'sourisDoubleClic');
    const evenement = new MouseEvent('dblclick', { clientX: 0, clientY: 0 });
    component.sourisDoubleClic(evenement);
    expect(stubOutilActif.sourisDoubleClic).toHaveBeenCalledWith(evenement);
  });
  it('#sourisDoubleClic ne devrait rien faire si la fonction sourisDoubleClic' +
    " de l'outil actif n'existe pas", () => {
    spyOn(stubOutilActif, 'sourisDoubleClic');
    service.outilActif = service.listeOutils[1];
    component.sourisDoubleClic(new MouseEvent('dblclick'));
    expect(stubOutilActif.sourisDoubleClic).not.toHaveBeenCalled();
  });
  it("#sourisDoubleClic ne devrait rien faire si l'outil actif n'exsite pas" +
    " dans le lexique d'outils", () => {
    spyOn(stubOutilActif, 'sourisDoubleClic');
    service.outilActif = service.listeOutils[2];
    component.sourisDoubleClic(new MouseEvent('dblclick'));
    expect(stubOutilActif.sourisDoubleClic).not.toHaveBeenCalled();
  });
});
