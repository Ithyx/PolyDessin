export interface InterfaceOutils {
    sourisDeplacee?(evenement: MouseEvent): void;
    sourisEnfoncee?(evenement: MouseEvent): void;
    sourisRelachee?(evenement?: MouseEvent): void;
    sourisCliquee?(evenement?: MouseEvent, cle?: number): void;
    sourisSortie?(evenement?: MouseEvent): void;
    sourisEntree?(evenement: MouseEvent): void;
    sourisDoubleClic?(evenement: MouseEvent): void;
    vider?(): void;
}
