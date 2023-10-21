import {DRACOLoader} from "three/addons/loaders/DRACOLoader.js";
import {GLTFLoader} from "three/addons/loaders/GLTFLoader.js";

export class GameModel {
    constructor(scene, assetUrl, startOptions) {
        this.scene = scene;
        this.assetUrl = assetUrl;
        this.startOptions = startOptions;
        this.model = null;
        this.dracoLoader = new DRACOLoader();
        this.dracoLoader.setDecoderPath('/assets/draco/');
        this.gltfLoader = new GLTFLoader();
        this.gltfLoader.setDRACOLoader(this.dracoLoader);

        //Init model
        this.init();
    }

    async init() {
        //Load the model
        new Promise((resolve, reject) => {
            this.gltfLoader.load(
                this.assetUrl,
                (gltf) => {
                    //Get the model
                    this.model = gltf.scene.children[0];

                    //Set shadow settings
                    this.model.traverse(item => {
                        if (item.isMesh) {
                            item.castShadow = true;
                            item.receiveShadow = true;
                        }
                    });

                    if(this.startOptions.position) {
                        //Set position of the model
                        this.model.position.copy(this.startOptions.position);
                    }

                    if(this.startOptions.rotation) {
                        //Set rotation of the model
                        this.model.rotation.copy(this.startOptions.rotation);
                    }

                    if(this.startOptions.scale) {
                        //Set scale of the model
                        this.model.scale.copy(this.startOptions.scale);
                    }

                    //Add car to scene
                    this.scene.add(this.model);

                    //Resolve
                    resolve(gltf)
                },
                (xhr) => {
                    //Calculate car progress
                    // const progress = (xhr.loaded / xhr.total) * 100;

                    //Log progress
                    // console.log('model load progress: ', progress + '%');
                },
                (error) => reject(error),
            );
        });
    }
}
