export interface BaseComponent {
    readonly name: string;

    onCreate?(): void;
    onRemove?(): void;
}
