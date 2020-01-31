import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';

// Components
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
import { NavigationGuideService } from './services/navigation-guide.service';
import { StockageSvgService } from './services/stockage-svg.service';

@NgModule({
    declarations: [AppComponent, AccueilComponent, PageDessinComponent, PageGuideComponent,
        FenetreNewDessinComponent, BarreOutilsComponent, OutilDessinComponent, GuideSujetComponent, SurfaceDessinComponent],
    imports: [BrowserModule, HttpClientModule, MatButtonModule, RouterModule.forRoot([
        {path: '', component: AccueilComponent},
        {path: 'dessin', component: PageDessinComponent},
        {path: 'guide', component : PageGuideComponent}
    ])],
    providers: [NavigationGuideService, StockageSvgService, DessinCrayonService],
    bootstrap: [AppComponent],
})
export class AppModule {}
