export class SubjectGuide {
   name: string;
   description: string;
   previous: boolean;
   next: boolean;
   id?: number;
   subSubjects?: SubjectGuide[];
   openCategory ?: boolean;

   constructor() {
      this.openCategory = false;
   }
}
