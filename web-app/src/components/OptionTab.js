import { useState } from "react";
import { faAngleDown, faAngleUp, faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const OptionTab = ({
    textData, 
    setTextData,
    imageData, 
    setImageData, 
    isSelected, 
    setIsSelected,
    isImageSelected,
    fonts,
    tshirtcolor,
    setTshirtColor,
    tshirtsize,
    setTshirtSize,
    filteredImages,
    handleFontChange, 
    handleSizeChange, 
    handleColorChange,
    handleSearch
}) => {
    const [selectedOption, setSelectedOption] = useState("Product");
    const size = Array.from({ length: 50 }, (_, i) => (i + 12) * 2);
    const [searchImg, setsearchImg] = useState("");
    const [openOption, setOpenOption] = useState(false);
    const [isFontFamilyDropdownOpen, setFontFamilyDropdownOpen] = useState(false);
    const [isFontSizeDropdownOpen, setFontSizeDropdownOpen] = useState(false);

    const toggleDropdown = (type) => {
    if (type === 'fontFamily') {
        setFontFamilyDropdownOpen(!isFontFamilyDropdownOpen);
        setFontSizeDropdownOpen(false);
    } else if (type === 'fontSize') {
        setFontSizeDropdownOpen(!isFontSizeDropdownOpen);
        setFontFamilyDropdownOpen(false);
    }
    };

    const handleOptionChange = (option) => {
        setSelectedOption(option);
    };

    const handleAddText = () => {
        const newObject = {
            id: textData.length===0?1:textData[textData.length-1].id+1, 
            type: "text",
            value: "new text", 
            fontFamily:"Arial", 
            fontSize:"24px", 
            fontColor:"black", 
            x:"0px", 
            y:"0px"
        };

        setTextData((prevObjects) => [...prevObjects, newObject]);
    };
    const handleAddImage = (image) => {
        const newObject = {
            id: imageData.length===0?1:imageData[imageData.length-1].id+1,
            type: "image",
            width: "100px", 
            x: "0px", 
            y: "0px",
            imagename: image,
        }
        setImageData((prevObjects) => [...prevObjects, newObject]);
    };

    return(
        <div className="grid-item">
            <div className="dropdown" onClick={e=>setOpenOption(previous=>!previous)}>
                <p className="dropdown-option">{selectedOption}</p>
                <FontAwesomeIcon className="dropdown-icon" icon={openOption?faAngleUp:faAngleDown} />
            </div>
            <div className="grid-container-2" style={{display:openOption&&"grid"}}>
                <div className="grid-item-2 option-tab">
                    <button
                    className={selectedOption === "Product" ? "active" : ""}
                    onClick={() => handleOptionChange("Product")}
                    >
                    Product
                    </button>
                    <button
                    className={selectedOption === "Text" ? "active" : ""}
                    onClick={() => handleOptionChange("Text")}
                    >
                    Text
                    </button>
                    <button
                    className={selectedOption === "Image" ? "active" : ""}
                    onClick={() => handleOptionChange("Image")}
                    >
                    Image
                    </button>
                    
                </div>
                {/* Render content based on selectedOption */}
                {selectedOption === "Product" && 
                <div className="grid-item-3 option-content">
                    <div>
                        <p>Select T-shirt Color</p>
                        <select value={tshirtcolor} onChange={(e)=>setTshirtColor(e.target.value)}>
                            <option key="white" value="white">White</option>
                            <option key="black" value="black">Black</option>
                        </select>
                        <p>Select T-shirt Size</p>
                        <select value={tshirtsize} onChange={(e)=>setTshirtSize(e.target.value)}>
                            <option key="S" value="S">S</option>
                            <option key="M" value="M">M</option>
                            <option key="L" value="L">L</option>
                            <option key="XL" value="XL">XL</option>
                        </select>
                    </div>
                </div>}
                {selectedOption === "Text" && 
                <div className="grid-item-3 option-content">        
                    <div className="text-list-wrap">
                        {/* {textData.map((text, index)=>{
                            return(
                                <p 
                                    key={"p"+index}
                                    className="text-list"
                                    style={{ 
                                        padding: isSelected[index]&&(!isSelected)? "0px 9px":"0px 10px",
                                        backgroundColor: isSelected[index]&&(!isSelectedImage)? "mediumseagreen": "transparent", 
                                        border: isSelected[index]&&(!isSelectedImage)? "1px solid gray": "none", 
                                        borderRadius: "20px",
                                        cursor: "pointer"
                                    }}
                                    onClick={()=>{
                                        const updatedSelection = Array(textData.length).fill(false);
                                        updatedSelection[index] = !updatedSelection[index];
                                        setIsSelected(updatedSelection);
                                    }}
                                >
                                    {index+1}: {text.value}
                                </p>
                            )
                        })} */}
                        <button className="design-btn" onClick={handleAddText}>Create New Text</button>
                    </div>
                    {(isSelected.some((selected) => selected === true)&&(!isImageSelected))&&
                        <div className="text-option">
                            <div className="custom-dropdown">
                                <p>Font Family</p>
                                <div className="selected-option" onClick={() => toggleDropdown('fontFamily')}>
                                    {textData[isSelected.findIndex((selected) => selected === true)].fontFamily}
                                </div>
                                <ul className={`dropdown-options ${isFontFamilyDropdownOpen ? 'open' : ''}`}>
                                    {fonts.map((fontName) => (
                                    <li key={fontName} value={fontName} onClick={(e) => handleFontChange(fontName, isSelected.findIndex((selected) => selected === true))}>
                                        {fontName}
                                    </li>
                                    ))}
                                </ul>
                                <p>Font Size</p>
                                <div className="selected-option" onClick={() => toggleDropdown('fontSize')}>
                                    {textData[isSelected.findIndex((selected) => selected === true)].fontSize}
                                </div>
                                <ul className={`dropdown-options ${isFontSizeDropdownOpen ? 'open' : ''}`}>
                                    {size.map((fontSizeOption) => (
                                    <li key={fontSizeOption} onClick={(e) => handleSizeChange(fontSizeOption, isSelected.findIndex((selected) => selected === true))}>
                                        {fontSizeOption}px
                                    </li>
                                    ))}
                                </ul>
                            </div>
                            <p>Text Color</p>
                            <div className="colorpicker">
                                <input
                                type="color"
                                className="colorselectinput"
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
                {selectedOption === "Image" && 
                    <div className="grid-item-4 option-content">
                        <div className="search-container">
                        <FontAwesomeIcon
                            icon={faMagnifyingGlass}
                            className="search-icon"
                            id={`search-btn`}
                        />
                        <input
                            type="search"
                            className="search-img"
                            value={searchImg}
                            onChange={(e) => {
                                setsearchImg(e.target.value);
                                handleSearch(e.target.value);
                              }}
                            placeholder="Search image by keywords..."
                        />
                        </div>
                        <div className="show-container">
                            {filteredImages.map((name, index)=>(
                                <img className="img-img" key={index} src={`../picture/${name}`} alt="img-img" onClick={e=>handleAddImage(name)} />
                            ))}
                        </div>
                    </div>}
            </div>
        </div>
    )
}

export default OptionTab;