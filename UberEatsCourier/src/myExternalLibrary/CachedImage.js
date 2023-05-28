import React, {useEffect, useState} from 'react';
import {Image, ImageBackground, View} from 'react-native';
import * as FileSystem from 'expo-file-system';
import * as Crypto from 'expo-crypto';
import {getAllRestaurants} from "./getFunctions";


const generateFilesystemKey = async (remoteURI) => {
    const hashed = await Crypto.digestStringAsync(
        Crypto.CryptoDigestAlgorithm.SHA256,
        remoteURI
    );
    return `${FileSystem.cacheDirectory}${hashed}`;
};

export const cacheImage = async (imageUrl) => {
    const filesystemURI = await generateFilesystemKey(imageUrl);
    const metadata = await FileSystem.getInfoAsync(filesystemURI);

    if (!metadata.exists) {
        return FileSystem.downloadAsync(imageUrl, filesystemURI);
    }
};

export const cacheImagesArray = async (imageArray) => {
    const cachePromises = imageArray.map(imageUrl => cacheImage(imageUrl));
    await Promise.all(cachePromises);
};

export const cacheAllImages = async () => {
    const restaurants = await getAllRestaurants();
    await Promise.all([...restaurants].map(({image}) => cacheImage(image)));
};



const CachedImage = ({source, isBackground, imagesToCache, children, ...otherProps}) => {
    const [imgURI, setImgURI] = useState('');

    useEffect(() => {
        const loadImage = async (remoteURI) => {
            try {
                const filesystemURI = await generateFilesystemKey(remoteURI);
                const metadata = await FileSystem.getInfoAsync(filesystemURI);

                if (metadata.exists) {
                    setImgURI(filesystemURI);
                } else {
                    const imageObject = await FileSystem.downloadAsync(remoteURI, filesystemURI);
                    setImgURI(imageObject.uri);
                }
            } catch (err) {
                console.log('Image loading error:', err);
                setImgURI(remoteURI);
            }
        };

        loadImage(source.uri);

        if (imagesToCache) {
            cacheImagesArray(imagesToCache);
        }
    }, [source.uri, imagesToCache]);

    const ImageComponent = isBackground ? ImageBackground : Image;

    return (
        <View>
            <ImageComponent
                {...otherProps}
                source={imgURI ? {uri: imgURI} : null}
            >
                {children}
            </ImageComponent>
        </View>
    );
};


export default CachedImage;
