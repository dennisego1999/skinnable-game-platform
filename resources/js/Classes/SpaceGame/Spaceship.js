import {lerp} from "@/Util/gameHelpers.js";
import {Vector3, Mesh, CylinderGeometry, MeshBasicMaterial} from "three";
import {GameModel} from "@/Classes/SpaceGame/GameModel.js";

export class Spaceship extends GameModel {
    constructor(scene, assetUrl, startOptions) {
        super(scene, assetUrl, startOptions);

        this.lasers = [];
        this.currentPosition = new Vector3();
        this.targetPosition = new Vector3();
        this.laserGeometry = new CylinderGeometry(0.1, 0.01, 0.2, 32, 32);
        this.laserMaterial = new MeshBasicMaterial({color: 0x00ff00});
    }

    shoot() {
        //Create laser geometry and material
        const laserMesh = new Mesh(this.laserGeometry, this.laserMaterial);

        //Set initial laser position at spaceship front
        laserMesh.position.set(this.model.position.x, this.model.position.y, this.model.position.z - 1);

        //Set rotation
        laserMesh.rotation.x = Math.PI / 2;

        //Add laser to the scene
        this.scene.add(laserMesh);

        //Add laser to update list
        this.lasers.push(laserMesh);
    }

    update() {
        //Lerp spaceship position
        this.currentPosition.x = lerp(this.currentPosition.x, this.targetPosition.x, 0.1);
        this.currentPosition.y = lerp(this.currentPosition.y, this.targetPosition.y, 0.1);

        //Apply to spaceship
        this.model.position.copy(this.currentPosition);

        //Update the position of the lasers
        this.lasers.forEach((laser, index) => {
            //Update the position
            laser.position.z -= 1;

            //Check if laser should be removed
            if(laser.position.z === -100) {
                this.scene.remove(laser);
                this.lasers.splice(index, 1);
            }
        });
    }
}
