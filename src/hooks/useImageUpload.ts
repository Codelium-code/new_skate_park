import { useState, useCallback } from 'react';

export const useImageUpload = () => {
  const [preview, setPreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const uploadImage = useCallback((file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      setIsLoading(true);
      setError(null);

      // Validate file type
      if (!file.type.startsWith('image/')) {
        setError('Por favor selecciona una imagen válida');
        setIsLoading(false);
        reject(new Error('Invalid file type'));
        return;
      }

      // Validate file size (max 2MB)
      if (file.size > 2 * 1024 * 1024) {
        setError('La imagen debe ser menor a 2MB');
        setIsLoading(false);
        reject(new Error('File too large'));
        return;
      }

      const reader = new FileReader();
      
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setPreview(result);
        setIsLoading(false);
        resolve(result);
      };

      reader.onerror = () => {
        setError('Error al cargar la imagen');
        setIsLoading(false);
        reject(new Error('FileReader error'));
      };

      reader.readAsDataURL(file);
    });
  }, []);

  const resetUpload = useCallback(() => {
    setPreview(null);
    setError(null);
    setIsLoading(false);
  }, []);

  return {
    preview,
    isLoading,
    error,
    uploadImage,
    resetUpload,
    setPreview
  };
};