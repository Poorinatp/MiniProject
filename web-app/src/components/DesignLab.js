import React, { useEffect, useRef, useState } from "react";
import "../css/DesignLab.css";

const DesignLab = () => {
  const canvasRef = useRef(null);
  const boxRef = useRef(null);

  const isClicked = useRef(false);
  const [isSelected, setisSelected] = useState(null);
  const [currentElement, setcurrentElement] = useState(null);

  const [textData,setTextData] = useState([
    {id:1, value: "hi", fontFamily:"", fontSize:"10", fontColor:"black", x:"0px", y:"0px"},
    {id:2, value: "mynameis", fontFamily:"", fontSize:"10", fontColor:"red", x:"100px", y:"100px"},
    {id:3, value: "poom", fontFamily:"", fontSize:"10", fontColor:"blue", x:"200px", y:"200px"}
  ])

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
    if (!isSelected ) return;
    const canvas = canvasRef.current;
    console.log("last X = "+coords.current.lastX+" last Y = "+coords.current.lastY);
    console.log("start X = "+coords.current.startX+" start Y = "+coords.current.startY);
    const onMouseDown = (e) => {
      isClicked.current = true;
      coords.current.lastX = currentElement.offsetLeft;
      coords.current.lastY = currentElement.offsetTop;
      coords.current.startX = e.clientX;
      coords.current.startY = e.clientY;
    };

    const onMouseUp = (e) => {
      isClicked.current = false;
      setisSelected(null)
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
  }, [isSelected]);

  const handleTextChange = (index, e) => {
    const updatedTextData = [...textData];
    updatedTextData[index].value = e.target.value;
    setTextData(updatedTextData);
  };

  return (
    <div className="container">
      <div ref={canvasRef} className="canvas">
      {textData.map((text, index) => (
        isSelected ? (
          <input 
            key={"text" + text.id}
            id={"text" + text.id}
            className="box textinput"
            style={{ top: text.x, left: text.y }}
            onClick={e => {
              setisSelected(text.id);
              setcurrentElement(e.target);
            }}
            onChange={e => handleTextChange(index, e)}
            value={text.value}
          />
        ) : (
          <p
            key={"text" + text.id}
            id={"text" + text.id}
            className="view"
            style={{ top: text.x, left: text.y }}
            onClick={e => {
              setisSelected(text.id);
              setcurrentElement(e.target);
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
