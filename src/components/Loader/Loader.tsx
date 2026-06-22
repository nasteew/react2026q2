const Loader = () => {
  return (
    <div className="flex justify-center py-10">
      <div
        role="status"
        aria-label="Loading"
        className="
          w-10 h-10
          border-4
          border-red-500 dark:border-red-700
          border-t-transparent
          rounded-full
          animate-spin
        "
        style={{ borderTopColor: 'transparent' }}
      >
        <span className="sr-only">Loading...</span>
      </div>
    </div>
  );
};

export default Loader;
