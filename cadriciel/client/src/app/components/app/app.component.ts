import { Component } from '@angular/core';
import { Router, RoutesRecognized } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { filter, pairwise } from 'rxjs/operators';
import { RoutingManagerService } from 'src/app/services/routing-manager.service';

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
                public routingManager: RoutingManagerService) {
        this.routing.events
            .pipe(filter(this.fonctionFiltre), pairwise())
            .subscribe({next: this.miseAJourURL.bind(this)});
    }

    fonctionFiltre(evenement: any) {
        return evenement instanceof RoutesRecognized
    }

    miseAJourURL(evenement: [any, any]) {
        this.routingManager.previousPage = evenement[0].url;
        this.routingManager.currentPage = evenement[1].url;
    };

}
