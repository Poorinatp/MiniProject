import { useEffect, useState } from "react";
import DesignLab from "../components/DesignLab"
import NavBar from "../components/NavBar";
import CheckoutPopup from "../components/CheckoutPopup";
import OptionTab from "../components/OptionTab";
import "./Design.css"
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import html2canvas from 'html2canvas';
import Swal from 'sweetalert2';

const Design = ({apihost}) => {
    const [textData, setTextData] = useState([
        {id: 1, type: "text", value: "Type text here", fontFamily: "Basic-Regular", width:"160px", fontSize: "24px", fontColor: "black", x: "30px", y: "25px"},
    ]);      
    const [imageData, setImageData] = useState([
        {id: 1, type: "image", width:"200px", x: "60px", y: "0px", imagename:"แมวบนโซฟาสีเขียว.png"}
    ]);

    const [isSelected, setIsSelected] = useState(Array(textData.length).fill(false));
    const [isImageSelected, setIsImageSelected] = useState(false);

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


    const { product_id } = useParams();

    useEffect(() => {
        if (product_id) {
            axios
                .get(`${apihost}/products-with-details/${product_id}`)
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
            if(sessionStorage.getItem('textData')&&sessionStorage.getItem('imageData')){
                const sessionTextData=JSON.parse(sessionStorage.getItem('textData'))
                const sessionImageData=JSON.parse(sessionStorage.getItem('imageData'))
                setTextData(sessionTextData)
                setImageData(sessionImageData)
            }else{

            }
        }
        axios
            .get(`${apihost}/fonts`)
            .then((response) => {
                setFonts(response.data);
                response.data.forEach((fontName) => {
                    const fontFace = new FontFace(fontName, `url(/fonts/${fontName}.ttf)`);
                    document.fonts.add(fontFace);
                });
            })
            .catch((error) => {});
        axios
            .get(`${apihost}/picture`)
            .then((response) => {
                setImgname(response.data)
                setFilteredImages(response.data)
            })
            .catch((error) => {});
    }, [apihost, product_id]);

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

    const saveDesign = async () => {
        if (!session) {
            Swal.fire('Prior to save a design, you are required to log in.', '', 'warning');
            sessionStorage.setItem('textData', JSON.stringify(textData));
            sessionStorage.setItem('imageData', JSON.stringify(imageData));
            navigate('/signin');
            return false
        } else {
            const inputElements = document.querySelectorAll('input');
            
            inputElements.forEach(inputElement => {
                const paragraphElement = document.createElement('p');

                paragraphElement.textContent = inputElement.value;
                paragraphElement.className = inputElement.className;
                paragraphElement.style = inputElement.style;
                paragraphElement.style.cssText = inputElement.style.cssText;
                inputElement.parentNode.replaceChild(paragraphElement, inputElement);
            });

            const container = document.getElementById('container');
            const canvas = await html2canvas(container);
            const blob = await new Promise((resolve, reject) => {
                canvas.toBlob(resolve, 'image/png');
            });
            const formData = new FormData();
            const fileName = `${session.user_id}_${Date.now()}.png`;
            formData.append('image', blob, fileName);

            try {
                const response = await axios.post(`${apihost}/saveimage`, formData);
                const imageDescriptions = imageData.map(image => image.imagename.replace(/\.png$/, '')).join(' ');
                const productData = {
                    User_id: session.user_id,
                    Description: imageDescriptions,
                    product_image: response.data,
                    status: "enable"
                };

                const productDetails = [];
                textData.forEach(item => {
                    const textContainer = document.getElementById(`textcontainer${item.id}`);
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

                imageData.forEach(item => {
                    const imgbox = document.getElementById(`imgbox${item.id}`);
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

                const productResponse = await axios.post(`${apihost}/saveproduct`, { productData, productDetails });

                if (productResponse.status === 200) {
                    setProductId(productResponse.data.insertId);
                    Swal.fire('Design saved', '', 'success');
                    return true
                }
                return false
            }
            catch (error) {
                Swal.fire('error'+error, '', 'error');
                return false
            }
        }
    };

    const handleSaveClick = async () => {
        const results = await Swal.fire({
            title: 'Do you want to save ?',
            showDenyButton: true,
            showCancelButton: true,
            confirmButtonText: 'Save',
            denyButtonText: `Don't save`,
        });
        if (results.isConfirmed) {
            const result = await saveDesign();
            if (result===true) {
                navigate("/profile");
            }
        }else if (results.isDenied) {
            Swal.fire('Design not saved', '', 'warning');
        }
    }

    const handlePayment = async () => {
        if (!session) {
            Swal.fire('You must log in before proceeding with the payment.', '', 'warning');
            sessionStorage.setItem('textData', JSON.stringify(textData));
            sessionStorage.setItem('imageData', JSON.stringify(imageData));
            navigate('/signin');
        } else {
            const result = await saveDesign();
            if(result){}
            setOpenQr(true);
            setTimeLeft(180);
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
            try {
                const response = await axios.post(`${apihost}/createpayment`, { paymentData });
    
                if (response.status === 200) {
                    setPaymentId(response.data.insertId);
                } else {
                    setPaymentId(null);
                }
            } catch (error) {
                
            }
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

    const handleUpload = async () => {
        if (paymentId) {
            const formData = new FormData();
            const fileInput = uploadedReceiptFile;
            const fileName = `${session.user_id}_receipt_${Date.now()}.png`;
            formData.append('image', fileInput, fileName);
    
            try {
                const response = await axios.post(`${apihost}/savereceipt`, formData);
                if (response.status === 200) {
                    const orderData = {
                        Product_id: productId,
                        Payment_id: paymentId,
                        Color: tshirtcolor,
                        Size: tshirtsize,
                        Total_item: totalItem
                    };
                    const orderResponse = await axios.post(`${apihost}/createorder`, { orderData });
        
                    if (orderResponse.status === 200) {
                        Swal.fire('Receipt uploaded', '', 'success');
                        navigate("/profile");
                    }
                }
            } catch (error) {
                Swal.fire('Receipt not uploaded', '', 'error');
            }
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
                    imageData={imageData}
                    isSelected={isSelected}
                    isImageSelected={isImageSelected}
                    fonts={fonts}
                    tshirtcolor={tshirtcolor}
                    tshirtsize={tshirtsize}
                    filteredImages={filteredImages}
                    setTextData={setTextData}
                    setImageData={setImageData}
                    setIsSelected={setIsSelected}
                    setTshirtColor={setTshirtColor}
                    setTshirtSize={setTshirtSize}
                    handleFontChange={handleFontChange}
                    handleSizeChange={handleSizeChange}
                    handleColorChange={handleColorChange}
                    handleSearch={handleSearch}
                />
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
                    handleSaveClick={handleSaveClick}
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
                        totalItem={totalItem}
                        totalPrice={totalPrice}
                        uploadedReceipt={uploadedReceipt}
                        openQr={openQr}
                        openUploadBtn={openUploadBtn}
                        timeLeft={timeLeft}
                        setTotalItem={setTotalItem}
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