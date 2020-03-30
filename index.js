const SPIN = new function() {
    let SPIN = this, cnv, ctx, width, height, nodes = [], sprites=[], node_count = 0,
    for_destroy = {}, down_keys = {}, image, frameIndex = 1, numberOfFrames = 1
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
            nodes.push(this)
            console.log('nodes', nodes)
        }
        _update() {
            if(this.update)
                this.update(this)
        }
        draw() {
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
            this.count = 0
            this.delay = 15
            this.currentLoopIndex = 0
            sprites.push(this)
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
            ctx.drawImage( this.clr, 0 + currentLoopIndex * width, 0 + this.currentDirection * height, width, height, 
                            this.x, this.y, scaledWidth, scaledHeight)
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
        animation(currentLoopIndex, delay = 15) {
            this.count ++ 
            // console.log(this.count)
            if (this.count >= this.delay && this.hasMoved) {
                this.count = 0
                this.delay = delay
                this.currentLoopIndex = (this.currentLoopIndex == 3) ? 0 : this.currentLoopIndex + 1
                // this.frame = this.frame_set[this.currentLoopIndex]
                
                
            }
            if (!this.hasMoved)
                    this.currentLoopIndex = 0
            return this.currentLoopIndex
            
        }
    }

    SPIN.create_sprite = (x, y, w, h, clr, currentDirection, hasMoved, upd) => new Sprite(x, y, w, h, clr, currentDirection, hasMoved, upd)
    SPIN.create_node = (x, y, w, h, clr, upd) => new Node(x, y, w, h, clr, upd)

    SPIN.loop = () => {
        ctx.clearRect(0, 0, width, height)
        for (let node of nodes){
            node._update()
            node.draw()
        }
        sprites.forEach( sprite => {
            sprite._update()
            sprite.drawTexture(sprite.animation(this.currentLoopIndex, 10))
            // sprite.hasMoved ? console.log('run') : console.log('stop')
            
        })
        requestAnimationFrame(SPIN.loop)
    }

    SPIN.start = (W, H) => {
        cnv = $('cnv')
        ctx = cnv.getContext('2d')
        width = W
        height = H
        cnv.width = width
        cnv.height = height
        SPIN.loop()
        window.addEventListener('keydown', e => down_keys[e.code] = true)
        window.addEventListener('keyup', e => delete down_keys[e.code])
    }
    SPIN.key = key => down_keys[key]

}
console.log('spin', SPIN)
window.addEventListener('load', () => {
    SPIN.start(1300,580)
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
    let levelObj = []
    imageHero = new Image()
    imageHero.src ='character.png'
    SPIN.create_sprite(640/2-25, 480-50-60, 30, 60, imageHero, currentDirection = 1, this.hasMoved = false, node => {
        node.y+=5
        if (node.intersect(levelObj[0])){
            node.y-=5
        }
        if(SPIN.key('KeyA')){
            node.x -= 10
            node.currentDirection = FACING_LEFT
            node.hasMoved = true
        }
        else if (SPIN.key('KeyD')) {
            node.x += 10
            node.currentDirection = FACING_RIGHT
            node.hasMoved = true
        } else {
            node.hasMoved = false
        }
        if(SPIN.key('KeyW'))
            node.y-=20

    }) 
    levelObj.push(SPIN.create_node(640/5-25, 440, 1000, 15, 'white'))
    // console.log(levelObj)
})