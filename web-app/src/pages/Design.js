import { useState } from "react";
import DesignLab from "../components/DesignLab"
import NavBar from "../components/NavBar";
import "./Design.css"
const OptionTab = () => {
    const [selectedOption, setSelectedOption] = useState("product");
    const [objects, setObjects] = useState([]);
    const handleOptionChange = (option) => {
        setSelectedOption(option);
    };

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

    return(
        <div className="option-tab-container">
            <div className="option-tab">
                <button
                className={selectedOption === "product" ? "active" : ""}
                onClick={() => handleOptionChange("product")}
                >
                Product
                </button>
                <button
                className={selectedOption === "text" ? "active" : ""}
                onClick={() => handleOptionChange("text")}
                >
                Text
                </button>
                <button
                className={selectedOption === "image" ? "active" : ""}
                onClick={() => handleOptionChange("image")}
                >
                Image
                </button>
            </div>
            {/* Render content based on selectedOption */}
            {selectedOption === "product" && <div className="option-content">Product Option Content</div>}
            {selectedOption === "text" && 
            <div className="option-content">        
                <div>
                    <button onClick={handleAddObject}>Create New Object</button>
                </div>
            </div>}
            {selectedOption === "image" && <div className="option-content">Image Option Content</div>}
        </div>
    )
}

const Design = () => {
    return(
        <>
            <NavBar/>
            <div className="container2">
                <OptionTab/>
                <DesignLab/>
            </div>
        </>
    )
}

export default Design;