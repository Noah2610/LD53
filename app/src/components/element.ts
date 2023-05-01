import { BaseComponent } from "./_baseComponent";

export class Element implements BaseComponent {
    public readonly name = "element";
    public element: HTMLElement;

    constructor(element: HTMLElement) {
        this.element = element;
    }

    onCreate() {
        this.element.classList.add("entity");

        const entitiesEl = document.querySelector(".game-entities");

        if (!entitiesEl) {
            throw new Error(
                "[Element.onCreate] Expected #game-entities element",
            );
        }

        entitiesEl.appendChild(this.element);
    }

    onRemove() {
        this.element.remove();
    }
}
