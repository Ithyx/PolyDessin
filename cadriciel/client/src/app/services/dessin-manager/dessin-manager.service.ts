import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DessinManagerService {
  hauteur: number;
  largeur: number;
  // Stocké de préférence en hexadécimal
  couleur: number;
}
