import { TestBed } from '@angular/core/testing';
import { GuideSujet } from '../components/guide-sujet/guide-sujet';
import { ContenuGuide } from '../components/page-guide/SujetsGuide';
import { NavigationGuideService, sujetVide } from './navigation-guide.service';

describe('NavigationGuideService', () => {
  let sujets: GuideSujet[];
  let service: NavigationGuideService;
  beforeEach(() => TestBed.configureTestingModule({}));
  beforeEach(() => service = TestBed.get(NavigationGuideService));
  beforeEach(() => sujets = ContenuGuide);

  it('should be created', () => {
    const testService: NavigationGuideService = TestBed.get(NavigationGuideService);
    expect(testService).toBeTruthy();
  });

  it('ParcourirSujets should return subject with ID 1', () => {
    expect(service.parcourirSujets(1, sujets).id).toBe(1);
  });

  it('ParcourirSujets should return an empty subjet when given negative or null ID', () => {
    expect(service.parcourirSujets(-5, sujets)).toBe(sujetVide);
    expect(service.parcourirSujets(0, sujets)).toBe(sujetVide);
  })

  it('ParcourirSujets should be able to return a subject in a category', () => {
    expect(service.parcourirSujets(4, sujets).id).toBe(4);
  })

  it('OuvrirCategorie should open all categories', () => {
    service.ouvrirCategories(sujets);
    expect(sujets[1].categorieOuverte).toBe(true);
    /* TODO: Ajouter les catégories qui doivent etre ouvertes. */
  })

  it('OuvrirCategorie should not affect pure subjects', () => {
    const sujetVideCopy: GuideSujet = sujetVide;
    service.ouvrirCategories([sujetVide]);
    expect(sujetVide).toBe(sujetVideCopy);
  })
});
