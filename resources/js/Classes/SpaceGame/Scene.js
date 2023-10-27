import * as BABYLON from "babylonjs";

export class Scene {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.engine = null;
        this.scene = null;
        this.camera = null;
        this.light = null;
        this.cameraStartPosition = new BABYLON.Vector3(0, 5, -10);
        this.assetsManager = null;

        //Setup scene
        this.setupScene();

        //Setup asset manager
        this.setupAssetManager();

        //Set up render loop
        this.setupRenderLoop();
    }

    setupScene() {
        //Create engine
        this.engine = new BABYLON.Engine(this.canvas, true, {
            preserveDrawingBuffer: true,
            stencil: true
        });

        //Create scene
        this.scene = new BABYLON.Scene(this.engine);

        //Create camera
        this.camera = new BABYLON.ArcRotateCamera('camera', 3 * Math.PI / 2, Math.PI / 8, 1,  this.cameraStartPosition, this.scene);
        this.camera.zoomOnFactor = 1;
        this.camera.lowerRadiusLimit = 5;
        this.camera.upperRadiusLimit = 20;

        //Set target of camera => scene origin
        this.camera.setTarget(BABYLON.Vector3.Zero());

        //Attach camera to canvas
        this.camera.attachControl(this.canvas, true);
    }

    setupAssetManager() {
        //Setup manager
        this.assetsManager = new BABYLON.AssetsManager(this.scene);

        //Disable default loading screen
        this.assetsManager.useDefaultLoadingScreen = false;
    }

    setupRenderLoop() {
        this.engine.runRenderLoop(() => {
            //Render the scene
            this.scene.render();
        });
    }

    resize() {
        this.engine.resize();
    }
}