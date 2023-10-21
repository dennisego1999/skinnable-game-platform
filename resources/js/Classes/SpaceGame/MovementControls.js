export class MovementControls {
    constructor(targetPosition) {
        this.targetPosition = targetPosition;
        this.pressedKeys = {}; // Object to track pressed keys

        // Init movement controls
        this.init();
    }

    init() {
        // Setup event listeners
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

        //Update the target position based on the combined movement
        this.targetPosition.x += deltaX;
        this.targetPosition.y += deltaY;
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
