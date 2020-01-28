import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterModule } from '@angular/router';

import { BarreOutilsComponent } from '../barre-outils/barre-outils.component';
import { OutilDessinComponent } from '../outil-dessin/outil-dessin.component';
import { PageDessinComponent } from './page-dessin.component';

describe('PageDessinComponent', () => {
  let component: PageDessinComponent;
  let fixture: ComponentFixture<PageDessinComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ RouterModule, RouterModule.forRoot([
        {path: 'dessin', component: PageDessinComponent}
      ])],
      declarations: [ PageDessinComponent, BarreOutilsComponent, OutilDessinComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PageDessinComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
