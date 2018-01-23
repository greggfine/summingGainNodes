const ctx = new AudioContext();

const btn = document.getElementById('play');
btn.addEventListener('click', play);

const stopBtn = document.getElementById('stop');
stopBtn.addEventListener('click', stop);

const sineRange = document.getElementById('sine-range');
const triRange = document.getElementById('tri-range');
const squareRange = document.getElementById('square-range');
const sawRange = document.getElementById('saw-range');
const masterFilt = document.getElementById('master-filter');
const masterOut = document.getElementById('master-out');

let oscSine;
let oscTri;
let oscSquare;
let oscSaw;

let bool = false;

class oscBuilder {
	constructor(context, type, freq, choice, bool) {
		this.context = context;
		this.type = type;
		this.freq = freq;
		this.choice = choice;
	}

	init() {
		this.osc = this.context.createOscillator();
		this.osc.type = this.type;
		this.osc.frequency.value = this.freq;
		this.amp = this.context.createGain();
		this.osc.connect(this.amp);
		this.amp.connect(masterFilter);
	}

	play() {
		this.init();
		this.slider();
		this.osc.start(this.context.currentTime);
	}

	stop() {
		this.osc.stop(this.context.currentTime)
	}

	slider() {
		setInterval(() => {
			this.amp.gain.value = this.choice.value;
			// this.amp.gain.setValueAtTime(this.amp.gain.value, this.context.currentTime + 2);
		}, 10)
	}
}

function play() {
		if(!bool) {
			oscSine = new oscBuilder(ctx, 'sine', 261.63, sineRange);
			oscSine.play();	

			oscTri = new oscBuilder(ctx, 'triangle', 329.63,triRange);
			oscTri.play();	

			oscSquare = new oscBuilder(ctx, 'square', 392.00, squareRange);
			oscSquare.play();
	
			oscSaw = new oscBuilder(ctx, 'sawtooth', 523.25,sawRange);
			oscSaw.play();
		}
 	}


function stop() {
	oscSine.stop();
	oscTri.stop();
	oscSquare.stop();
	oscSaw.stop();
}

const masterFilter = ctx.createBiquadFilter();
const masterGainOut = ctx.createGain();
masterFilter.type = "lowpass";
masterFilter.frequency.value = 1000;
masterFilter.connect(masterGainOut);


masterGainOut.connect(ctx.destination);

setInterval(() => {
		masterFilter.frequency.value = masterFilt.value;
}, 10)

setInterval(() => {
			masterGainOut.gain.value = masterOut.value;
}, 10)