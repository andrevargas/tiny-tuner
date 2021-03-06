import { h, Component } from 'preact';
import Tuner from '../components/Tuner';

class AudioProcessor extends Component {

    constructor() {
        super();

        this.state = {
            frequency: null,
            octave: null,
            note: null
        };

        this.audioContext = new window.AudioContext();
        this.analyser = this.audioContext.createAnalyser();
        this.gainNode = this.audioContext.createGain();
        this.microphone = null;

        const FFTSIZE = 2048;

        this.gainNode.gain.value = 0;
        this.analyser.fftSize = FFTSIZE;
        this.analyser.smoothingTimeConstant = 0;

        this.frequencyBufferLength = FFTSIZE;
        this.frequecyBuffer = new Float32Array(this.frequencyBufferLength);

        this.strings = {
            e2: {
                offset: Math.round(this.audioContext.sampleRate / 82.4069),
                difference: 0
            },
            a2: {
                offset: Math.round(this.audioContext.sampleRate / 110),
                difference: 0
            },
            d3: {
                offset: Math.round(this.audioContext.sampleRate / 146.832),
                difference: 0
            },
            g3: {
                offset: Math.round(this.audioContext.sampleRate / 195.998),
                difference: 0
            },
            b3: {
                offset: Math.round(this.audioContext.sampleRate / 246.932),
                difference: 0
            },
            e4: {
                offset: Math.round(this.audioContext.sampleRate / 329.628),
                difference: 0
            }
        };

        this.stringKeys = Object.keys(this.strings);

        this.lastRms = 0;
        this.assessedStringsInLastFrame = false;
        this.assessStringsUntilTime = 0;
    }

    componentDidMount() {
        this.requestUserMedia();
    }

    componentWillUnmount() {
        this.sendingAudioData = false;
    }

    requestUserMedia() {

        navigator.getUserMedia({ audio: true }, stream => {

            this.sendingAudioData = true;

            this.microphone = this.audioContext.createMediaStreamSource(stream);
            this.microphone.connect(this.analyser);
            this.analyser.connect(this.gainNode);
            this.gainNode.connect(this.audioContext.destination);

            requestAnimationFrame(this.dispatchAudioData);

        }, error => {
            this.setState({ error });
        });
    }

    autocorrelateAudioData(time) {

        const rmsMin = 0.008;
        const tolerance = 0.001;
        const rmsThreshold = 0.006;
        const searchSize = this.frequencyBufferLength * 0.5;

        let offset = 0;
        let difference = 0;
        let rms = 0;
        let assessedStringsInLastFrame = this.assessedStringsInLastFrame;

        this.analyser.getFloatTimeDomainData(this.frequecyBuffer);

        this.frequecyBuffer.forEach(value => {
            rms += value * value;
        });

        rms = Math.sqrt(rms / this.frequecyBuffer.length);

        if (rms < rmsMin) return 0;

        if (rms > this.lastRms + rmsThreshold) {
            this.assessStringsUntilTime = time + 250;
        }

        if (time < this.assessStringsUntilTime) {

            this.assessedStringsInLastFrame = true;

            this.stringKeys.forEach(key => {

                offset = this.strings[key].offset;
                difference = 0;

                if (!assessedStringsInLastFrame) {
                    this.strings[key].difference = 0;
                }

                for (let i = 0; i < searchSize; i++) {
                    difference += Math.abs(this.frequecyBuffer[i] -
                        this.frequecyBuffer[i + offset]);
                }

                difference /= searchSize;
                this.strings[key].difference += (difference * offset);

            });

        } else {
            this.assessedStringsInLastFrame = false;
        }

        if (assessedStringsInLastFrame && this.assessedStringsInLastFrame) {
            this.stringKeys.sort((a, b) =>
                this.strings[a].difference - this.strings[b].difference
            );
        }

        const searchRange = 10;
        const assumedString = this.strings[this.stringKeys[0]];
        const searchStart = assumedString.offset - searchRange;
        const searchEnd = assumedString.offset + searchRange;

        let actualFrequency = assumedString.offset;
        let smallestDifference = Number.POSITIVE_INFINITY;

        for (let i = searchStart; i < searchEnd; i++) {

            difference = 0;

            for (let j = 0; j < searchSize; j++) {
                difference += Math.abs(this.frequecyBuffer[j] -
                    this.frequecyBuffer[j + i]);
            }

            difference /= searchSize;

            if (difference < smallestDifference) {
                smallestDifference = difference;
                actualFrequency = i;
            }

            if (difference < tolerance) {
                actualFrequency = i;
                break;
            }

        }

        this.lastRms = rms;
        return this.audioContext.sampleRate / actualFrequency;

    }

    dispatchAudioData = time => {

        if (this.sendingAudioData) {
            requestAnimationFrame(this.dispatchAudioData);
        }

        const frequency = this.autocorrelateAudioData(time);

        if (frequency === 0) return;

        const dominantFrequency = Math.log2(frequency / 440);
        const semitonesFromA4 = 12 * dominantFrequency;

        const octave = Math.round(4 + ((9 + semitonesFromA4) / 12));
        const note = (12 + (Math.round(semitonesFromA4) % 12)) % 12;

        this.setState({ frequency, octave, note });

    }

    render(props, { frequency, octave, note }) {
        return (
            <Tuner
                note={note}
                octave={octave}
                frequency={frequency}
            />
        );
    }

}

export default AudioProcessor;
