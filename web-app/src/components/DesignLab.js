import React, { useEffect, useRef, useState } from "react";

const DesignLab = ({textData, setTextData}) => {
  const canvasRef = useRef(null);
  const isClicked = useRef(false);
  
  const [currentElement, setcurrentElement] = useState(null);

  

  const [isSelected, setIsSelected] = useState(Array(textData.length).fill(false));
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
      const updatedTextData = [...textData];
      isSelected.forEach((isSelectedValue, index) => {
        if (isSelectedValue) {
          updatedTextData[index].x = currentElement.style.top;
          updatedTextData[index].y = currentElement.style.left;
        }
      });
      setTextData(updatedTextData);
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
    canvas.addEventListener("mouseleave", onMouseUp);

    const cleanup = () => {
      currentElement.removeEventListener("mousedown", onMouseDown);
      currentElement.removeEventListener("mouseup", onMouseUp);
      canvas.removeEventListener("mousemove", onMouseMove);
      canvas.removeEventListener("mouseleave", onMouseUp);
    };
    return cleanup;
  }, [currentElement]);

  const handleTextChange = (index, e) => {
    const updatedTextData = [...textData];
    updatedTextData[index].value = e.target.value;
    setTextData(updatedTextData);
  };

  const handleItemClick = (index, id) => {
    const updatedSelection = Array(textData.length).fill(false)
    updatedSelection[index] = !updatedSelection[index];
    setIsSelected(updatedSelection);
  };
  

  return (
    <div className="grid-item">
      <div ref={canvasRef} className="canvas" style={{width:"500px", height:"500px"}}>
      {textData.map((text, index) => (
        isSelected[index] ? (
          <input 
            key={"text" + text.id}
            id={"text" + text.id}
            className="box textinput"
            style={{ top: text.x, left: text.y }}
            onClick={e=>{
              setcurrentElement(e.target)
              console.log(e.target)
            }}
            onChange={e => handleTextChange(index, e)}
            value={text.value}
          />
        ) : (
          <p
            key={"textview" + text.id}
            id={"textview" + text.id}
            className="view"
            style={{ top: text.x, left: text.y }}
            onClick={e => {
              handleItemClick(index, text.id);
            }}
            >
            {text.value}
          </p>
        )
      ))}
      </div>
    </div>
  );
};

export default DesignLab;
