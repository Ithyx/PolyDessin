import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class RoutingManagerService {
  previousPage: string;
  currentPage: string;

  constructor() {
    this.previousPage = '';
    this.currentPage = '';
  }
}
