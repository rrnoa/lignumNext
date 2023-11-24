/**
 * Generado por Chat-gpt 
 * applyGrayscale
 * applySepia
 * applyWarmFilter
 * applyColdFilter
 * applyInvertFilter
 */
export function applyGrayscale(imageSrc) {
    return new Promise((resolve, reject) => {
      const image = new Image();
      image.src = imageSrc;
  
      image.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = image.width;
        canvas.height = image.height;
  
        ctx.drawImage(image, 0, 0);
  
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;
  
        for (let i = 0; i < data.length; i += 4) {
          const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
          data[i]     = avg; // red
          data[i + 1] = avg; // green
          data[i + 2] = avg; // blue
        }
  
        ctx.putImageData(imageData, 0, 0);
        resolve(canvas.toDataURL());
      };
  
      image.onerror = () => {
        reject(new Error('Failed to load image'));
      };
    });
  }

export  function applySepia(imageSrc) {
    return new Promise((resolve, reject) => {
      const image = new Image();
      image.src = imageSrc;
  
      image.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = image.width;
        canvas.height = image.height;
  
        ctx.drawImage(image, 0, 0);
  
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;
  
        for (let i = 0; i < data.length; i += 4) {
          const red = data[i];
          const green = data[i + 1];
          const blue = data[i + 2];
  
          // Sepia filter formula
          const sepiaRed = 0.393 * red + 0.769 * green + 0.189 * blue;
          const sepiaGreen = 0.349 * red + 0.686 * green + 0.168 * blue;
          const sepiaBlue = 0.272 * red + 0.534 * green + 0.131 * blue;
  
          data[i] = sepiaRed > 255 ? 255 : sepiaRed;
          data[i + 1] = sepiaGreen > 255 ? 255 : sepiaGreen;
          data[i + 2] = sepiaBlue > 255 ? 255 : sepiaBlue;
        }
  
        ctx.putImageData(imageData, 0, 0);
        resolve(canvas.toDataURL());
      };
  
      image.onerror = () => {
        reject(new Error('Failed to load image'));
      };
    });
  }

export  function applyWarmFilter(imageSrc) {
    return new Promise((resolve, reject) => {
      const image = new Image();
      image.crossOrigin = 'Anonymous'; // Esto es necesario si la imagen está alojada en otro dominio
      image.src = imageSrc;
  
      image.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = image.width;
        canvas.height = image.height;
  
        ctx.drawImage(image, 0, 0);
  
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;
  
        for (let i = 0; i < data.length; i += 4) {
          // Aumentar los tonos rojos y amarillos (rojo y verde)
          data[i] = data[i] * 1.1;     // Rojo
          data[i + 1] = data[i + 1] * 1.1; // Verde
  
          // Disminuir ligeramente los tonos azules
          data[i + 2] = data[i + 2] * 0.9; // Azul
        }
  
        // Asegurarse de que los valores estén en el rango [0, 255]
        for (let i = 0; i < data.length; i++) {
          if (data[i] > 255) {
            data[i] = 255;
          }
        }
  
        ctx.putImageData(imageData, 0, 0);
        resolve(canvas.toDataURL());
      };
  
      image.onerror = (error) => {
        reject(error);
      };
    });
  }

export  function applyColdFilter(imageSrc) {
    return new Promise((resolve, reject) => {
      const image = new Image();
      image.crossOrigin = 'Anonymous'; // Necesario para imágenes de dominios cruzados
      image.src = imageSrc;
  
      image.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = image.width;
        canvas.height = image.height;
  
        ctx.drawImage(image, 0, 0);
  
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;
  
        for (let i = 0; i < data.length; i += 4) {
          // Aumentar los tonos azules
          data[i + 2] = data[i + 2] * 1.1; // Azul
  
          // Disminuir ligeramente los tonos rojos y verdes
          data[i] = data[i] * 0.9; // Rojo
          data[i + 1] = data[i + 1] * 0.9; // Verde
        }
  
        // Asegurarse de que los valores estén en el rango [0, 255]
        for (let i = 0; i < data.length; i++) {
          if (data[i] > 255) {
            data[i] = 255;
          }
        }
  
        ctx.putImageData(imageData, 0, 0);
        resolve(canvas.toDataURL());
      };
  
      image.onerror = (error) => {
        reject(error);
      };
    });
  }

export  function applyInvertFilter(imageSrc) {
    return new Promise((resolve, reject) => {
      const image = new Image();
      image.crossOrigin = 'Anonymous'; // Necesario para imágenes de dominios cruzados
      image.src = imageSrc;
  
      image.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = image.width;
        canvas.height = image.height;
  
        ctx.drawImage(image, 0, 0);
  
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;
  
        for (let i = 0; i < data.length; i += 4) {
          data[i] = 255 - data[i];     // Invertir el canal rojo
          data[i + 1] = 255 - data[i + 1]; // Invertir el canal verde
          data[i + 2] = 255 - data[i + 2]; // Invertir el canal azul
          // El canal alfa se mantiene igual
        }
  
        ctx.putImageData(imageData, 0, 0);
        resolve(canvas.toDataURL());
      };
  
      image.onerror = (error) => {
        reject(error);
      };
    });
  }
  
  
  
  