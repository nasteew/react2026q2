import { Component } from 'react';
import Button from '../ui/Button/Button';

interface State {
  shouldThrowError: boolean;
}

class ErrorButton extends Component<Record<string, never>, State> {
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
      <Button
        onClick={this.handleClick}
        label="Trigger Error"
        ariaLabel="Simulate error"
        className="bg-red-700 focus:ring-red-300"
      />
    );
  }
}

export default ErrorButton;
