import React, { useEffect, useRef, useState } from "react";

const DesignLab = () => {
  const canvasRef = useRef(null);
  const boxRef = useRef(null);

  const isClicked = useRef(false);
  
  const [currentElement, setcurrentElement] = useState(null);

  const [textData,setTextData] = useState([
    {id:1, value: "hi", fontFamily:"", fontSize:"10", fontColor:"black", x:"0px", y:"0px"},
    {id:2, value: "mynameis", fontFamily:"", fontSize:"10", fontColor:"red", x:"100px", y:"100px"},
    {id:3, value: "poom", fontFamily:"", fontSize:"10", fontColor:"blue", x:"200px", y:"200px"}
  ])

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
    console.log(isSelected)
    const canvas = canvasRef.current;
  
    const onMouseDown = (e) => {
      isClicked.current = true;
      coords.current.lastX = currentElement.offsetLeft;
      coords.current.lastY = currentElement.offsetTop;
      coords.current.startX = e.clientX;
      coords.current.startY = e.clientY;
    }

    const onMouseUp = (e) => {
      isClicked.current = false;
      setIsSelected(Array(textData.length).fill(false));
    };

    const onMouseMove = (e) => {
      if (!isClicked.current) return;
    
      const nextX = e.clientX - coords.current.startX + coords.current.lastX;
      const nextY = e.clientY - coords.current.startY + coords.current.lastY;
    
      const updatedTextData = [...textData];
      isSelected.forEach((isSelectedValue, index) => {
        if (isSelectedValue) {
          updatedTextData[index].x = `${nextX}px`;
          updatedTextData[index].y = `${nextY}px`;
        }
      });
    
      setTextData(updatedTextData);
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
  }, [isSelected]);

  const handleTextChange = (index, e) => {
    const updatedTextData = [...textData];
    updatedTextData[index].value = e.target.value;
    setTextData(updatedTextData);
  };

  const handleItemClick = (index) => {
    console.log("Before update:", isSelected);
    const updatedSelection = [...isSelected];
    updatedSelection[index] = !updatedSelection[index];
    setIsSelected(updatedSelection);
    console.log("After update:", updatedSelection);
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
            onClick={e => {
              setcurrentElement(e.target);
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
              setIsSelected(handleItemClick(index));
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
