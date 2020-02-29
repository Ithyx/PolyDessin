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
            .pipe(filter(this.filterFunction), pairwise())
            .subscribe({next: this.updateURL.bind(this)});
    }

    filterFunction(event: any): boolean{
        return event instanceof RoutesRecognized;
    }

    updateURL(event: [any, any]): void {
        this.routingManager.previousPage = event[0].url;
        this.routingManager.currentPage = event[1].url;
    }

}
