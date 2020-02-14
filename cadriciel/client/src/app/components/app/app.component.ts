import { Component } from '@angular/core';
import { Router, RoutesRecognized } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { filter, pairwise } from 'rxjs/operators';
import { GestionnaireRoutingService } from 'src/app/services/gestionnaire-routing.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
})
export class AppComponent {
    readonly title: string = 'LOG2990';
    message = new BehaviorSubject<string>('');

    constructor(
                private routing: Router,
                public gestionnaireRoutes: GestionnaireRoutingService) {
        this.routing.events
            .pipe(filter(this.fonctionFiltre), pairwise())
            .subscribe({next: this.miseAJourURL});
    }

    fonctionFiltre(evenement: any) {
        return evenement instanceof RoutesRecognized
    }

    miseAJourURL(evenement: [any, any]) {
        this.gestionnaireRoutes.pagePrecedante = evenement[0].url;
        this.gestionnaireRoutes.pageEnCours = evenement[1].url;
    };

}
