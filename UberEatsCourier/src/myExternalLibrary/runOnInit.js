import {getAllDishes, getAllRestaurants} from "./getFunctions";
import {CacheManager} from "expo-cached-image";


export function runOnInit(appName) {
    console.log("\n\n ~~~~~~~~~~~~~~~~~~~~~ caching all the images ~~~~~~~~~~~~~~~~~~~~~ ",appName)
    switch (appName){

        case "user":
            getAllRestaurants().then(restaurants => restaurants.forEach(r => CacheManager.downloadAsync({
                uri: `${r.image}`,
                key: `${r.id}`
            })))
            getAllDishes().then(dishes => dishes.forEach(d=>CacheManager.downloadAsync({
                uri: `${d.image}`,
                key: `${d.id}`
            })))
            break;

        case "courier":
            getAllRestaurants().then(restaurants => restaurants.forEach(r => CacheManager.downloadAsync({
                uri: `${r.image}`,
                key: `${r.id}`
            })))
            break;


        default: console.error("couldn't run the init function")
    }

}