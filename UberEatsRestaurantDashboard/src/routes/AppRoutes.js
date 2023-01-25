import DetailedOrder from "../screens/DetailedOrder";
import Orders from "../screens/Orders";
import RestaurantMenu from "../screens/RestaurantMenu";
import CreateMenuItem from "../components/CreateMenuItem";
import OrderHistory from "../screens/OrderHisotry";
import EditMenuItem from "../components/EditMenuItem";
import Login from "../screens/Login";
import NewRestaurant from "../screens/NewRestaurant";
import {Route, Routes} from "react-router-dom";
import EditRestaurant from "../screens/EditRestaurant";


const AppRoutes = () => {
    // const {restaurant} = useRestaurantContext()
    // !restaurant ? <Navigate to="create-new-restaurant" replace/> :


    return (
            <Routes>
                <Route path="/" element={<Orders/>}/>
                <Route path="create-new-restaurant" element={<NewRestaurant/>}/>
                <Route path="order/:id" element={<DetailedOrder/>}/>
                <Route path="menu" element={<RestaurantMenu/>}/>
                <Route path="menu/create" element={<CreateMenuItem/>}/>
                <Route path="menu/edit" element={<EditMenuItem/>}/>
                <Route path="order-history" element={<OrderHistory/>}/>
                <Route path="edit-restaurant" element={<EditRestaurant/>}/>
                {/*<Route path="settings" element={<Settings/>}/>*/}
                <Route path="login" element={<Login/>}/>
            </Routes>
    );
};

export default AppRoutes;
