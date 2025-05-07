const NotFound = () => {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center p-6 bg-white rounded-lg shadow-md">
          <h1 className="text-4xl font-bold text-red-600 mb-4">404 - Page Not Found</h1>
          <p className="text-gray-600 mb-6">
            The page you are looking for does not exist or has been moved.
          </p>
          <a
            href="/dashboard"
            className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600"
          >
            Go to Dashboard
          </a>
        </div>
      </div>
    );
  };
  
  export default NotFound;