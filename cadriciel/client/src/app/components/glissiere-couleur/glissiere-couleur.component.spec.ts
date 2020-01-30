import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GlissiereCouleurComponent } from './glissiere-couleur.component';

describe('GlissiereCouleurComponent', () => {
  let component: GlissiereCouleurComponent;
  let fixture: ComponentFixture<GlissiereCouleurComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GlissiereCouleurComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GlissiereCouleurComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
