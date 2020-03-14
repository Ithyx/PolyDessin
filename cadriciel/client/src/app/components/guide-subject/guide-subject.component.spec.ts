import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { GUIDE_CONTENTS } from '../guide-page/guide-contents';
import { GuideSubjectComponent } from './guide-subject.component';
import { SubjectGuide } from './subject-guide';

// tslint:disable: no-magic-numbers
// tslint:disable: no-string-literal

describe('GuideSujetComponent', () => {
  let component: GuideSubjectComponent;
  let fixture: ComponentFixture<GuideSubjectComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GuideSubjectComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GuideSubjectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // TEST notificationReceived

  it('#notificationReceived() devrait emettre un sujet', () => {
    const sujet: SubjectGuide = GUIDE_CONTENTS[5];
    spyOn(component['notification'], 'emit');

    component.notificationReceived(sujet);
    expect(component['notification'].emit).toHaveBeenCalledWith(sujet);
  });

  // TESTS onClick

  it('#onClick() est appelé sur un sujet alors celui-ci doit être émit via notification', () => {
    component['node'] = GUIDE_CONTENTS[0];   // Sujet de Bienvenue
    spyOn(component['notification'], 'emit');

    component.onClick();

    expect(component['notification'].emit).toHaveBeenCalledWith(GUIDE_CONTENTS[0]);
  });

  it('#onClick() est appelé sur une catégorie alors celle-ci devrait être ouverte', () => {
      component['node'] = GUIDE_CONTENTS[1];   // Catégorie des outils
      component['node'].openCategory = false;
      component.onClick();
      expect(component['node'].openCategory).toBe(true);
  });

});
