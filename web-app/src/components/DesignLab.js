import React, { useEffect, useRef, useState } from "react";

const DesignLab = ({ textData, setTextData, isSelected, setIsSelected }) => {
  const canvasRef = useRef(null);
  const isClicked = useRef(false);
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
    canvas.addEventListener("mouseleave", onMouseUp);

    const cleanup = () => {
      currentElement.removeEventListener("mousedown", onMouseDown);
      currentElement.removeEventListener("mouseup", onMouseUp);
      canvas.removeEventListener("mousemove", onMouseMove);
      canvas.removeEventListener("mouseleave", onMouseUp);
    };
    return cleanup;
  }, [currentElement]);

  useEffect(()=>{
    console.log(textData)
  }, [textData])
  const handleTextChange = (index, e) => {
    const updatedTextData = [...textData];
    updatedTextData[index].value = e.target.value;
    setTextData(updatedTextData);
  };

  const handleItemClick = (index, id) => {
    const updatedSelection = Array(textData.length).fill(false)
    updatedSelection[index] = !updatedSelection[index];
    setIsSelected(updatedSelection);
    console.log(isSelected)
  };
  

  return (
    <div className="grid-item">
      <img src='../image/tshirt.jpg' alt="t-shirt" className="tshirt" />
      <div ref={canvasRef} className="canvas" style={{width:"210px", height:"340px"}} 
      onClick={e=>{
        currentElement?currentElement.style.border = "transparent":console.log(e.target);
      }}>
      {textData.map((text, index) => (
        <div
          key={"textbox" + text.id}
          id={"textbox" + text.id}
          className="textbox"
          onClick={e=>{
            currentElement!==e.target&&currentElement!==null?currentElement.style.border = "transparent":console.log(e.target);
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
          >
          <input 
            key={"textinput" + text.id}
            id={"textinput" + text.id}
            className="textinput"
            style={{ 
              top: text.x,
              left: text.y,
              fontFamily: text.fontFamily,
              fontSize: text.fontSize,
              color: text.fontColor
             }}
            
            onChange={e => {
              const newWidth = e.target.value.length;
              e.target.style.width = `${newWidth*text.fontSize}px`;
              handleTextChange(index, e)
            }}
            value={text.value}
          />
        </div>
        ))}
      </div>
    </div>
  );
};

export default DesignLab;
