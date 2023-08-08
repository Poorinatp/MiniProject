import React, { useEffect, useRef } from "react";
import "../css/DesignLab.css";

const DesignLab = () => {
  const canvasRef = useRef(null);
  const boxRef = useRef(null);

  const isClicked = useRef(false);

  const coords = useRef({
    startX: 0,
    startY: 0,
    lastX: 0,
    lastY: 0
  });

  useEffect(() => {
    if (!boxRef.current || !canvasRef.current) return;

    const box = boxRef.current;
    const canvas = canvasRef.current;

    const onMouseDown = (e) => {
      isClicked.current = true;
      coords.current.startX = e.clientX;
      coords.current.startY = e.clientY;
    };

    const onMouseUp = (e) => {
      isClicked.current = false;
      coords.current.lastX = box.offsetLeft;
      coords.current.lastY = box.offsetTop;
      console.log(box.style.top);
    };

    const onMouseMove = (e) => {
      if (!isClicked.current) return;

      const nextX = e.clientX - coords.current.startX + coords.current.lastX;
      const nextY = e.clientY - coords.current.startY + coords.current.lastY;

      box.style.top = `${nextY}px`;
      box.style.left = `${nextX}px`;
    };

    box.addEventListener("mousedown", onMouseDown);
    box.addEventListener("mouseup", onMouseUp);
    canvas.addEventListener("mousemove", onMouseMove);
    canvas.addEventListener("mouseleave", onMouseUp);

    const cleanup = () => {
      box.removeEventListener("mousedown", onMouseDown);
      box.removeEventListener("mouseup", onMouseUp);
      canvas.removeEventListener("mousemove", onMouseMove);
      canvas.removeEventListener("mouseleave", onMouseUp);
    };
    console.log(box.style.top);
    return cleanup;
  }, []);

  return (
    <div className="container">
      <div ref={canvasRef} className="canvas">
        <div ref={boxRef} className="box"></div>
      </div>
    </div>
  );
};

export default DesignLab;
