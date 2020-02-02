import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
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



// Service
import { NavigationGuideService } from './services/navigation-guide.service';


// Module
import { ChoixCouleurModule } from './components/choix-couleur/choix-couleur.module';
import { ChoixCouleurComponent } from './components/choix-couleur/choix-couleur.component'



@NgModule({
    declarations: [AppComponent, AccueilComponent, PageDessinComponent, PageGuideComponent,
        FenetreNewDessinComponent, BarreOutilsComponent, OutilDessinComponent, GuideSujetComponent, ChoixCouleurComponent],
    imports: [BrowserModule, ChoixCouleurModule, HttpClientModule, MatButtonModule, MatDialogModule, BrowserAnimationsModule, RouterModule.forRoot([
        {path: '', component: ChoixCouleurComponent},
        {path: 'dessin', component: PageDessinComponent},
        {path: 'guide', component : PageGuideComponent}
    ])],
    providers: [NavigationGuideService],
    entryComponents:[FenetreNewDessinComponent],
    bootstrap: [AppComponent],
})
export class AppModule {}
