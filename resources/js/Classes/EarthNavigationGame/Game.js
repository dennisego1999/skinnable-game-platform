import "babylonjs-loaders";
import * as BABYLON from "babylonjs";
import {gsap} from "gsap";
import {Scene} from "@/Classes/EarthNavigationGame/Scene.js";

export class Game extends Scene {
    constructor(canvasId) {
        super(canvasId);

        this.particleSystems = [];
        this.earth = null;
        this.activeMarker = null;
        this.actionManager = new BABYLON.ActionManager(this.scene);

        //Set up game
        this.setupGame();
    }

    setupGame() {
        //Disable interaction
        this.disableInteraction();

        //Create a light for the scene
        this.light = new BABYLON.HemisphericLight('light', new BABYLON.Vector3(0, 1, 0), this.scene);
        this.light.intensity = 0.7;

        //Create game objects
        this.createGameObjects();
    }

    createParticleSystem() {
        //Create a particle system
        const particleSystem = new BABYLON.ParticleSystem('particles', 10, this.scene);

        //Texture of each particle
        particleSystem.particleTexture = new BABYLON.Texture('/assets/images/flare/flare.png', this.scene);

        //Colors of all particles
        particleSystem.color1 = new BABYLON.Color4(0.7, 0.8, 1.0, 1.0);
        particleSystem.color2 = new BABYLON.Color4(0.2, 0.5, 1.0, 1.0);
        particleSystem.colorDead = new BABYLON.Color4(0, 0, 0.2, 0.0);

        //Size of each particle
        particleSystem.minSize = 0.01;
        particleSystem.maxSize = 0.07;

        //Lifetime of each particle
        particleSystem.minLifeTime = 0.2;
        particleSystem.maxLifeTime = 0.4;

        //Emission rate
        particleSystem.emitRate = 1500;

        //Blend mode
        particleSystem.blendMode = BABYLON.ParticleSystem.BLENDMODE_ONEONE;

        //Speed
        particleSystem.minEmitPower = 1;
        particleSystem.maxEmitPower = 3;
        particleSystem.updateSpeed = 0.005;

        //Direction of each particle after it has been emitted
        particleSystem.direction1 = new BABYLON.Vector3(-1, -1, -1);

        return particleSystem;
    }

    createGameObjects() {
        //Create skybox
        const skybox = BABYLON.MeshBuilder.CreateBox('skybox', {size: 1000}, this.scene);
        const skyboxMaterial = new BABYLON.StandardMaterial("skyBox", this.scene);
        skyboxMaterial.backFaceCulling = false;
        skyboxMaterial.reflectionTexture = new BABYLON.CubeTexture('/assets/images/skybox/skybox', this.scene);
        skyboxMaterial.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;
        skyboxMaterial.diffuseColor = new BABYLON.Color3(0, 0, 0);
        skyboxMaterial.specularColor = new BABYLON.Color3(0, 0, 0);
        skybox.material = skyboxMaterial;

        //Define asset task names
        const earthTaskName = 'import earth model';

        //Define loading tasks here
        this.assetsManager.addMeshTask(
            earthTaskName,
            '',
            '/assets/models/earth/',
            'scene.gltf'
        );

        //Load all tasks
        this.assetsManager.load();

        //Handle assets success
        this.assetsManager.onFinish = tasks => {
            tasks.forEach(task => {
                if (task.name === earthTaskName) {
                    //Set variable
                    this.earth = new BABYLON.Mesh('earth-parent', this.scene);

                    task.loadedMeshes.forEach(mesh => {
                        //Set scaling of meshes
                        mesh.scaling.x = 0.0007;
                        mesh.scaling.y = 0.0007;
                        mesh.scaling.z = 0.0007;

                        //Set the parent on the mesh
                        mesh.parent = this.earth;
                    });

                    //Set initial scaling
                    this.earth.scaling = new BABYLON.Vector3(0, 0, 0);

                    //Define markers
                    const markers = [{
                        name: 'marker-1',
                        position: {
                            x: 0,
                            y: 2.4,
                            z: -3.2
                        }
                    }];

                    //Create markers
                    markers.forEach(marker => {
                        this.createMarker(marker);
                    });

                    const timeline = gsap.timeline();
                    timeline
                        .to('#loader > div', {
                            scale: 0,
                            duration: 1,
                            ease: 'expo.inOut'
                        }, '0')
                        .to('#loader', {
                            yPercent: -100,
                            duration: 1,
                            ease: 'power2.inOut',
                            onComplete: () => {
                                //Tween rotation of the mesh
                                gsap.from(this.earth.rotation, {
                                    x: 0,
                                    y: -Math.PI,
                                    z: 0,
                                    duration: 2,
                                    ease: 'power2.inOut'
                                });

                                //Tween scaling of the mesh
                                gsap.to(this.earth.scaling, {
                                    x: 1,
                                    y: 1,
                                    z: 1,
                                    duration: 2,
                                    ease: 'power2.inOut',
                                    onComplete: () => {
                                        //Start emitting
                                        this.particleSystems.forEach(item => item.system.start());

                                        //Enable interactivity
                                        this.enableInteraction();

                                        //Dispatch event
                                        document.dispatchEvent(new Event('openSpaceModal'));
                                    }
                                });
                            }
                        }, '0.7');
                }
            });
        };
    }

