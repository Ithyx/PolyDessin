import { TestBed } from '@angular/core/testing';
import { GUIDE_CONTENTS } from '../components/guide-page/guide-contents';
import { SubjectGuide } from '../components/guide-subject/subject-guide';
import { EMPTY_SUBJECT, NavigationGuideService } from './navigation-guide.service';

describe('NavigationGuideService', () => {
  let subjects: SubjectGuide[];
  let service: NavigationGuideService;
  beforeEach(() => TestBed.configureTestingModule({}));
  beforeEach(() => service = TestBed.get(NavigationGuideService));
  beforeEach(() => subjects = GUIDE_CONTENTS);

  it('should be created', () => {
    const testService: NavigationGuideService = TestBed.get(NavigationGuideService);
    expect(testService).toBeTruthy();
  });

  // TESTS browseSubjects

  it('#browseSubjects devrait retourner le sujet avec un ID de 1', () => {
    expect(service.browseSubjects(1, subjects).id).toBe(1);
  });

  it('#browseSubjects devrait retourner un sujet vide quand on lui demande un ID nul ou négatif', () => {
    expect(service.browseSubjects(-5, subjects)).toBe(EMPTY_SUBJECT);
    expect(service.browseSubjects(0, subjects)).toBe(EMPTY_SUBJECT);
  });

  it('#browseSubjects devrait retourner un sujet dans une catégorie', () => {
    expect(service.browseSubjects(4, subjects).id).toBe(4);
  });

  // TESTS ouvrirCaterogie

  it('#ouvrirCategorie devrait ouvrir toutes les catégories', () => {
    service.openCategories(subjects);
    expect(subjects[1].openCategory).toBe(true);
    /* TODO: Ajouter les catégories qui doivent etre ouvertes pour sprint 2 et sprint 3. */
  });

  it('#ouvrirCategorie ne devrait pas affecter les objets purs', () => {
    const sujetVideCopy: SubjectGuide = EMPTY_SUBJECT;
    service.openCategories([EMPTY_SUBJECT]);
    expect(EMPTY_SUBJECT).toBe(sujetVideCopy);
  });

});
