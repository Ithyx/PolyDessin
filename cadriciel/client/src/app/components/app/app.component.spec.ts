import { HttpClientModule } from '@angular/common/http';
import { Injector } from '@angular/core';
import { async, TestBed } from '@angular/core/testing';
import { RouterStateSnapshot, RoutesRecognized } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { AppComponent } from './app.component';

const injecteur = Injector.create(
    { providers: [{provide: RouterStateSnapshot, useValue: {}}, {provide: RoutesRecognized, deps: [RouterStateSnapshot]}] }
);

describe('AppComponent', () => {
    let app: AppComponent;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [RouterTestingModule, HttpClientModule],
            declarations: [AppComponent],
        });
        const fixture = TestBed.createComponent(AppComponent);
        app = fixture.componentInstance;
    }));

    it('should create the app', () => {
        expect(app).toBeTruthy();
    });

    it("devrait avoir le titre 'LOG2990'", () => {
        expect(app.title).toEqual('LOG2990');
    });

    //  Tests updateURL

    it('#updateURL devrait mettre à jour l\'URL courante', () => {
        const routes: [any, any] = [{url: 'précédante'}, {url: 'actuelle'}];
        app.updateURL(routes);
        expect(app.routingManager.currentPage).toBe('actuelle');
    });

    it('#updateURL devrait mettre à jour l\'URL précédante', () => {
        const routes: [any, any] = [{url: 'précédante'}, {url: 'actuelle'}];
        app.updateURL(routes);
        expect(app.routingManager.previousPage).toBe('précédante');
    });

    //  Tests filterFunction

    /*it('#filterFunction devrait refuser un paramètre qui n\'est pas une RouteRecognized', () => {
        expect(app.filterFunction(0)).toBe(false);
        expect(app.filterFunction('test')).toBe(false);
        expect(app.filterFunction(true)).toBe(false);
        expect(app.filterFunction([123, 'test'])).toBe(false);
    });*/

    it('#filterFunction devrait accepter un paramètre de type RouteRecognized', () => {
        const evt: RoutesRecognized = injecteur.get(RoutesRecognized);
        expect(app.filterFunction(evt)).toBe(true);
    });
});
