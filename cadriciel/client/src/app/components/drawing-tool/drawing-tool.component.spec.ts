import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { DrawingToolComponent } from './drawing-tool.component';

describe('DrawingToolComponent', () => {
  let component: DrawingToolComponent;
  let fixture: ComponentFixture<DrawingToolComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DrawingToolComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DrawingToolComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // TESTS getActiveStatus
  it('#getActiveStatus devrait retourner "active" si tool.isActive est vrai', () => {
    component.tool.isActive = true;
    expect(component.getActiveStatus()).toEqual('active');
  });

  it('#getActiveStatus devrait retourner "inactive" si tool.isActive est faux', () => {
    component.tool.isActive = false;
    expect(component.getActiveStatus()).toEqual('inactive');
  });

});
