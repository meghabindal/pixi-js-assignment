import * as PIXI from "pixi.js";
import MainScene from "./MainScene";
// import { WrapperFunc } from "./utils";

//sprite class used to store each card with animation information
class CardSprite extends PIXI.Sprite {
    public animTime: number = 0;
    public startAnim: number = 0;
    public zIndex: number = 0;
}

class CardsDeckScene extends MainScene {
    //container store all cards sprites that is used to position cards on the screen
    public cardsConatiner = new PIXI.Sprite();
    public cards: CardSprite[] = [];
    public cardsHeight: number = 0;
    public cardsAnimationWidth: number = 200;
    public direction: number = 1;

    public clock: number = 0;

    public init(loader: PIXI.Loader) {
        //texture sheets to store all types of cards in on big texture
        loader.add("cardsTextures", "images/cards-textures.png");
    }

}

export default CardsDeckScene;
