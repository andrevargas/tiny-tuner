import { h, Component } from 'preact';
import AudioProcessor from './components/AudioProcessor';

class App extends Component {
    render() {
        return (
            <div>
                <AudioProcessor />
            </div>
        );
    }
}

export default App;
