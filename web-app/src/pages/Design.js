import { useEffect, useState } from "react";
import DesignLab from "../components/DesignLab"
import NavBar from "../components/NavBar";
import "./Design.css"
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { faAngleDown, faAngleUp, faMagnifyingGlass, faUpload } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import html2canvas from 'html2canvas';

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
            fontSize:"10px", 
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
                                <img className="img-img" key={index} src={`../picture/${name}`} onClick={e=>handleAddImage(name)} />
                            ))}
                        </div>
                    </div>}
            </div>
        </div>
    )
}

const CheckoutPopup = ({
    tshirtcolor,
    tshirtsize,
    textData,
    imageData,
    tshirtPrice,
    textPrice,
    imagePrice,
    designPrice,
    setTotalItem,
    totalItem,
    totalPrice,
    uploadedReceipt,
    openQr,
    openUploadBtn,
    timeLeft,
    closePopup,
    handlePayment,
    handleUpload,
    handleFileUpload
}) => {
    
    const formatTime = (timeLeft) => {
        const minutes = Math.floor(timeLeft / 60);
        const seconds = timeLeft % 60;
        return `${minutes} minute${minutes !== 1 ? 's' : ''}${seconds > 0 ? ` and ${seconds} second${seconds !== 1 ? 's' : ''}` : ''}`;
    };
    return (
      <div className="checkout-popup">
        <div>
        <h2>Checkout Information</h2>
        <p>T-Shirt Color: {tshirtcolor}</p>
        <p>T-Shirt Size: {tshirtsize}</p>
        <p>T-Shirt Price: {tshirtPrice} ฿</p>
        <p>Design Price: {designPrice} ฿</p>
        <p>Total Price: {tshirtPrice+designPrice} ฿</p>
        <p>Number of t-shirts: <input value={totalItem} style={{width:"50px"}} onChange={e=>setTotalItem(e.target.value)} type="number"/> </p>
        <h3>Total: {totalPrice} ฿</h3>
        </div>
        {/* Display text data for reconfirmation */}
        <div className="info-grid-container">
            <div className="info-grid-item">
                <h3>Text Design:</h3>
                {textData.map((text, index) => (
                    <div key={`text-row-${index}`}>
                        <p key={`text-${index}`} className="text-name">{text.value}</p>
                        <p key={`text-price-${index}`} className="text-price">{textPrice} ฿</p>
                    </div>
                ))}
                <h3 style={{alignSelf:"flex-end"}}>{textData.length*textPrice} ฿</h3>
            </div>
            <div className="info-grid-item">
                <h3>Image Design:</h3>
                {imageData.map((image, index) => (
                    <div key={`img-row-${index}`}>
                        <p key={`img-${index}`} className="img-name">{image.imagename.replace(/\.png$/, '')}</p>
                        <p key={`img-price-${index}`} className="img-price">{imagePrice} ฿</p>
                    </div>
                ))}
                <h3 style={{alignSelf:"flex-end"}}>{imageData.length*imagePrice} ฿</h3>
            </div>
        </div>
        {openQr&&
            <div>
                <h1 className="payment-warn">Please pay via QR-code within {formatTime(timeLeft)}</h1>
                <img className="payment-qr" src="../image/paymentQR.jpg"/>
                
                <h1 className="input-warn">Upload receipt here ...</h1>
                <div className="input-file-container">
                    <input
                    type="file"
                    className="input-file"
                    accept="image/*"
                    id="receiptUpload"
                    onChange={handleFileUpload}
                    />
                    <label htmlFor="receiptUpload" className="upload-label">
                    <FontAwesomeIcon icon={faUpload} />
                    Upload Receipt
                    </label>
                </div>

                {/* Display the uploaded receipt */}
                {uploadedReceipt && (
                    <div className="uploaded-receipt-container">
                    <h1 className="input-warn">Uploaded receipt</h1>
                    <img
                        className="uploaded-receipt"
                        src={uploadedReceipt}
                    />
                    </div>
                )}
            </div>
        }
        {timeLeft==0&&
            <h1 className="payment-warn">Payment unsuccessfully please try agian. {formatTime(timeLeft)}</h1>
        }
        <div className="btn-group">
            {openQr&&openUploadBtn&&<button onClick={handleUpload}>Upload</button>}
            {!openQr&&<button onClick={handlePayment}>Payment</button>}
            <button onClick={closePopup}>Close</button>
        </div>
      </div>
    );
};

