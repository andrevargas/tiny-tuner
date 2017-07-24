import { h } from 'preact';
import styles from './styles';

const notes = [
    { letter: 'A', intonation: null },
    { letter: 'A', intonation: '♯' },
    { letter: 'B', intonation: null },
    { letter: 'C', intonation: '♯' },
    { letter: 'C', intonation: null },
    { letter: 'D', intonation: '♯' },
    { letter: 'D', intonation: null },
    { letter: 'E', intonation: '♯' },
    { letter: 'F', intonation: null },
    { letter: 'F', intonation: '♯' },
    { letter: 'G', intonation: null },
    { letter: 'G', intonation: '♯' },
];

const NoteInfo = ({ note }) => (
    <div class={styles.NoteInfo}>
        <div class={styles.Note}>
            {notes[note] && notes[note].letter}
            <span class={styles.Intonation}>
                {notes[note] && notes[note].intonation}
            </span>
        </div>
    </div>
);

export default NoteInfo;
