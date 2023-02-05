import {Button, Drawer, Menu, ConfigProvider} from 'antd';
import {useNavigate} from 'react-router-dom';
import {useState} from "react";
import {
    BookOutlined,
    HistoryOutlined,
    MenuFoldOutlined,
    MenuOutlined,
    MenuUnfoldOutlined,
    ShoppingCartOutlined, UserOutlined
} from '@ant-design/icons'
import "./index.css"

const AppMenu = () => {
    const navigate = useNavigate()
    const [collapsed, setCollapsed] = useState(false)
    const toggleCollapsed = () => {
        setCollapsed(!collapsed)
    }
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
        {/*<Button*/}
        {/*    type="primary"*/}
        {/*    onClick={toggleCollapsed}*/}
        {/*    style={{*/}
        {/*        marginBottom: 16,*/}
        {/*    }}*/}
        {/*    className="button"*/}
        {/*>*/}
        {/*    {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}*/}
        {/*</Button>*/}

        <Menu
            defaultSelectedKeys={['1']}
            defaultOpenKeys={['sub1']}
            mode="horizontal"
            theme="light"
            // inlineCollapsed={collapsed}
            items={items}
            onClick={(menuItem) => navigate(menuItem.key)}

        />
    </div>)
}
// const [openMenu, setOpenMenu] = useState(false)
// return (
//     <div>
//         <div className="menuIcon" >
//             <MenuOutlined style={{fontSize: 30}} onClick={() => {
//                 setOpenMenu(true)
//             }}
//
//             />
//         </div>
//         <span className="headerMenu">
//         <AppMenu mode="horizontal"/>
//             </span>
//         <Drawer
//             placement="left"
//             open={openMenu}
//             onClose={() => {
//                 setOpenMenu(false)
//             }}
//             closable={false}>
//
//             <AppMenu/>
//
//         </Drawer>
//     </div>
// )

// function AppMenu() {
//     const navigate = useNavigate();
//     const menuItems = [
//         {
//             key: "/",
//             label: 'Orders'
//         },
//         {
//             key: "menu",
//             label: 'Menu'
//         },
//         {
//             key: "order-history",
//             label: 'Order History'
//         },
//         {
//             key: "edit-restaurant",
//             label: 'Edit Restaurant'
//         }
//     ];
//
//     return (
//         <Menu class="my-menu" items={menuItems} onClick={(menuItem) => navigate(menuItem.key)}/>
//     )
// }

export default AppMenu;
