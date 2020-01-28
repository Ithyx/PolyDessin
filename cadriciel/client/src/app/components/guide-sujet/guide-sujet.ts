export class GuideSujet {
   nom: string;
   description: string;
   precedant: boolean;
   suivant: boolean;
   id?: number;
   sousSujets?: GuideSujet[];
   categorieOuverte ? = false;
}
