
import * as PIXI from 'pixi.js'
import { AppEngine, TextMenuScene } from './AppEngine';
import CardsDeckScene from './CardsDeckScene';
import TextEmojiScene from './TextEmojiScene';


export default class MainApp extends AppEngine {
    constructor(container: HTMLElement) {
        super(container);
        console.log(this);

    }
    public launch() {

        this.setRequiredFps(60)

        const fpsDisplay = document.createElement('div')
        fpsDisplay.style.position = "absolute";

        fpsDisplay.style.color = "#ffffff";
        fpsDisplay.style.fontSize = "26px"


        this.container.appendChild(fpsDisplay)


        const menu = new TextMenuScene(this);

        const returnToMenu = () => {
            this.setActiveScene("menu")
        }
        const loader = new PIXI.Loader()
        const cardsDeckScene = new CardsDeckScene(this, returnToMenu);
        const textEmojiScene = new TextEmojiScene(this, returnToMenu)


        cardsDeckScene.init(loader);
        textEmojiScene.init(loader);


        menu.add("CARDS DECK", () => {
            this.setActiveScene("cards-deck");
        })

        menu.add("TEXT EMOJIS", () => {
            this.setActiveScene("text-emoji");
        })


        this.addScene("menu", menu);
        this.addScene("cards-deck", cardsDeckScene)
        this.addScene("text-emoji", textEmojiScene)


        this.setActiveScene("menu")
        fpsDisplay.style.left = "0";
        fpsDisplay.style.top = "50%";
        fpsDisplay.style.width = "100%";
        fpsDisplay.style.textAlign = "center";


        fpsDisplay.innerHTML = "Loading please wait..."

        window.addEventListener("resize", () => { this.resize() })
        loader.load((loader, resources: Partial<Record<string, PIXI.LoaderResource>>) => {


            cardsDeckScene.build(resources)
            cardsDeckScene.resize(this.renderer.width, this.renderer.height)

            textEmojiScene.build(resources)
            textEmojiScene.resize(this.renderer.width, this.renderer.height)

            fpsDisplay.style.left = "10px";
            fpsDisplay.style.top = "10px";
            fpsDisplay.style.width = "auto";
            this.start(() => {

            })

            setInterval(() => {
                fpsDisplay.innerHTML = `${this.currentFps} fps`
            }, 200)


        })


    }
}




