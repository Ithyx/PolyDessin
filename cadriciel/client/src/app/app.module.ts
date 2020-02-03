import { HttpClientModule } from '@angular/common/http';
import { NgModule} from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule, MatDialogModule} from '@angular/material';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { AccueilComponent } from './components/accueil/accueil.component';
import { AppComponent } from './components/app/app.component';
import { BarreOutilsComponent } from './components/barre-outils/barre-outils.component';
import { FenetreNewDessinComponent } from './components/fenetre-new-dessin/fenetre-new-dessin.component';
import { GuideSujetComponent } from './components/guide-sujet/guide-sujet.component';
import { OutilDessinComponent } from './components/outil-dessin/outil-dessin.component';
import { PageDessinComponent } from './components/page-dessin/page-dessin.component';
import { PageGuideComponent } from './components/page-guide/page-guide.component';
import { SurfaceDessinComponent } from './components/surface-dessin/surface-dessin.component';

// Service
import { DessinCrayonService } from './services/dessin-crayon.service';
import { DessinManagerService } from './services/dessin-manager/dessin-manager.service';
import { DessinRectangleService } from './services/dessin-rectangle.service';
import { FormulaireNouveauDessinService } from './services/formulaire-nouveau-dessin.service';
import { GestionnaireRaccourcisService } from './services/gestionnaire-raccourcis.service';
import { NavigationGuideService } from './services/navigation-guide.service';
import { StockageSvgService } from './services/stockage-svg.service';

@NgModule({
    declarations: [AppComponent, AccueilComponent, PageDessinComponent, PageGuideComponent,
        FenetreNewDessinComponent, BarreOutilsComponent, OutilDessinComponent, GuideSujetComponent, SurfaceDessinComponent],
    imports: [BrowserModule, HttpClientModule, MatButtonModule, FormsModule, ReactiveFormsModule,
        MatButtonModule, MatDialogModule, BrowserAnimationsModule, RouterModule.forRoot([
        {path: '', component: AccueilComponent},
        {path: 'dessin', component: PageDessinComponent},
        {path: 'guide', component : PageGuideComponent}
    ])],
    providers: [NavigationGuideService, StockageSvgService, DessinCrayonService, FormulaireNouveauDessinService, DessinManagerService,
                GestionnaireRaccourcisService, DessinRectangleService],
    entryComponents: [FenetreNewDessinComponent],
    bootstrap: [AppComponent],
})
export class AppModule {}
