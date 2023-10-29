import React, { useRef, useState } from "react";

const DesignLab2 = () => {
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

    const [currentX, setCurrentX] = useState(null);
    const [currentY, setCurrentY] = useState(null);


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

  const handleTextChange = (index, e) => {
    const updatedTextData = [...textData];
    updatedTextData[index].value = e.target.value;
    setTextData(updatedTextData);
  };

  const handleMouseDown = (e) => {
    console.log(e.target.style)
  };

  const handleMouseUp = (e) => {
    const nextX = e.clientX - coords.current.startX + coords.current.lastX;
    const nextY = e.clientY - coords.current.startY + coords.current.lastY;

    e.target.style.top = `${nextY}px`;
  };

  const handleMouseMove = (e) => {
  };

  return (
    <div className="grid-item">
      <div ref={canvasRef} className="canvas" style={{width:"500px", height:"500px"}}>
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
            onMouseDown={e=>handleMouseDown(e)}
            onMouseMove={e=>handleMouseMove(e)}
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

export default DesignLab2;
