import React, { useEffect, useRef, useState } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRotateLeft, faXmark, faPlus, faMinus } from '@fortawesome/free-solid-svg-icons';
import html2canvas from 'html2canvas';

const DesignLab = ({ 
  textData, 
  setTextData,
  imageData, 
  setImageData, 
  isSelected, 
  tshirtcolor,
  tshirtsize,
  setIsSelected,
  selectedImage,
  handleCheckoutClick
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
      const textContainer = e.target.closest('.text-container');
      const imgContainer = e.target.closest('.img-container');
  
      if (textContainer) {
        isClicked.current = true;
        coords.current.lastX = textContainer.offsetLeft;
        coords.current.lastY = textContainer.offsetTop;
        coords.current.startX = e.clientX;
        coords.current.startY = e.clientY;
        setCurrentContainer(textContainer);
      } else if (imgContainer) {
        isClicked.current = true;
        coords.current.lastX = imgContainer.offsetLeft;
        coords.current.lastY = imgContainer.offsetTop;
        coords.current.startX = e.clientX;
        coords.current.startY = e.clientY;
        setCurrentContainer(imgContainer);
      }
    };
  
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
    console.log(textData);
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
  
  const handleItemClick = (index, e) => {
    const updatedSelection = Array(textData.length).fill(false);
    updatedSelection[index] = !updatedSelection[index];
    setIsSelected(updatedSelection);
  
    const canvas = document.getElementById("canvas");
    const allInputs = canvas.querySelectorAll('input');
  
    // Set styles for all input elements
    allInputs.forEach((input) => {
      input.style.border = "none";
      input.style.padding = "6px";
    });
  
    setCurrentContainer(e.target);
  };

  const handleRemoveText = (index) => {
    const updatedSelection = Array(textData.length).fill(false)
    const newTextData = [...textData];
    newTextData.splice(index, 1);
    setIsSelected(updatedSelection)
    setTextData(newTextData);
    setCurrentContainer(null);
  };

  const handleRemoveImage = (index) => {
    const updatedSelection = Array(textData.length).fill(false)
    const newImgData = [...imageData];
    newImgData.splice(index, 1);
    setIsSelected(updatedSelection)
    setImageData(newImgData);
    setCurrentContainer(null);
  };

  const handleResizeImage = (type, index) => {
    if (!isSelected[index]) return;
  
    const imageDataCopy = [...imageData];
    const selectedImage = imageDataCopy[index];
    const currentWidth = parseFloat(selectedImage.width);
    const resizeFactor = type === "increase" ? 1.2 : 0.8;
    const newWidth = currentWidth * resizeFactor;

    console.log(selectedImage)
    console.log(newWidth+"px")
    selectedImage.width = newWidth + "px";
    imageDataCopy[index] = selectedImage;
    console.log(imageDataCopy)
    setImageData(imageDataCopy);
  };

  const handleSaveClick = () => {
    // Get the container element
    const container = document.getElementById('container');
  
    // Use html2canvas to capture the contents of the container
    html2canvas(container).then((canvas) => {
      // Create a blob from the canvas content
      canvas.toBlob((blob) => {
        if (!blob) {
          console.error('Failed to create a blob from the canvas.');
          return;
        }
  
        // Create a temporary download link
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = 'design.png'; // You can change the filename
        link.click();
  
        // Clean up the URL.createObjectURL
        URL.revokeObjectURL(link.href);
      }, 'image/png'); // You can change the format if needed
    });
  };
  
  return (
    <div className="grid-item-1 lab">
      <div className="container-1"
      id="container"
      ref={canvasRef}
      >
        <img src={`../image/tshirt${tshirtcolor}.png`} alt="t-shirt" className="tshirt" />
        <div style={{width:"18px",height:"13px",position:"absolute",top:"98px",left:"213px",textAlign:"center",fontSize:"10px",color:"#FFFFFF"}}>{tshirtsize}</div>
        <div
          className="canvas"
          id="canvas"
          onClick={(e) => {
            if (currentContainer) {
              // Check if the clicked element is not the currentContainer or its descendant
              if (!currentContainer.contains(e.target)) {
                currentContainer.style.border = "none";
                currentContainer.style.padding = "6px";
                const updatedSelection = Array(textData.length).fill(false)
                setIsSelected(updatedSelection)
                setCurrentContainer(null);
              }
            }
          }}
        >
        {textData.map((text, index) => (
          <div
            id={`textcontainer${text.id}`}
            key={`textcontainer${text.id}`}
            className="text-container"
            style={{
              top: text.x,
              left: text.y,
            }}
          >
            <FontAwesomeIcon
              icon={faXmark}
              className="remove-icon"
              id={`remove-btn-${text.id}`}
              onClick={() => handleRemoveText(index)}
              style={{
                display: ( isSelected[index] && text.type === "text" ) ? 'block' : 'none',
              }}
            />
            <input
              key={`textinput${text.id}`}
              id={`textinput${text.id}`}
              className="textinput"
              style={{
                width: text.width,
                padding: (isSelected[index]&&text.type==="text")? "4px":"6px",
                border: (isSelected[index]&&text.type==="text")? "2px dashed black": "none", 
                fontFamily: text.fontFamily,
                fontSize: text.fontSize,
                color: text.fontColor,
              }}
              onChange={(e) => {
                handleTextChange(index, e);
              }}
              value={text.value}
              onClick={(e) => {
                handleItemClick(index, e);
              }}
              onMouseEnter={(e) => {
                e.target.style.border = "2px dashed black";
                e.target.style.padding = "4px";
              }}
              onMouseLeave={(e) => {
                if (currentContainer !== e.target) {
                  e.target.style.border = "none";
                  e.target.style.padding = "6px";
                }
              }}
            />
          </div>
        ))}
          {imageData.map((image, index) => (
            <div
              id={`imgbox${image.id}`}
              key={`imgbox${image.id}`}
              className="img-container"
              style={{
                top: image.x,
                left: image.y,
                padding: "6px",
              }}
            >
              <FontAwesomeIcon
                icon={faXmark}
                className="remove-icon"
                id={`remove-btn-${image.id}`}
                onClick={() => handleRemoveImage(index)}
                style={{
                  display: ( isSelected[index] && image.type === "image" ) ? 'block' : 'none',
                }}
              />
              <FontAwesomeIcon
                icon={faMinus}
                className="decrease-icon"
                id={`decrease-btn-${image.id}`}
                onClick={() => handleResizeImage("decrease", index)}
                style={{
                  display: ( isSelected[index] && image.type === "image" ) ? 'block' : 'none',
                }}
              />
              <FontAwesomeIcon
                icon={faPlus}
                className="increase-icon"
                id={`increase-btn-${image.id}`}
                onClick={() => handleResizeImage("increase", index)}
                style={{
                  display: ( isSelected[index] && image.type === "image" ) ? 'block' : 'none',
                }}
              />
              <img
                src={`../picture/${image.imagename}`}
                alt="Display Image"
                className="display-image"
                style={{ 
                  width: image.width
                 }}
                draggable="false"
                onClick={(e) => {
                  handleItemClick(index, e);
                }}
                onMouseEnter={(e) => {
                  e.target.style.border = "2px dashed black";
                  e.target.style.padding = "4px";
                }}
                onMouseLeave={(e) => {
                  if (currentContainer !== e.target) {
                    e.target.style.border = "none";
                    e.target.style.padding = "6px";
                  }
                }}
              />
            </div>
          ))}
        </div>
      </div>
      <div className="btn-group">
          <button className="save-btn" onClick={handleSaveClick}>Save</button>
          <button className="checkout-btn" onClick={handleCheckoutClick}>Check Out</button>
        </div>
    </div>
  );
};

export default DesignLab;