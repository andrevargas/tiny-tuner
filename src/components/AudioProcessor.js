import { h, Component } from 'preact';

class AudioProcessor extends Component {

    constructor() {
        super();
        this.audioContext = new AudioContext();
        this.analyser = this.audioContext.createAnalyser();
        this.gainNode = this.audioContext.createGain();
        this.microphone = null;
        this.microphone = null;
        this.sendingAudioData = null;
    }

    componentDidMount() {
        this.requestUserMedia();
    }

    componentWillUnmount() {
        this.sendingAudioData = false;
    }

    requestUserMedia() {

        if (!navigator.getUserMedia) return;

        navigator.getUserMedia({ audio: true }, stream => {

            this.sendingAudioData = true;

            this.microphone = this.audioContext.createMediaStreamSource(stream);
            this.microphone.connect(this.analyser);
            this.analyser.connect(this.gainNode);
            this.gainNode.connect(this.audioContext.destination);

            requestAnimationFrame(this.dispatchAudioData);

        }, err => {
            console.log(err);
        });
    }

    dispatchAudioData = time => {
        if (this.sendingAudioData) {
            requestAnimationFrame(this.dispatchAudioData);
        }
    }

    render() {
        return null;
    }

}

export default AudioProcessor;
