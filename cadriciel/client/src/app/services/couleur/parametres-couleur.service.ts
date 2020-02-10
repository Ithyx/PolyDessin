import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ParametresCouleurService {
  couleurPrincipale = 'rgba(0, 0, 0, 1)';
  couleurSecondaire = 'rgba(255, 255, 255, 1)';
  couleurFond = 'rgba(255, 255, 255, 1)';
}
