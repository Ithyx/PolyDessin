import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChoixCouleurComponent } from './choix-couleur.component';

describe('ChoixCouleurComponent', () => {
  let component: ChoixCouleurComponent;
  let fixture: ComponentFixture<ChoixCouleurComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChoixCouleurComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChoixCouleurComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