    createMarker(data) {
        //Build mesh
        const marker = new BABYLON.MeshBuilder.CreateSphere(data.name, {
            segments: 64,
            diameter: 0.5,
        }, this.scene);

        //Make marker pickable
        marker.isPickable = true;

        //Set a material
        marker.material = new BABYLON.StandardMaterial('transparent-material', this.scene);
        marker.material.alpha = 0;

        //Settings
        marker.parent = this.earth;
        marker.position = new BABYLON.Vector3(data.position.x, data.position.y, data.position.z);

        //Set action
        marker.actionManager = this.actionManager;
        marker.actionManager.registerAction(
            new BABYLON.ExecuteCodeAction(
                {
                    trigger: BABYLON.ActionManager.OnPickTrigger,
                },
                () => {
                    //Set active marker
                    this.activeMarker = marker;

                    //Stop particle system
                    const particleSystemObject = this.particleSystems.find(ps => ps.name === data.name);
                    particleSystemObject.system.stop();

                    //Animate camera view to marker
                    this.animateCameraView('zoomToMesh', this.camera.position, marker.position, false);

                    //Dispatch event
                    document.dispatchEvent(new Event('openMarkerInfo'));
                }
            )
        );

        //Emit from the marker
        const particleSystem = this.createParticleSystem();
        particleSystem.emitter = marker;

        //Set the minimum and maximum emit box to the same point (the center of the marker)
        particleSystem.minEmitBox = new BABYLON.Vector3(0, 0, 0);
        particleSystem.maxEmitBox = new BABYLON.Vector3(0, 0, 0);

        //Add to particle systems list
        this.particleSystems.push({
            name: data.name,
            system: particleSystem,
        });
    }

    animateCameraView(name, currentPos, targetPos, resetCameraControl) {
        //Smoothly zoom in on the marker
        const ease = new BABYLON.CubicEase();
        ease.setEasingMode(BABYLON.EasingFunction.EASINGMODE_EASEINOUT);

        //Disable interaction
        this.disableInteraction();

        //Start animation
        const zoomAnimation = BABYLON.Animation.CreateAndStartAnimation(
            name,
            this.camera,
            'position',
            60,
            180,
            currentPos,
            targetPos,
            0,
            ease,
            () => {
                if (!resetCameraControl) {
                    return;
                }

                //Enable interaction
                this.enableInteraction();
            }
        );
        zoomAnimation.disposeOnEnd = true;
    }

    resetCameraView() {
        //Enable particle system
        const particleSystemObject = this.particleSystems.find(ps => ps.name === this.activeMarker.name);
        particleSystemObject.system.start();

        //Animate camera view to center
        this.animateCameraView('resetCameraView', this.activeMarker.position, this.cameraStartPosition, true);

        //Reset active marker variable
        this.activeMarker = null;
    }

    onPointerDown() {
        //Update the cursor
        this.updateCursor();
    }

    onPointerUp() {
        //Update the cursor
        this.updateCursor();
    }

    updateCursor() {
        if (this.canvas.classList.contains('cursor-grab')) {
            this.canvas.classList.remove('cursor-grab');
            this.canvas.classList.add('cursor-grabbing');

            return;
        }

        this.canvas.classList.remove('cursor-grabbing');
        this.canvas.classList.add('cursor-grab');
    }

    enableInteraction() {
        if(this.canvas.classList.contains('pointer-events-none')) {
            this.canvas.classList.remove('pointer-events-none')
        }
    }

    disableInteraction() {
        if(!this.canvas.classList.contains('pointer-events-none')) {
            this.canvas.classList.add('pointer-events-none')
        }
    }

    addEventListeners() {
        window.addEventListener('resize', () => this.resize());
        document.addEventListener('pointerup', () => this.onPointerUp.call(this));
        document.addEventListener('pointerdown', () => this.onPointerDown.call(this));
    }

    removeEventListeners() {
        window.removeEventListener('resize', () => this.resize());
        document.removeEventListener('pointerup', () => this.onPointerUp.call(this));
        document.removeEventListener('pointerdown', () => this.onPointerDown.call(this));
    }
}
