import * as THREE from "three";
import {GLTFLoader} from "three/examples/jsm/loaders/GLTFLoader";
import {DRACOLoader} from "three/examples/jsm/loaders/DRACOLoader";
import {OrbitControls} from "three/addons/controls/OrbitControls.js";
import {gsap} from "gsap";

export default class RaceGame {
    constructor(canvasId) {
        this.cameraControls = null;
        this.fps = 1000 / 30;
        this.then = null;
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.animateFrameId = null;
        this.car = null;
        this.carWheels = [];
        this.carProgress = 0;
        this.carLoader = null;
        this.totalProgress = 0;
        this.canvas = document.getElementById(canvasId);
        this.clock = new THREE.Clock();
        this.dracoLoader = new DRACOLoader();
        this.dracoLoader.setDecoderPath('/assets/draco/');
        this.gltfLoader = new GLTFLoader();
        this.gltfLoader.setDRACOLoader(this.dracoLoader);

        //Init game
        this.init();
    }

    async init() {
        //Set scene
        this.scene = new THREE.Scene();

        //Setup renderer
        this.setupRenderer();

        //Setup camera
        this.setupCamera();

        //Setup controls
        this.setupControls();

        //Load models
        // await this.loadModels();

        //Setup scene
        this.setupScene();

        //Start render loop
        this.animate.call(this);
    }

    setupRenderer() {
        //Set WEBGL renderer
        this.renderer = new THREE.WebGLRenderer({
            antialias: true,
            powerPreference: 'high-performance',
            canvas: this.canvas,
        });

        //Set size & aspect ratio
        this.renderer.toneMapping = THREE.ReinhardToneMapping;
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(window.devicePixelRatio);
    }

    setupCamera() {
        //Set perspective camera
        this.camera = new THREE.PerspectiveCamera(35, this.canvas.offsetWidth / this.canvas.offsetHeight, 0.1, 1000);

        //Set camera setting
        gsap.to(this.camera.position, {
            x: 0,
            y: 1,
            z: 4,
            duration: 0.4,
            ease: 'power1.easeInOut'
        });

        //Update camera projection matrix
        this.camera.updateProjectionMatrix();

        //Add camera to scene
        this.scene.add(this.camera);
    }

    setupControls() {
        //Set controls
        this.cameraControls = new OrbitControls(this.camera, this.renderer.domElement);
    }

    async loadModels() {
        //Set car loader
        this.carLoader = new Promise((resolve, reject) => {
            this.gltfLoader.load(
                '/assets/models/ferrari.glb',
                (gltf) => {
                    //Get the model
                    this.car = gltf.scene.children[0];

                    //Set materials
                    const bodyMaterial = new THREE.MeshPhysicalMaterial({
                        color: 0xff0000, metalness: 1.0, roughness: 0.5, clearcoat: 1.0, clearcoatRoughness: 0.03
                    });

                    const detailsMaterial = new THREE.MeshStandardMaterial({
                        color: 0xffffff, metalness: 1.0, roughness: 0.5
                    });

                    const glassMaterial = new THREE.MeshPhysicalMaterial({
                        color: 0xffffff, metalness: 0.25, roughness: 0, transmission: 1.0
                    });

                    //Prepare the car
                    this.car.getObjectByName('body').material = bodyMaterial;
                    this.car.getObjectByName('rim_fl').material = detailsMaterial;
                    this.car.getObjectByName('rim_fr').material = detailsMaterial;
                    this.car.getObjectByName('rim_rr').material = detailsMaterial;
                    this.car.getObjectByName('rim_rl').material = detailsMaterial;
                    this.car.getObjectByName('trim').material = detailsMaterial;
                    this.car.getObjectByName('glass').material = glassMaterial;

                    this.carWheels.push(
                        this.car.getObjectByName('wheel_fl'),
                        this.car.getObjectByName('wheel_fr'),
                        this.car.getObjectByName('wheel_rl'),
                        this.car.getObjectByName('wheel_rr')
                    );

                    //Get shadow texture
                    const shadow = new THREE.TextureLoader().load('/assets/textures/ferrari_ao.png');

                    //Create car shadow
                    const mesh = new THREE.Mesh(
                        new THREE.PlaneGeometry(0.655 * 4, 1.3 * 4),
                        new THREE.MeshBasicMaterial({
                            map: shadow, blending: THREE.MultiplyBlending, toneMapped: false, transparent: true
                        })
                    );
                    mesh.rotation.x = - Math.PI / 2;
                    mesh.renderOrder = 2;
                    this.car.add(mesh);

                    //Add car to scene
                    this.scene.add(this.car);

                    //Resolve
                    resolve(gltf)
                },
                (xhr) => {
                    //Get total
                    let total = xhr.total;

                    if (total === 0) {
                        //Set default
                        total = 1681572;
                    }

                    //Calculate car progress
                    this.carProgress = xhr.loaded / total;

                    //Update progress
                    this.updateProgress();
                },
                (error) => reject(error),
            );
        });

        return Promise.all([this.carLoader])
    }

    updateProgress() {
        //Keep array of loaders
        const loaders = [
            this.carLoader,
        ];

        //Add all progresses between the (...) to get the actual % progress
        this.totalProgress = (this.carProgress) / loaders.length;

        //TODO: apply this percentage to a progress bar
    }

    setupScene() {
        //Add hemisphere light
        const hemiLight = new THREE.HemisphereLight(0xffffff, 0x444444);
        hemiLight.position.set(0, 20, 0);
        this.scene.add(hemiLight);

        //Add directional light
        this.dirLight = new THREE.DirectionalLight(0xffffff, 1);
        this.dirLight.position.set(-3, 6, -10);
        this.dirLight.castShadow = true;
        this.dirLight.shadow.camera = new THREE.OrthographicCamera(-10, 10, 10, -10, 1, 1000);
        this.dirLight.shadow.mapSize.set(4096, 4096);
        this.scene.add(this.dirLight);

        const geometry = new THREE.BoxGeometry( 1, 1, 1 );
        const material = new THREE.MeshBasicMaterial( {color: 0x00ff00} );
        const cube = new THREE.Mesh( geometry, material );
        this.scene.add( cube );
    }

    resize() {
        //Set correct aspect
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();

        //Set canvas size again
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }

    animate() {
        const now = Date.now();
        const delta = now - this.then;

        if (delta > this.fps) {
            this.then = now - (delta % this.fps);

            //Render
            this.render(delta);
        }

        //Request the animation frame
        this.animateFrameId = requestAnimationFrame(this.animate.bind(this));
    }

    render(delta) {
        //Update controls
        this.cameraControls.update();

        //Render
        this.renderer.render(this.scene, this.camera);
    }
}
