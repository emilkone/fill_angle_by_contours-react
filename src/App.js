import React, { useState, useRef, useEffect } from "react";

function App() {
  const [points, setPoints] = useState([]);
  const [image, setImage] = useState(null);
  const canvasRef = useRef(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [canvasSize, setCanvasSize] = useState(500);
  const pointSize = 1;
  const lineColor = "red";
  const lineWidth = 1;

  const handleImageLoad = (event) => {
    handleResetPoints();
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        setCanvasSize({ width: img.width, height: img.height });
        setImage(img);
      };

      img.src = e.target.result;
    };

    reader.readAsDataURL(file);
  };

  useEffect(() => {
    if (image) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(image, 0, 0);

      ctx.fillStyle = lineColor;
      ctx.strokeStyle = lineColor;
      ctx.lineWidth = lineWidth;

      for (let i = 0; i < points.length; i++) {
        const point = points[i];
        ctx.beginPath();
        ctx.arc(point[0], point[1], pointSize, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        if (i > 0) {
          const prevPoint = points[i - 1];
          ctx.beginPath();
          ctx.moveTo(prevPoint[0], prevPoint[1]);
          ctx.lineTo(point[0], point[1]);
          ctx.stroke();
        }
      }
    }
  }, [points, image]);

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        setImage(img);
      };
      img.src = e.target.result;
    };

    reader.readAsDataURL(file);
  };

  const handleCanvasClick = (event) => {
    const rect = canvasRef.current.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    setPoints([...points, [x, y]]);
  };

  const handleResetPoints = () => {
    setPoints([]);
  };

  const handleGenerateImage = () => {
    if (points.length === 0) {
      alert("Нет выделенных точек.");
      return;
    }

    const canvas = canvasRef.current;
    const canvasCopy = document.createElement("canvas");
    const copyCtx = canvasCopy.getContext("2d");

    canvasCopy.width = canvas.width;
    canvasCopy.height = canvas.height;

    copyCtx.fillStyle = "white";
    copyCtx.beginPath();
    copyCtx.moveTo(points[0][0], points[0][1]);

    for (let i = 1; i < points.length; i++) {
      copyCtx.lineTo(points[i][0], points[i][1]);
    }

    copyCtx.closePath();
    copyCtx.fill();

    const outputCanvas = document.createElement("canvas");
    const outputCtx = outputCanvas.getContext("2d");

    outputCanvas.width = canvas.width;
    outputCanvas.height = canvas.height;

    // outputCtx.fillStyle = "black";

    outputCtx.fillStyle = "black"; // Установка белого цвета фона
    outputCtx.fillRect(0, 0, outputCanvas.width, outputCanvas.height); // Закрашивание холста белым цветом

    // image.fillStyle = "white";
    // image.fill();
    outputCtx.drawImage(
      canvasCopy,
      0,
      0,
      outputCanvas.width,
      outputCanvas.height
    );
    outputCtx.globalCompositeOperation = "source-in";
    outputCtx.drawImage(
      outputCanvas,
      0,
      0,
      outputCanvas.width,
      outputCanvas.height
    );

    const outputImage = outputCanvas.toDataURL();

    const link = document.createElement("a");
    link.href = outputImage;
    link.download = "output_image.png";
    link.click();
  };

  return (
    <div>
      <input type="file" accept="image/*" onChange={handleImageLoad} />
      <br />
      <canvas
        ref={canvasRef}
        width={canvasSize.width}
        height={canvasSize.height}
        onClick={handleCanvasClick}
        style={{ border: "1px solid black" }}
      ></canvas>
      <br />
      <button onClick={handleResetPoints}>Сбросить точки</button>
      <br />
      <button onClick={handleGenerateImage}>Создать изображение</button>
    </div>
  );
}

export default App;
