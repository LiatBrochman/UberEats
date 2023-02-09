import React, { useState } from "react";

const UploadAndDisplayImage = () => {
    const [selectedImage, setSelectedImage] = useState(null);

    return (
        <div>
            <br/>
            <input
                type="file"
                name="myImage"
                onChange={(event) => {
                    console.log(event.target.files[0]);
                    setSelectedImage(event.target.files[0]);
                }}
            />
            {selectedImage && (
                <div>
                    <button onClick={()=>setSelectedImage(null)}>Remove</button>
                </div>
            )}
        </div>
    );
};

export default UploadAndDisplayImage;
