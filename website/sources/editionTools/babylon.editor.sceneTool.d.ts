declare module BABYLON.EDITOR {
    class SceneTool extends AbstractDatTool {
        tab: string;
        private _fogType;
        private _physicsEnabled;
        /**
        * Constructor
        * @param editionTool: edition tool instance
        */
        constructor(editionTool: EditionTool);
        isObjectSupported(object: any): boolean;
        createUI(): void;
        update(): boolean;
    }
}
