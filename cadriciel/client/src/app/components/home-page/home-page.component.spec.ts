import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog, MatDialogConfig, MatDialogModule, MatSidenavModule } from '@angular/material';
import { RouterModule } from '@angular/router';

import { DrawingPageComponent } from '../drawing-page/drawing-page.component';
import { DrawingSurfaceComponent } from '../drawing-surface/drawing-surface.component';
import { DrawingToolComponent } from '../drawing-tool/drawing-tool.component';
import { GalleryComponent } from '../gallery/gallery.component';
import { GuidePageComponent } from '../guide-page/guide-page.component';
import { GuideSubjectComponent } from '../guide-subject/guide-subject.component';
import { NewDrawingWindowComponent } from '../new-drawing-window/new-drawing-window.component';
import { ToolbarComponent } from '../toolbar/toolbar.component';
import { HomePageComponent } from './home-page.component';

// tslint:disable: no-string-literal

describe('HomePageComponent', () => {
  let component: HomePageComponent;
  let fixture: ComponentFixture<HomePageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DrawingPageComponent, GuidePageComponent, HomePageComponent, ToolbarComponent, GuideSubjectComponent,
        DrawingToolComponent, DrawingSurfaceComponent ],
      imports: [ MatSidenavModule, MatDialogModule, RouterModule.forRoot([
        {path: '', component: HomePageComponent},
        {path: 'dessin', component: DrawingPageComponent},
        {path: 'guide', component : GuidePageComponent}
    ])],
    providers: [ MatDialog, MatDialogConfig ]
    });
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HomePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // TEST createDrawing

  it('#createDrawing devrait appeler dialog.open() avec les bons parametres', () => {
    spyOn(component['dialog'], 'open');
    component.createDrawing();
    expect(component['dialog'].open).toHaveBeenCalledWith(NewDrawingWindowComponent, component['dialogConfig']);
  });

  // TEST openGallery

  it('#openGallery devrait appeler dialog.open() avec les bons parametres', () => {
    spyOn(component['dialog'], 'open');
    component.openGallery();
    expect(component['dialog'].open).toHaveBeenCalledWith(GalleryComponent, component['dialogConfig']);
  });

  // TESTS onKeyDown

  it('#onKeyDown devrait appeler createDrawing() si on appuie CTRL+O', () => {
    const keyboard = new KeyboardEvent('keypress', { key: 'o', ctrlKey: true});
    spyOn(component, 'createDrawing');
    component.onKeyDown(keyboard);
    expect(component.createDrawing).toHaveBeenCalled();
  });

  it('#onKeyDown ne devrait rien faire si on appuie seulement sur O', () => {
    const keyboard = new KeyboardEvent('keypress', { key: 'o', ctrlKey: false});
    spyOn(keyboard, 'preventDefault');
    spyOn(component, 'createDrawing');
    component.onKeyDown(keyboard);
    expect(component.createDrawing).not.toHaveBeenCalled();
    expect(keyboard.preventDefault).not.toHaveBeenCalled();
  });

  it('#onKeyDown ne devrait rien faire si on appuie sur CTRL et une autre touche', () => {
    const keyboard = new KeyboardEvent('keypress', { key: 'z', ctrlKey: true});
    spyOn(keyboard, 'preventDefault');
    spyOn(component, 'createDrawing');
    component.onKeyDown(keyboard);
    expect(component.createDrawing).not.toHaveBeenCalled();
    expect(keyboard.preventDefault).not.toHaveBeenCalled();
  });

  it('#onKeyDown ne devrait rien faire si on appuie sur une autre touche', () => {
    const keyboard = new KeyboardEvent('keypress', { key: 'z', ctrlKey: false});
    spyOn(keyboard, 'preventDefault');
    spyOn(component, 'createDrawing');
    component.onKeyDown(keyboard);
    expect(component.createDrawing).not.toHaveBeenCalled();
    expect(keyboard.preventDefault).not.toHaveBeenCalled();
  });

});
