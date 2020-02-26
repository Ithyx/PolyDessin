export interface ToolInterface {
    onMouseMove?(evenement: MouseEvent): void;
    onMousePress?(evenement: MouseEvent): void;
    onMouseRelease?(evenement?: MouseEvent): void;
    onMouseClick?(evenement?: MouseEvent): void;
    onMouseLeave?(evenement?: MouseEvent): void;
    onMouseEnter?(evenement: MouseEvent): void;
    onDoubleClick?(evenement: MouseEvent): void;
    clear?(): void;
}
