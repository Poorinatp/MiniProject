import { useEffect, useState } from "react";
import DesignLab from "../components/DesignLab"
import NavBar from "../components/NavBar";
import "./Design.css"
import DesignLab2 from "../components/DesignLab2";
const OptionTab = ({
    textData, 
    setTextData,
    imageData, 
    setImageData, 
    isSelected, 
    setIsSelected, 
    selectedImage, 
    handleFontChange, 
    handleSizeChange, 
    handleColorChange,
    handleImageUpload}) => {
    const [selectedOption, setSelectedOption] = useState("product");
    const size = Array.from({ length: 50 }, (_, i) => (i + 12) * 2);

    const handleOptionChange = (option) => {
        setSelectedOption(option);
    };

    const handleAddText = () => {
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
    const handleAddImage = (image) => {
        const newObject = {
            id: 1, 
            width:"50px", 
            x: "0px", 
            y: "0px", 
            rotationAngle: 0, 
            image: selectedImage,
            filename: selectedImage.name
        }
        setImageData((prevObjects) => [...prevObjects, newObject]);
    };
      

    return(
        <div className="grid-item">
            <div className="grid-container-2">
                <div className="grid-item-2 option-tab">
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
                {selectedOption === "product" && <div className="grid-item-3 option-content">Product Option Content</div>}
                {selectedOption === "text" && 
                <div className="grid-item-3 option-content">        
                    <div>
                        {textData.map((text)=>{
                            return(
                                <p>
                                    {text.value}
                                </p>
                            )
                        })}
                        <button onClick={handleAddText}>Create New Object</button>
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
                            <div className="colorpicker">
                                <input
                                type="color"
                                value={textData[isSelected.findIndex((selected) => selected === true)].fontColor}
                                onChange={(e) => handleColorChange(e, isSelected.findIndex((selected) => selected === true))}
                                />
                                <input
                                type="text"
                                className="colortextinput"
                                value={textData[isSelected.findIndex((selected) => selected === true)].fontColor}
                                onChange={(e) => handleColorChange(e, isSelected.findIndex((selected) => selected === true))}
                                placeholder="Enter color code..."
                                />
                            </div>
                        </div>
                    }
                </div>}
                {selectedOption === "image" && 
                    <div className="grid-item-4 option-content">
                        <input
                        type="file"
                        accept="image/*"
                        onChange={e=>handleImageUpload(e)}
                        />
                        {selectedImage && (
                            <>
                            <img
                                src={URL.createObjectURL(selectedImage)}
                                alt="Uploaded Image"
                                className="uploaded-image"
                            />
                            <button onClick={handleAddImage}>Add image</button>
                            </>
                        )}
                    </div>}
            </div>
        </div>
    )
}

const Design = () => {
    const [textData, setTextData] = useState([
        {id: 1, value: "hi", fontFamily: "Arial", width:"50px", fontSize: "24px", fontColor: "black", x: "0px", y: "0px", rotationAngle: 0},
        {id: 2, value: "mynameis", fontFamily: "Arial", width:"100px", fontSize: "24px", fontColor: "red", x: "50px", y: "50px", rotationAngle: 0},
        {id: 3, value: "poom", fontFamily: "Arial", width:"100px", fontSize: "24px", fontColor: "blue", x: "100px", y: "100px", rotationAngle: 0}
    ]);      
    const [isSelected, setIsSelected] = useState(Array(textData.length).fill(false));
    
    const [imageData, setImageData] = useState([
        {id: 1, width:"50px", x: "0px", y: "0px", rotationAngle: 0, image: "blob:http://localhost:3000/b3158cc4-d925-4325-89d9-76162dde110e", filename:""}
    ]);

    const [selectedImage, setSelectedImage] = useState(null);

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

    const handleImageUpload = (e) => {
        const imageFile = e.target.files[0];
        setSelectedImage(imageFile);
        console.log(selectedImage);
    };

    return(
        <>
            <NavBar/>
            <div className="grid-container-1">
                <OptionTab
                    textData={textData}
                    setTextData={setTextData}
                    imageData={imageData}
                    setImageData={setImageData}
                    isSelected={isSelected}
                    setIsSelected={setIsSelected}
                    selectedImage={selectedImage}
                    handleFontChange={handleFontChange}
                    handleSizeChange={handleSizeChange}
                    handleColorChange={handleColorChange}
                    handleImageUpload={handleImageUpload}
                />
                {/* <DesignLab/> */}
                <DesignLab
                    textData={textData}
                    isSelected={isSelected}
                    imageData={imageData}
                    setImageData={setImageData}
                    setTextData={setTextData}
                    setIsSelected={setIsSelected}
                    selectedImage={selectedImage}
                />
            </div>
        </>
    )
}

export default Design;