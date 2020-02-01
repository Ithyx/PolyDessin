import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CouleurPaletteComponent } from './couleur-palette.component';

describe('CouleurPaletteComponent', () => {
  let component: CouleurPaletteComponent;
  let fixture: ComponentFixture<CouleurPaletteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CouleurPaletteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CouleurPaletteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
