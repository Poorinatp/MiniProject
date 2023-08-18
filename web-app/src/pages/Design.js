import { useEffect, useState } from "react";
import DesignLab from "../components/DesignLab"
import NavBar from "../components/NavBar";
import "./Design.css"
import DesignLab2 from "../components/DesignLab2";
const OptionTab = ({textData, setTextData}) => {
    const [selectedOption, setSelectedOption] = useState("product");
    const [objects, setObjects] = useState([]);
    const handleOptionChange = (option) => {
        setSelectedOption(option);
    };

    useEffect(()=>{
        console.log(textData)
    })

    const handleAddObject = () => {
        const newObject = {
            id:textData.length, 
            value: "hi", 
            fontFamily:"", 
            fontSize:"10", 
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
                </div>}
                {selectedOption === "image" && <div className="grid-item option-content">Image Option Content</div>}
            </div>
        </div>
    )
}

const Design = () => {
    const [textData,setTextData] = useState([
        {id:1, value: "hi", fontFamily:"", fontSize:"10", fontColor:"black", x:"0px", y:"0px"},
        {id:2, value: "mynameis", fontFamily:"", fontSize:"10", fontColor:"red", x:"100px", y:"100px"},
        {id:3, value: "poom", fontFamily:"", fontSize:"10", fontColor:"blue", x:"200px", y:"200px"}
    ])
    
    return(
        <>
            <NavBar/>
            <div className="grid-container">
                <OptionTab textData={textData} setTextData={setTextData}/>
                {/* <DesignLab/> */}
                <DesignLab textData={textData} setTextData={setTextData}/>
            </div>
        </>
    )
}

export default Design;