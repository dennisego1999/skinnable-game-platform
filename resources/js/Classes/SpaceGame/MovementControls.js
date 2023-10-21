import {Frustum, Matrix4} from "three";

export class MovementControls {
    constructor(object, camera, targetPosition, keepInsideViewport) {
        this.object = object;
        this.camera = camera;
        this.targetPosition = targetPosition;
        this.keepInsideViewport = keepInsideViewport;
        this.pressedKeys = {};

        //Init
        this.init();
    }

    init() {
        //Setup event listeners
        this.setupEventListeners();
    }

    handleKey(keyCode, isDown) {
        //Update the state of the pressedKeys object
        this.pressedKeys[keyCode] = isDown;

        //Calculate the movement based on the pressed keys
        const moveSpeed = 0.2;
        let deltaX = 0;
        let deltaY = 0;

        if(this.pressedKeys['KeyW'] || this.pressedKeys['ArrowUp']) {
            deltaY += moveSpeed;
        }

        if(this.pressedKeys['KeyS'] || this.pressedKeys['ArrowDown']) {
            deltaY -= moveSpeed;
        }

        if(this.pressedKeys['KeyA'] || this.pressedKeys['ArrowLeft']) {
            deltaX -= moveSpeed;
        }

        if(this.pressedKeys['KeyD'] || this.pressedKeys['ArrowRight']) {
            deltaX += moveSpeed;
        }

        if(!this.keepInsideViewport) {
            this.targetPosition.x += deltaX;
            this.targetPosition.y += deltaY;

            return;
        }

        //Calculate the new target position based on the combined movement
        const newTargetPosition = this.targetPosition.clone();
        newTargetPosition.x += deltaX;
        newTargetPosition.y += deltaY;

        //Check if the new target position is outside the viewport
        const frustum = new Frustum();
        const matrix = new Matrix4().multiplyMatrices(this.camera.projectionMatrix, this.camera.matrixWorldInverse);
        frustum.setFromProjectionMatrix(matrix);

        if (frustum.containsPoint(newTargetPosition)) {
            //If the new target position is inside the viewport, update the target position
            this.targetPosition.copy(newTargetPosition);
        }
    }

    onKeyDown(event) {
        this.handleKey(event.code, true);
    }

    onKeyUp(event) {
        this.handleKey(event.code, false);
    }

    setupEventListeners() {
        //Add event listeners for keydown and keyup
        document.body.addEventListener('keydown', event => this.onKeyDown(event));
        document.body.addEventListener('keyup', event => this.onKeyUp(event));
    }

    removeEventListeners() {
        //Remove event listeners
        document.body.removeEventListener('keydown', event => this.onKeyDown(event));
        document.body.removeEventListener('keyup', event => this.onKeyUp(event));
    }
}
