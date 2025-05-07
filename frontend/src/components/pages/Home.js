const Home = () => {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center p-6 bg-white rounded-lg shadow-md max-w-lg">
          <img
            src="/logo.png"
            alt="Clinic Logo"
            className="h-16 mx-auto mb-4"
            onError={(e) => (e.target.src = 'https://via.placeholder.com/64')}
          />
          <h1 className="text-3xl font-bold mb-4">Welcome to Clinic App</h1>
          <p className="text-gray-600 mb-6">
            Manage your clinic operations efficiently with our comprehensive system. Log in to access
            patient records, medical records, prescriptions, and transactions.
          </p>
          <a
            href="/login"
            className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600"
          >
            Log In
          </a>
        </div>
      </div>
    );
  };
  
  export default Home;