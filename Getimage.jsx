import React, { useEffect, useState } from 'react';
import axios from 'axios';

const GetImage = () => {
  const [images, setImages] = useState([]); 

  const fetchImage = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/items');
      console.log(response.data); 
      setImages(response.data); 
    } catch (error) {
      console.error('Error fetching images:', error);
    }
  };

  useEffect(() => {
    fetchImage();
  }, []);

  return (
    <div>
      {images.length > 0 ? (
        images.map((image, index) => (
          <img 
            key={index} 
            src={`http://localhost:3000/uploads/${image.image}`} 
            alt={image.title || 'Image'} 
            style={{ width: '300px', margin: '10px' }} 
          />
        ))
      ) : (
        <p>Loading images...</p>
      )}
    </div>
  );
};

export default GetImage;
