// defining a class
class Particle {

    // defining the arguments we will need to 
    // instantiate a new instance of the class
    constructor (position, velocity, acceleration, c_context) {

        // we will treat position, velocity, 
        // and acceleration, as vector objects
        this.pos = position
        this.vel = velocity
        this.acc = acceleration

        // rather than referring to the canvas context
        // in global variable, it is cleaner and more convenient
        // to pass a reference to it to the constructor 
        // to store on the particle object
        this.ctx = c_context
    }

    // defining how the particle is to move
    move () {

        // acceleration affects velocity
        this.vel.add (this.acc)

        // velocity affects position
        this.pos.add (this.vel)

        // reset accelreation vector
        // so we can add fresh gravitation later
        this.acc.mult (0)

        // this.ctx is the canvas context
        // here I am extracting the actual canvas
        // and storing it in 'c' for convenience
        const c = this.ctx.canvas

        // conditional logic to respawn
        // on the opposite side of the frame
        if (this.pos.x < 0) {
            this.pos.x = c.width
        }

        if (this.pos.x > c.width) {
            this.pos.x = 0
        }

        if (this.pos.y < 0) {
            this.pos.y = c.height
        }

        if (this.pos.y > c.height) {
            this.pos.y = 0
        }
    }

    // draw to canvas
    draw () {

        // referring to the canvas context
        // stored on each particle
        // fill colour = white
        this.ctx.fillStyle = `white`

        // the particle is a 3 x 3 square
        // the position is the middle pixel
        this.ctx.fillRect (this.pos.x - 1, this.pos.y - 1, 3, 3)
    }

    // this method accepts a square object as its argument
    // then checks to see whther the particle's position
    // is inside that square
    check_collision (s) {

        // conditional logic for the four boundaries 
        // of the square
        const inside_l = this.pos.x > s.pos.x
        const inside_r = this.pos.x < s.pos.x + s.len
        const inside_t = this.pos.y > s.pos.y
        const inside_b = this.pos.y < s.pos.y + s.len

        // if the particle is inside all of those boundaries
        if (inside_l && inside_r && inside_t && inside_b) {

            // call the collision method on 
            // the square that was passed in
            s.collision ()

            // calculate the distance to the center 
            // of the square along the x and y axes
            const x_distance = Math.abs (s.mid.x - this.pos.x)
            const y_distance = Math.abs (s.mid.y - this.pos.y)

            // x distance is larger -> horizontal collision
            // pass the square to the x_collision method
            if (x_distance > y_distance) this.x_collision (s)

            // y distance is larger -> vertical collision
            // pass the square to the y_collision method
            else this.y_collision (s)
        }
    }

    // defining the behaviour for a horizontal collision
    x_collision (s) {

        // horizontal velocity is reversed (and then some)
        this.vel.x *= -1.01

        // if the x velocity is positive 
        // put particle on the right side
        // otherwise put it on the left
        this.pos.x = this.vel.x > 0 ? s.pos.x + s.len : s.pos.x

        // give it a touch of random y velocity
        // to keep things interesting
        this.vel.y += ((Math.random () * 2) - 1) * 0.02
    }

    // defining the behaviour for a vertical collision
    y_collision (s) {

        // vertical velocity is reversed (and then some)
        this.vel.y *= -1.01

        // if the y velocity is positive 
        // put particle on the bottom
        // otherwise put it on the top
        this.pos.y = this.vel.y > 0 ? s.pos.y + s.len : s.pos.y 

        // give it a touch of random x velocity
        // to keep things interesting
        this.vel.x += ((Math.random () * 2) - 1) * 0.02
    }

    // the gravitate method accepts a square as an argument
    // and then applies an acceleration force on the particle 
    // towards that square
    gravitate (s) {

        // make a copy of the position of 
        // the square's centre
        const to_square = s.mid.clone ()

        // subtracting the position of the particle
        // yields the vector that goes from 
        // the particle, to the square
        to_square.subtract (this.pos)

        // use the inverse-square rule
        // to calculate a gravitational force
        const grav = 128 / (to_square.mag () ** 2)

        // set the magnitude of the vector towards
        // the square to be equal to the gravitation
        to_square.setMag (grav)

        // add this vector to the particle's
        // acceleration vector
        this.acc.add (to_square)
    }
}
