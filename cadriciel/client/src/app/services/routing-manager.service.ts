import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class RoutingManagerService {
  previousPage = '';
  currentPage = ''
}
