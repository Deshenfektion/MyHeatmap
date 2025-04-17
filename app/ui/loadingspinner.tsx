const LoadingSpinner = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <div className="spinner mb-4"></div>
      <h1 className="text-2xl mb-4">Lädt...</h1>
    </div>
  );
};

export default LoadingSpinner;
