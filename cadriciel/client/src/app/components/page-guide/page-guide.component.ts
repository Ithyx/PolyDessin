import { Component, OnInit } from '@angular/core';
import { GuideSujet, ContenuGuide } from '../guide-sujet/guide-sujet.component';

@Component({
  selector: 'app-page-guide',
  templateUrl: './page-guide.component.html',
  styleUrls: ['./page-guide.component.scss']
})

export class PageGuideComponent implements OnInit {
  sujets: GuideSujet[] = ContenuGuide;
  sujetActif: GuideSujet;
  
  constructor() { }

  ngOnInit() {
  }

  onNotify(sujet: GuideSujet) {
    this.sujetActif = sujet;
  }

}
