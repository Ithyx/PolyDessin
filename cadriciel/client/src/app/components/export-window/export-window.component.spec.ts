import { HttpClientModule } from '@angular/common/http';
import { ElementRef } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { MatDialogModule, MatDialogRef, MatSidenavModule } from '@angular/material';
import { By, DomSanitizer } from '@angular/platform-browser';
import { DrawingManagerService } from 'src/app/services/drawing-manager/drawing-manager.service';
import { ExportWindowComponent, PREVIEW_SIZE } from './export-window.component';

// tslint:disable: no-string-literal
// tslint:disable: no-magic-numbers

describe('ExportWindowComponent', () => {
  let component: ExportWindowComponent;
  let fixture: ComponentFixture<ExportWindowComponent>;
  let context: CanvasRenderingContext2D;
  let element: SVGElement;
  let link: ElementRef<HTMLAnchorElement>;
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
    element = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    component['drawingPreview'] = new ElementRef<SVGElement>(element);
    component['canvas'] = document.createElement('canvas');
    const contextTest = component['canvas'].getContext('2d');
    const anchor = document.createElement('a');
    link = new ElementRef<HTMLAnchorElement>(anchor);
    component['link'] = link;
    if (contextTest) {
      context = contextTest;
      component['context'] = context;
    }
    component['image'] = new Image();
    fixture.detectChanges();

    const drawing = TestBed.get(DrawingManagerService);
    drawing.width = 444;
    drawing.height = 228;

    spyOn(context, 'drawImage').and.callFake(() => new ImageData(2, 2));
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

  // TESTS export

  it('#export devrait obtenir le contexte du canvas', () => {
    spyOn(component['canvas'], 'getContext');
    component.export();
    expect(component['canvas'].getContext).toHaveBeenCalledWith('2d');
  });

  it('#export ne devrait rien faire si le contexte n\'est pas défini', () => {
    delete component['context'];
    spyOn(component['canvas'], 'getContext').and.callFake(() => null);
    component.export();
    expect(component['context']).not.toBeDefined();
  });

  it('#export ne devrait rien faire si element n\'est pas défini', () => {
    delete component['context'];
    delete component['drawingPreview'].nativeElement;
    component.export();
    expect(component['context']).not.toBeDefined();
  });

  it('#export devrait garder en mémoire le contexte s\'il est défini', () => {
    component.export();
    expect(component['context']).toEqual(context);
  });

  it('#export devrait assigner temporairement la largeur du dessin à celle du preview', () => {
    spyOn(component['drawingPreview'].nativeElement, 'setAttribute');
    component.export();
    expect(component['drawingPreview'].nativeElement.setAttribute).toHaveBeenCalledWith('width', '444');
  });

  it('#export devrait assigner temporairement la hauteur du dessin à celle du preview', () => {
    spyOn(component['drawingPreview'].nativeElement, 'setAttribute');
    component.export();
    expect(component['drawingPreview'].nativeElement.setAttribute).toHaveBeenCalledWith('height', '228');
  });

  it('#export devrait appeler serializeToString avec l\'élément', () => {
    const spy = spyOn(XMLSerializer.prototype, 'serializeToString');
    component.export();
    expect(spy).toHaveBeenCalledWith(component['drawingPreview'].nativeElement);
  });

  it('#export devrait assigner la fonction downloadImage au onload de l\'image', () => {
    component.export();
    expect(JSON.stringify(component['image'].onload)).toEqual(JSON.stringify(component.downloadImage));
  });

  it('#export devrait générer un URL pour le SVG', () => {
    spyOn(URL, 'createObjectURL');
    component.export();
    expect(URL.createObjectURL).toHaveBeenCalledWith(
      new Blob([new XMLSerializer().serializeToString(component['drawingPreview'].nativeElement)], {type: 'image/svg+xml;charset=utf-8'})
    );
  });

  it('#export devrait assigner l\'URL au src de l\'image', () => {
    spyOn(URL, 'createObjectURL').and.callFake(() => 'http://localhost:9876/fakeURL');
    component.export();
    expect(component['image'].src).toEqual('http://localhost:9876/fakeURL');
  });

  it('#export devrait remettre la largeur du preview à sa valeur normale', () => {
    spyOn(component['drawingPreview'].nativeElement, 'setAttribute');
    component.export();
    expect(component['drawingPreview'].nativeElement.setAttribute).toHaveBeenCalledWith('width', PREVIEW_SIZE);
  });

  it('#export devrait remettre la hauteur du preview à sa valeur normale', () => {
    spyOn(component['drawingPreview'].nativeElement, 'setAttribute');
    component.export();
    expect(component['drawingPreview'].nativeElement.setAttribute).toHaveBeenCalledWith('height', PREVIEW_SIZE);
  });

  // TESTS downloadImage

  it('#downloadImage devrait appeler drawImage du contexte', () => {
    component.downloadImage();
    expect(context.drawImage).toHaveBeenCalledWith(component['image'], 0, 0);
  });

  it('#downloadImage devrait mettre le src de l\'image dans le href du lien si le type choisi est svg', () => {
    component['image'].src = 'http://localhost:9876/testURL';
    component['selectedExportFormat'] = 'svg';
    component.downloadImage();
    expect(component['link'].nativeElement.href).toEqual(component['image'].src);
  });

  it('#downloadImage devrait appeler toDataURL de canvas pour les autres types', () => {
    spyOn(component['canvas'], 'toDataURL');
    component['selectedExportFormat'] = 'png';
    component.downloadImage();
    expect(component['canvas'].toDataURL).toHaveBeenCalledWith('image/png');
    component['selectedExportFormat'] = 'jpeg';
    component.downloadImage();
    expect(component['canvas'].toDataURL).toHaveBeenCalledWith('image/jpeg');
  });

  it('#downloadImage devrait mettre le résultat de toDataURL dans la source pour les autres types', () => {
    spyOn(component['canvas'], 'toDataURL').and.callFake(() => 'http://localhost:9876/testURL');
    component['selectedExportFormat'] = 'png';
    component.downloadImage();
    expect(component['link'].nativeElement.href).toEqual('http://localhost:9876/testURL');
    component['selectedExportFormat'] = 'jpeg';
    component.downloadImage();
    expect(component['link'].nativeElement.href).toEqual('http://localhost:9876/testURL');
  });

  it('#downloadImage devrait mettre le nom de fichier entré dans le download du lien', () => {
    component['selectedFileName'] = 'testFileName';
    component.downloadImage();
    expect(component['link'].nativeElement.download).toEqual('testFileName');
  });

  it('#downloadImage devrait appeler click sur le lien', () => {
    spyOn(component['link'].nativeElement, 'click');
    component.downloadImage();
    expect(component['link'].nativeElement.click).toHaveBeenCalled();
  });

  it('#downloadImage devrait appeler revokeObjectURL sur la source de l\'image', () => {
    spyOn(URL, 'revokeObjectURL');
    component['image'].src = 'http://localhost:9876/testURL';
    component['selectedExportFormat'] = 'svg';
    component.downloadImage();
    expect(URL.revokeObjectURL).toHaveBeenCalledWith('http://localhost:9876/testURL');
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
