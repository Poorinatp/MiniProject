import React, { useEffect, useRef, useState } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRotateLeft } from '@fortawesome/free-solid-svg-icons';

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
  const rotationAngleRef = useRef(0);
  const [currentElement, setcurrentElement] = useState(null);
  
  const imgDesign = [
    {x:"", Y:""},
    {x:"", Y:""},
    {x:"", Y:""}
  ]

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
      isClicked.current = true;
      coords.current.lastX = currentElement.offsetLeft;
      coords.current.lastY = currentElement.offsetTop;
      coords.current.startX = e.clientX;
      coords.current.startY = e.clientY;
      console.log(coords)
    }

    const onMouseUp = (e) => {
      isClicked.current = false;
    };

    const onMouseMove = (e) => {
      if (!isClicked.current) return;

      const nextX = e.clientX - coords.current.startX + coords.current.lastX;
      const nextY = e.clientY - coords.current.startY + coords.current.lastY;
    
      currentElement.style.top = `${nextY}px`;
      currentElement.style.left = `${nextX}px`;
    };    

    currentElement.addEventListener("mousedown", onMouseDown);
    currentElement.addEventListener("mouseup", onMouseUp);
    canvas.addEventListener("mousemove", onMouseMove);

    const cleanup = () => {
      currentElement.removeEventListener("mousedown", onMouseDown);
      currentElement.removeEventListener("mouseup", onMouseUp);
      canvas.removeEventListener("mousemove", onMouseMove);
    };
    return cleanup;
  }, [currentElement]);

  useEffect(()=>{
    console.log(textData)
  }, [textData])
  const handleTextChange = (index, e) => {
    const updatedTextData = [...textData];
    const valueLength = e.target.value.length;
    console.log("length = "+valueLength);
    console.log("fontSize = "+valueLength*parseInt(updatedTextData[index].fontSize,10))
    console.log("fontSize = "+valueLength*(parseInt(updatedTextData[index].fontSize,10))/1.618)
    const newWidth = `${valueLength*(parseInt(updatedTextData[index].fontSize,10))/1.618}px`;
    updatedTextData[index].value = e.target.value;
    console.log(newWidth);
    console.log("Before:")
    console.log(updatedTextData);
    updatedTextData[index].width = newWidth;
    console.log("After:")
    console.log(updatedTextData);
    setTextData(updatedTextData);
  };

  const handleItemClick = (index, id) => {
    const updatedSelection = Array(textData.length).fill(false)
    updatedSelection[index] = !updatedSelection[index];
    setIsSelected(updatedSelection);
    //console.log(isSelected)
  };
  
  const handleRotate = (index, e) => {
    const updatedTextData = [...textData];
    const newRotationAngles = textData[index].rotationAngle + 45;
    updatedTextData[index].rotationAngle += 45;
    setTextData(updatedTextData);
    e.target.style.transform = `rotate(${newRotationAngles[index]}deg)`; // Apply rotation
  };

  return (
    <div className="grid-item-1 lab">
      <div className="container-1"
      >
        <img src='../image/tshirt.jpg' alt="t-shirt" className="tshirt" />
        <div className="canvas"
        ref={canvasRef}
        onClick={e=>{
          currentElement?currentElement.style.border = "transparent":console.log(e.target);
        }}>
        {textData.map((text, index) => (
          <div>
            <div
              key={`textbox${text.id}`}
              id={`textbox${text.id}`}
              className="textbox"
              >
              <input 
                key={"textinput" + text.id}
                id={"textinput" + text.id}
                className="textinput"
                style={{
                  width: text.width,
                  top: text.x,
                  left: text.y,
                  padding:"6px",
                  transform: `rotate(${text.rotationAngle}deg)`,
                  fontFamily: text.fontFamily,
                  fontSize: text.fontSize,
                  color: text.fontColor,
                }}
                
                onChange={e => {
                  handleTextChange(index, e)
                }}
                value={text.value}
                onClick={e=>{
                  handleItemClick(index, text.id);
                  setcurrentElement(e.target)
                  e.target.style.border = "2px dashed black";
                }}
                onMouseEnter={e=>{
                  e.target.style.border = "2px dashed black";
                  e.target.style.padding = "4px";
                }}
                onMouseLeave={e=>{
                  if (currentElement!==e.target){
                    e.target.style.border = "transparent";
                    e.target.style.padding = "6px";
                  }
                }}
              />
              
            </div>
            {/* {isSelected[index]?
            <button
            className="rotatebtn"
            onClick={e=>{
              const deltaX = e.clientX - coords.current.startX;
              const deltaY = e.clientY - coords.current.startY;
              const angle = Math.atan2(deltaY, deltaX) * (180 / Math.PI);
              rotationAngleRef.current += angle;
              currentElement.style.transform = `rotate(${rotationAngleRef.current}deg)`;
              coords.current.startX = e.clientX;
              coords.current.startY = e.clientY;
            }}
            onMouseMove={e=>{
              const deltaX = e.clientX - coords.current.startX;
              const deltaY = e.clientY - coords.current.startY;
              const angle = Math.atan2(deltaY, deltaX) * (180 / Math.PI);
              rotationAngleRef.current += angle;
              currentElement.style.transform = `rotate(${rotationAngleRef.current}deg)`;
              coords.current.startX = e.clientX;
              coords.current.startY = e.clientY;
            }}
            style={{
              top:currentElement.style.top,
              left:currentElement.style.left
            }}
          >
            <FontAwesomeIcon icon={faRotateLeft} style={{ color: "#0042aa" }} />
          </button>:<></>
            } */}
          </div>
          ))}
          {imageData.map((image, index) => (
          <div>
            <div
              key={`imgbox${image.id}`}
              id={`imgbox${image.id}`}
              className="imgbox"
              style={{
                width: image.width,
                top: image.x,
                left: image.y,
                padding:"6px",
                transform: `rotate(${image.rotationAngle}deg)`,
              }}
              draggable="false"
              onClick={e=>{
                handleItemClick(index, image.id);
                setcurrentElement(e.target)
                e.target.style.border = "2px dashed black";
                e.target.style.padding = "4px";
              }}
              onMouseEnter={e=>{
                e.target.style.border = "2px dashed black";
                e.target.style.padding = "4px";
              }}
              onMouseLeave={e=>{
                if (currentElement!==e.target){
                  e.target.style.border = "transparent";
                  e.target.style.padding = "6px";
                }
              }}
              >
              <img
                src="blob:http://localhost:3000/b3158cc4-d925-4325-89d9-76162dde110e"
                alt="Display Image"
                className="display-image"
                style={{width:"100%"}}
                draggable="false"
              />
            </div>
          </div>
          ))}
        </div>
      </div>
      
    </div>
  );
};

export default DesignLab;
