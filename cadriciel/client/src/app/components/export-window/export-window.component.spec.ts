import { HttpClientModule } from '@angular/common/http';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { MatDialogModule, MatDialogRef, MatSidenavModule } from '@angular/material';
import { By, DomSanitizer } from '@angular/platform-browser';
import { DrawingManagerService } from 'src/app/services/drawing-manager/drawing-manager.service';
import { ExportWindowComponent } from './export-window.component';

// tslint:disable: no-string-literal
// tslint:disable: no-magic-numbers

describe('ExportWindowComponent', () => {
  let component: ExportWindowComponent;
  let fixture: ComponentFixture<ExportWindowComponent>;
  let sanitizer: DomSanitizer;

  const matDialogRefStub: Partial<MatDialogRef<ExportWindowComponent>> = {
    close(): void { /* NE RIEN FAIRE */ }
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExportWindowComponent ],
      imports: [MatSidenavModule, MatDialogModule, FormsModule, HttpClientModule],
      providers: [ {provide: MatDialogRef, useValue: matDialogRefStub}]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExportWindowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    const drawing = TestBed.get(DrawingManagerService);
    drawing.width = 444;
    drawing.height = 228;
    sanitizer = TestBed.get(DomSanitizer);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // TEST close

  it('#close devrait appeler la méthode close de dialogRef', () => {
    spyOn(component['dialogRef'], 'close');
    component.close();
    expect(component['dialogRef'].close).toHaveBeenCalled();
  });

  // TESTS downloadExport

  it('#downloadExport ne devrait pas appeller export si l\'attribut drawingElemnt est invalide', () => {
      const spy = spyOn(component['service'], 'export');
      const backup = component['drawingPreview'].nativeElement;
      delete component['drawingPreview'].nativeElement;
      component.downloadExport();
      expect(spy).not.toHaveBeenCalled();
      component['drawingPreview'].nativeElement = backup;
  });
  it('#downloadExport devrait appeller export si l\'attribut drawingElemnt est valide', () => {
      const spy = spyOn(component['service'], 'export');
      component.downloadExport();
      expect(spy).toHaveBeenCalled();
  });

  // TESTS emailExport

  it('#emailExport ne devrait pas appeller export si l\'attribut drawingElemnt est invalide', () => {
      const spy = spyOn(component['service'], 'export');
      const backup = component['drawingPreview'].nativeElement;
      delete component['drawingPreview'].nativeElement;
      component.emailExport();
      expect(spy).not.toHaveBeenCalled();
      component['drawingPreview'].nativeElement = backup;
  });
  it('#emailExport devrait appeller export si l\'attribut drawingElemnt est valide', () => {
      const spy = spyOn(component['service'], 'export');
      component.emailExport();
      expect(spy).toHaveBeenCalled();
  });

  // TEST updateSelectedFormat

  it('#updateSelectedFormat devrait actualiser le format sélectionné', () => {
    component['selectedExportFormat'] = 'png';
    const input = fixture.debugElement.query(By.css('select[id="format"]')).nativeElement;
    input.value = 'svg';
    input.dispatchEvent(new Event('change')); // updateSelectedFormat appelée implicitement
    expect(component['selectedExportFormat']).toEqual('svg');
  });

  // TEST updateSelectedFilter

  it('#updateSelectedFilter devrait actualiser le filtre sélectionné', () => {
    component['selectedExportFilter'] = 'Noir-et-blanc';
    const input = fixture.debugElement.query(By.css('select[id="filter"]')).nativeElement;
    input.value = 'Sepia';
    input.dispatchEvent(new Event('change')); // updateSelectedFilter appelée implicitement
    expect(component['selectedExportFilter']).toEqual('Sepia');
  });

  // TEST updateFileName

  it('#updateFileName devrait actualiser le nom de fichier sélectionné', () => {
    component['selectedFileName'] = 'test1';
    const input = fixture.debugElement.query(By.css('input[id="name"]')).nativeElement;
    input.value = 'test2';
    input.dispatchEvent(new Event('change')); // updateFileName appelée implicitement
    expect(component['selectedFileName']).toEqual('test2');
  });

  // TEST updateEmail

  it('#updateEmail devrait actualiser l\'addresse email sélectionnée', () => {
    component['emailAdress'] = 'test1@example.com';
    const input = fixture.debugElement.query(By.css('input[name="email"]')).nativeElement;
    input.value = 'test2@example.com';
    input.dispatchEvent(new Event('change')); // updateEmail appelée implicitement
    expect(component['emailAdress']).toEqual('test2@example.com');
  });

  // TEST updateAuthor

  it('#updateAuthor devrait actualiser le nom de l\'auteur', () => {
    component['selectedAuthor'] = 'Test 1';
    const input = fixture.debugElement.query(By.css('input[id="author"]')).nativeElement;
    input.value = 'Test 2';
    input.dispatchEvent(new Event('change')); // updateAuthor appelée implicitement
    expect(component['selectedAuthor']).toEqual('Test 2');
  });

  // TEST sanitize

  it('#sanitize devrait retourner la valeur en SafeHtml du string passé en paramètre', () => {
    const testString = '<test />';
    expect(component.sanitize(testString)).toEqual(sanitizer.bypassSecurityTrustHtml(testString));
  });

  // TESTS getFilter

  it('#getFilter devrait retourner le filtre dans le bon format s\'il est défini', () => {
    component['selectedExportFilter'] = 'filter';
    expect(component.getFilter()).toEqual('url(#filter)');
  });

  it('#getFilter devrait retourner "none" si le filtre n\'est pas défini', () => {
    expect(component.getFilter()).toEqual('none');
  });
});
