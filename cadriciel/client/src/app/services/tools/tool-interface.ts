export interface ToolInterface {
    onMouseMove?(event: MouseEvent): void;
    onMousePress?(event: MouseEvent): void;
    onMouseRelease?(event?: MouseEvent): void;
    onMouseClick?(event?: MouseEvent): void;
    onMouseLeave?(event?: MouseEvent): void;
    onMouseEnter?(event?: MouseEvent): void;
    onDoubleClick?(event?: MouseEvent): void;
    onRightClick?(event?: MouseEvent): void;
    clear?(): void;
}
