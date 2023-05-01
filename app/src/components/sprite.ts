import { Vector } from "ld53-lib/types";
import { BaseComponent } from "./_baseComponent";

export class Sprite implements BaseComponent {
    public readonly name: "sprite";

    public size: Vector;

    private src: string;
    private el: HTMLElement;
    // TODO move to separate Label component
    private label: string | null;
    private labelEl: HTMLElement | null;

    constructor({
        src,
        size,
        label,
    }: {
        src: string;
        size: Vector;
        label?: string;
    }) {
        this.name = "sprite";
        this.size = size;
        this.src = src;
        this.el = document.createElement("div");
        this.label = label ?? null;
        this.labelEl = null;
    }

    public onCreate() {
        this.el.classList.add("entity");

        this.setSize(this.size);
        this.el.style.setProperty("--sprite-src", `url(${this.src})`);

        // TODO: move to separate Label component
        if (this.label !== null) {
            this.labelEl = document.createElement("div");
            this.labelEl.classList.add("entity-label");
            this.labelEl.innerText = this.label;
            this.el.appendChild(this.labelEl);
        }

        const entitiesEl = document.querySelector(".game-entities");
        if (!entitiesEl) {
            throw new Error(
                "[Sprite.onCreate] expected .game-entities element",
            );
        }
        entitiesEl.appendChild(this.el);
    }

    public onRemove() {
        this.el.remove();
    }

    public setSize(size: Vector) {
        this.size = size;

        this.el.style.setProperty("--width", `${size.x}px`);
        this.el.style.setProperty("--height", `${size.y}px`);
    }

    // TODO move to separate Label component
    public setLabel(label: string) {
        if (!this.labelEl) {
            this.labelEl = document.createElement("div");
            this.labelEl.classList.add("entity-label");
            this.el.appendChild(this.labelEl);
        }

        console.log("setting label", label);
        this.label = label;
        this.labelEl.innerText = label;
    }
}
