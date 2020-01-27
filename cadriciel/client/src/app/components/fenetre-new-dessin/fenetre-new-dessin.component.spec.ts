import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FenetreNewDessinComponent } from './fenetre-new-dessin.component';

describe('FenetreNewDessinComponent', () => {
  let component: FenetreNewDessinComponent;
  let fixture: ComponentFixture<FenetreNewDessinComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FenetreNewDessinComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FenetreNewDessinComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
