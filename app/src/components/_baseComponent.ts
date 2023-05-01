export interface BaseComponent {
    name: string;

    onCreate?(): void;
    onRemove?(): void;
}
