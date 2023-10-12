import { useEffect, useState } from "react";
import DesignLab from "../components/DesignLab"
import NavBar from "../components/NavBar";
import "./Design.css"
import axios from "axios";
import DesignLab2 from "../components/DesignLab2";
import { useParams } from "react-router-dom";
const OptionTab = ({
    textData, 
    setTextData,
    imageData, 
    setImageData, 
    isSelected, 
    setIsSelected, 
    selectedImage,
    fonts,
    tshirtcolor,
    setTshirtColor,
    tshirtsize,
    setTshirtSize, 
    handleFontChange, 
    handleSizeChange, 
    handleColorChange,
    handleImageUpload
}) => {
    const [selectedOption, setSelectedOption] = useState("product");
    const size = Array.from({ length: 50 }, (_, i) => (i + 12) * 2);

    const handleOptionChange = (option) => {
        setSelectedOption(option);
    };

    const handleAddText = () => {
        const newObject = {
            id:textData.length+1, 
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
                {selectedOption === "product" && 
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
                {selectedOption === "text" && 
                <div className="grid-item-3 option-content">        
                    <div>
                        {textData.map((text)=>{
                            return(
                                <p key={text.id}>
                                    {text.id}: {text.value}
                                </p>
                            )
                        })}
                        <button onClick={handleAddText}>Create New Object</button>
                    </div>
                    {isSelected.some((selected) => selected === true)&&
                        <div>
                            <p>Font Family</p>
                            <select value={textData[isSelected.findIndex((selected) => selected === true)].fontFamily} onChange={(e) => handleFontChange(e, isSelected.findIndex((selected) => selected === true))}>
                                {fonts.map((fontName) => (
                                    <option key={fontName} value={fontName}>
                                        {fontName}
                                    </option>
                                ))}
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

const CheckoutPopup = ({
    tshirtcolor,
    tshirtsize,
    textData,
    textDesignPrice,
    closePopup,
}) => {
    return (
      <div className="checkout-popup">
        <h2>Checkout Information</h2>
        <p>T-Shirt Color: {tshirtcolor}</p>
        <p>T-Shirt Size: {tshirtsize}</p>
        <p>Text Design Price: ${textDesignPrice}</p>
  
        {/* Display text data for reconfirmation */}
        <h3>Text Data:</h3>
        <ul>
          {textData.map((text, index) => (
            <li key={`text-${index}`}>{text.value}</li>
          ))}
        </ul>
  
        <button onClick={closePopup}>Close</button>
      </div>
    );
};

const Design = () => {
    const [textData, setTextData] = useState([
        {id: 1, value: "hi", fontFamily: "Basic-Regular", width:"50px", fontSize: "24px", fontColor: "black", x: "0px", y: "0px", rotationAngle: 0},
        {id: 2, value: "mynameis", fontFamily: "Basic-Regular", width:"120px", fontSize: "24px", fontColor: "red", x: "50px", y: "50px", rotationAngle: 0},
        {id: 3, value: "poom", fontFamily: "Basic-Regular", width:"100px", fontSize: "24px", fontColor: "blue", x: "100px", y: "100px", rotationAngle: 0}
    ]);      
    const [isSelected, setIsSelected] = useState(Array(textData.length).fill(false));
    
    const [imageData, setImageData] = useState([
        {id: 1, width:"50px", x: "0px", y: "0px", rotationAngle: 0, image: "blob:http://localhost:3000/b3158cc4-d925-4325-89d9-76162dde110e", filename:""}
    ]);

    const [selectedImage, setSelectedImage] = useState(null);

    const [fonts, setFonts] = useState([]);
    const [tshirtcolor, setTshirtColor] = useState('white');
    const [tshirtsize, setTshirtSize] = useState('S');
    const [isCheckoutPopupOpen, setIsCheckoutPopupOpen] = useState(false);

    const { product_id } = useParams();
    useEffect(() => {
        // Fetch the list of fonts from the server using Axios
        if (product_id) {
            // Fetch data based on the product_id
            axios
                .get(`http://localhost:8080/products-with-details/${product_id}`)
                .then((response) => {
                    // Handle the response data here
                    console.log(response.data.filter((item) => item.Font_family !== ""));
                    // Update your state or perform other actions with the data
                    const transformedData = response.data
                    .filter((item) => item.Font_family !== "")
                    .map((item) => ({
                        id: item.id,
                        value: 'EXAMPLE',
                        fontFamily: item.Font_family,
                        fontSize: item.Font_size + 'px',
                        fontColor: item.Font_color,
                        x: item.location_text.split(';')[0].trim() + 'px',
                        y: item.location_text.split(';')[1].trim() + 'px',
                        rotationAngle: 0, // You can set this to the default value
                    }));
                    console.log(transformedData);
                    setTextData(transformedData);
                })
                .catch((error) => console.error("Error fetching product details:", error));
        }else{
            console.log("new product")
        }
        axios
            .get("http://localhost:8080/fonts")
            .then((response) => {
                setFonts(response.data);
                response.data.forEach((fontName) => {
                    const fontFace = new FontFace(fontName, `url(/fonts/${fontName}.ttf)`);
                    document.fonts.add(fontFace);
                });
            })
            .catch((error) => console.error("Error fetching fonts:", error));
    }, []);

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
    };

    const handleCheckoutClick = () => {
        setIsCheckoutPopupOpen(true);
      };
      
    const closeCheckoutPopup = () => {
        setIsCheckoutPopupOpen(false);
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
                    fonts={fonts}
                    tshirtcolor={tshirtcolor}
                    setTshirtColor={setTshirtColor}
                    tshirtsize={tshirtsize}
                    setTshirtSize={setTshirtSize}
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
                    tshirtcolor={tshirtcolor}
                    tshirtsize={tshirtsize}
                    setImageData={setImageData}
                    setTextData={setTextData}
                    setIsSelected={setIsSelected}
                    selectedImage={selectedImage}
                    setIsCheckoutPopupOpen={setIsCheckoutPopupOpen}
                    handleCheckoutClick={handleCheckoutClick}
                />
            </div>
            {isCheckoutPopupOpen && (
                <>
                    <div className="popup-overlay"></div>
                    <CheckoutPopup
                        tshirtcolor={tshirtcolor}
                        tshirtsize={tshirtsize}
                        textData={textData}
                        textDesignPrice={textData.length * 10}
                        closePopup={closeCheckoutPopup}
                    />
                </>
            )}
        </>
    )
}

export default Design;