const SPIN = new function() {
    let SPIN = this, cnv, ctx, width, height, nodes = [], sprites=[], node_count = 0,
    for_destroy = {}, down_keys = {}, image, frameIndex = 1, numberOfFrames = 1
    // console.log(SPIN)
    let $ = id => document.getElementById(id)
    let rect = (x, y, w, h, clr) => {
        ctx.fillStyle = clr
        ctx.fillRect(x, y, w, h)
    }
    class Node {
        constructor(x, y, w, h, clr, upd) {
            this.id = node_count++
            this.x = x
            this.y = y
            this.w = w
            this.h = h
            this.clr = clr
            this.update = upd
            // console.log(this)
            nodes.push(this)
            console.log('nodes', nodes)
        }
        _update() {
            if(this.update)
                this.update(this)
        }
        draw() {
            
            // console.log(this.clr)
            rect(this.x, this.y, this.w, this.h, this.clr)
            
        }
        destroy() {
            for_destroy[this.id] = this
        }
        move(x, y) {
            this.x += x
            this.y += y
        }
        intersect(node) {
            return !(this.x + this.w <= node.x ||
                 this.y + this.h <= node.y || 
                 node.x + node.w <= this.x || 
                 node.y + node.h <= this.y)
        }
    }
    class Sprite {
        constructor(x, y, w, h, clr, currentDirection, hasMoved, upd) {
            this.id = node_count++
            this.x = x
            this.y = y
            this.w = w
            this.h = h
            this.clr = clr
            this.currentDirection = currentDirection
            this.hasMoved = hasMoved
            this.update = upd
            // console.log(this)
            sprites.push(this)
            console.log('sprites', sprites)
        }
        _update() {
            if(this.update)
                this.update(this)
        }
        drawTexture(currentLoopIndex) {
            const scale = 0.5;
            const width = 864/8;
            const height = 140;
            const scaledWidth = scale * width;
            const scaledHeight = scale * height;
            // let CYCLE_LOOP = [0,1,2,3,4,5,6,7]
            // let frameCount = 0
            // let FRAME_LIMIT = 12
            // let currentLoopIndex = 0
            // if (this.hasMoved) {
            //     frameCount++;
            //     // console.log(frameCount)
            //     if (frameCount >= FRAME_LIMIT) {
            //         frameCount = 0;
            //         currentLoopIndex++;
            //         if (currentLoopIndex >= CYCLE_LOOP.length) {
            //             currentLoopIndex = 0;
            //         }
            //     }
            // }
            console.log(currentLoopIndex)
            ctx.drawImage( this.clr, 0 + currentLoopIndex * width, 0 + this.currentDirection * height, width, height, 
                                    this.x, this.y, scaledWidth, scaledHeight)
            // let comm = iterat++
            // console.log(iterat++)
            // this.frameIndex++
            // console.log(this.clr)
        }
        destroy() {
            for_destroy[this.id] = this
        }
        move(x, y) {
            this.x += x
            this.y += y
        }
        intersect(node) {
            return !(this.x + this.w <= node.x || 
                this.y + this.h <= node.y || 
                node.x + node.w <= this.x || 
                node.y + node.h <= this.y)
        }
    }
    // class Sprite {
    //     constructor(rows, cols, vector, character){
    //         this.rows = rows
    //         this.cols = cols
    //         this.vector = vector
    //         this.character = character
    //     }
    //     updateFrame() {
    //         curFrame = ++curFrame % frameCount
    //         srcX = curFrame*width
    //         ctx.clearRect(x,y, width, height)
    //     }
    // }
    SPIN.create_sprite = (x, y, w, h, clr, currentDirection, hasMoved, upd) => new Sprite(x, y, w, h, clr, currentDirection, hasMoved, upd)
    SPIN.create_node = (x, y, w, h, clr, upd) => new Node(x, y, w, h, clr, upd)

    SPIN.update = () => {
        ctx.clearRect(0, 0, width, height)
        for(let i = 0, len = nodes.length; i < len; i++){
            nodes[i]._update()
            nodes[i].draw()
            // nodes[0]._update()
            // nodes[i].drawTexture()
            
        }
        let CYCLE_LOOP = [0,1,2,3,4,5,6,7]
            let frameCount = 0
            let FRAME_LIMIT = 12
            let currentLoopIndex = 0
            if (this.hasMoved) {
                frameCount++;
                // console.log(frameCount)
                if (frameCount >= FRAME_LIMIT) {
                    frameCount = 0;
                    currentLoopIndex++;
                    if (currentLoopIndex >= CYCLE_LOOP.length) {
                        currentLoopIndex = 0;
                    }
                }
            }
        for(let i = 0, len = sprites.length; i<len;i++){
            sprites[i]._update()
            sprites[i].drawTexture(currentLoopIndex)
        }
        // nodes[0].drawTexture()
        requestAnimationFrame(SPIN.update)
    }

    SPIN.start = (W, H) => {
        cnv = $('cnv')
        ctx = cnv.getContext('2d')
        width = W
        height = H
        cnv.width = width
        cnv.height = height
        SPIN.update()
        window.addEventListener('keydown', e => down_keys[e.code] = true)
        window.addEventListener('keyup', e => delete down_keys[e.code])
    }
    SPIN.key = key => down_keys[key]

}
// console.log('spin', SPIN)
window.addEventListener('load', () => {
    SPIN.start(640,480)
    // for(let i = 0; i<3; i++) {
    //     for(let j = 0; j<10; j++) {
    //         SPIN.create_node(30 + (20+40) * j, 20 + (20+40)*i, 40, 40, '#ff6d5a', node => node.y +=0.1)
    //     }
    // }
    let jump = (x, y) => {

    }
    const FACING_DOWN = 0
    const FACING_UP = 1
    const FACING_LEFT = 1
    const FACING_RIGHT = 0
    let hasMoved = false
    let currentDirection
    let CYCLE_LOOP = [0,1,2,3,4,5,6,7]
    let frameCount = 0
    let FRAME_LIMIT = 12
    // let currentLoopIndex = 0
    let levelObj = []
    imageHero = new Image()
    imageHero.src ='character.png'
    // console.log(typeof(imageHero))
    SPIN.create_sprite(640/2-25, 480-50-60, 30, 60, imageHero, currentDirection = 0, hasMoved, node => {
        node.y+=5
        if (node.intersect(levelObj[0])){
            node.y-=5
        }
        
        if(SPIN.key('KeyA')){
            node.x -= 10
            node.currentDirection = FACING_LEFT
            node.hasMoved = true
        }
            
            // console.log(node.currentDirection)
        if(SPIN.key('KeyD')){
            node.x += 10
            node.currentDirection = FACING_RIGHT
            node.hasMoved = true
        }
            
        if(SPIN.key('KeyW'))
            node.y-=20

        // console.log(hasMoved)
        // if (hasMoved) {
        //     frameCount++;
        //     if (frameCount >= FRAME_LIMIT) {
        //         frameCount = 0;
        //         currentLoopIndex++;
        //         if (currentLoopIndex >= CYCLE_LOOP.length) {
        //             currentLoopIndex = 0;
        //         }
        //     }
        // }

    }) 
    levelObj.push(SPIN.create_node(640/5-25, 440, 1000, 15, 'white'))
    // console.log(levelObj)
})