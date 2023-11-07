import { faUpload } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

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
                <img className="payment-qr" src="../image/paymentQR.jpg" alt="payment-qr"/>
                
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
                        alt="uploaded-receipt" 
                    />
                    </div>
                )}
            </div>
        }
        {timeLeft===0&&
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

export default CheckoutPopup;