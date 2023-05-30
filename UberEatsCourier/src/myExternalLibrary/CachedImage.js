// import React, {useEffect, useState} from 'react';
// import {Image, ImageBackground, View} from 'react-native';
// import * as FileSystem from 'expo-file-system';
// import * as Crypto from 'expo-crypto';
// import {getAllRestaurants} from "./getFunctions";
//
//
// const generateFilesystemKey = async (remoteURI) => {
//     console.log(`Generating key for: ${remoteURI}`);
//     const imageName = remoteURI.substring(remoteURI.lastIndexOf('/') + 1);
//     const hashedImageName = await Crypto.digestStringAsync(
//         Crypto.CryptoDigestAlgorithm.SHA256,
//         imageName
//     )
//     return `${FileSystem.cacheDirectory}${hashedImageName}`;
// }
//
// const encodeURIComponents = (uri) => {
//     const encoded = uri.split('/').map(part => encodeURI(part)).join('/')
//     console.log("\n\n ~~~~~~~~~~~~~~~~~~~~~ encoded ~~~~~~~~~~~~~~~~~~~~~ :", JSON.stringify(encoded,null,4))
//     return encoded
// }
//
// export const cacheImage = async (imageUrl) => {
//     try {
//         if (typeof imageUrl !== 'string' || imageUrl.trim() === '') {
//             console.error(`Invalid imageUrl: ${imageUrl}`)
//             return
//         }
//         imageUrl = encodeURIComponents(imageUrl)
//         const filesystemURI = await generateFilesystemKey(imageUrl)
//         const metadata = await FileSystem.getInfoAsync(filesystemURI)
//
//         if (!metadata.exists) {
//             return FileSystem.downloadAsync(imageUrl, filesystemURI)
//         }
//     } catch (error) {
//         console.error(`Failed to cache image: ${imageUrl}`, error)
//     }
// }
//
// export const cacheImagesArray = async (imageArray) => {
//     const cachePromises = imageArray.map(imageUrl => cacheImage(imageUrl))
//     await Promise.all(cachePromises)
// }
//
// export const cacheAllImages = async () => {
//     const restaurants = await getAllRestaurants()
//     restaurants.forEach(({image}) => cacheImage(image))
// }
//
// const CachedImage = ({source, isBackground, imagesToCache, children, ...otherProps}) => {
//     const [imgURI, setImgURI] = useState('')
//
//     useEffect(() => {
//         const loadImage = async (remoteURI) => {
//             try {
//                 if (typeof remoteURI !== 'string' || remoteURI.trim() === '') {
//                     console.error(`Invalid imageUrl: ${remoteURI}`)
//                     return
//                 }
//
//                 remoteURI = encodeURIComponents(remoteURI)
//                 const filesystemURI = await generateFilesystemKey(remoteURI)
//                 const metadata = await FileSystem.getInfoAsync(filesystemURI)
//
//                 if (metadata.exists) {
//                     setImgURI(filesystemURI)
//                 } else {
//                     const imageObject = await FileSystem.downloadAsync(remoteURI, filesystemURI)
//                     setImgURI(imageObject.uri)
//                 }
//             } catch (err) {
//                 console.log('Image loading error:', err)
//                 setImgURI(remoteURI)
//                 console.log("\n\n the final image :", JSON.stringify(remoteURI,null,4))
//             }
//         }
//         loadImage(source.uri)
//
//         if (imagesToCache) {
//             cacheImagesArray(imagesToCache)
//         }
//     }, [source.uri, imagesToCache])
//
//     const ImageComponent = isBackground ? ImageBackground : Image
// useEffect(()=>{console.log("\n\n the final image :", JSON.stringify(imgURI,null,4))},[imgURI])
//     return (
//         <View>
//             <ImageComponent
//                 {...otherProps}
//                 source={imgURI ? {uri: imgURI} : null}
//             >
//                 {children}
//             </ImageComponent>
//         </View>
//     )
// }
//
//
// export default CachedImage
import React, {useEffect, useState} from 'react';
import {Image, ImageBackground, View} from 'react-native';
import * as FileSystem from 'expo-file-system';
import * as Crypto from 'expo-crypto';
import {getAllDishes, getAllRestaurants} from "./getFunctions";


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

export const cacheAllImages = async () => {
    const [restaurants, dishes] = await Promise.all([getAllRestaurants(), getAllDishes()]);

    await Promise.all([...restaurants, ...dishes].map(({image}) => cacheImage(image)));
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
