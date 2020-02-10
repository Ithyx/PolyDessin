import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ValeurCouleurComponent } from './valeur-couleur.component';

describe('ValeurCouleurComponent', () => {
  let component: ValeurCouleurComponent;
  let fixture: ComponentFixture<ValeurCouleurComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ValeurCouleurComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ValeurCouleurComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
