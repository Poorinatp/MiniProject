import axios from "axios";
import { useState } from "react";

const TestUpload = ({apihost}) => {
    const [inputFile, setInputFile] = useState(null);

    const handleChange = (e) => {
        setInputFile(e.target.files[0])
    }

    const handleClick = () => {
        const formData = new FormData();
        formData.append('image', inputFile);

        axios
        .post(`${apihost}/saveimage`, formData)
        .then((response) => {})
    }
    
    return (
        <>
        <input type="file" onChange={e=>handleChange(e)}/>
        <button onClick={handleClick}>Upload</button>
        </>
    )
}

export default TestUpload;