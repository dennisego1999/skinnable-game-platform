import * as THREE from "three";
import {MovementControls} from "@/Classes/SpaceGame/MovementControls.js";
import {lerp} from "@/Util/gameHelpers.js";
import {gsap} from "gsap";
import {GameModel} from "@/Classes/SpaceGame/GameModel.js";

export default class Game {
    constructor(canvasId) {
        this.fps = 1000 / 30;
        this.then = null;
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.controls = null;
        this.animateFrameId = null;
        this.stars = null;
        this.spaceship = null;
        this.canvas = document.getElementById(canvasId);
        this.clock = new THREE.Clock();
        this.textureLoader = new THREE.TextureLoader();
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

        //Setup scene
        this.setupScene();

        //Setup controls
        this.setupControls();

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

    async setupScene() {
        //Create spaceship
        this.spaceship = new GameModel(this.scene, '/assets/models/spaceship/scene.glb', {
            scale: new THREE.Vector3(0.01, 0.01, 0.01),
            rotation: new THREE.Euler(Math.PI / 2, Math.PI, 0)
        });

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
            vertices[i * 3] = (Math.random() - 0.5) * 100;
            vertices[i * 3 + 1] = (Math.random() - 0.5) * 100;
            vertices[i * 3 + 2] = (Math.random() - 0.5) * 100;
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

    setupControls() {
        this.controls = new MovementControls(this.spaceship, this.camera, this.spaceshipTargetPosition, true);
    }

    setupEventListeners() {
        //Add event listeners
        window.addEventListener('resize', () => this.resize());
    }

    removeEventListeners() {
        //Remove event listeners
        document.body.removeEventListener('keydown', event => this.onKeyDown.call(this, event));
        window.removeEventListener('resize', () => this.resize());
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

        if(this.spaceship && this.spaceship.model) {
            //Lerp spaceship position
            this.spaceshipCurrentPosition.x = lerp(this.spaceshipCurrentPosition.x, this.spaceshipTargetPosition.x, 0.05);
            this.spaceshipCurrentPosition.y = lerp(this.spaceshipCurrentPosition.y, this.spaceshipTargetPosition.y, 0.05);

            //Apply to spaceship
            this.spaceship.model.position.copy(this.spaceshipCurrentPosition);
        }

        //Render
        this.renderer.render(this.scene, this.camera);
    }
}
