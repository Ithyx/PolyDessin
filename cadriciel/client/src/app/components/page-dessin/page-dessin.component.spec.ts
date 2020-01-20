import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PageDessinComponent } from './page-dessin.component';

describe('PageDessinComponent', () => {
  let component: PageDessinComponent;
  let fixture: ComponentFixture<PageDessinComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PageDessinComponent ]
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
