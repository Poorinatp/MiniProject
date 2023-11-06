import { useEffect, useState } from "react";
import "./SlideShow.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCaretLeft, faCaretRight } from "@fortawesome/free-solid-svg-icons";

const SlideShow = () => {
    const [slideNumber, setSlideNumber] = useState(0); // Initialize with 0 for the first slide
    const examplePicture = [
        "example1.png",
        "example2.png",
        "example3.png",
    ];

    useEffect(() => {
        const nextSlide = (slideNumber + 1) % examplePicture.length;
        const interval = setInterval(() => {
            setSlideNumber(nextSlide);
        }, 3000);

        return () => {
            clearInterval(interval);
        };
    }, [slideNumber]);

    return (
        <div className="slide-show-container">
            {examplePicture.map((picture, index) => (
                slideNumber === index && (
                    <div key={`slide-show-${index}`} className="slide-show-page">
                        <div key="btn-left" className="btn">
                            <FontAwesomeIcon
                                className="btn-icon"
                                icon={faCaretLeft}
                                style={{
                                    color:index===0?"transparent":"white"
                                }}
                                onClick={e=>setSlideNumber(index-1)}
                            />
                        </div>
                        <img
                            key={`slide-img-${index}`}
                            className="slide-img"
                            src={`../image/${picture}`}
                            alt="slide-img"
                        />
                        <div key="btn-right" className="btn">
                            <FontAwesomeIcon
                                className="btn-icon"
                                icon={faCaretRight}
                                style={{
                                    color:index<=examplePicture.length-1?"transparent":"white"
                                }}
                                onClick={e=>setSlideNumber(index+1)}
                            />
                        </div>
                    </div>
                )
            ))}
        </div>
    );
};

export default SlideShow;