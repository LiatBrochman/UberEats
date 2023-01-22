import { Layout, Image } from "antd";
import SideMenu from '../src/components/SideMenu';
import AppRoutes from "./components/AppRoutes";
import {Amplify} from "aws-amplify";
import awsExports from "./aws-exports";
import { withAuthenticator } from '@aws-amplify/ui-react';

Amplify.configure(awsExports)
global.subscription = {
    restaurant: {},
    orders: {},
    restaurantDishes: {},
    orderDishes: {}
}

const { Sider, Content, Footer } = Layout;

function App() {
  return (
    <Layout>
      <Sider style={{ height: "100vh", backgroundColor: "white" }}>
        <Image
          src="https://logos-world.net/wp-content/uploads/2020/11/Uber-Eats-Symbol.jpg"
          preview={false}
        />
        <SideMenu />
      </Sider>
      <Layout>
        <Content>
          <AppRoutes />
        </Content>
        <Footer style={{ textAlign: "center" }}>
          Uber Eats Restaurant Dashboard ©2022
        </Footer>
      </Layout>
    </Layout>
  );
}

export default withAuthenticator(App);
