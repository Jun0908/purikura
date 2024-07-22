'use client';

import { ChangeEvent, useState } from 'react';
import axios from 'axios';

export default function Home() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewSrc, setPreviewSrc] = useState<string>('');
  const [processedImage, setProcessedImage] = useState<string>('');
  const [color, setColor] = useState<[number, number, number]>([255, 215, 0]); // Default to gold

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
      setPreviewSrc(URL.createObjectURL(e.target.files[0]));
    }
  };

  const handleColorChange = (e: ChangeEvent<HTMLInputElement>) => {
    const selectedColor = e.target.value;
    if (selectedColor === 'gold') {
      setColor([255, 215, 0]);
    } else if (selectedColor === 'green') {
      setColor([0, 255, 0]);
    } else if (selectedColor === 'red') {
      setColor([255, 0, 0]);
    }
  };

  const handleSubmit = async () => {
    if (!selectedFile) return;

    const formData = new FormData();
    formData.append('image', selectedFile);
    formData.append('color', JSON.stringify(color));

    try {
      const response = await axios.post('http://localhost:5000/change_hair_color', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setProcessedImage(response.data);
    } catch (error) {
      console.error('Error uploading the image:', error);
    }
  };

  return (
    <div>
      <h1>Hair Color Changer</h1>
      <input type="file" onChange={handleFileChange} />
      <div>
        <label>
          <input type="radio" value="gold" name="color" onChange={handleColorChange} defaultChecked /> Gold
        </label>
        <label>
          <input type="radio" value="green" name="color" onChange={handleColorChange} /> Green
        </label>
        <label>
          <input type="radio" value="red" name="color" onChange={handleColorChange} /> Red
        </label>
      </div>
      <button onClick={handleSubmit}>Submit</button>
      <div>
        {previewSrc && <img src={previewSrc} alt="preview" style={{ maxWidth: '300px' }} />}
      </div>
      <div>
        {processedImage && <img src={`data:image/jpeg;base64,${processedImage}`} alt="processed" style={{ maxWidth: '300px' }} />}
      </div>
    </div>
  );
}
