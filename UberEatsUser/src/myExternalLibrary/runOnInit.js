import {CacheManager} from "expo-cached-image";
import {API, graphqlOperation} from 'aws-amplify';

export const FIRST_USERNAME_INDEX = 59

const getRestaurantImages = `
query GetRestaurantImages {
  listRestaurants(filter:{isActive:{ eq: true }}) {
    items {
      image
    }
  }
}
`

const getDishImages = `
query GetDishImages {
  listDishes(filter: { originalID: { eq: "null" }, isDeleted: { eq: false } }) {
    items {
      image
    }
  }
}
`

function getAllRestaurantsURLs() {
    return API.graphql(graphqlOperation(getRestaurantImages)).then(result => {
        const restaurantImageUrls = result.data.listRestaurants.items.map(item => item.image);
        console.log(restaurantImageUrls);
        return restaurantImageUrls
    }).catch(error => {
        console.error(error);
    });
}

function getAllDishesURLs() {
    return API.graphql(graphqlOperation(getDishImages)).then(result => {
        const dishImageUrls = result.data.listDishes.items.map(item => item.image);
        console.log(dishImageUrls);
        return dishImageUrls
    }).catch(error => {
        console.error(error);
    });
}

export function runOnInit(appName) {

    console.log("\n\n ~~~~~~~~~~~~~~~~~~~~~ caching all the images ~~~~~~~~~~~~~~~~~~~~~ ", appName)
    switch (appName) {

        case "user":

            // getAllRestaurantURLs().then(restaurants => restaurants.forEach(r => CacheManager.downloadAsync({
            getAllRestaurantsURLs().then(urls => urls.forEach(url => CacheManager.downloadAsync({
                uri: url,
                // key: url.substring(url.lastIndexOf('/') + 1)
                key: url.substring(FIRST_USERNAME_INDEX)

            })))
            getAllDishesURLs().then(urls => urls.forEach(url => CacheManager.downloadAsync({
                uri: url,
                // key: url.substring(url.lastIndexOf('/') + 1)
                key: url.substring(FIRST_USERNAME_INDEX)
            })))
            break;

        case "courier":
            getAllRestaurantsURLs().then(urls => urls.forEach(url => CacheManager.downloadAsync({
                uri: url,
                // key: url.substring(url.lastIndexOf('/') + 1)
                key: url.substring(FIRST_USERNAME_INDEX)
            })))
            break;


        default:
            console.error("couldn't run the init function")
    }

}