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


let oscSine, oscTri, oscSquare, oscSaw;
const masterGainOut = ctx.createGain();

class filterBuilder {
	constructor(filterType, freqValue, freqSlider, connection){
		this.filterType = filterType;
		this.freqValue = freqValue;
		this.connection = connection;
		this.freqSlider = freqSlider;
	}

	init(){
		this.filt = ctx.createBiquadFilter();
		this.filt.type = this.filterType;
		this.filt.frequency.value = this.freqValue;
		this.filt.connect(this.connection);
		this.slider();
	}

	slider() {
		setInterval(() => {
			this.filt.frequency.value = this.freqSlider.value;
		}, 10)
	}
}

const masterFilter = new filterBuilder("lowpass", 1000, masterFilt, masterGainOut);

class oscBuilder {
	constructor(audioContext, oscType, oscFreq, gainSlider, connection) {
		this.audioContext = audioContext;
		this.oscType = oscType;
		this.oscFreq = oscFreq;
		this.gainSlider = gainSlider;
		this.connection = connection;
	}
	init() {
		this.osc = this.audioContext.createOscillator();
		this.osc.type = this.oscType;
		this.osc.frequency.value = this.oscFreq;
		this.amp = this.audioContext.createGain();
		this.osc.connect(this.amp);
		this.amp.connect(this.connection);
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
			oscSine = new oscBuilder(ctx, "sine", 261.63, sineRange, masterFilter.filt);
			oscSine.play();	

			oscTri = new oscBuilder(ctx, "triangle", 329.63,triRange, masterFilter.filt);
			oscTri.play();	

			oscSquare = new oscBuilder(ctx, "square", 392.00, squareRange, masterFilter.filt);
			oscSquare.play();
	
			oscSaw = new oscBuilder(ctx, "sawtooth", 523.25,sawRange, masterFilter.filt);
			oscSaw.play();
}

masterFilter.init();
masterGainOut.connect(ctx.destination);

function stop() {
	oscSine.stop();
	oscTri.stop();
	oscSquare.stop();
	oscSaw.stop();
}

setInterval(() => {
			masterGainOut.gain.value = masterOut.value;
}, 10)
