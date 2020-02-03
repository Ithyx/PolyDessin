import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { RouterModule } from '@angular/router';

import { FenetreNewDessinComponent } from './fenetre-new-dessin.component';

describe('FenetreNewDessinComponent', () => {
  let component: FenetreNewDessinComponent;
  let fixture: ComponentFixture<FenetreNewDessinComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ ReactiveFormsModule, MatDialogModule, RouterModule.forRoot([]) ],
      declarations: [ FenetreNewDessinComponent ],
      providers: [ {provide: MatDialogRef, useValue: {}} ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FenetreNewDessinComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
