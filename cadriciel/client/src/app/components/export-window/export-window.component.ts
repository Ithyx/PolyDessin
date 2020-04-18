import { Component, ElementRef, ViewChild } from '@angular/core';
import { MatDialogRef } from '@angular/material';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { DrawingManagerService } from 'src/app/services/drawing-manager/drawing-manager.service';
import { ExportService } from 'src/app/services/export/export.service';
import { SVGStockageService } from 'src/app/services/stockage-svg/svg-stockage.service';

@Component({
  selector: 'app-export-window',
  templateUrl: './export-window.component.html',
  styleUrls: ['./export-window.component.scss']
})
export class ExportWindowComponent {
  @ViewChild('drawingPreview', {static: false})
  private drawingPreview: ElementRef<SVGElement>;
  @ViewChild('link', {static: false})
  private link: ElementRef<HTMLAnchorElement>;

  private EXPORT_FORMAT: string[] = ['png', 'jpeg', 'svg'];
  private EXPORT_FILTER: string[] = ['', 'Noir-et-blanc', 'Sepia', 'Flou', 'Tremblant', 'Tache'];

  private selectedExportFormat: string;
  private selectedExportFilter: string;
  private selectedFileName: string;
  private selectedAuthor: string;
  private emailAdress: string;

  constructor(private dialogRef: MatDialogRef<ExportWindowComponent>,
              private drawingParams: DrawingManagerService,
              private sanitizer: DomSanitizer,
              private service: ExportService,
              protected stockageSVG: SVGStockageService,
              ) {
    this.selectedExportFormat = this.EXPORT_FORMAT[0];
    this.selectedExportFilter = this.EXPORT_FILTER[0];
    this.selectedFileName = this.drawingParams.name;
    this.selectedAuthor = '';
    this.emailAdress = '';
  }

  close(): void {
    this.dialogRef.close();
  }

  downloadExport(): void {
    const element = this.drawingPreview.nativeElement;
    if (!element) { return; }
    this.service.export(element, this.selectedExportFormat, this.link.nativeElement, this.selectedFileName);
  }

  emailExport(): void {
    const element = this.drawingPreview.nativeElement;
    if (!element) { return; }
    this.service.exportToSend(element, this.selectedExportFormat, this.selectedAuthor, this.emailAdress, this.selectedFileName);
  }

  updateSelectedFormat(event: Event): void {
    const eventCast: HTMLInputElement = (event.target as HTMLInputElement);
    this.selectedExportFormat = eventCast.value;
  }

  updateSelectedFilter(event: Event): void {
    const eventCast: HTMLInputElement = (event.target as HTMLInputElement);
    this.selectedExportFilter = eventCast.value;
  }

  updateFileName(event: Event): void {
    const eventCast: HTMLInputElement = (event.target as HTMLInputElement);
    this.selectedFileName = eventCast.value;
  }

  updateEmail(event: Event): void {
    const eventCast: HTMLInputElement = (event.target as HTMLInputElement);
    this.emailAdress = eventCast.value;
  }

  updateAuthor(event: Event): void {
    const eventCast: HTMLInputElement = (event.target as HTMLInputElement);
    this.selectedAuthor = eventCast.value;
  }

  sanitize(svg: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(svg);
  }

  getFilter(): string {
    return this.selectedExportFilter ? ('url(#' + this.selectedExportFilter + ')') : 'none';
  }
}
