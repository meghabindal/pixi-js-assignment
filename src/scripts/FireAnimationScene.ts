import * as PIXI from 'pixi.js'
import MainScene from './MainScene';
import { ObjectsData } from './utils';


//sprite class for every partical
class ParticleSprite extends PIXI.Sprite {
    public age: number = 0
    public time: number = 0
    public life: number = 0
    public velX: number = 0;
    public velY: number = 0;
    public gravity: number = 0;
    public lifeDecay: number = 0.1;
    public decay: number = 0;
    public spin: number = 0;
    public pScale: number = 0;


}

class SimpleParticleSystem extends PIXI.Sprite {
    public particleTextures: PIXI.Texture[] = []
    public spritePool: ObjectsData;
    public clock: number = 0;

    constructor(textureSheet: PIXI.Texture, particleWidth: number, particleHeight: number, maxSprites: number = 10) {
        super()


        //generate the sprite object when needed
        this.spritePool = new ObjectsData(() => {
            const spr = new ParticleSprite();
            this.addChild(spr);
            spr.visible = false;
            spr.anchor.set(0.5)
            return spr;

        }, maxSprites)

        //generate the texture sheet
        for (let y = 0; y < textureSheet.baseTexture.height; y += particleHeight) {
            for (let x = 0; x < textureSheet.baseTexture.width; x += particleWidth) {
                this.particleTextures.push(new PIXI.Texture(textureSheet.baseTexture, new PIXI.Rectangle(x, y, particleWidth, particleHeight)))
            }
        }

    }

    public updateSprite(spr: ParticleSprite) {

    }
    public update(timeDelta: number) {
        let spr;

        for (let i = 0; i < this.children.length; i++) {
            spr = this.children[i] as ParticleSprite

            if (spr.visible) {
                spr.life -= spr.lifeDecay
                spr.decay = spr.life / spr.age;
                spr.x += spr.velX
                spr.y += spr.velY;
                spr.velY += spr.gravity

                if (spr.life < 0) {
                    this.spritePool.free(spr);
                    spr.visible = false
                } else {
                    spr.alpha = spr.decay;
                    spr.texture = this.particleTextures[Math.floor((this.particleTextures.length - 1) * (1 - spr.decay))];
                    this.updateSprite(spr)
                }

            }

        }

        this.clock += timeDelta
    }

}

class FireParticleSystem extends SimpleParticleSystem {
    public lastClock: number = 0;

    public updateSprite(spr: ParticleSprite) {
        spr.scale.set(1 - spr.decay, 1 - spr.decay)

    }
    public update(timeDelta: number) {

        //emit new fire partical after 0.25 secs
        if (this.clock - this.lastClock > 0.25) {
            const spr = this.spritePool.get() as ParticleSprite
            if (spr) {
                spr.age = 2;
                spr.life = spr.age;
                spr.velY = -0.8;
                spr.gravity = 0;

                spr.lifeDecay = 0.03;
                spr.visible = true
                spr.x = 0;
                spr.y = 0;
            }

            this.lastClock = this.clock;
        }

        super.update(timeDelta)
    }
}




export default class FireAnimationScene extends MainScene {

    public clock: number = 0
    public fireContainer = new PIXI.Sprite()

    public fireParticleSystem: FireParticleSystem;
    public activated() {
        this.clock = 0
    }
    public build(resources: Partial<Record<string, PIXI.LoaderResource>>) {

        this.fireParticleSystem = new FireParticleSystem(resources.fire?.texture as PIXI.Texture, 64, 64)
        this.addChild(this.fireParticleSystem)

        this.fireParticleSystem.scale.set(6, 6)
        console.log(this.fireParticleSystem)
    }

    public init(loader: PIXI.Loader) {
        //texture to store all partical textures of fire , that are used based upon partical state
        loader.add('fire', 'images/fire-animation.png');
    }


    public update(timeDelta: number) {

        this.fireParticleSystem.x = (this.engine.renderer.width / 2) - (this.fireParticleSystem.width / 2)
        this.fireParticleSystem.y = (this.engine.renderer.height / 2) - (this.fireParticleSystem.height / 2)

        this.clock += timeDelta;
        this.fireParticleSystem.update(timeDelta)

    }

}