import { Component } from '@angular/core';
import { NavigationStart, Router, RoutesRecognized } from '@angular/router';
// import { BehaviorSubject } from 'rxjs';
import { filter, pairwise } from 'rxjs/operators';
import { RoutingManagerService } from 'src/app/services/routing-manager/routing-manager.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
})
export class AppComponent {
    // protected message: BehaviorSubject<string>;

    constructor(private routing: Router,
                private routingManager: RoutingManagerService
            ) {
                this.routing.events
                    .pipe(filter(this.filterFunction), pairwise())
                    .subscribe({next: this.updateURL.bind(this)});
                // this.message = new BehaviorSubject<string>('');
            }

    filterFunction(event: NavigationStart): boolean {
        return event instanceof RoutesRecognized;
    }

    updateURL(event: [ RoutesRecognized,  RoutesRecognized]): void {
        this.routingManager.previousPage = event[0].url;
        this.routingManager.currentPage = event[1].url;
    }

}
