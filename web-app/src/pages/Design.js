import { useEffect, useState } from "react";
import DesignLab from "../components/DesignLab"
import NavBar from "../components/NavBar";
import "./Design.css"
import DesignLab2 from "../components/DesignLab2";
const OptionTab = ({textData, setTextData, isSelected, setIsSelected, handleFontChange, handleSizeChange, handleColorChange}) => {
    const [selectedOption, setSelectedOption] = useState("product");
    const size = Array.from({ length: 50 }, (_, i) => (i + 12) * 2);

    const handleOptionChange = (option) => {
        setSelectedOption(option);
    };

    const handleAddObject = () => {
        const newObject = {
            id:textData.length, 
            value: "new text", 
            fontFamily:"Arial", 
            fontSize:"10px", 
            fontColor:"black", 
            x:"0px", 
            y:"0px"
        };

        setTextData((prevObjects) => [...prevObjects, newObject]);
      };
      

    return(
        <div className="grid-item">
            <div className="grid-container">
                <div className="grid-item option-tab">
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
                {selectedOption === "product" && <div className="grid-item option-content">Product Option Content</div>}
                {selectedOption === "text" && 
                <div className="grid-item option-content">        
                    <div>
                        {textData.map((text)=>{
                            return(
                                <p>
                                    {text.value}
                                </p>
                            )
                        })}
                        <button onClick={handleAddObject}>Create New Object</button>
                    </div>
                    {isSelected.some((selected) => selected === true)&&
                        <div>
                            <p>Font Family</p>
                            <select value={textData[isSelected.findIndex((selected) => selected === true)].fontFamily} onChange={(e) => handleFontChange(e, isSelected.findIndex((selected) => selected === true))}>
                                <option value="Arial">Arial</option>
                                <option value="Helvetica">Helvetica</option>
                                <option value="Times New Roman">Times New Roman</option>
                                <option value="Courier New">Courier New</option>
                                <option value="Verdana">Verdana</option>
                                <option value="Georgia">Georgia</option>
                                <option value="Tahoma">Tahoma</option>
                                <option value="Palatino">Palatino</option>
                            </select>

                            <p>Font Size</p>
                            <select value={textData[isSelected.findIndex((selected) => selected === true)].fontSize} onChange={(e) => handleSizeChange(e, isSelected.findIndex((selected) => selected === true))}>
                            {size.map((fontSizeOption) => (
                                <option key={fontSizeOption} value={`${fontSizeOption}px`}>
                                {fontSizeOption}px
                                </option>
                            ))}
                            </select>

                            <p>Font Color</p>
                            <input
                            type="text"
                            value={textData[isSelected.findIndex((selected) => selected === true)].fontColor}
                            onChange={(e) => handleColorChange(e, isSelected.findIndex((selected) => selected === true))}
                            placeholder="Enter color code..."
                            />
                        </div>
                    }
                </div>}
                {selectedOption === "image" && <div className="grid-item option-content">Image Option Content</div>}
            </div>
        </div>
    )
}

const Design = () => {
    const [textData,setTextData] = useState([
        {id:1, value: "hi", fontFamily:"Arial", fontSize:"10px", fontColor:"black", x:"0px", y:"0px"},
        {id:2, value: "mynameis", fontFamily:"Arial", fontSize:"10px", fontColor:"red", x:"50px", y:"50px"},
        {id:3, value: "poom", fontFamily:"Arial", fontSize:"10px", fontColor:"blue", x:"100px", y:"100px"}
    ])
    const [isSelected, setIsSelected] = useState(Array(textData.length).fill(false));

    const handleFontChange = (event, index) => {
        const newTextElements = [...textData];
        newTextElements[index].fontFamily = event.target.value;
        setTextData(newTextElements);
      };
    
      const handleSizeChange = (event, index) => {
        const newTextElements = [...textData];
        newTextElements[index].fontSize = event.target.value;
        setTextData(newTextElements);
      };
    
      const handleColorChange = (event, index) => {
        const newTextElements = [...textData];
        newTextElements[index].fontColor = event.target.value;
        setTextData(newTextElements);
      };

    return(
        <>
            <NavBar/>
            <div className="grid-container">
                <OptionTab
                    textData={textData}
                    isSelected={isSelected}
                    setTextData={setTextData}
                    setIsSelected={setIsSelected}
                    handleFontChange={handleFontChange}
                    handleSizeChange={handleSizeChange}
                    handleColorChange={handleColorChange}
                />
                {/* <DesignLab/> */}
                <DesignLab
                    textData={textData}
                    isSelected={isSelected}
                    setTextData={setTextData}
                    setIsSelected={setIsSelected}
                />
            </div>
        </>
    )
}

export default Design;