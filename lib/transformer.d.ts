import Component from "./component";
import Group from "./group";
declare class Transformer {
    private readonly app;
    object: any;
    constructor(object: Component | Group, app: any);
    static bindBg(app: any): void;
    static bindShotcuts(app: any): void;
    static clearSelections(): void;
    static get selectedComponents(): (Component | Group)[];
}
export default Transformer;
