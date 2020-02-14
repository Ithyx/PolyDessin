import { HttpClientModule } from '@angular/common/http';
import { Injector } from '@angular/core';
import { async, TestBed } from '@angular/core/testing';
import { RouterStateSnapshot, RoutesRecognized } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { IndexService } from '../../services/index/index.service';
import { AppComponent } from './app.component';
import SpyObj = jasmine.SpyObj;

const injecteur = Injector.create(
    { providers: [{provide: RouterStateSnapshot, useValue: {}}, {provide: RoutesRecognized, deps: [RouterStateSnapshot]}] }
)

describe('AppComponent', () => {
    let indexServiceSpy: SpyObj<IndexService>;
    let app: AppComponent

    beforeEach(() => {
        indexServiceSpy = jasmine.createSpyObj('IndexService', ['basicGet']);
    });

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [RouterTestingModule, HttpClientModule],
            declarations: [AppComponent],
            providers: [{ provide: IndexService, useValue: indexServiceSpy }],
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

    //
    it('#miseAJourURL devrait mettre à jour l\'URL courante', () => {
        const routes: [any, any] = [{url: 'précédante'}, {url: 'actuelle'}];
        app.miseAJourURL(routes)
        expect(app.gestionnaireRoutes.pageEnCours).toBe('actuelle')
    })

    it('#miseAJourURL devrait mettre à jour l\'URL précédante', () => {
        const routes: [any, any] = [{url: 'précédante'}, {url: 'actuelle'}];
        app.miseAJourURL(routes)
        expect(app.gestionnaireRoutes.pagePrecedante).toBe('précédante')
    })

    //
    it('#fonctionFiltre devrait refuser un paramètre qui n\'est pas une RouteRecognized', () => {
        expect(app.fonctionFiltre(0)).toBe(false);
        expect(app.fonctionFiltre('test')).toBe(false);
        expect(app.fonctionFiltre(true)).toBe(false);
        expect(app.fonctionFiltre([123, 'test'])).toBe(false);
    })

    it('#fonctionFiltre devrait accepter un paramètre de type RouteRecognized', () => {
        const evt: RoutesRecognized = injecteur.get(RoutesRecognized);
        expect(app.fonctionFiltre(evt)).toBe(true);
    })
});
