import {Button, Col, Menu} from 'antd';
import {useNavigate} from 'react-router-dom';
import {
    BookOutlined,
    HistoryOutlined,
    ShoppingCartOutlined,
    UserOutlined
} from '@ant-design/icons'
import "./index.css"


const AppMenu = () => {

    const navigate = useNavigate()
    const items = [
        {
            key: "/",
            label: 'Orders',
               icon:  <ShoppingCartOutlined />
        },
        {
            key: "menu",
            label: 'Menu',
            icon: <BookOutlined />
        },
        {
            key: "order-history",
            label: 'Order History',
            icon: <HistoryOutlined />
        },
        {
            key: "edit-restaurant",
            label: 'Edit Restaurant',
            icon: <UserOutlined />
        }
    ]

    return  (<div
   className="div"
    >
        <Col xs={24} md={0}>

        <Menu
            defaultSelectedKeys={['1']}
            defaultOpenKeys={['sub1']}
            mode={"horizontal"}
            theme="light"
            items={items}
            style={{width: "100%", display: "table", textAlign: "center", backgroundColor:"#F0F0F0"}}
            onClick={(menuItem) => navigate(menuItem.key)}

        />
        </Col>
        <Col xs={0} md={24}>
                <Menu
                    defaultSelectedKeys={['1']}
                    defaultOpenKeys={['sub1']}
                    mode={"horizontal"}
                    theme="light"
                    items={items}
                    style={{width: "100%", display: "table", textAlign: "center", backgroundColor:"#F0F0F0"}}
                    onClick={(menuItem) => navigate(menuItem.key)}

                />

        </Col>
    </div>)
}


export default AppMenu;
