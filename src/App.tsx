import { Component } from 'react';
import type { Item } from './types/item';
import { pokemonService } from './api/pokemonService';
import { storage } from './utils/storage';
import Search from './components/Search/Search';
import Loader from './components/Loader/Loader';
import CardList from './components/CardList/CardList';
import ErrorButton from './components/ErrorButton/ErrorButton';

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
    const saved = storage.getSearch();
    this.setState({ searchTerm: saved }, () => {
      if (saved) this.loadSearch(saved);
      else this.loadPage(1);
    });
  }

  private setLoading = (loading: boolean) => this.setState({ loading });

  private setResults = (results: Item[]) =>
    this.setState({ results, error: null });

  private setError = (message: string) =>
    this.setState({ error: message, results: [] });

  private async fetchAndHandle<T>(
    request: () => Promise<T>,
    onSuccess: (data: T) => void
  ): Promise<void> {
    this.setLoading(true);
    try {
      const data = await request();
      onSuccess(data);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      this.setError(message);
    } finally {
      this.setLoading(false);
    }
  }

  handleSearch = async (value: string) => {
    const trimmed = value.trim();

    if (trimmed === this.state.searchTerm.trim()) return;

    this.setState({ searchTerm: trimmed, page: 1, error: null });

    storage.setSearch(trimmed);

    if (trimmed) {
      await this.fetchAndHandle(
        () => pokemonService.getByName(trimmed),
        (item: Item) => this.setResults([item])
      );
    } else {
      await this.fetchAndHandle(
        () => pokemonService.getPage(1),
        (list: Item[]) => this.setResults(list)
      );
    }
  };

  loadPage = async (page: number) => {
    this.setState({ page, error: null });
    await this.fetchAndHandle(
      () => pokemonService.getPage(page),
      (list: Item[]) => this.setResults(list)
    );
  };

  loadSearch = async (term: string) => {
    await this.fetchAndHandle(
      () => pokemonService.getByName(term),
      (item: Item) => this.setResults([item])
    );
  };

  render() {
    const { searchTerm, results, loading, error } = this.state;
    return (
      <div className="min-h-screen bg-gray-100">
        <header className="bg-red-500 shadow-lg">
          <Search value={searchTerm} onSearch={this.handleSearch} />
        </header>

        <main className="max-w-4xl mx-auto p-4 space-y-6">
          <div className="max-w-4xl mx-auto">
            <ErrorButton />
          </div>

          {loading && <Loader />}

          {error && (
            <div className="flex flex-col items-center justify-center p-8 bg-white rounded-xl border-3 border-red-500 text-center">
              <p className="text-red-700 font-medium">{error}</p>
            </div>
          )}

          {!loading && !error && <CardList items={results} />}
        </main>
      </div>
    );
  }
}

export default App;
