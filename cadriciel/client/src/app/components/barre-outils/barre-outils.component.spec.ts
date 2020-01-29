import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterModule } from '@angular/router';

import { GuideSujetComponent } from '../guide-sujet/guide-sujet.component';
import { OutilDessinComponent } from '../outil-dessin/outil-dessin.component';
import { PageGuideComponent } from '../page-guide/page-guide.component';
import { BarreOutilsComponent } from './barre-outils.component';

describe('BarreOutilsComponent', () => {
  let component: BarreOutilsComponent;
  let fixture: ComponentFixture<BarreOutilsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PageGuideComponent, BarreOutilsComponent, OutilDessinComponent, GuideSujetComponent ],
      imports: [ RouterModule.forRoot([
        {path: 'guide', component : PageGuideComponent}
    ])]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BarreOutilsComponent);
    component = fixture.componentInstance;
    component.outils = [
      {nom: 'defaut', estActif: true, idOutil: -1, parametres: []},
      {nom: 'test', estActif: false, idOutil: -2, parametres: []}
    ];
    component.outilActif = component.outils[0];
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('test emit', () => {
    spyOn(component.notifieur, 'emit').and.callThrough();
    component.onNotify(component.outils[1]);
    expect(component.notifieur.emit).toHaveBeenCalledWith(component.outils[1]);
  });

  it("#onNotify l'ancien outil selectionne ne devrait plus etre selectionne", () => {
    component.onNotify(component.outils[1]);
    expect(component.outils[0].estActif).toBe(false);
  });

  it("#onNotify devrait actualiser l'outil actif", () => {
    component.onNotify(component.outils[1]);
    expect(component.outilActif).toEqual(component.outils[1]);
  });

  it("#onNotify devrait actualiser le id de l'outil actif", () => {
    component.onNotify(component.outils[1]);
    expect(component.idOutilActif).toEqual(-2);
  });
});
