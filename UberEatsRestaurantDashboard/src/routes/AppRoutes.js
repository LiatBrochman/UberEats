import DetailedOrder from "../screens/DetailedOrder";
import Orders from "../screens/Orders";
import RestaurantMenu from "../screens/RestaurantMenu";
import CreateMenuItem from "../components/CreateMenuItem";
import OrderHistory from "../screens/OrderHisotry";
import EditMenuItem from "../components/EditMenuItem";
import Settings from "../screens/Settings";
import Login from "../screens/Login";
import {Route, Routes} from "react-router-dom";

const AppRoutes = () => {
    return (
        <Routes>
            <Route path="/" element={<Orders/>}/>
            <Route path="order/:id" element={<DetailedOrder/>}/>
            <Route path="menu" element={<RestaurantMenu/>}/>
            <Route path="menu/create" element={<CreateMenuItem/>}/>
            <Route path= "menu/edit" element={<EditMenuItem/>} />
            {/*<Route path= "menu/edit" render={(props) =><EditMenuItem props={props}/>}/>*/}
            {/*<Route path= "menu/edit/:id" element={<EditMenuItem />}/>*/}
            <Route path="order-history" element={<OrderHistory/>}/>
            <Route path="settings" element={<Settings/>}/>
            <Route path="login" element ={<Login/>}/>
        </Routes>
    );
};

export default AppRoutes;