import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterModule } from '@angular/router';

import { ColorParameterService } from 'src/app/services/color/color-parameter.service';
import { DrawingSurfaceComponent } from './drawing-surface.component';

const parametresCouleurStub: Partial<ColorParameterService> = {
  temporaryBackgroundColor: undefined
};

describe('SurfaceDessinComponent', () => {
  let component: DrawingSurfaceComponent;
  let fixture: ComponentFixture<DrawingSurfaceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DrawingSurfaceComponent ],
      providers: [ {provide: ColorParameterService, useValue: parametresCouleurStub} ],
      imports: [ RouterModule.forRoot([]) ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DrawingSurfaceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
