import React, {useEffect, useState} from 'react';
import {Image, ImageBackground, View} from 'react-native';
import * as FileSystem from 'expo-file-system';
import * as Crypto from 'expo-crypto';

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
            cacheImages(imagesToCache);
        }
    }, [source.uri, imagesToCache]);

    const generateFilesystemKey = async (remoteURI) => {
        const hashed = await Crypto.digestStringAsync(
            Crypto.CryptoDigestAlgorithm.SHA256,
            remoteURI
        );
        return `${FileSystem.cacheDirectory}${hashed}`;
    };

    const cacheImages = async (imageArray) => {
        const cachePromises = imageArray.map(async (imageUrl) => {
            const filesystemURI = await generateFilesystemKey(imageUrl);
            const metadata = await FileSystem.getInfoAsync(filesystemURI);

            if (!metadata.exists) {
                return FileSystem.downloadAsync(imageUrl, filesystemURI);
            }
        });

        await Promise.all(cachePromises);
    };

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
