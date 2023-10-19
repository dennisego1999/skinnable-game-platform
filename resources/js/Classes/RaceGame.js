import * as THREE from "three";
import {GLTFLoader} from "three/addons/loaders/GLTFLoader.js";
import {DRACOLoader} from "three/addons/loaders/DRACOLoader.js";
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
        this.textureLoader = new THREE.TextureLoader();
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
        await this.loadModels();

        //Setup scene
        this.setupScene();

        //Start render loop
        this.animate.call(this);

        //Set camera view
        this.setCameraView({
            x: 0,
            y: 1.1,
            z: 3,
        });
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

        //Set camera view
        this.setCameraView({
            x: 0,
            y: 1,
            z: 0.5,
            instant: true,
        });

        //Update camera projection matrix
        this.camera.updateProjectionMatrix();

        //Add camera to scene
        this.scene.add(this.camera);
    }

    setCameraView(data) {
        if(data.instant) {
            this.camera.position.set(data.x, data.y, data.z);
            return;
        }

        //Tween camera setting
        gsap.to(this.camera.position, {
            x: data.x,
            y: data.y,
            z: data.z,
            duration: 1,
            ease: 'power2.out'
        });
    }

    setupControls() {
        //Set controls
        this.cameraControls = new OrbitControls(this.camera, this.renderer.domElement);

        //Limit angle => don't go below ground
        this.cameraControls.maxPolarAngle = Math.PI / 2.1;
    }

    async loadModels() {
        //Set car loader
        this.carLoader = new Promise((resolve, reject) => {
            this.gltfLoader.load(
                '/assets/models/car/scene.gltf',
                (gltf) => {
                    //Get the model
                    this.car = gltf.scene.children[0];

                    //Set shadow settings
                    this.car.traverse(item => {
                        if(item.isMesh) {
                            item.castShadow = true;
                            item.receiveShadow = true;
                        }
                    });

                    //Set rotation of car
                    this.car.rotation.z = Math.PI;

                    //Set scale of car
                    this.car.scale.set(0.5, 0.5, 0.5);

                    //Add car to scene
                    this.scene.add(this.car);

                    //Set the car as target of orbit controls
                    this.cameraControls.target = this.car.position;

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
    }

    setupScene() {
        //Create road texture
        const roadAoTexture = this.textureLoader.load("/assets/textures/road/road_ambientOcclusion.jpg");
        const roadRoughnessTexture = this.textureLoader.load("/assets/textures/road/road_roughness.jpg");
        const roadNormalTexture = this.textureLoader.load("/assets/textures/road/road_normal.jpg");
        const roadTexture = this.textureLoader.load("/assets/textures/road/road.jpg");
        roadTexture.anisotropy = this.renderer.capabilities.getMaxAnisotropy();
        roadTexture.wrapT = THREE.RepeatWrapping;
        roadTexture.wrapS = THREE.RepeatWrapping;

        //Create road geometry, material and mesh
        const roadGeometry = new THREE.PlaneGeometry(2, 2);
        const roadMaterial = new THREE.MeshStandardMaterial({
            map: roadTexture,
            normalMap: roadNormalTexture,
            roughnessMap: roadRoughnessTexture,
            aoMap: roadAoTexture
        });
        const roadMesh = new THREE.Mesh(roadGeometry, roadMaterial);
        roadMesh.position.set(0, 0, 0);
        roadMesh.rotation.set(Math.PI / -2, 0, 0);

        //Set shadow settings
        roadMesh.receiveShadow = true;

        //Add road mesh to scene
        this.scene.add(roadMesh);

        //Add directional scene light
        const directionalLight = new THREE.DirectionalLight(0xFFFFFF, 1);
        directionalLight.position.set(0, 2, 3);
        directionalLight.castShadow = true;
        this.scene.add(directionalLight);
    }

    setSun() {
        //Set variables
        const pmremGenerator = new THREE.PMREMGenerator(this.renderer);
        const phi = THREE.MathUtils.degToRad(90 - this.sunParameters.elevation);
        const theta = THREE.MathUtils.degToRad(this.sunParameters.azimuth);

        //Add sun
        this.sun = new THREE.Vector3();
        this.sun.setFromSphericalCoords(1, phi, theta);

        //Set uniforms
        this.sky.material.uniforms['sunPosition'].value.copy(this.sun);

        //Set environment texture
        const renderTarget = pmremGenerator.fromScene(this.sky);
        this.scene.environment = renderTarget.texture;
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
