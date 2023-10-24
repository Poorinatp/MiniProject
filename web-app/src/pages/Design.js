import { useEffect, useState } from "react";
import DesignLab from "../components/DesignLab"
import NavBar from "../components/NavBar";
import "./Design.css"
import axios from "axios";
import DesignLab2 from "../components/DesignLab2";
import { useNavigate, useParams } from "react-router-dom";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import html2canvas from 'html2canvas';

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
    const [searchImg, setsearchImg] = useState("");
    const [imgname, setImgname] = useState([]);
    const [filteredImages, setFilteredImages] = useState([]);

    useEffect(()=>{
        axios
        .get("http://localhost:8080/picture")
        .then((response) => {
            setImgname(response.data)
            setFilteredImages(response.data)
        })
        .catch((error) => {});
    },[])

    const handleOptionChange = (option) => {
        setSelectedOption(option);
    };

    const handleAddText = () => {
        const newObject = {
            id: textData[textData.length-1].id+1, 
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
            id: imageData[imageData.length-1].id+1,
            type: "image",
            width: "100px", 
            x: "0px", 
            y: "0px",
            imagename: image,
        }
        setImageData((prevObjects) => [...prevObjects, newObject]);
    };

    const handleSearch = (query) => {
        const lowerQuery = query.toLowerCase();
        const filtered = imgname.filter((name) =>
          name.toLowerCase().includes(lowerQuery)
        );
        setFilteredImages(filtered);
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
                    <div className="text-list-wrap">
                        {textData.map((text, index)=>{
                            return(
                                <p 
                                    key={"p"+index}
                                    className="text-list"
                                    style={{ 
                                        padding: isSelected[index]? "0px 9px":"0px 10px",
                                        backgroundColor: isSelected[index]? "mediumseagreen": "transparent", 
                                        border: isSelected[index]? "1px solid gray": "none", 
                                        borderRadius: "20px",
                                        cursor: "pointer"
                                    }}
                                    onClick={(e)=>{
                                        const updatedSelection = Array(textData.length).fill(false);
                                        updatedSelection[index] = !updatedSelection[index];
                                        setIsSelected(updatedSelection);
                                    }}
                                >
                                    {index+1}: {text.value}
                                </p>
                            )
                        })}
                        <button onClick={handleAddText}>Create New Object</button>
                    </div>
                    {(isSelected.some((selected) => selected === true)&&textData.length!==0)&&
                        <div className="text-option">
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
                                <img className="img-img" key={index} src={`../picture/${name}`} alt={`image${index}`} onClick={e=>handleAddImage(name)} />
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
    openQr,
    timeLeft,
    closePopup,
    handlePayment,
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
                <img className="payment-qr" src="../image/paymentQR.jpg" alt="payment-qr-code"/>
            </div>
        }
        {timeLeft==0&&
            <h1 className="payment-warn">Payment unsuccessfully please try agian. {formatTime(timeLeft)}</h1>
        }
        <div className="btn-group">
            <button onClick={handlePayment}>Payment</button>
            <button onClick={closePopup}>Close</button>
        </div>
      </div>
    );
};

const Design = () => {
    const [textData, setTextData] = useState([
        {id: 1, type: "text", value: "hi", fontFamily: "Basic-Regular", width:"50px", fontSize: "24px", fontColor: "black", x: "0px", y: "0px"},
        {id: 2, type: "text", value: "mynameis", fontFamily: "Basic-Regular", width:"120px", fontSize: "36px", fontColor: "red", x: "50px", y: "50px"},
        {id: 3, type: "text", value: "poom", fontFamily: "Basic-Regular", width:"100px", fontSize: "24px", fontColor: "blue", x: "100px", y: "100px"}
    ]);      
    const [isSelected, setIsSelected] = useState(Array(textData.length).fill(false));
    const [imageData, setImageData] = useState([
        {id: 1, type: "image", width:"100px", x: "0px", y: "0px", imagename:"แมวบนโซฟาสีเขียว.png"}
    ]);

    const [selectedImage, setSelectedImage] = useState(null);

    const [fonts, setFonts] = useState([]);
    const [tshirtcolor, setTshirtColor] = useState('white');
    const [tshirtsize, setTshirtSize] = useState('S');
    const [isCheckoutPopupOpen, setIsCheckoutPopupOpen] = useState(false);
    const tshirtPrice = 100;
    const textPrice = 10;
    const imagePrice = 30;
    const [totalItem, setTotalItem] = useState(1);
    const totalPrice = (tshirtPrice+(textData.length*textPrice+imageData.length*imagePrice))*totalItem;
    const { product_id } = useParams();
    const session =  JSON.parse(sessionStorage.getItem('userData'));
    const navigate = useNavigate();

    const [productId, setProductId] = useState(null);
    const [openQr, setOpenQr] = useState(false)
    const [timeLeft, setTimeLeft] = useState(180);
    const timeout = 180 * 1000;
    const [paymentTimer, setPaymentTimer] = useState(null);

    useEffect(() => {
        // Fetch the list of fonts from the server using Axios
        
        if (product_id) {
            // Fetch data based on the product_id
            axios
                .get(`http://localhost:8080/products-with-details/${product_id}`)
                .then((response) => {
                    // Handle the response data here
                    if (response.status === 200) {
                        // Update your state or perform other actions with the data
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
    }, []);

    useEffect(() => {
        if (timeLeft === 0) {
          setOpenQr(false);
          clearInterval(paymentTimer); // Stop the timer when time is up
        }
    }, [timeLeft, paymentTimer]);

      
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

    const handleSaveDesign = () => {
        if (!session) {
          navigate('/signin');
        } else {
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
                    const productDetailData = {
                      Product_id: null,
                      Font_size: parseInt(item.fontSize),
                      Font_family: item.fontFamily,
                      Font_color: item.fontColor,
                      location_img: '',
                      img_width: '',
                      img: '',
                      location_text: `${item.x};${item.y}`,
                      text_value: item.value,
                    };
                    productDetails.push(productDetailData);
                  });
        
                  imageData.forEach((item) => {
                    const productDetailData = {
                      Product_id: null,
                      Font_size: 0,
                      Font_family: '',
                      Font_color: '',
                      location_img: `${item.x};${item.y}`,
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
            setOpenQr(true)
            setPaymentTimer(
                setInterval(() => {
                    setTimeLeft((prevTimeLeft) => prevTimeLeft - 1);
                }, 1000) // Update every 1 second
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
                    handleSaveDesign()
                    const orderData = {
                        Product_id: productId,
                        Payment_id: response.data.paymentId,
                        Color: tshirtcolor,
                        Size: tshirtsize,
                        Total_item: totalItem
                    }
                    axios
                    .post('http://localhost:8080/createorder', { orderData })
                    .then((response) => {
                        if(response.status==200) {
                            
                        } else {

                        }
                    })
                    .catch((error) => {
        
                    });

                } else {

                }
                
            })
            .catch((error) => {

            });
            //handleSaveDesign()
        }
    }

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
                    handleSaveDesign={handleSaveDesign}
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
                        imageData={imageData}
                        tshirtPrice={tshirtPrice}
                        textPrice={textPrice}
                        imagePrice={imagePrice}
                        designPrice={textData.length * textPrice + imageData.length * imagePrice}
                        setTotalItem={setTotalItem}
                        totalItem={totalItem}
                        totalPrice={totalPrice}
                        openQr={openQr}
                        timeLeft={timeLeft}
                        closePopup={closeCheckoutPopup}
                        handlePayment={handlePayment}
                    />
                </>
            )}
        </>
    )
}

export default Design;