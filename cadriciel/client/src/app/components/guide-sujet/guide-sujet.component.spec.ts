import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CONTENU_GUIDE} from '../page-guide/guide-contents';
import { GuideSujet } from './subject-guide';
import { GuideSujetComponent } from './guide-sujet.component';

describe('GuideSujetComponent', () => {
  let component: GuideSujetComponent;
  let fixture: ComponentFixture<GuideSujetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GuideSujetComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GuideSujetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // TEST notificationReceived

  it('#notificationReceived() devrait emettre un sujet', () => {
    const sujet: GuideSujet = CONTENU_GUIDE[5];
    spyOn(component.notification, 'emit');

    component.notificationReceived(sujet);
    expect(component.notification.emit).toHaveBeenCalledWith(sujet);
  });

  // TESTS clic

  it('#clic() est appelé sur un sujet alors celui-ci doit être émit via notification', () => {
    component.node = CONTENU_GUIDE[0];   // Sujet de Bienvenue
    spyOn(component.notification, 'emit');

    component.clic();

    expect(component.notification.emit).toHaveBeenCalledWith(CONTENU_GUIDE[0]);
  })

  it('#clic() est appelé sur une catégorie alors celle-ci devrait être ouverte', () => {
      component.node = CONTENU_GUIDE[1];   // Catégorie des outils
      component.node.categorieOuverte = false;
      component.clic();
      expect(component.node.categorieOuverte).toBe(true);
  });

});
