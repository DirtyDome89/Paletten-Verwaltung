function App() {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-blue-500">
        Tailwind funktioniert!
      </h1>
      <form action="#">
        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
          Email
        </label>
        <input
          type="email"
          id="email"
          name="email"
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm 
                     focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        />
        <button type="submit" className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md">
          Absenden
        </button>
      </form>
    </div>
  );
}

export default App;
