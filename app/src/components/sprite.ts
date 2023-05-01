export class Sprite {
    public readonly name: "sprite";
    public el: HTMLElement;

    constructor({ el }: { el: HTMLElement }) {
        this.name = "sprite";
        this.el = el;
    }
}
