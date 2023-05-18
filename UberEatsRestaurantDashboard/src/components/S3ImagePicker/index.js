import React, { useState, useEffect } from 'react';
import { Storage } from 'aws-amplify';
import { List, Popover, Button } from 'antd';
import {useAuthContext} from "../../contexts/AuthContext";

const S3ImagePicker = ({ onSelect }) => {
    const [images, setImages] = useState([]);
    const {dbOwner} = useAuthContext()

    useEffect(() => {
        fetchImages();
    }, []);

    const fetchImages = async () => {
        try {
            const {results} = await Storage.list(`${dbOwner.email}`);
         //   console.log("\n\n ~~~~~~~~~~~~~~~~~~~~~ results ~~~~~~~~~~~~~~~~~~~~~ :", JSON.stringify(results,null,4))
            setImages(results);
        } catch (error) {
            console.error('Error fetching images:', error);
        }
    };

    const handleSelect = (image) => {
        onSelect(image);
    };

    const content = (
        <List
            itemLayout="horizontal"
            dataSource={images}
            renderItem={(item) => (
                <List.Item onClick={() => handleSelect(item)}>
                    <List.Item.Meta
                        title={item.key.match(/\/([^/]+)$/)?.[1] ?? ""}
                    />
                </List.Item>
            )}
        />
    );

    return (
        <Popover content={content} title="Select an Image" trigger="click">
            <Button style={{backgroundColor:"#96CEB4", borderRadius:30}}>
                Choose from S3
            </Button>
        </Popover>
    );
};

export default S3ImagePicker;

