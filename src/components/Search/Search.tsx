import { Component } from 'react';
import type { ChangeEvent } from 'react';
interface Props {
  value: string;
  onSearch: (value: string) => void;
}

interface State {
  inputValue: string;
}

class Search extends Component<Props, State> {
  state: State = {
    inputValue: '',
  };

  componentDidMount(): void {
    this.setState({ inputValue: this.props.value });
  }

  componentDidUpdate(prevProps: Readonly<Props>): void {
    if (this.props.value !== prevProps.value) {
      this.setState({ inputValue: this.props.value });
    }
  }

  handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    this.setState({ inputValue: e.target.value });
  };

  handleClick = () => {
    this.props.onSearch(this.state.inputValue);
  };

  render() {
    return (
      <div className="flex gap-4 items-center">
        <input
          type="text"
          value={this.state.inputValue}
          onChange={this.handleChange}
          className="border p-2 rounded w-full"
          placeholder="Enter Pokémon name..."
        />

        <button
          onClick={this.handleClick}
          className="px-4 py-2 bg-blue-600 text-white rounded"
        >
          Search
        </button>
      </div>
    );
  }
}

export default Search;
