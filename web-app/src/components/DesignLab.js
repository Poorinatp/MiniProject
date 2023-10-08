import React, { useEffect, useRef, useState } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faRotateLeft } from '@fortawesome/free-solid-svg-icons';

const DesignLab = ({ 
  textData, 
  setTextData,
  imageData, 
  setImageData, 
  isSelected, 
  setIsSelected,
  selectedImage
 }) => {
  const canvasRef = useRef(null);
  const isClicked = useRef(false);
  const [currentContainer, setCurrentContainer] = useState(null);
  
  const coords = useRef({
    startX: 0,
    startY: 0,
    lastX: 0,
    lastY: 0
  });

  useEffect(() => {
    if (isSelected.every(value => !value)) return;
    
    const canvas = canvasRef.current;
  
    const onMouseDown = (e) => {
      const container = e.target.closest('.text-container');
      if (!container) return;
      isClicked.current = true;
      coords.current.lastX = container.offsetLeft;
      coords.current.lastY = container.offsetTop;
      coords.current.startX = e.clientX;
      coords.current.startY = e.clientY;
      setCurrentContainer(container);
    }

    const onMouseUp = (e) => {
      isClicked.current = false;
    };

    const onMouseMove = (e) => {
      if (!isClicked.current) return;

      const nextX = e.clientX - coords.current.startX + coords.current.lastX;
      const nextY = e.clientY - coords.current.startY + coords.current.lastY;
    
      currentContainer.style.top = `${nextY}px`;
      currentContainer.style.left = `${nextX}px`;
    };    

    canvas.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mouseup", onMouseUp);
    window.addEventListener("mousemove", onMouseMove);

    const cleanup = () => {
      canvas.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("mouseup", onMouseUp);
      window.removeEventListener("mousemove", onMouseMove);
    };
    return cleanup;
  }, [currentContainer]);

  useEffect(()=>{
    console.log(textData)
  }, [textData])

  const handleTextChange = (index, e) => {
    const updatedTextData = [...textData];
    const value = e.target.value;
    const fontSize = parseInt(updatedTextData[index].fontSize, 10);
    const offset = 10; // Adjust this value as needed
    const minWidth = 100; // Adjust this value as the minimum width
    const maxWidth = 500; // Adjust this value as the maximum width
  
    const span = document.createElement('span');
    span.style.display = 'inline-block'; // Change to inline-block to measure width accurately
    span.style.fontFamily = updatedTextData[index].fontFamily;
    span.style.fontSize = `${fontSize}px`;
    span.innerHTML = value.replace(/ /g, '&nbsp'); // Prevent whitespace collapse
  
    document.body.appendChild(span);
  
    let newWidth = Math.max(minWidth, Math.min(maxWidth, span.offsetWidth + offset));
  
    document.body.removeChild(span);
  
    updatedTextData[index].value = value;
    updatedTextData[index].width = `${newWidth}px`;
    setTextData(updatedTextData);
  };
  

  const handleItemClick = (index, id) => {
    const updatedSelection = Array(textData.length).fill(false)
    updatedSelection[index] = !updatedSelection[index];
    setIsSelected(updatedSelection);
  };

  const handleRemoveText = (index) => {
    const newTextData = [...textData];
    newTextData.splice(index, 1);
    setTextData(newTextData);
  };

  const handleRotate = (index, e) => {
    const updatedTextData = [...textData];
    const newRotationAngles = textData[index].rotationAngle + 45;
    updatedTextData[index].rotationAngle += 45;
    setTextData(updatedTextData);
    e.target.style.transform = `rotate(${newRotationAngles[index]}deg)`; // Apply rotation
  };

  const handleSaveClick = () => {
    const canvas = canvasRef.current;
  
    if (!canvas) {
      console.error("Canvas element not found.");
      return;
    }
  
    const ctx = canvas.getContext('2d')
  
    if (!ctx) {
      console.error("Canvas context not available.");
      return;
    }
  
    // Ensure all images are loaded before drawing
    const imagesToLoad = imageData.length;
  
    let imagesLoaded = 0;
  
    const onImageLoad = () => {
      imagesLoaded++;
  
      if (imagesLoaded === imagesToLoad) {
        // All images are loaded, proceed to draw on the canvas
  
        // Draw text elements
        textData.forEach((text) => {
          ctx.font = `${text.fontSize}px ${text.fontFamily}`;
          ctx.fillStyle = text.fontColor;
          ctx.fillText(text.value, text.x, text.y);
        });
  
        // Draw image elements
        imageData.forEach((image) => {
          const img = new Image();
          img.src = image.src;
          img.onload = () => {
            ctx.drawImage(img, image.x, image.y, image.width, image.height);
  
            // Check if all images have been drawn
            if (imagesLoaded === imagesToLoad) {
              // Trigger the download
              const link = document.createElement('a');
              link.href = canvas.toDataURL('image/png'); // You can change the format if needed
              link.download = 'design.png'; // You can change the filename
              link.click();
            }
          };
        });
      }
    };
  
    // Start loading images
    imageData.forEach((image) => {
      const img = new Image();
      img.src = image.src;
      img.onload = onImageLoad;
    });
  };  
  
  return (
    <div className="grid-item-1 lab">
      <div className="container-1"
      id="container"
      ref={canvasRef}
      >
        <img src={'../image/tshirt'+'white'+'.png'} alt="t-shirt" className="tshirt" />
        <div className="canvas"
        onClick={e=>{
          currentContainer?currentContainer.style.border = "transparent":console.log(e.target);
        }}>
        {textData.map((text, index) => (
          <div
            key={`textcontainer${text.id}`}
            className="text-container"
            style={{
              top: text.x,
              left: text.y,
              transform: `rotate(${text.rotationAngle}deg)`,
            }}
          >
            <FontAwesomeIcon
              icon={faTrash}
              className="remove-icon"
              onClick={() => handleRemoveText(index)}
            />
            <input
              key={"textinput" + text.id}
              id={"textinput" + text.id}
              className="textinput"
              style={{
                width: text.width,
                padding: "6px",
                fontFamily: text.fontFamily,
                fontSize: text.fontSize,
                color: text.fontColor,
              }}
              onChange={(e) => {
                handleTextChange(index, e);
              }}
              value={text.value}
              onClick={(e) => {
                handleItemClick(index, text.id);
                setCurrentContainer(e.target);
                e.target.style.border = "2px dashed black";
              }}
              onMouseEnter={(e) => {
                e.target.style.border = "2px dashed black";
                e.target.style.padding = "4px";
              }}
              onMouseLeave={(e) => {
                if (currentContainer !== e.target) {
                  e.target.style.border = "transparent";
                  e.target.style.padding = "6px";
                }
              }}
            />
          </div>
        ))}
          {imageData.map((image, index) => (
            <div
              key={`imgbox${image.id}`}
              id={`imgbox${image.id}`}
              className="img-container"
              style={{
                width: image.width,
                top: image.x,
                left: image.y,
                padding: "6px",
                transform: `rotate(${image.rotationAngle}deg)`,
              }}
              draggable="false"
              onClick={() => {
                handleItemClick(index, image.id);
                setCurrentContainer(null);
              }}
              onMouseEnter={() => {
                setCurrentContainer(document.getElementById(`imgbox${image.id}`));
              }}
              onMouseLeave={() => {
                setCurrentContainer(null);
              }}
            >
              <img
                src="blob:http://localhost:3000/b3158cc4-d925-4325-89d9-76162dde110e"
                alt="Display Image"
                className="display-image"
                style={{ width: "100%" }}
                draggable="false"
              />
            </div>
          ))}
        </div>
        <div className="btn-group">
          <button className="save-btn" onClick={handleSaveClick}>Save</button>
          <button className="save-btn">Check Out</button>
        </div>
      </div>
    </div>
  );
};

export default DesignLab;
