import { Component } from 'react';
import type { Item } from './types/item';
import { fetchPokemon, fetchPokemonList } from './api/api';
import Search from './components/Search/Search';
import Loader from './components/Loader/Loader';
import CardList from './components/CardList/CardList';
import ErrorButton from './components/ErrorButton/ErrorButton';
import ErrorBoundary from './components/ErrorBoundary/ErrorBoundary';

interface State {
  searchTerm: string;
  results: Item[];
  loading: boolean;
  error: string | null;
  page: number;
}

class App extends Component<Record<string, never>, State> {
  state: State = {
    searchTerm: '',
    results: [],
    loading: false,
    error: null,
    page: 1,
  };

  componentDidMount(): void {
    const saved = localStorage.getItem('searchTerm') || '';
    this.setState({ searchTerm: saved });

    if (saved) {
      this.loadSearch(saved);
    } else {
      this.loadPage(1);
    }
  }

  handleSearch = async (value: string) => {
    const trimmed = value.trim();

    if (trimmed === this.state.searchTerm) return;

    this.setState({ loading: true, searchTerm: trimmed, page: 1 });

    localStorage.setItem('searchTerm', trimmed);

    try {
      if (trimmed) {
        const result = await fetchPokemon(trimmed);
        this.setState({ results: [result], error: null });
      } else {
        const list = await fetchPokemonList(1);
        this.setState({ results: list, error: null });
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        this.setState({ error: err.message, results: [] });
      }
    } finally {
      this.setState({ loading: false });
    }
  };

  loadPage = async (page: number) => {
    this.setState({ loading: true, page });

    try {
      const list = await fetchPokemonList(page);
      this.setState({ results: list, error: null });
    } catch (err: unknown) {
      if (err instanceof Error) {
        this.setState({ error: err.message, results: [] });
      }
    } finally {
      this.setState({ loading: false });
    }
  };

  loadSearch = async (term: string) => {
    this.setState({ loading: true });

    try {
      const item = await fetchPokemon(term);
      this.setState({ results: [item], error: null });
    } catch (err: unknown) {
      if (err instanceof Error) {
        this.setState({ error: err.message, results: [] });
      }
    } finally {
      this.setState({ loading: false });
    }
  };

  render() {
    const { searchTerm, results, loading, error } = this.state;
    return (
      <div className="p-6">
        <Search value={searchTerm} onSearch={this.handleSearch} />
        {loading && <Loader />}
        {error && <div className="text-red-500 text-lg my-4">{error}</div>}
        <ErrorBoundary>
          {!loading && !error && <CardList items={results} />}
        </ErrorBoundary>
        <div className="mt-6">
          <ErrorButton />
        </div>
      </div>
    );
  }
}

export default App;