const Design = () => {
    const [textData, setTextData] = useState([
        {id: 1, type: "text", value: "Type text here", fontFamily: "Basic-Regular", width:"160px", fontSize: "24px", fontColor: "black", x: "30px", y: "25px"},
    ]);      
    const [imageData, setImageData] = useState([
        {id: 1, type: "image", width:"200px", x: "60px", y: "0px", imagename:"แมวบนโซฟาสีเขียว.png"}
    ]);

    const [isSelected, setIsSelected] = useState(Array(textData.length).fill(false));
    const [isImageSelected, setIsImageSelected] = useState(false);

    const { product_id } = useParams();
    const session =  JSON.parse(sessionStorage.getItem('userData'));
    const navigate = useNavigate();

    const [fonts, setFonts] = useState([]);
    const [tshirtcolor, setTshirtColor] = useState('white');
    const [tshirtsize, setTshirtSize] = useState('S');

    const [isCheckoutPopupOpen, setIsCheckoutPopupOpen] = useState(false);
    const tshirtPrice = 100;
    const textPrice = 10;
    const imagePrice = 30;
    const [totalItem, setTotalItem] = useState(1);
    const totalPrice = (tshirtPrice+(textData.length*textPrice+imageData.length*imagePrice))*totalItem;
    
    const [productId, setProductId] = useState(null);
    const [paymentId, setPaymentId] = useState(null);

    const [openQr, setOpenQr] = useState(false)
    const [openUploadBtn, setOpenUploadBtn] = useState(false)

    const [timeLeft, setTimeLeft] = useState(180);
    const [paymentTimer, setPaymentTimer] = useState(null);

    const [uploadedReceipt, setUploadedReceipt] = useState(null);
    const [uploadedReceiptFile, setUploadedReceiptFile] = useState(null);


    const [imgname, setImgname] = useState([]);
    const [filteredImages, setFilteredImages] = useState([]);

    const findNewWidth = (fontSize, fontFamily, value) => {
        const offset = 20;
        const minWidth = 10;
      
        const span = document.createElement('span');
        span.style.display = 'inline-block';
        span.style.fontFamily = fontFamily
        span.style.fontSize = `${fontSize}px`;
        span.innerHTML = value.replace(/ /g, '&nbsp');
      
        document.body.appendChild(span);
        let newWidth = Math.max(minWidth, span.offsetWidth + offset);
        document.body.removeChild(span);
        return newWidth;
    }

    useEffect(() => {
        
        if (product_id) {
            axios
                .get(`http://localhost:8080/products-with-details/${product_id}`)
                .then((response) => {
                    if (response.status === 200) {
                        const textDetailData = response.data
                        .filter((item) => item.Font_family !== "")
                        .map((item) => ({
                            id: item.id,
                            type: "text",
                            value: item.text_value,
                            fontFamily: item.Font_family,
                            fontSize: item.Font_size + 'px',
                            fontColor: item.Font_color,
                            x: item.location_text.split(';')[0].trim(),
                            y: item.location_text.split(';')[1].trim(),
                            width: findNewWidth(item.Font_size, item.Font_family, item.text_value)
                        }));
                        const imageDetailData = response.data
                        .filter((item) => item.Font_family === "")
                        .map((item) => ({
                            id: item.id,
                            type: "image",
                            width: item.img_width,
                            x: item.location_img.split(';')[0].trim(),
                            y: item.location_img.split(';')[1].trim(),
                            imagename: item.img
                        }));
                        setTextData(textDetailData);
                        setImageData(imageDetailData);
                    } else {

                    }
                    
                })
                .catch((error) =>{});
        }else{

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
            .catch((error) => {});
        axios
            .get("http://localhost:8080/picture")
            .then((response) => {
                setImgname(response.data)
                setFilteredImages(response.data)
            })
            .catch((error) => {});
    }, []);

    useEffect(() => {
        if (timeLeft <= 0) {
          setOpenQr(false);
          clearInterval(paymentTimer);
        }
    }, [timeLeft, paymentTimer]);

      
    const handleFontChange = (value, index) => {
        const newTextElements = [...textData];
        newTextElements[index].fontFamily = value;
        newTextElements[index].width = findNewWidth(newTextElements[index].fontSize, value, newTextElements[index].value);
        setTextData(newTextElements);
    };
    
    const handleSizeChange = (value, index) => {
        const newTextElements = [...textData];
        newTextElements[index].fontSize = value;
        newTextElements[index].width = findNewWidth(value, newTextElements[index].fontFamily, newTextElements[index].value);
        setTextData(newTextElements);
    };
    
    const handleColorChange = (event, index) => {
        const newTextElements = [...textData];
        newTextElements[index].fontColor = event.target.value;
        setTextData(newTextElements);
    };

    // const handleImageUpload = (e) => {
    //     const imageFile = e.target.files[0];
    //     setSelectedImage(imageFile);
    // };

    const handleCheckoutClick = () => {
        setIsCheckoutPopupOpen(true);
      };
      
    const closeCheckoutPopup = () => {
        setIsCheckoutPopupOpen(false);
    };

    const handleSaveDesign = () => {
        if (!session) {
          navigate('/signin');
        } else {
            const inputElements = document.querySelectorAll('input');
            
            inputElements.forEach(inputElement => {
                console.log(inputElement)
                const paragraphElement = document.createElement('p');

                paragraphElement.textContent = inputElement.value;
                paragraphElement.style.cssText = inputElement.style.cssText;
                
                inputElement.parentNode.replaceChild(paragraphElement, inputElement);
            
                console.log(inputElement)
            });

            const container = document.getElementById('container');
            html2canvas(container).then((canvas) => {
                canvas.toBlob((blob) => {
                    const formData = new FormData();
                    const fileName = `${session.user_id}_${Date.now()}.png`;
                    formData.append('image', blob, fileName);
            
                    axios
                        .post('http://localhost:8080/saveimage', formData)
                        .then((response) => {
                            const imageDescriptions = imageData.map((image) => image.imagename.replace(/\.png$/, '')).join(' ');
                            const productData = {
                                User_id: session.user_id,
                                Description: imageDescriptions,
                                product_image: response.data,
                            };
                
                            const productDetails = [];
                            textData.forEach((item) => {
                                const textContainer = document.getElementById(`textcontainer${item.id}`)
                                const productDetailData = {
                                    Product_id: null,
                                    Font_size: parseInt(item.fontSize),
                                    Font_family: item.fontFamily,
                                    Font_color: item.fontColor,
                                    location_img: '',
                                    img_width: '',
                                    img: '',
                                    location_text: `${textContainer.style.top};${textContainer.style.left}`,
                                    text_value: item.value,
                                };
                                productDetails.push(productDetailData);
                            });
                
                            imageData.forEach((item) => {
                                const imgbox = document.getElementById(`imgbox${item.id}`)
                                const productDetailData = {
                                    Product_id: null,
                                    Font_size: 0,
                                    Font_family: '',
                                    Font_color: '',
                                    location_img: `${imgbox.style.top};${imgbox.style.left}`,
                                    img_width: item.width,
                                    img: item.imagename,
                                    location_text: '',
                                    text_value: '',
                                };
                                productDetails.push(productDetailData);
                            });
                            axios
                                .post('http://localhost:8080/saveproduct', { productData, productDetails })
                                .then((response) => {
                                    if (response.status==200) {
                                        setProductId(response.data.insertId)

                                    }
                                })
                            .catch((error) => {

                            });
                        })
                    .catch((error) => {
                        
                    });
                }, 'image/png');
            });
        }
    };

    const handlePayment = () => {
        if (!session) {
            navigate('/signin');
        } else {
            handleSaveDesign()
            setOpenQr(true)
            setTimeLeft(180)
            setPaymentTimer(
                setInterval(() => {
                    setTimeLeft((prevTimeLeft) => prevTimeLeft - 1);
                }, 1000)
            );
            const paymentData = {
                User_id: session.user_id,
                Amount: totalPrice,
                status: "ยังไม่ชำระเงิน",
            }
            axios
                .post('http://localhost:8080/createpayment', { paymentData })
                .then((response) => {
                    if(response.status==200) {
                        setPaymentId(response.data.insertId)
                    } else {

                    }
                    
                })
                .catch((error) => {

                });
        }
    }

    const handleFileUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            setUploadedReceiptFile(e.target.files[0])
            setUploadedReceipt(URL.createObjectURL(file));
            setOpenUploadBtn(true);
        } else {
            setUploadedReceipt(null);
            setOpenUploadBtn(false);
        }
    };

    const handleUpload = () => {
        if (paymentId) {
            const formData = new FormData();
            const fileInput = uploadedReceiptFile;
            const fileName = `${session.user_id}_receipt_${Date.now()}.png`;
            formData.append('image', fileInput, fileName);
    
            axios
                .post('http://localhost:8080/savereceipt', formData)
                .then((response) => {
                    const orderData = {
                        Product_id: productId,
                        Payment_id: paymentId,
                        Color: tshirtcolor,
                        Size: tshirtsize,
                        Total_item: totalItem
                    }
                    axios
                        .post('http://localhost:8080/createorder', { orderData })
                        .then((response) => {
                            if(response.status===200) {
                                navigate("/profile")
                            }
                        })
                        .catch((error) => {});
                })
                .catch((error)=>{});
        }
    }


    const handleSearch = (query) => {
        const lowerQuery = query.toLowerCase();
        const filtered = imgname.filter((name) =>
          name.toLowerCase().includes(lowerQuery)
        );
        setFilteredImages(filtered);
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
                    isImageSelected={isImageSelected}
                    fonts={fonts}
                    tshirtcolor={tshirtcolor}
                    setTshirtColor={setTshirtColor}
                    tshirtsize={tshirtsize}
                    setTshirtSize={setTshirtSize}
                    filteredImages={filteredImages}
                    handleFontChange={handleFontChange}
                    handleSizeChange={handleSizeChange}
                    handleColorChange={handleColorChange}
                    handleSearch={handleSearch}
                />
                {/* <DesignLab/> */}
                <DesignLab
                    textData={textData}
                    isSelected={isSelected}
                    isImageSelected={isImageSelected}
                    imageData={imageData}
                    tshirtcolor={tshirtcolor}
                    tshirtsize={tshirtsize}
                    setImageData={setImageData}
                    setTextData={setTextData}
                    setIsSelected={setIsSelected}
                    setIsImageSelected={setIsImageSelected}
                    setIsCheckoutPopupOpen={setIsCheckoutPopupOpen}
                    handleSaveDesign={handleSaveDesign}
                    handleCheckoutClick={handleCheckoutClick}
                    findNewWidth={findNewWidth}
                />
            </div>
            {isCheckoutPopupOpen && (
                <>
                    <div className="popup-overlay"></div>
                    <CheckoutPopup
                        tshirtcolor={tshirtcolor}
                        tshirtsize={tshirtsize}
                        textData={textData}
                        imageData={imageData}
                        tshirtPrice={tshirtPrice}
                        textPrice={textPrice}
                        imagePrice={imagePrice}
                        designPrice={textData.length * textPrice + imageData.length * imagePrice}
                        setTotalItem={setTotalItem}
                        totalItem={totalItem}
                        totalPrice={totalPrice}
                        uploadedReceipt={uploadedReceipt}
                        openQr={openQr}
                        openUploadBtn={openUploadBtn}
                        timeLeft={timeLeft}
                        closePopup={closeCheckoutPopup}
                        handlePayment={handlePayment}
                        handleUpload={handleUpload}
                        handleFileUpload={handleFileUpload}
                    />
                </>
            )}
        </>
    )
}

export default Design;