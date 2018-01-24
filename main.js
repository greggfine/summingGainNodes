"use strict";
const ctx = new (window.AudioContext || window.webkitAudioContext)();

const btn = document.getElementById("play");
btn.addEventListener("click", play);

const stopBtn = document.getElementById("stop");
stopBtn.addEventListener("click", stop);

const sineRange = document.getElementById("sine-range");
const triRange = document.getElementById("tri-range");
const squareRange = document.getElementById("square-range");
const sawRange = document.getElementById("saw-range");
const masterFilt = document.getElementById("master-filter");
const masterOut = document.getElementById("master-out");

const masterFilter = ctx.createBiquadFilter();
const masterGainOut = ctx.createGain();
masterFilter.type = "lowpass";
masterFilter.frequency.value = 1000;
masterFilter.connect(masterGainOut);
masterGainOut.connect(ctx.destination);

let oscSine, oscTri, oscSquare, oscSaw;

class oscBuilder {
	constructor(audioContext, oscType, oscFreq, gainSlider) {
		this.audioContext = audioContext;
		this.oscType = oscType;
		this.oscFreq = oscFreq;
		this.gainSlider = gainSlider;
	}
	init() {
		this.osc = this.audioContext.createOscillator();
		this.osc.type = this.oscType;
		this.osc.frequency.value = this.oscFreq;
		this.amp = this.audioContext.createGain();
		this.osc.connect(this.amp);
		this.amp.connect(masterFilter);
	}
	play() {
		this.init();
		this.slider();
		this.osc.start(this.audioContext.currentTime);
	}
	stop() {
		this.osc.stop(this.audioContext.currentTime);
	}
	slider() {
		setInterval(() => {
			this.amp.gain.value = this.gainSlider.value;
			// this.amp.gain.setValueAtTime(this.amp.gain.value, this.context.currentTime + 2);
		}, 10)
	}
}

function play() {
			oscSine = new oscBuilder(ctx, "sine", 261.63, sineRange);
			oscSine.play();	

			oscTri = new oscBuilder(ctx, "triangle", 329.63,triRange);
			oscTri.play();	

			oscSquare = new oscBuilder(ctx, "square", 392.00, squareRange);
			oscSquare.play();
	
			oscSaw = new oscBuilder(ctx, "sawtooth", 523.25,sawRange);
			oscSaw.play();
 	}

function stop() {
	oscSine.stop();
	oscTri.stop();
	oscSquare.stop();
	oscSaw.stop();
}

setInterval(() => {
		masterFilter.frequency.value = masterFilt.value;
}, 10)

setInterval(() => {
			masterGainOut.gain.value = masterOut.value;
}, 10)
