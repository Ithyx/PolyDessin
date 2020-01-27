import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SurfaceDessinComponent } from './surface-dessin.component';

describe('SurfaceDessinComponent', () => {
  let component: SurfaceDessinComponent;
  let fixture: ComponentFixture<SurfaceDessinComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SurfaceDessinComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SurfaceDessinComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
