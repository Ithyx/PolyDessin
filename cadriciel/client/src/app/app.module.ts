import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { MatButtonModule } from "@angular/material";
import { AppComponent } from './components/app/app.component';
import { AccueilComponent } from './components/accueil/accueil.component';
import { PageDessinComponent } from './components/page-dessin/page-dessin.component';
import { RouterModule } from '@angular/router';
import { PageGuideComponent } from './components/page-guide/page-guide.component';
import { GuideSujetComponent } from "./components/guide-sujet/guide-sujet.component";
import { BarreOutilsComponent } from "./components/barre-outils/barre-outils.component";
import { OutilDessinComponent } from './components/outil-dessin/outil-dessin.component';
import { FenetreNewDessinComponent } from './components/fenetre-new-dessin/fenetre-new-dessin.component';
import { SurfaceDessinComponent } from './components/surface-dessin/surface-dessin.component';


@NgModule({
    declarations: [AppComponent, AccueilComponent, PageDessinComponent, PageGuideComponent,
        FenetreNewDessinComponent, BarreOutilsComponent, OutilDessinComponent, GuideSujetComponent, SurfaceDessinComponent],
    imports: [BrowserModule, HttpClientModule, MatButtonModule, RouterModule.forRoot([
        {path: '', component: AccueilComponent},
        {path: 'dessin', component: PageDessinComponent},
        {path: 'guide', component : PageGuideComponent}
    ])],
    providers: [],
    bootstrap: [AppComponent],
})
export class AppModule {}
