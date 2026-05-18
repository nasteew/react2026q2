interface ErrorMessageProps {
  message: string;
}

function ErrorMessage({ message }: ErrorMessageProps) {
  return (
    <div className="flex flex-col items-center justify-center p-8 bg-white rounded-xl border-3 border-red-500 text-center">
      <p className="text-red-700 font-medium">{message}</p>
    </div>
  );
}

export default ErrorMessage;
