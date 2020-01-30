import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CONTENU_GUIDE} from '../page-guide/SujetsGuide';
import { GuideSujet } from './guide-sujet';
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

  it('onNotify()', () => {
    const sujet: GuideSujet = CONTENU_GUIDE[5];
    component.onNotify(sujet);
    expect()
  });
});
