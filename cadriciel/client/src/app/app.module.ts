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
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';




@NgModule({
    declarations: [AppComponent, AccueilComponent, PageDessinComponent, PageGuideComponent, BarreOutilsComponent, OutilDessinComponent, GuideSujetComponent],
    imports: [BrowserModule, HttpClientModule, MatButtonModule ,RouterModule.forRoot([
        {path: '', component: AccueilComponent},
        {path: 'dessin', component: PageDessinComponent},
        {path: 'guide', component : PageGuideComponent}
    ]), BrowserAnimationsModule],
    providers: [],
    bootstrap: [AppComponent],
})
export class AppModule {}
