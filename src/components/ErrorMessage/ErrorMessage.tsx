interface ErrorMessageProps {
  message: string;
  className?: string;
}

function ErrorMessage({ message, className }: ErrorMessageProps) {
  return (
    <div
      role="alert"
      className={`flex flex-col items-center justify-center p-8 bg-white rounded-xl border-3 border-red-500 text-center ${className}`}
    >
      <p className="text-red-700 font-medium">{message}</p>
    </div>
  );
}

export default ErrorMessage;
