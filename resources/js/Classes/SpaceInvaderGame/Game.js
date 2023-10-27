import * as PIXI from "pixi.js";
import PixiManager from "@/Classes/SpaceInvaderGame/PixiManager.js";

export class Game extends PixiManager {
    constructor(canvasId) {
        super(canvasId);

        this.assets = null;
        this.bgSprite = null;

        //Init
        this.init();
    }

    init() {
        //Create pixi app
        this.createPixiApp();

        //Setup scene
        this.setupScene();

        //Setup renderer
        this.setupRender({
            object: this.app.stage,
            action: () => {
                //Add custom render logic here
            }
        });

        //Start rendering
        this.enableRendering();
    }

    async setupScene() {
        //Load assets
        await this.loadAssets();

        //Add assets to scene
        this.addAssetsToScene();
    }

    async loadAssets() {
        //Define assets manifest
        const manifest = {
            bundles: [
                {
                    name: 'game-assets',
                    assets: [
                        {
                            alias: 'background',
                            src: '/assets/images/space-invader/SpaceInvaders_Background.png',
                        },
                        {
                            alias: 'buildings',
                            src: '/assets/images/space-invader/SpaceInvaders_BackgroundBuildings.png',
                        },
                        {
                            alias: 'floor',
                            src: '/assets/images/space-invader/SpaceInvaders_BackgroundFloor.png',
                        },
                    ],
                },
            ]
        };

        //Init the manifest
        await PIXI.Assets.init({manifest});

        //Load bundle
        this.assets = await PIXI.Assets.loadBundle('game-assets');
    }

    addAssetsToScene() {
        //Create sprites
        this.bgSprite = new PIXI.TilingSprite(
            this.assets['background'],
            window.innerWidth,
            window.innerHeight
        );

        //Add sprites to scene
        this.app.stage.addChild(this.bgSprite);
    }


    resize() {
        //Resize the app
        this.app.resize();

        //Update the sprites
        this.bgSprite.width = window.innerWidth;
        this.bgSprite.height = window.innerHeight;
    }
}
