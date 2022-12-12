import * as PIXI from 'pixi.js'

import MainScene from './MainScene';
import { ObjectsData } from './utils';
import { WrapperFunc } from './utils';

//regular expression to match the tags in input
let rgTags = new RegExp("\<[\\s\\S]*?\/\>", "g")


class TextImages extends PIXI.Container {

    //dictionary to hold the images list
    public static ImagesList: { [index: string]: PIXI.Texture } = {}

    // load images list from the texture sheet
    public static LoadImagesList(texture: PIXI.BaseTexture, prefix: string, width: number, height: number, tags?: string[]) {

        let x = 0;
        let y = 0;
        if (tags) {
            tags.forEach(tag => {
                TextImages.ImagesList[prefix + tag] = new PIXI.Texture(texture, new PIXI.Rectangle(x, y, width, height))
                x += width
                if (x > texture.width) {
                    x = 0;
                    y += height
                }
            })
        }
        else {
            let cols = (texture.width / width);
            let rows = texture.height / height;

            for (y = 0; y < rows; y++) {
                for (x = 0; x < cols; x++) {
                    TextImages.ImagesList[`${prefix}${y}x${x}`] = new PIXI.Texture(texture, new PIXI.Rectangle(x * width, y * height, width, height))

                }
            }

        }


    }

    //object pool that manage text objects
    public static TextsPool = new ObjectsData(() => {
        return new PIXI.Text("dummy", new PIXI.TextStyle({
            fontFamily: 'Arial',
            fill: '#ffffff',
            fontSize: 36,
        }))
    }, 100)

    //object pool that manage image objects
    public static ImagesPool = new ObjectsData(() => {
        return new PIXI.Sprite(PIXI.Texture.WHITE)
    }, 100)


    public needsUpdate: boolean = false

    public clearChildren() {
        const childCount = this.children.length;
        let child;
        for (let i = 0; i < childCount; i++) {
            child = this.removeChildAt(0)
            if (child instanceof PIXI.Text) {
                TextImages.TextsPool.free(child)
            }
            else {
                TextImages.ImagesPool.free(child)
            }
        }

    }
    public setText(input: string) {

        console.log(input)
        //free existing children and put back to their related pools
        this.clearChildren()

        const tags = input.match(rgTags)

        //style object to maintain style changes in the text parts, we can add more style tags and properties here which are supported by pixi
        const textStyles = {
            fontSize: 24,
            fill: '#ffffff'
        }


        if (tags) {
            // Parse tags and setup sequence list
            tags.forEach(tag => {
                input = input.replace(tag, "<tag>" + tag.replace("<", "{").replace(">", "}") + "<tag>")
            })

            // get parts in sequence of display
            const parts = input.trim().split("<tag>")

            parts.forEach(part => {

                if (part !== "") {
                    if (part.startsWith("{") && part.endsWith("/}")) {

                        const partInfo = part.replace(/\{|\/\}/g, "").split(" ", 2)
                        //set fontsize for upcoming text object
                        if (partInfo[0] === "fs") {
                            textStyles.fontSize = parseInt(partInfo[1])
                        }
                        //set fontcolor for upcoming text object
                        else if (partInfo[0] === "fc") {
                            textStyles.fill = partInfo[1]
                        }

                        //embed image form imageslist
                        else if (partInfo[0] === "mg") {
                            //if supplied image tags matches then embed
                            if (TextImages.ImagesList.hasOwnProperty(partInfo[1])) {
                                //fetch available image object from the pool
                                const img = TextImages.ImagesPool.get() as PIXI.Sprite
                                img.texture = TextImages.ImagesList[partInfo[1]]
                                let scale = textStyles.fontSize / img.texture.height
                                img.scale.set(scale, scale)
                                this.addChild(img)
                            }

                        }
                    }
                    else {

                        //part is a text then fetch available text object from pool

                        if (part !== "") {
                            const text = TextImages.TextsPool.get() as PIXI.Text
                            Object.assign(text.style, textStyles)
                            text.text = part
                            this.addChild(text)
                        }


                    }
                }
            })

        }
        else {
            const text = TextImages.TextsPool.get() as PIXI.Text
            text.text = input
            this.addChild(text)
        }
        this.needsUpdate = true
    }

    public update() {
        if (this.needsUpdate) {
            let x = 0;
            let maxH = 0;
            let part;
            this.children.forEach(child => {
                part = child as PIXI.Sprite
                part.x = x;
                x += part.width
                maxH = Math.max(maxH, part.height)
            })

            maxH /= 2;
            this.children.forEach(child => {
                part = child as PIXI.Sprite
                part.y = maxH - (part.height / 2);

            })
        }


    }
}


export default class TextEmojiScene extends MainScene {

    public textImages: TextImages
    public sampleWords: string[]
    public sampleImages: string[]

    public clock: number = 0

    public activated() {
        this.clock = 0
    }
    public build(resources: Partial<Record<string, PIXI.LoaderResource>>) {

        const emojis = (resources.emojis?.texture as PIXI.Texture).baseTexture

        TextImages.LoadImagesList(emojis, "m2", 20, 20)


        this.textImages = new TextImages()

        this.addChild(this.textImages)

        // generate some random words for combination
        this.sampleWords = "Self-confidence is a state of mind where someone pushes their boundaries and encourages belief from the very beginning, and this comes from a place of self-love,You ought to love yourself to gain that freedom from doubting your actions".split(" ")
        this.sampleImages = Object.keys(TextImages.ImagesList)

        this.generateRandomSample()

    }


    public generateRandomSample() {

        const parts: string[] = []
        const partsCount = Math.floor(Math.random() * 10) + 4
        let lastPartType = 0;
        for (let i = 0; i < partsCount; i++) {
            if (Math.floor(Math.random() * 3) == 2) {
                lastPartType = 1;
                parts.push(`<mg ${this.sampleImages[Math.floor(Math.random() * (this.sampleImages.length - 2))]}/>`)
            }
            else {
                if (lastPartType === 2) {
                    parts.push(" ")
                }
                lastPartType = 2

                if (Math.floor(Math.random() * 2) == 1) {

                    parts.push(`<fs ${Math.floor(Math.random() * 50) + 12}/>`)
                }

                if (Math.floor(Math.random() * 2) == 1) {

                    parts.push(`<fc ${'#' + (Math.random() * 0xFFFFFF << 0).toString(16).padStart(6, '0')}/>`)
                }

                parts.push(this.sampleWords[Math.floor(Math.random() * (this.sampleWords.length - 1))])
            }
        }
        this.textImages.setText(parts.join(""))
    }
    public init(loader: PIXI.Loader) {

        // load texture sheets for emojis
        loader.add('emojis', 'images/emojis.png')
    }
    public update(timeDelta: number) {

        if (this.textImages) {

            const time = WrapperFunc.BounceOut(Math.sin(this.clock))
            const newY = ((this.engine.renderer.height * 0.15) * time) + (this.engine.renderer.height * 0.5) - 150

            this.textImages.x = (this.engine.renderer.width / 2) - (this.textImages.width / 2)


            this.textImages.update()

            // check if text animated out of the screen that create another random text
            if (newY > this.engine.renderer.height && this.textImages.y < this.engine.renderer.height) {
                this.generateRandomSample();
            }
            this.textImages.y = newY;



        }
        this.clock += timeDelta


    }

}