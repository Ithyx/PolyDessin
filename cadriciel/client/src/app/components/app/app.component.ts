import { Component } from '@angular/core';
import { Router, RoutesRecognized } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { filter, map, pairwise } from 'rxjs/operators';
import { GestionnaireRoutingService } from 'src/app/services/gestionnaire-routing.service';
import { Message } from '../../../../../common/communication/message';
import { IndexService } from '../../services/index/index.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
})
export class AppComponent {
    readonly title: string = 'LOG2990';
    message = new BehaviorSubject<string>('');

    constructor(private basicService: IndexService,
                private routing: Router,
                public gestionnaireRoutes: GestionnaireRoutingService) {
        this.basicService
            .basicGet()
            .pipe(map((message: Message) => `${message.title} ${message.body}`))
            .subscribe(this.message);
        this.routing.events
            .pipe(filter((evt: any) => evt instanceof RoutesRecognized), pairwise())
            .subscribe({next: (evenement) => {
                gestionnaireRoutes.pagePrecedante = evenement[0].url;
                gestionnaireRoutes.pageEnCours = evenement[1].url;
             }});
    }
}
