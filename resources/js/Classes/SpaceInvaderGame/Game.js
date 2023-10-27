import * as PIXI from "pixi.js";
import PixiManager from "@/Classes/SpaceInvaderGame/PixiManager.js";

export class Game extends PixiManager {
    constructor(canvasId) {
        super(canvasId);

        this.assets = null;
        this.bg = null;
        this.logo = null;

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
                        {
                            alias: 'invaders',
                            src: '/assets/images/space-invader/SpaceInvaders.png',
                        },
                        {
                            alias: 'logo',
                            src: '/assets/images/space-invader/SpaceInvaders_LogoLarge.png',
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
        this.bg = new PIXI.TilingSprite(
            this.assets['background'],
            window.innerWidth,
            window.innerHeight
        );

        //Create sprites
        this.logo = new PIXI.Sprite(this.assets['logo']);

        //Update assets
        this.updateAssets();

        //Add sprites to scene
        this.app.stage.addChild(this.bg, this.logo);
    }

    updateAssets() {
        //Update logo
        const logoAspectRatio = 640 / 320;
        this.logo.width = 400;
        this.logo.height = this.logo.width / logoAspectRatio;
        this.logo.position.x = (window.innerWidth - this.logo.width) / 2;
        this.logo.position.y = (window.innerHeight - this.logo.height) / 2;
    }

    resize() {
        //Resize the app
        this.app.resize();

        //Update the sprites
        this.bg.width = window.innerWidth;
        this.bg.height = window.innerHeight;

        //Update assets
        this.updateAssets();
    }
}
