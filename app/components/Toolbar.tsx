const Toolbar = () => {
  return (
    <div className="flex items-center justify-between bg-gray-100 p-3 shadow-md border-b">
      <div className="flex space-x-2">
        <button className="px-3 py-1 bg-white border border-gray-300 rounded hover:bg-gray-200">
          B
        </button>
        <button className="px-3 py-1 bg-white border border-gray-300 rounded hover:bg-gray-200">
          I
        </button>
        <button className="px-3 py-1 bg-white border border-gray-300 rounded hover:bg-gray-200">
          U
        </button>
      </div>
      <button className="px-4 py-1 bg-green-600 text-white rounded hover:bg-green-700">
        Save
      </button>
    </div>
  );
};

export default Toolbar;
