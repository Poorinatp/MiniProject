import React, { useEffect, useRef, useState } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark, faPlus, faMinus, faUpDownLeftRight } from '@fortawesome/free-solid-svg-icons';

const DesignLab = ({ 
  textData, 
  setTextData,
  imageData, 
  setImageData, 
  isSelected,
  isImageSelected, 
  tshirtcolor,
  tshirtsize,
  setIsSelected,
  setIsImageSelected,
  handleSaveDesign,
  handleCheckoutClick,
  findNewWidth
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

  const borderColor = tshirtcolor==="black"?"white":"black"

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
  }, [currentContainer, textData]);

  const handleTextChange = (index, e) => {
    const updatedTextData = [...textData];
    const value = e.target.value;
    const fontSize = parseInt(updatedTextData[index].fontSize, 10);
    const fontFamily = updatedTextData[index].fontFamily;
    
    updatedTextData[index].value = value;
    updatedTextData[index].width = `${findNewWidth(fontSize, fontFamily, value)}px`;
    setTextData(updatedTextData);
  };
  
  const handleItemClick = (index, e) => {
    const updatedSelection = Array(textData.length).fill(false);
    updatedSelection[index] = !updatedSelection[index];
    setIsSelected(updatedSelection);
  
    const canvas = document.getElementById("canvas");
    const allInputs = canvas.querySelectorAll('input');
    const allImages = canvas.querySelectorAll('img');

    allInputs.forEach((input) => {
      input.style.border = "none";
      input.style.padding = "6px";
    });
    allImages.forEach((img) => {
      img.style.border = "none";
      img.style.padding = "6px";
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

    selectedImage.width = newWidth + "px";
    imageDataCopy[index] = selectedImage;
    setImageData(imageDataCopy);
  };
  
  return (
    <div className="grid-item-1">
      <div className="container-1"
      id="container"
      ref={canvasRef}
      onClick={(e) => {
        if (currentContainer) {
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
        <img src={`../image/tshirt${tshirtcolor}.png`} className="tshirt" />
        <div style={{width:"18px",height:"13px",position:"absolute",top:"98px",left:"213px",textAlign:"center",fontSize:"10px",color:"#FFFFFF"}}>{tshirtsize}</div>
        <div
          className="canvas"
          id="canvas"
        >
        {textData.map((text, index) => (
          <div
            id={`textcontainer${text.id}`}
            key={`textcontainer${text.id}`}
            className="text-container no-select"
            style={{
              top: text.x,
              left: text.y,
            }}
          >
            <FontAwesomeIcon
              icon={faXmark}
              className="remove-icon no-select"
              id={`remove-btn-${text.id}`}
              onClick={() => handleRemoveText(index)}
              style={{
                display: ( isSelected[index] && !isImageSelected ) ? 'block' : 'none',
              }}
            />
            <FontAwesomeIcon
              icon={faUpDownLeftRight}
              className="move-icon no-select"
              id={`move-btn-${text.id}`}
              onClick={(e) => {
                handleItemClick(index, e);
                setIsImageSelected(false);
              }}
              style={{
                display: ( isSelected[index] && !isImageSelected ) ? 'block' : 'none',
              }}
            />
            <input
              key={`textinput${text.id}`}
              id={`textinput${text.id}`}
              className="text-input"
              style={{
                width: text.width,
                padding: ( isSelected[index]&& !isImageSelected )? "4px":"6px",
                border: ( isSelected[index]&& !isImageSelected )? "2px dashed black": "none", 
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
                setIsImageSelected(false);
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
              className="img-container no-select"
              style={{
                top: image.x,
                left: image.y,
                padding: "6px",
              }}
            >
              <FontAwesomeIcon
                icon={faXmark}
                className="remove-icon no-select"
                id={`remove-btn-${image.id}`}
                onClick={() => handleRemoveImage(index)}
                style={{
                  display: ( isSelected[index] && isImageSelected ) ? 'block' : 'none',
                }}
              />
              <FontAwesomeIcon
                icon={faMinus}
                className="decrease-icon no-select"
                id={`decrease-btn-${image.id}`}
                onClick={() => handleResizeImage("decrease", index)}
                style={{
                  display: ( isSelected[index] && isImageSelected ) ? 'block' : 'none',
                }}
              />
              <FontAwesomeIcon
                icon={faPlus}
                className="increase-icon"
                id={`increase-btn-${image.id}`}
                onClick={() => handleResizeImage("increase", index)}
                style={{
                  display: ( isSelected[index] && isImageSelected ) ? 'block' : 'none',
                }}
              />
              <FontAwesomeIcon
                icon={faUpDownLeftRight}
                className="move-icon no-select"
                id={`move-btn-${image.id}`}
                onClick={(e) => {
                  handleItemClick(index, e);
                  setIsImageSelected(true);
                }}
                style={{
                  display: ( isSelected[index] && isImageSelected ) ? 'block' : 'none',
                }}
              />
              <img
                src={`../picture/${image.imagename}`}
                className="display-image"
                style={{ 
                  width: image.width,
                  padding: (isSelected[index]&&isImageSelected )? "4px":"6px",
                  border: (isSelected[index]&&isImageSelected )? "2px dashed black": "none", 
                 }}
                draggable="false"
                onClick={(e) => {
                  handleItemClick(index, e);
                  setIsImageSelected(true)
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
          <button className="save-btn design-btn" onClick={handleSaveDesign}>Save</button>
          <button className="checkout-btn design-btn" onClick={handleCheckoutClick}>Check Out</button>
      </div>
    </div>
  );
};

export default DesignLab;