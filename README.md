
# Pixi JS Assignment

Application is a collection of three parts, that is implemented using webpack ,typescript and pixijs.

## Card Deck

* `Requirements`

Create 144 sprites (NOT graphics object) that are stacked on each other like cards in a deck(so object above covers bottom one, but not completely). Every second 1 object from top of stack goes to other stack - animation of moving should be 2 seconds long. So at the end of whole process you should have reversed stack. Display number of fps in left top corner and make sure, that this demo runs well on mobile devices.

* `About Card Deck`

1. Used a png having 52 cards images from which sprites have been created.
2. Out of the Sprites, Cards are showing one above the another and once the stack is completed then , they will create a stack in another direction., i.e. will switch the direction.

## Emoji Text

* `Requirements`

Create a tool that will allow mixed text and images in an easy way (for example displaying text with emoticons or prices with money icon). It should come up every 2 seconds a random text with images in random configuration (image + text + image, image + image + image, image + image + text, text + image + text etc) and a random font size.


* `Implementation`

1. Here We need to show text and some emoji images mixed.
2. Used the png and create sprites out of it and mix it with random text to display it to make a combination.


## Fire Effect

* `Requirements`
Particles - make a demo that shows an awesome fire effect. Please keep number of images low (max 10 sprites on screen at once). Feel free to use existing libraries how you would use them in a real project.


* `Implementation`

1. Here using sprites, try to display the animation with min number of texture sheet.

## Full Screen

Project can be make full screen using full screen option in main menu.