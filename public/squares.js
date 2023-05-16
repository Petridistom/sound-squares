// defining a class
class Sound_Square {

    // defining a constructor that accepts the arguments 
    // required to instantiate a new instance of the object
    constructor (position, length, note, c_context, a_context) {

        // we will treat position as a vector
        this.pos   = position

        // side length value
        this.len   = length

        // midi note value
        this.note  = note

        // reference to the canvas context
        this.ctx   = c_context

        // reference to the audio context
        this.audio = a_context

        // calculating the position of the center
        // of the square
        const mid_x = this.pos.x + (this.len / 2)
        const mid_y = this.pos.y + (this.len / 2)

        // storing this position as a vector
        this.mid = new Vector (mid_x, mid_y)

        // make the squares pink
        this.col     = `deeppink`

        // on / off state
        // false value -> silent
        this.running = true

        // storing a new oscillator
        // on the object
        this.osc = this.audio.createOscillator ()

        // lets use a sawtooth oscillator
        this.osc.type = 'sawtooth'

        // calculate the frequency of the note it should play
        const cps  = 440 * (2 ** ((this.note - 69) / 12))

        // set the oscillator to that frequency
        this.osc.frequency.value = cps

        // start the oscillator
        this.osc.start ()

        // store a new gain node
        // on the object
        this.amp = this.audio.createGain ()

        // setting the gain to functional silence
        this.amp.gain.value = 0.0001

        // we want to create a stereo field
        // where squares on the left are heard
        // more in the left channel
        // so we create a stereo panner node
        // to store on the object
        this.pan = this.audio.createStereoPanner ()

        // set it to a value that corresponds with
        // the x position of the square
        this.pan.pan.value = (this.mid.x / this.ctx.canvas.width) * 2 - 1

        // wire the nodes together:
        // osc -> amp -> pan -> output
        this.osc.connect (this.amp)
            .connect (this.pan)
            .connect (this.audio.destination)
    }

    // define a draw method
    draw () {

        // fill with the colour stored in the .col property
        this.ctx.fillStyle = this.col

        // draw a square at the coordinates held 
        // in the .pos vector, with a width and height
        // equal to the value stored in the .len property
        this.ctx.fillRect (this.pos.x, this.pos.y, this.len, this.len)
    }

    // when a particle detects that it has collided with a square
    // it will call this method on the square
    collision () {

        // only make a sound if the square is running
        if (this.running) {

            // get the current time from the audio context
            const now = this.audio.currentTime

            // because many particles will be hitting these squares
            // the amp node will be recieving lots many competing
            // sets of instructions.  By cancelling the scheduled
            // values we are telling the amp that the only set of
            // instructions that we are interested in is the most 
            // recent one
            this.amp.gain.cancelScheduledValues (now)

            // set the gain right now, to what it already is
            // this might seem redundant, but it helps the API
            // understand the timing of envelope that it needs to make
            this.amp.gain.setValueAtTime (this.amp.gain.value, now)

            // ramp from whatever value it was at, to 0.1, in 20 ms
            this.amp.gain.linearRampToValueAtTime (0.1, now + 0.02)

            // then ramp down exponentially, to 0.000001, in 8 s
            this.amp.gain.exponentialRampToValueAtTime (0.000001, now + 8)
        }
    }

    // define a method to turn the square on and off
    toggle () {

        // if already on
        if (this.running) {

            // make the colour grey
            this.col     = `grey`

            // set the .running property to false
            this.running = false
        }

        // if off
        else {

            // make the colour pink
            this.col     = `deeppink`

            // set the .running property to true
            this.running = true
        }
    }
}
