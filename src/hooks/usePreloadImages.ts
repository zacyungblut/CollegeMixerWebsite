import { useEffect, useState } from 'react';

const usePreloadImages = (imageArray: string[]) => {
  const [loadedImages, setLoadedImages] = useState<string[]>([]);

  useEffect(() => {
    imageArray.forEach((imgUrl) => {
      const img = new Image();
      img.src = imgUrl;
      img.onload = () => setLoadedImages((prev) => [...prev, imgUrl]);
    });
  }, [imageArray]);

  return loadedImages;
};

export default usePreloadImages;
