import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    file: null,
  });

  const handleChange = (event) => {
    const { name, value, files } = event.target;

    if (name === 'file') {
      setFormData({ ...formData, file: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleEvent = async (event) => {
    event.preventDefault();

    const dataToBeSent = new FormData();
    dataToBeSent.append('title', formData.name);
    dataToBeSent.append('image', formData.file);

    console.log('FormData content:', Array.from(dataToBeSent.entries()));

    try {
      const response = await axios.post('http://localhost:3000/posts', dataToBeSent, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log('Response data:', response.data);
      navigate('/getimage'); // Navigate after successful submission
    } catch (err) {
      console.error('Error occurred:', err);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-gray-100 rounded-lg shadow-md">
      <form onSubmit={handleEvent} className="space-y-6">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
            Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter your name"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>

        <div>
          <label htmlFor="file" className="block text-sm font-medium text-gray-700 mb-1">
            File
          </label>
          <input
            type="file"
            id="file"
            name="file"
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>

        <div>
          <button
            type="submit"
            className="w-full bg-indigo-600 text-white font-medium py-2 px-4 rounded-lg shadow hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};

export default Home;
