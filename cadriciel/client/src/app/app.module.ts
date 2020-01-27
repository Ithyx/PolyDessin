import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './components/app/app.component';
import { AccueilComponent } from './components/accueil/accueil.component';
import { PageDessinComponent } from './components/page-dessin/page-dessin.component';
import { RouterModule } from '@angular/router';
import { PageGuideComponent } from './components/page-guide/page-guide.component';
import { GuideSujetComponent } from "./components/guide-sujet/guide-sujet.component";
import { BarreOutilsComponent } from "./components/barre-outils/barre-outils.component";
import { OutilDessinComponent } from './components/outil-dessin/outil-dessin.component';



@NgModule({
    declarations: [AppComponent, AccueilComponent, PageDessinComponent, PageGuideComponent, BarreOutilsComponent, OutilDessinComponent, GuideSujetComponent],
    imports: [BrowserModule, HttpClientModule, RouterModule.forRoot([
        {path: '', component: AccueilComponent},
        {path: 'dessin', component: PageDessinComponent},
        {path: 'guide', component : PageGuideComponent}
    ])],
    providers: [],
    bootstrap: [AppComponent],
})
export class AppModule {}
