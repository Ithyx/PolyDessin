import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AvertissementNouveauDessinComponent } from './avertissement-nouveau-dessin.component';

describe('AvertissementNouveauDessinComponent', () => {
  let component: AvertissementNouveauDessinComponent;
  let fixture: ComponentFixture<AvertissementNouveauDessinComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AvertissementNouveauDessinComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AvertissementNouveauDessinComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
