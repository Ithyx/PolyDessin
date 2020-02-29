import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog, MatDialogConfig, MatDialogModule } from '@angular/material';
import { RouterModule } from '@angular/router';

import { DrawingPageComponent } from '../drawing-page/drawing-page.component';
import { DrawingSurfaceComponent } from '../drawing-surface/drawing-surface.component';
import { DrawingToolComponent } from '../drawing-tool/drawing-tool.component';
import { GuidePageComponent } from '../guide-page/guide-page.component';
import { GuideSubjectComponent } from '../guide-subject/guide-subject.component';
import { NewDrawingWindowComponent } from '../new-drawing-window/new-drawing-window.component';
import { ToolbarComponent } from '../toolbar/toolbar.component';
import { HomePageComponent } from './home-page.component';

describe('AccueilComponent', () => {
  let component: HomePageComponent;
  let fixture: ComponentFixture<HomePageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DrawingPageComponent, GuidePageComponent, HomePageComponent, ToolbarComponent, GuideSubjectComponent,
        DrawingToolComponent, DrawingSurfaceComponent ],
      imports: [ MatDialogModule, RouterModule.forRoot([
        {path: '', component: HomePageComponent},
        {path: 'dessin', component: DrawingPageComponent},
        {path: 'guide', component : GuidePageComponent}
    ]) ],
    providers: [ MatDialog, MatDialogConfig ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HomePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('#creationDessin devrait appeler dialog.open() avec les bons parametres ', () => {
    spyOn(component.dialog, 'open');
    component.createDrawing();
    expect(component.dialog.open).toHaveBeenCalledWith(NewDrawingWindowComponent, component.dialogConfig);
  });

});
