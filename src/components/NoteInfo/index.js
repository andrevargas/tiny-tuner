import { h, Component } from 'preact';
import styled from 'styled-components';

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

const NoteInfo = ({ className, note }) => {
    const { letter, intonation } = notes[note] || {};
    return (
        <div className={className}>
            <div>
                {letter}<span>{intonation}</span>
            </div>
        </div>
    );
};

export default styled(NoteInfo)`
    width: 220px;
    height: 258px;
    margin: 10% auto;
    color: #000000;
    background-color: #00E676;
    -webkit-mask-image: url('../../assets/guitar-pick.svg');
    -webkit-mask-repeat: no-repeat;
    -webkit-mask-size: 100%;

    & > div {
        font-size: 8em;
        font-weight: normal;
        text-align: center;
        line-height: 258px;
        vertical-align: middle;
        user-select: none;
    }

    & > div > span {
        font-size: 0.5em;
        margin-left: 10px;
    }
`;
