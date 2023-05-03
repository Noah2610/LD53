import { Vector } from "ld53-lib/types";
import { BaseComponent } from "./_baseComponent";

interface SpritesheetInfo {
    size: Vector;
    cols: number;
    rows: number;
    spriteIndex: number;
    spriteCount: number;
}

export class Sprite implements BaseComponent {
    public readonly name = "sprite";

    public size: Vector;
    public el: HTMLElement;

    private src: string;

    private spritesheet: SpritesheetInfo | null;

    // TODO move to separate Label component
    private label: string | null;
    private labelEl: HTMLElement | null;

    constructor({
        src,
        size,
        spritesheetSize,
        label,
        classNames,
    }: {
        src: string;
        size: Vector;
        spritesheetSize?: Vector;
        label?: string;
        classNames?: string[];
    }) {
        this.size = size;
        this.src = src;

        this.spritesheet = null;
        if (spritesheetSize) {
            this.setSpritesheetSize(spritesheetSize);
        }

        this.el = document.createElement("div");
        classNames && this.el.classList.add(...classNames);
        this.label = label ?? null;
        this.labelEl = null;
    }

    public onCreate() {
        this.el.classList.add("entity", "sprite");

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

        this.el.style.setProperty("--sprite-width", `${size.x}px`);
        this.el.style.setProperty("--sprite-height", `${size.y}px`);

        if (this.spritesheet) {
            this.el.style.setProperty(
                "--image-width",
                `${this.spritesheet.size.x}px`,
            );
            this.el.style.setProperty(
                "--image-height",
                `${this.spritesheet.size.y}px`,
            );
        }
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

    public setSpriteIndex(index: number) {
        if (!this.spritesheet) {
            throw new Error(
                "[Sprite.setSpriteIndex] Sprite has no spritesheet",
            );
        }

        if (index < 0 || index >= this.spritesheet.spriteCount) {
            throw new Error(
                `[Sprite.setSpriteIndex] Invalid sprite index ${index}, sprite count: ${this.spritesheet.spriteCount}`,
            );
        }

        this.spritesheet.spriteIndex = index;
        const col = index % this.spritesheet.cols;
        const row = Math.floor(index / this.spritesheet.cols);
        const spriteX = col * this.size.x;
        const spriteY = row * this.size.y;

        this.el.style.setProperty("--sprite-x", `${spriteX}px`);
        this.el.style.setProperty("--sprite-y", `${spriteY}px`);
    }

    private setSpritesheetSize(spritesheetSize: Vector) {
        const cols = Math.floor(spritesheetSize.x / this.size.x);
        const rows = Math.floor(spritesheetSize.y / this.size.y);

        this.spritesheet = {
            size: { ...spritesheetSize },
            cols,
            rows,
            spriteIndex: 0,
            spriteCount: cols * rows,
        };
    }
}
