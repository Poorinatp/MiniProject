import React, { useEffect, useRef, useState } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRotateLeft, faXmark } from '@fortawesome/free-solid-svg-icons';
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

  const handleSaveClick = async () => {
    const container = document.getElementById("container");
    const inputs = container.querySelectorAll("input")
    // Use html2canvas to capture the HTML content
    inputs.forEach((input)=>{
      console.log(input.style)
    })
    await html2canvas(container).then(function (canvas) {
      // Convert the canvas image to a data URL and create a download link
      const dataURL = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.href = dataURL;
      link.download = "design.png"; // You can change the filename
      link.click();
    });
  };

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
  
    // Set styles for the clicked item
    e.target.style.border = "2px dashed blue";
    e.target.style.padding = "4px";
  
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

  const handleCheckoutClick = () => {
    // Calculate the text design price based on the number of textData items
    const textDesignPrice = textData.length * 10; // Adjust the price per item as needed
  
    // Construct the URL for the checkout page with parameters
    const checkoutURL = `/checkout?color=${tshirtcolor}&size=${tshirtsize}&textDesignPrice=${textDesignPrice}`;
  
    // Redirect to the checkout page
    window.location.href = checkoutURL;
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
                display: isSelected[index] ? 'block' : 'none',
              }}
            />
            <input
              key={`textinput${text.id}`}
              id={`textinput${text.id}`}
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
                handleItemClick(index, e);
              }}
              onMouseEnter={(e) => {
                e.target.style.border = "2px dashed blue";
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
          {/* {imageData.map((image, index) => (
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
          ))} */}
        </div>
      </div>
      <div className="btn-group">
          <button className="save-btn" onClick={handleSaveClick}>Save</button>
          <button className="checkout-btn" onClick={handleCheckoutClick}>สั่งซื้อ</button>
        </div>
    </div>
  );
};

export default DesignLab;