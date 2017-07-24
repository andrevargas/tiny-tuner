import { h } from 'preact';
import styles from './styles';

const NoteInfo = ({ note }) => (
    <div class={styles.NoteInfo}>
        <div class={styles.Note}>
            {note}
        </div>
    </div>
);

export default NoteInfo;
