import { HttpClientModule } from '@angular/common/http';
import { NgModule} from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule, MatDialogConfig, MatDialogModule, MatSidenavModule } from '@angular/material';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';

// Component
import { AppComponent } from './components/app/app.component';
import { ColorChoiceComponent } from './components/color-choice/color-choice.component';
import { ColorInputComponent } from './components/color-choice/color-input/color-input.component';
import { ColorPickerComponent } from './components/color-choice/color-picker/color-picker.component';
import { ColorSliderComponent } from './components/color-choice/color-slider/color-slider.component';
import { DrawingPageComponent } from './components/drawing-page/drawing-page.component';
import { DrawingSurfaceComponent } from './components/drawing-surface/drawing-surface.component';
import { DrawingToolComponent } from './components/drawing-tool/drawing-tool.component';
import { ExportWindowComponent } from './components/export-window/export-window.component';
import { GalleryLoadWarningComponent } from './components/gallery-load-warning/gallery-load-warning.component';
import { GalleryElementComponent } from './components/gallery/gallery-element/gallery-element.component';
import { GalleryComponent } from './components/gallery/gallery.component';
import { GridOptionsComponent } from './components/grid-options/grid-options.component';
import { GuidePageComponent } from './components/guide-page/guide-page.component';
import { GuideSubjectComponent } from './components/guide-subject/guide-subject.component';
import { HomePageComponent } from './components/home-page/home-page.component';
import { NewDrawingWarningComponent } from './components/new-drawing-warning/new-drawing-warning.component';
import { NewDrawingWindowComponent } from './components/new-drawing-window/new-drawing-window.component';
import { SavePopupComponent } from './components/save-popup/save-popup.component';
import { ToolbarComponent } from './components/toolbar/toolbar.component';

// Service
import { AttributesPanelComponent } from './components/attributes-panel/attributes-panel.component';
import { CanvasConversionService } from './services/canvas-conversion/canvas-conversion.service';
import { ColorParameterService } from './services/color/color-parameter.service';
import { CommandManagerService } from './services/command/command-manager.service';
import { DrawingManagerService } from './services/drawing-manager/drawing-manager.service';
import { GridService } from './services/grid/grid.service';
import { NavigationGuideService } from './services/navigation-guide/navigation-guide.service';
import { RoutingManagerService } from './services/routing-manager/routing-manager.service';
import { LocalSaveManagerService } from './services/saving/local/local-save-manager.service';
import { ShortcutsManagerService } from './services/shortcuts/shortcuts-manager.service';
import { SVGStockageService } from './services/stockage-svg/svg-stockage.service';
import { RectangleToolService } from './services/tools/basic-shape-tool/rectangle-tool.service';
import { LineToolService } from './services/tools/line-tool.service';
import { SelectionService } from './services/tools/selection/selection.service';
import { PencilToolService } from './services/tools/tracing-tool/pencil-tool.service';

@NgModule({
    declarations: [AppComponent, HomePageComponent, NewDrawingWarningComponent, DrawingPageComponent, GuidePageComponent,
        NewDrawingWindowComponent, ToolbarComponent, DrawingToolComponent, GuideSubjectComponent, DrawingSurfaceComponent,
        ColorChoiceComponent, ColorSliderComponent, ColorPickerComponent, ColorInputComponent, GridOptionsComponent,
        SavePopupComponent, GalleryComponent, GalleryElementComponent, GalleryLoadWarningComponent, ExportWindowComponent,
        AttributesPanelComponent],
    imports: [BrowserModule, HttpClientModule, MatButtonModule, FormsModule, ReactiveFormsModule,
        MatProgressSpinnerModule, MatDialogModule, MatSidenavModule, BrowserAnimationsModule, RouterModule.forRoot([
        {path: '', component: HomePageComponent},
        {path: 'dessin', component: DrawingPageComponent},
        {path: 'guide', component : GuidePageComponent}
    ])],
    providers: [NavigationGuideService, SVGStockageService, PencilToolService, DrawingManagerService,
                ShortcutsManagerService, RectangleToolService, LineToolService,
                RoutingManagerService, ColorParameterService, MatDialogConfig, SelectionService,
                CommandManagerService, GridService, CanvasConversionService, LocalSaveManagerService],

    entryComponents: [NewDrawingWindowComponent, NewDrawingWarningComponent,
                      ColorChoiceComponent, GridOptionsComponent, SavePopupComponent, GalleryComponent,
                      GalleryLoadWarningComponent, ExportWindowComponent],
    bootstrap: [AppComponent],
})
export class AppModule {}
