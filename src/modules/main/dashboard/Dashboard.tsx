import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import React, {useEffect} from 'react';
import useCartItems from '../../../hooks/useCartItems';
import useRefreshToken from '../../../hooks/useRefreshToken';
import CustomTabBar from './components/customTabBar/CustomTabBar';
import DashboardCart from './components/tabs/Cart';
import Home from './components/tabs/Home';
import List from './components/tabs/List';
import Profile from './components/tabs/Profile';

interface Dashboard {}

const Tab = createBottomTabNavigator();

const Dashboard: React.FC<Dashboard> = () => {
  const {getCartItems} = useCartItems();
  const {} = useRefreshToken();

  useEffect(() => {
    getCartItems().then(() => {});
  }, []);

  return (
    <>
      <Tab.Navigator
        screenOptions={{
          headerShown: false,
        }}
        initialRouteName="Home"
        tabBar={props => <CustomTabBar {...props} />}>
        <Tab.Screen name="Home" component={Home} />
        <Tab.Screen name="List" component={List} />
        <Tab.Screen name="All Carts" component={DashboardCart} />
        <Tab.Screen name="Profile" component={Profile} />
      </Tab.Navigator>
    </>
  );
};

export default Dashboard;
