import Button from '../ui/Button/Button';

interface PaginationProps {
  page: number;
  totalPages: number;
  onChange: (page: number) => void;
}

function Pagination({ page, totalPages, onChange }: PaginationProps) {
  const isLastPage = page >= totalPages;

  return (
    <div className="flex justify-center gap-4 mt-6 items-center">
      <Button
        onClick={() => page > 1 && onChange(page - 1)}
        label="<"
        ariaLabel="Previous page"
        disabled={page === 1}
        className="
          bg-red-700 dark:bg-red-900 text-white px-3 py-2 text-sm
          border-2 border-black shadow-md
          hover:scale-105 active:scale-95
          disabled:opacity-50 disabled:cursor-not-allowed
        "
        type="button"
      />

      <span
        className="
        px-3 py-1 rounded-lg text-sm
        bg-white dark:bg-gray-800
        text-gray-900 dark:text-gray-100
        border-2 border-black dark:border-gray-600
        shadow-sm
      "
      >
        {page} / {totalPages}
      </span>

      <Button
        onClick={() => !isLastPage && onChange(page + 1)}
        label=">"
        ariaLabel="Next page"
        disabled={isLastPage}
        className="
          bg-red-700 dark:bg-red-900 text-white px-3 py-2 text-sm
          border-2 border-black shadow-md
          hover:scale-105 active:scale-95
          disabled:opacity-50 disabled:cursor-not-allowed
        "
        type="button"
      />
    </div>
  );
}

export default Pagination;
