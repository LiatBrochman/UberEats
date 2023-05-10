import React, {useEffect, useState} from 'react';
import {Image, ImageBackground, View} from 'react-native';
import * as FileSystem from 'expo-file-system';
import * as Crypto from 'expo-crypto';


const generateFilesystemKey = async (remoteURI) => {
    if(typeof remoteURI !== 'string') {
        console.error("!!!!!!!!!!!!!!!!!!")
        console.log("\n\n ~~~~~~~~~~~~~~~~~~~~~ remoteURI ~~~~~~~~~~~~~~~~~~~~~ :", JSON.stringify(remoteURI,null,4))

        return null;
    }

    const hashed = await Crypto.digestStringAsync(
        Crypto.CryptoDigestAlgorithm.SHA256,
        remoteURI
    );
    return `${FileSystem.cacheDirectory}${hashed}`;
};

// This function is responsible for caching a single image.
export const cacheImage = async (imageUrl) => {
    console.log("\n\n ~~~~~~~~~~~~~~~~~~~~~ imageUrl ~~~~~~~~~~~~~~~~~~~~~ :", JSON.stringify(imageUrl,null,4))

    const filesystemURI = await generateFilesystemKey(imageUrl);
    if(filesystemURI===null) return null;

    const metadata = await FileSystem.getInfoAsync(filesystemURI);

    if (!metadata.exists) {
        return FileSystem.downloadAsync(imageUrl, filesystemURI);
    }
};

// This function uses cacheImage to cache an array of images.
export const cacheImagesArray = async (imageArray) => {
    const cachePromises = imageArray.map(imageUrl => cacheImage(imageUrl));
    await Promise.all(cachePromises);
};

const CachedImage = ({source, isBackground, imagesToCache, children, ...otherProps}) => {
    if(!source || Object.keys(source).length===0) {
        console.error("\n\n ~~~~~~~~~~~~~~~~~~~~~ source ~~~~~~~~~~~~~~~~~~~~~ :", JSON.stringify(source, null, 4))
        return;
    }


    const [imgURI, setImgURI] = useState('');

    useEffect(() => {
        const loadImage = async (remoteURI) => {
            try {

                console.log("\n\n ~~~~~~~~~~~~~~~~~~~~~before remoteURI ~~~~~~~~~~~~~~~~~~~~~ :", JSON.stringify(remoteURI,null,4))
                if(!remoteURI) return null;

                const filesystemURI = await generateFilesystemKey(remoteURI);
                if(filesystemURI===null) return null;

                const metadata = await FileSystem.getInfoAsync(filesystemURI);

                if (metadata.exists) {
                    setImgURI(filesystemURI);
                    console.log("\n\n ~~~~~~~~~~~~~~~~~~~~~ setImgURI ~~~~~~~~~~~~~~~~~~~~~ ")
                    console.log("\n\n ~~~~~~~~~~~~~~~~~~~~~ filesystemURI ~~~~~~~~~~~~~~~~~~~~~ :", JSON.stringify(filesystemURI,null,4))

                } else {
                    const imageObject = await FileSystem.downloadAsync(remoteURI, filesystemURI);
                    setImgURI(imageObject.uri);
                    console.log("\n\n ~~~~~~~~~~~~~~~~~~~~~ setImgURI ~~~~~~~~~~~~~~~~~~~~~ ")
                    console.log("\n\n ~~~~~~~~~~~~~~~~~~~~~ imageObject ~~~~~~~~~~~~~~~~~~~~~ :", JSON.stringify(imageObject,null,4))

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
