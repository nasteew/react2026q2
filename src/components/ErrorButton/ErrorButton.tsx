import { Component } from 'react';

interface State {
  shouldThrowError: boolean;
}

class ErrorButton extends Component<unknown, State> {
  state: State = {
    shouldThrowError: false,
  };

  handleClick = () => {
    this.setState({ shouldThrowError: true });
  };

  render() {
    if (this.state.shouldThrowError) {
      throw new Error('Simulated error from ErrorButton');
    }

    return (
      <button
        onClick={this.handleClick}
        className="px-5 py-2 bg-red-600 text-white font-bold rounded-lg border-2 border-black shadow-md hover:bg-red-700 hover:shadow-lg transition active:scale-95"
      >
        Error Button
      </button>
    );
  }
}

export default ErrorButton;
