/* QUESTION: How to stop previous note when new note is triggered? */




(function() {
	"use strict";

const ctx = new (window.AudioContext || window.webkitAudioContext)();

const playBtn = document.getElementById("play");
playBtn.addEventListener("click", play);

const stopBtn = document.getElementById("stop");
stopBtn.addEventListener("click", stop);

const sineRange = document.getElementById("sine-range");
const triRange = document.getElementById("tri-range");

const masterFilt = document.getElementById("master-filter");
const masterOut = document.getElementById("master-out");


let oscSine, oscTri, oscSquare, oscSaw;
const masterGainOut = ctx.createGain();

const frequencyMap = {
  'c3': 130.81,
  'd3': 146.83,
  'e3': 164.81,
  'f3': 174.61,
  'g3': 196.00,
  'a3': 220.00,
  'b3': 246.94,
  'c4': 261.63,
  'c#4':277.18,  
  'd4': 293.66,
  'd#4':311.13,
  'e4': 329.63,
  'f4': 349.23,
  'f#4':185.00,
  'g4': 392.00,
  'g#4':207.65,
  'a4': 440.00,
  'a#4':466.16,
  'b4': 493.88,
  'c5': 523.25,
};

const keyCodeMap = {
	65: "c4",
	83: "d4",
	68: "e4",
	70: "f4"
};





let selectedNote;
// const keyboard = document.querySelector('.keyboard');
// let keyboardNote = keyboard.querySelectorAll('.keyboard-note');
// keyboardNote.forEach(note => note.addEventListener('click', function(){
// 	selectedNote = note.dataset.frequency;
// 	play();
// }))

document.addEventListener('keydown', function(event) {
	for (let key in keyCodeMap) {
		if(event.keyCode == key) {
			selectedNote = (frequencyMap[keyCodeMap[key]]);
			play();
			// stop();
		}
	}
});

document.addEventListener('keyup', function(event) {
	for (let key in keyCodeMap) {
		if(event.keyCode == key) {
			selectedNote = (frequencyMap[keyCodeMap[key]]);
			// play();
			stop();
		}
	}
});




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
	constructor(audioContext, oscType, oscFreq = 261, gainSlider, connection) {
		this.audioContext = audioContext;
		this.oscType = oscType;
		this.oscFreq = oscFreq;
		this.gainSlider = gainSlider;
		this.connection = connection;
	}
	init() {
		this.osc = this.audioContext.createOscillator();
		// this.pressed = false;
		this.osc.type = this.oscType;
		this.osc.frequency.value = this.oscFreq;
		this.amp = this.audioContext.createGain();
		this.amp.gain.setValueAtTime(0, this.audioContext.currentTime);
		this.amp.gain.linearRampToValueAtTime(1, this.audioContext.currentTime + 0.01);
		// if(!this.pressed){
		// 	this.pressed = true;	
		// 	this.osc.connect(this.amp);
		// } 
		this.osc.connect(this.amp);
		this.amp.connect(this.connection);
	}
	play() {
		this.init();
		this.slider();
		this.osc.start(this.audioContext.currentTime);

	}
	stop() {
		// this.pressed = false;
		this.amp.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + 0.150);
		this.osc.stop(this.audioContext.currentTime + 0.150);
	}

	slider() {
		setInterval(() => {
			this.amp.gain.value = this.gainSlider.value;
			// this.amp.gain.setValueAtTime(this.amp.gain.value, this.context.currentTime + 2);
		}, 10)
	}
}

function play() {
			oscSine = new oscBuilder(ctx, "sawtooth", selectedNote, sineRange, masterFilter.filt);
			oscSine.play();	
}


masterFilter.init();
masterGainOut.connect(ctx.destination);

function stop() {
	oscSine.stop();
}

setInterval(() => {
			masterGainOut.gain.value = masterOut.value;
}, 10)
})();





// (function() {
//     // Create audio (context) container
//     var audioCtx = new (AudioContext || webkitAudioContext)();

//     // Table of notes with correspending keyboard codes. Frequencies are in hertz.
//     // The notes start from middle C
//     var notesByKeyCode = {
//         65: { noteName: 'c4', frequency: 261.6, keyName: 'a' },
//         83: { noteName: 'd4', frequency: 293.7, keyName: 's' },
//         68: { noteName: 'e4', frequency: 329.6, keyName: 'd' },
//         70: { noteName: 'f4', frequency: 349.2, keyName: 'f' },
//         71: { noteName: 'g4', frequency: 392, keyName: 'g' },
//         72: { noteName: 'a4', frequency: 440, keyName: 'h' },
//         74: { noteName: 'b4', frequency: 493.9, keyName: 'j' },
//         75: { noteName: 'c5', frequency: 523.3, keyName: 'k' },
//         76: { noteName: 'd5', frequency: 587.3, keyName: 'l' },
//         186: { noteName: 'e5', frequency: 659.3, keyName: ';' }
//     };

