import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GuideSujetComponent } from '../guide-sujet/guide-sujet.component';
import { PageGuideComponent } from './page-guide.component';

describe('PageGuideComponent', () => {
  let component: PageGuideComponent;
  let fixture: ComponentFixture<PageGuideComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PageGuideComponent, GuideSujetComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PageGuideComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
