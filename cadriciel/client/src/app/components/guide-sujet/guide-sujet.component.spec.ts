import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { GuideSujetComponent } from './guide-sujet.component';
import { GuideSujet } from './guide-sujet';
import { ContenuGuide } from '../page-guide/SujetsGuide';


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

  it('onNotify()', () => {
    const sujet: GuideSujet = ContenuGuide[5];
    component.onNotify(sujet);
    expect()
  });
});
