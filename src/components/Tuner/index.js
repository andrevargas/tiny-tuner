import { h } from 'preact';
import Gauge from '../Gauge';
import NoteInfo from '../NoteInfo';

const Tuner = props => (
    <div>
        <Gauge />
        <NoteInfo note="A" />
    </div>
);

export default Tuner;
