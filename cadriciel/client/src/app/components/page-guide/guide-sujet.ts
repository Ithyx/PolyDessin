export class GuideSujet {
    public nom:string;
    public description: string;
    public suivant: boolean;
    public precedant: boolean;
    public imagePaths?: string[];
    public sousSujets?: GuideSujet[];
}

export const ContenuGuide: GuideSujet[] = [
    {
        nom: "ceci est une fraude",
        description: "bonjour c'ets ici que je met mon argent pour éviter les taxes",
        suivant: true,
        precedant: false
    },
    {
        nom: "catégorie",
        description: "",
        suivant:false,
        precedant: false,
        sousSujets: [
            {
                nom: "sous-sujet1",
                description: "bidon",
                suivant: true,
                precedant: true
            },
            {
                nom: "sous-sujet2",
                description: "++bidon",
                suivant: false,
                precedant: true
            }
        ]
    }
];