//     function Key(keyCode, noteName, keyName, frequency) {
//         var keyHTML = document.createElement('div');
//         var keySound = new Sound(frequency, 'triangle');
        
//         /* Cheap way to map key on touch screens */
//         keyHTML.setAttribute('data-key', keyCode);

//         /* Style the key */
//         keyHTML.className = 'key';
//         keyHTML.innerHTML = noteName + '<br><span>' + keyName + '</span>';

//         return {
//             html: keyHTML,
//             sound: keySound
//         };
//     }

//     function Sound(frequency, type) {
//         this.osc = audioCtx.createOscillator(); // Create oscillator node
//         this.pressed = false; // flag to indicate if sound is playing

//         /* Set default configuration for sound */
//         if(typeof frequency !== 'undefined') {
//             /* Set frequency. If it's not set, the default is used (440Hz) */
//             this.osc.frequency.value = frequency;
//         }

//         /* Set waveform type. Default is actually 'sine' but triangle sounds better :) */
//         this.osc.type = type || 'triangle';

//         /* Start playing the sound. You won't hear it yet as the oscillator node needs to be
//         piped to output (AKA your speakers). */
//         this.osc.start(0);
//     };

//     Sound.prototype.play = function() {
//         if(!this.pressed) {
//             this.pressed = true;
//             this.osc.connect(audioCtx.destination);
//         }
//     };

//     Sound.prototype.stop = function() {
//         this.pressed = false;
//         this.osc.disconnect();
//     };

//     function createKeyboard(notes, containerId) {
//         var sortedKeys = []; // Placeholder for keys to be sorted
//         var waveFormSelector = document.getElementById('soundType');

//         for(var keyCode in notes) {
//             var note = notes[keyCode];

//             /* Generate playable key */
//             note.key = new Key(keyCode, note.noteName, note.keyName, note.frequency);

//             /* Add new key to array to be sorted */
//             sortedKeys.push(notes[keyCode]);
//         }

//         /* Sort keys by frequency so that they'll be added to the DOM in the correct order */
//         sortedKeys = sortedKeys.sort(function(note1, note2) {
//             if (note1.frequency < note2.frequency) return -1;
//             if (note1.frequency > note2.frequency) return 1;

//             return 0;
//         });

//         // Add those sorted keys to DOM
//         for(var i = 0; i < sortedKeys.length; i++) {
//             document.getElementById(containerId).appendChild(sortedKeys[i].key.html);
//         }

//         var playNote = function(event) {
//             event.preventDefault();
          
//             var keyCode = event.keyCode || event.target.getAttribute('data-key');

//             if(typeof notesByKeyCode[keyCode] !== 'undefined') {
//                 // Pipe sound to output (AKA speakers)
//                 notesByKeyCode[keyCode].key.sound.play();

//                 // Highlight key playing
//                 notesByKeyCode[keyCode].key.html.className = 'key playing';
//             }
//         };

//         var endNote = function(event) {
//             var keyCode = event.keyCode || event.target.getAttribute('data-key');

//             if(typeof notesByKeyCode[keyCode] !== 'undefined') {
//                 // Kill connection to output
//                 notesByKeyCode[keyCode].key.sound.stop();

//                 // Remove key highlight
//                 notesByKeyCode[keyCode].key.html.className = 'key';
//             }
//         };

//         var setWaveform = function(event) {
//             for(var keyCode in notes) {
//                 notes[keyCode].key.sound.osc.type = this.value;
//             }

//             // Unfocus selector so value is not accidentally updated again while playing keys
//             this.blur();
//         };

//         // Check for changes in the waveform selector and update all oscillators with the selected type
//         waveFormSelector.addEventListener('change', setWaveform);

//         window.addEventListener('keydown', playNote);
//         window.addEventListener('keyup', endNote);
//         window.addEventListener('touchstart', playNote);
//         window.addEventListener('touchend', endNote);
//     }

//     window.addEventListener('load', function() {
//         createKeyboard(notesByKeyCode, 'keyboard');
//     });
// })();









