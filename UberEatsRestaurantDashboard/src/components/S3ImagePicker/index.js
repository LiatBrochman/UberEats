import React, { useState, useEffect } from 'react';
import { Storage } from 'aws-amplify';
import { List, Popover, Button } from 'antd';

const S3ImagePicker = ({ onSelect }) => {
    const [images, setImages] = useState([]);

    useEffect(() => {
        fetchImages();
    }, []);

    const fetchImages = async () => {
        try {
            const {results} = await Storage.list('');
            setImages(results);
            console.log("\n\n ~~~~~~~~~~~~~~~~~~~~~ results ~~~~~~~~~~~~~~~~~~~~~ :", JSON.stringify(results,null,4))
            
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
                        title={item.key}
                    />
                </List.Item>
            )}
        />
    );

    return (
        <Popover content={content} title="Select an Image" trigger="click">
            <Button type="primary">
                Choose from S3
            </Button>
        </Popover>
    );
};

export default S3ImagePicker;

