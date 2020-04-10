const SPIN = new function() {
    let SPIN = this, cnv, ctx, width, height, nodes = [], sprites=[], backgrounds=[], node_count = 0,
    for_destroy = {}, down_keys = {}, image, frameIndex = 1, numberOfFrames = 1
    let $ = id => document.getElementById(id)
    let rect = (x, y, w, h, clr) => {
        ctx.fillStyle = clr
        ctx.fillRect(x, y, w, h)
    }
    class Background {
        constructor(x, y, w, h, image, upd) {
            this.x = x
            this.y = y
            this.w = w
            this.h = h
            this.image = image
            this.update = upd
            backgrounds.push(this)
        }
        _update() {
            if(this.update)
                this.update(this)
            if(Math.abs(this.x) > this.w )
                this.x = 0
            // console.log(this.x)
        }
        drawBackground() {
            ctx.drawImage( this.image, 0, 0, this.w, this.h, 
                this.x, 0, this.w, this.h)
            // if(this.x >= 0)
            if(this.x <= 0) {
                ctx.drawImage( this.image, 0, 0, this.w, this.h, 
                    (this.w + this.x), 0, this.w, this.h)
            } else {
                ctx.drawImage( this.image, 0, 0, this.w, this.h, 
                    -(this.w - this.x), 0, this.w, this.h) 
            }
            
        }
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
            // console.log('nodes', nodes)
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
            this.isJump = true
            this.y_velocity = 0
            this.x_velocity = 0
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
            if (this.count >= this.delay && this.hasMoved) {
                this.count = 0
                this.delay = delay
                this.currentLoopIndex = (this.currentLoopIndex == 7) ? 0 : this.currentLoopIndex + 1
            }
            if (!this.hasMoved)
                   this.currentDirection == 0 ? this.currentLoopIndex = 0 : this.currentLoopIndex = 7
            return this.currentLoopIndex
            
        }
    }
    SPIN.create_backgound = (x, y, w, h, image, upd) => new Background(x, y, w, h, image, upd)
    SPIN.create_sprite = (x, y, w, h, clr, currentDirection, hasMoved, upd) => new Sprite(x, y, w, h, clr, currentDirection, hasMoved, upd)
    SPIN.create_node = (x, y, w, h, clr, upd) => new Node(x, y, w, h, clr, upd)

    SPIN.loop = () => {
        ctx.clearRect(0, 0, width, height)
        backgrounds.forEach( background => {
            background._update()
            background.drawBackground()
        })
        // backgrounds[1]._update()
        // backgrounds[1].drawBackground()
        for (let node of nodes){
            node._update()
            node.draw()
        }
        sprites.forEach( sprite => {
            sprite._update()
            sprite.drawTexture(sprite.animation(this.currentLoopIndex, 6))
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
// console.log('spin', SPIN)
window.addEventListener('load', () => {
    SPIN.start(1300,800)
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
    SPIN.create_sprite(640/2-25, 480-50-60, 30, 60, imageHero, currentDirection = 0, this.hasMoved = false, node => {
        
        for(let obj of levelObj){
            if(node.intersect(obj)) {
                // node.y-=5
                // node.y_velocity -= 10
                // node.y_velocity *= 0.02
                // console.log(obj)
                node.y_velocity = 0
                node.y = obj.y - node.h +1
                node.isJump = true
            }
        }
        if(SPIN.key('KeyA')){
            // node.x -= 10
            node.currentDirection = FACING_LEFT
            node.hasMoved = true
            node.x_velocity -= 1.5
        }
        else if (SPIN.key('KeyD')) {
            // node.x += 10
            node.currentDirection = FACING_RIGHT
            node.hasMoved = true
            node.x_velocity += 1.5
        } else {
            node.hasMoved = false
        }
        if(SPIN.key('KeyW') && node.isJump) {
            // node.y -= 0.0001*(node.y)**2+0.0001*node.y
            // node.y -= 150
            node.y_velocity -= 30
            // console.log(node)
            node.isJump = false
        }
        node.y_velocity += 2
        node.x += node.x_velocity
        node.y += node.y_velocity
        node.x_velocity *= 0.88
        node.y_velocity *= 0.88
            // node.y -= node.x*(node.y)**2+node.x*node.y

    }) 
    levelObj.push(SPIN.create_node(0, 740, 1300, 15, 'white'))
    levelObj.push(SPIN.create_node(340/5-25, 640, 300, 15, 'white'))
    backgroundFirst = new Image()
    backgroundFirst.src = 'Pale/sky.png'
    backgroundSecond = new Image()
    backgroundSecond.src = 'Pale/houses4.png'
    backgroundThird = new Image()
    backgroundThird.src = 'Pale/houses3.png'
    backgroundFour = new Image()
    backgroundFour.src = 'Pale/houses2.png'
    backgroundFive = new Image()
    backgroundFive.src = 'Pale/houses1.png'
    SPIN.create_backgound(0, 0, 1300,800, backgroundFirst)
    SPIN.create_backgound(0, 0, 1300,800, backgroundSecond, background => {
        if(SPIN.key('KeyA')){
            background.x += 2
            // node.x_velocity -= 1.5
        }
        else if (SPIN.key('KeyD')) {
            background.x -= 2
            // node.x_velocity += 1.5
        } else {
            // node.hasMoved = false
        }
    })
    SPIN.create_backgound(0, 0, 1300,800, backgroundThird, background => {
        if(SPIN.key('KeyA')){
            background.x += 5
            // node.x_velocity -= 1.5
        }
        else if (SPIN.key('KeyD')) {
            background.x -= 5
            // node.x_velocity += 1.5
        } else {
            // node.hasMoved = false
        }
    })
    SPIN.create_backgound(0, 0, 1300,800, backgroundFour, background => {
        if(SPIN.key('KeyA')){
            background.x += 7
            // node.x_velocity -= 1.5
        }
        else if (SPIN.key('KeyD')) {
            background.x -= 7
            // node.x_velocity += 1.5
        } else {
            // node.hasMoved = false
        }
    })
    SPIN.create_backgound(0, 0, 1300,800, backgroundFive, background => {
        if(SPIN.key('KeyA')){
            background.x += 8
            // node.x_velocity -= 1.5
        }
        else if (SPIN.key('KeyD')) {
            background.x -= 8
            // node.x_velocity += 1.5
        } else {
            // node.hasMoved = false
        }
    })
})