import { HttpClientModule } from '@angular/common/http';
import { NgModule} from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule, MatDialogConfig, MatDialogModule} from '@angular/material';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';

// Component
import { AppComponent } from './components/app/app.component';
import { AvertissementNouveauDessinComponent } from './components/avertissement-nouveau-dessin/avertissement-nouveau-dessin.component';
import { BarreOutilsComponent } from './components/barre-outils/barre-outils.component';
import { ChoixCouleurComponent } from './components/choix-couleur/choix-couleur.component'
import { CouleurPaletteComponent } from './components/choix-couleur/couleur-palette/couleur-palette.component'
import { GlissiereCouleurComponent } from './components/choix-couleur/glissiere-couleur/glissiere-couleur.component'
import { ValeurCouleurComponent } from './components/choix-couleur/valeur-couleur/valeur-couleur.component';
import { FenetreNouveauDessinComponent } from './components/fenetre-nouveau-dessin/fenetre-nouveau-dessin.component';
import { GridOptionsComponent } from './components/grid-options/grid-options.component';
import { GuidePageComponent } from './components/guide-page/page-guide.component';
import { GuideSubjectComponent } from './components/guide-subject/guide-subject.component';
import { HomePageComponent } from './components/home-page/home-page.component';
import { OutilDessinComponent } from './components/outil-dessin/outil-dessin.component';
import { PageDessinComponent } from './components/page-dessin/page-dessin.component';
import { SurfaceDessinComponent } from './components/surface-dessin/surface-dessin.component';

// Service
import { ColorParameterService } from './services/color/color-parameter.service';
import { CommandManagerService } from './services/command/command-manager.service';
import { DrawingManagerService } from './services/drawing-manager/drawing-manager.service';
import { GridService } from './services/grid/grid.service';
import { NavigationGuideService } from './services/navigation-guide.service';
import { RoutingManagerService } from './services/routing-manager.service';
import { ShortcutsManagerService } from './services/shortcuts-manager.service';
import { SVGStockageService } from './services/stockage-svg/svg-stockage.service';
import { LineToolService } from './services/tools/line-tool.service';
import { DrawingToolService } from './services/tools/pencil-tool.service';
import { RectangleToolService } from './services/tools/rectangle-tool.service';
import { SelectionService } from './services/tools/selection/selection.service';

@NgModule({
    declarations: [AppComponent, HomePageComponent, AvertissementNouveauDessinComponent, PageDessinComponent, GuidePageComponent,
        FenetreNouveauDessinComponent, BarreOutilsComponent, OutilDessinComponent, GuideSubjectComponent, SurfaceDessinComponent,
            ChoixCouleurComponent, GlissiereCouleurComponent, CouleurPaletteComponent, ValeurCouleurComponent, GridOptionsComponent],
    imports: [BrowserModule, HttpClientModule, MatButtonModule, FormsModule, ReactiveFormsModule,
        MatButtonModule, MatDialogModule, BrowserAnimationsModule, RouterModule.forRoot([
        {path: '', component: HomePageComponent},
        {path: 'dessin', component: PageDessinComponent},
        {path: 'guide', component : GuidePageComponent}
    ])],
    providers: [NavigationGuideService, SVGStockageService, DrawingToolService, DrawingManagerService,
                ShortcutsManagerService, RectangleToolService, LineToolService,
                RoutingManagerService, ColorParameterService, MatDialogConfig, SelectionService,
                CommandManagerService, GridService],
    entryComponents: [FenetreNouveauDessinComponent, AvertissementNouveauDessinComponent,
                      ChoixCouleurComponent, GridOptionsComponent],
    bootstrap: [AppComponent],
})
export class AppModule {}
