import { Component } from 'react';
import type { ChangeEvent } from 'react';
import Pokeball from '../ui/icons/Pokeball';
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

  handleSubmit = () => {
    this.props.onSearch(this.state.inputValue);
  };

  render() {
    return (
      <form
        onSubmit={this.handleSubmit}
        className="flex gap-4 items-center max-w-4xl mx-auto p-4"
        role="search"
        aria-label="Search Pokémon"
      >
        <div className="relative flex-1">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
            <Pokeball className="w-5 h-5" />
          </span>

          <input
            type="text"
            value={this.state.inputValue}
            onChange={this.handleChange}
            className="w-full border-2 border-black rounded-md px-3 py-2 pl-12 bg-white text-sm placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-red-300 transition"
            placeholder="Enter Pokémon name..."
            aria-label="Enter Pokémon name"
          />
        </div>

        <button
          type="submit"
          className="px-4 py-2 rounded-md text-sm font-medium transition bg-red-500 hover:bg-red-600 text-white cursor-pointer"
        >
          Search
        </button>
      </form>
    );
  }
}

export default Search;
