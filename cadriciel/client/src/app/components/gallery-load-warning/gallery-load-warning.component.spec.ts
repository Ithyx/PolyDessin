import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogRef } from '@angular/material';
import { GalleryLoadWarningComponent } from './gallery-load-warning.component';

// tslint:disable: no-string-literal

describe('GalleryLoadWarningComponent', () => {
  let component: GalleryLoadWarningComponent;
  let fixture: ComponentFixture<GalleryLoadWarningComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GalleryLoadWarningComponent ],
      providers: [ {provide: MatDialogRef, useValue: {close: () => { return; }}} ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GalleryLoadWarningComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // TESTS confirm
  it('#confirm devrait appeler close avec la valeur true', () => {
    const spy = spyOn(component['dialogRef'], 'close');
    component.confirm();
    expect(spy).toHaveBeenCalledWith(true);
  });

  // TESTS cancel
  it('#cancel devrait appeler close avec la valeur true', () => {
    const spy = spyOn(component['dialogRef'], 'close');
    component.cancel();
    expect(spy).toHaveBeenCalledWith(false);
  });
});
