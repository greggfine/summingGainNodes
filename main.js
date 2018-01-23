const ctx = new AudioContext();

const btn = document.getElementsByTagName('button')[0];
btn.addEventListener('click', play);

const sawRangeVal = document.getElementById('saw-range').defaultValue;
const sawRange = document.getElementById('saw-range');


let osc = false;

function play() {
	if(!osc) {
		oscSine = oscCreator('sine', 261.63);
		oscSine.connect(ctx.destination);

		oscTri = oscCreator('triangle', 329.63);
		oscTri.connect(ctx.destination);

		oscSquare = oscCreator('square', 392.00);
		oscSquare.connect(ctx.destination);

		oscSaw = oscCreator('sawtooth', 523.25);
		oscSaw.connect(ctx.destination);
	} else {
 		oscSine.stop(ctx.currentTime);
 		oscTri.stop(ctx.currentTime);
 		oscSquare.stop(ctx.currentTime);
 		oscSaw.stop(ctx.currentTime);
 		osc = false;
 	}
}

function oscCreator(type, freq) {
	osc = ctx.createOscillator();
	osc.type = type;
	osc.frequency.value = freq;
	osc.start(ctx.currentTime);

	let amp = ctx.createGain();
	

	sawRange.addEventListener('change', function(e) {
		amp.gain.value = e.target.value/defaultValue;
	})

	var connectedOsc = osc.connect(amp);

	return connectedOsc;
}




