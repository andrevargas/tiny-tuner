import { h } from 'preact';
import Gauge from '../Gauge';
import NoteInfo from '../NoteInfo';

const Tuner = ({ frequency, octave, note }) => (
    <div>
        <Gauge />
        <NoteInfo note={1} />
    </div>
);

export default Tuner;
