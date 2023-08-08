import React, { useState, useEffect, useRef } from "react";
import "../css/DesignLab.css";

const DesignLab = () => {
  const [objects, setObjects] = useState([]);
  const [selectedObject, setSelectedObject] = useState(null);
  const canvasRef = useRef(null);
  const textEditorRef = useRef([]);
  const moveIconRef = useRef([]);

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;

    const onMouseDown = (e) => {
      const clickedMoveIcon = e.target.closest(".moveIcon");
      if (clickedMoveIcon) {
        const index = moveIconRef.current.indexOf(clickedMoveIcon);
        setSelectedObject(index);
      } else {
        setSelectedObject(null);
      }
    };

    const onMouseUp = () => {
      setSelectedObject(null);
    };

    const onMouseMove = (e) => {
      if (selectedObject === null) return;

      const textEditor = textEditorRef.current[selectedObject];
      if (!textEditor) return;

      const newX = textEditor.offsetLeft + e.movementX;
      const newY = textEditor.offsetTop + e.movementY;

      setObjects((prevObjects) =>
        prevObjects.map((object, index) =>
          index === selectedObject ? { ...object, x: newX, y: newY } : object
        )
      );
    };

    canvas.addEventListener("mousedown", onMouseDown);
    canvas.addEventListener("mouseup", onMouseUp);
    canvas.addEventListener("mousemove", onMouseMove);

    return () => {
      canvas.removeEventListener("mousedown", onMouseDown);
      canvas.removeEventListener("mouseup", onMouseUp);
      canvas.removeEventListener("mousemove", onMouseMove);
    };
  }, [selectedObject]);

  const handleAddObject = () => {
    const newObject = {
      x: 100,
      y: 100,
      text: "New Text",
      fontSize: "16px",
      fontColor: "#000000",
      fontFamily: "Arial",
      fontWeight: "normal"
    };
    setObjects((prevObjects) => [...prevObjects, newObject]);
  };

  const handleChangeText = (index, newText) => {
    setObjects((prevObjects) =>
      prevObjects.map((object, i) => (i === index ? { ...object, text: newText } : object))
    );
  };

  return (
    <main>
      <div>
        <button onClick={handleAddObject}>Create New Object</button>
        {/* ... (other controls for font size, font family, font color) */}
      </div>
      <div ref={canvasRef} className="canvas">
        {objects.map((object, index) => (
          <div
            key={index}
            className={`textEditor ${selectedObject === index ? "selected" : ""}`}
            style={{
              top: object.y,
              left: object.x,
              fontSize: object.fontSize,
              color: object.fontColor,
              fontFamily: object.fontFamily,
              fontWeight: object.fontWeight
            }}
            ref={(ref) => (textEditorRef.current[index] = ref)}
          >
            <input
              type="text"
              value={object.text}
              onChange={(e) => handleChangeText(index, e.target.value)}
              onClick={(e) => e.stopPropagation()} // Prevent selecting text when clicking on the input
            />
            <div
              className="moveIcon"
              ref={(ref) => (moveIconRef.current[index] = ref)}
              onMouseDown={(e) => e.stopPropagation()} // Prevent selecting text when clicking on the move icon
            />
          </div>
        ))}
      </div>
    </main>
  );
};

export default DesignLab;