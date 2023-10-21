import * as THREE from "three";
import {GLTFLoader} from "three/addons/loaders/GLTFLoader.js";
import {DRACOLoader} from "three/addons/loaders/DRACOLoader.js";
import {lerp} from "@/Util/gameHelpers.js";
import {gsap} from "gsap";

export default class SpaceGame {
    constructor(canvasId) {
        this.fps = 1000 / 30;
        this.then = null;
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.animateFrameId = null;
        this.stars = null;
        this.spaceship = null;
        this.spaceshipProgress = 0;
        this.spaceshipLoader = null;
        this.totalProgress = 0;
        this.canvas = document.getElementById(canvasId);
        this.clock = new THREE.Clock();
        this.dracoLoader = new DRACOLoader();
        this.dracoLoader.setDecoderPath('/assets/draco/');
        this.gltfLoader = new GLTFLoader();
        this.gltfLoader.setDRACOLoader(this.dracoLoader);
        this.textureLoader = new THREE.TextureLoader();
        this.spaceshipStartPosition = null;
        this.spaceshipCurrentPosition = new THREE.Vector3();
        this.spaceshipTargetPosition = new THREE.Vector3();

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

        //Load models
        await this.loadModels();

        //Setup scene
        this.setupScene();

        //Setup event listeners
        this.setupEventListeners();

        //Start render loop
        this.animate.call(this);

        //Set camera view
        this.setCameraView({
            x: 0,
            y: 0,
            z: 10,
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
        this.renderer.setPixelRatio(1);
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
        if (data.instant) {
            this.camera.position.set(data.x, data.y, data.z);
            return;
        }

        //Tween camera setting
        gsap.to(this.camera.position, {
            x: data.x,
            y: data.y,
            z: data.z,
            duration: 3,
            ease: 'power1.inOut'
        });
    }

    async loadModels() {
        //Set car loader
        this.spaceshipLoader = new Promise((resolve, reject) => {
            this.gltfLoader.load(
                '/assets/models/spaceship/scene.glb',
                (gltf) => {
                    //Get the model
                    this.spaceship = gltf.scene.children[0];

                    //Set shadow settings
                    this.spaceship.traverse(item => {
                        if (item.isMesh) {
                            item.castShadow = true;
                            item.receiveShadow = true;
                        }
                    });

                    //Set rotation of car
                    this.spaceship.rotation.z = Math.PI;

                    //Set scale of car
                    this.spaceship.scale.set(0.01, 0.01, 0.01);

                    //Add car to scene
                    this.scene.add(this.spaceship);

                    //Set start position
                    this.spaceshipStartPosition = this.spaceship.position

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
                    this.spaceshipProgress = xhr.loaded / total;

                    //Update progress
                    this.updateProgress();
                },
                (error) => reject(error),
            );
        });

        return Promise.all([this.spaceshipLoader])
    }

    updateProgress() {
        //Keep array of loaders
        const loaders = [
            this.spaceshipLoader,
        ];

        //Add all progresses between the (...) to get the actual % progress
        this.totalProgress = (this.spaceshipProgress) / loaders.length;
    }

    setupScene() {
        //Add directional scene light
        const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
        directionalLight.position.set(0, 2, 3);
        directionalLight.castShadow = true;
        this.scene.add(directionalLight);

        //Add ambient scene light
        const ambientLight = new THREE.AmbientLight(0xffffff, 1);
        this.scene.add(ambientLight);

        //Particles
        const particlesGeometry = new THREE.BufferGeometry();
        const particlesCount = 30000;
        const vertices = new Float32Array(particlesCount);

        //Loop through all the vertices and set their random position
        for (let i = 0; i < particlesCount; i++) {
            let x, y, z;
            do {
                // Generate random positions
                x = (Math.random() - 0.5) * 100;
                y = (Math.random() - 0.5) * 100;
                z = (Math.random() - 0.5) * 100;
            } while (this.spaceship.position.distanceTo(new THREE.Vector3(x, y, z)) < 10); // Minimum distance from spaceship

            vertices[i * 3] = x;
            vertices[i * 3 + 1] = y;
            vertices[i * 3 + 2] = z;
        }

        //Set position attr
        particlesGeometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
        const particleTexture = this.textureLoader.load('/assets/textures/star.png'); // Add a texture to the particles

        //Create star material
        const particlesMaterial = new THREE.PointsMaterial({
            map: particleTexture,
            size: 0.2,
            sizeAttenuation: true,
            transparent: true,
        });

        //Create star points
        this.stars = new THREE.Points(particlesGeometry, particlesMaterial);

        //Add stars to scene
        this.scene.add(this.stars);
    }

    setupEventListeners() {
        //Add event listeners
        document.body.addEventListener('mousemove', event => this.onMouseMove.call(this, event));
        window.addEventListener('resize', () => this.resize());
    }

    removeEventListeners() {
        //Remove event listeners
        document.body.removeEventListener('mousemove', event => this.onMouseMove.call(this, event));
        window.removeEventListener('resize', () => this.resize());
    }

    onMouseMove(event) {
        //Calculate the normalized mouse position within the canvas
        const mouse = new THREE.Vector2(
            (event.clientX / window.innerWidth) - 0.5,
            -(event.clientY / window.innerHeight) + 0.5,
        );

        //Create a new Vector3 with the mouse position in 3D space
        const cursor3D = new THREE.Vector3(mouse.x, mouse.y, 0);

        //Unproject the cursor position from 2D to 3D space
        cursor3D.unproject(this.camera);

        //Set the spaceship's target position to the cursor position
        this.spaceshipTargetPosition.copy(cursor3D);
    }


    resize() {
        //Set correct aspect
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();

        //Set canvas size and aspect ratio again
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
        //Rotate stars
        this.stars.rotation.y += -0.0001;

        if (this.spaceship) {
            //Lerp spaceship position
            this.spaceshipCurrentPosition.x = lerp(this.spaceshipCurrentPosition.x, this.spaceshipTargetPosition.x, 0.05);
            this.spaceshipCurrentPosition.y = lerp(this.spaceshipCurrentPosition.y, this.spaceshipTargetPosition.y, 0.05);

            //Apply to spaceship
            this.spaceship.position.copy(this.spaceshipCurrentPosition);
        }

        //Render
        this.renderer.render(this.scene, this.camera);
    }
}
