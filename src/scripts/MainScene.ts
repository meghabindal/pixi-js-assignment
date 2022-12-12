import { TextButton, AppEngine, Scene } from "./AppEngine"

export default class MainScene extends Scene {

    protected exitButton: TextButton

    constructor(engine: AppEngine, onExit: () => void) {
        super(engine)
        this.exitButton = new TextButton("Exit", onExit)
        this.addChild(this.exitButton)
    }

    public resize(width: number, height: number) {

        this.exitButton.x = width - this.exitButton.width
        this.exitButton.y = 50
    }
    public build(resources: Partial<Record<string, PIXI.LoaderResource>>) {

    }

    public init(loader: PIXI.Loader) {

    }



}