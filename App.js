import React, { Component } from 'react';
import { AppState, Text, View, Image ,TextInput,StyleSheet} from 'react-native';
import { createBottomTabNavigator } from 'react-navigation-tabs';
import { createAppContainer } from 'react-navigation';
import Transaction from './screens/Transaction';
import Search from './screens/Search';



export default class App extends Component {
  render() {
    return <AppContainer />;
  }
}

var TabNavigation = createBottomTabNavigator(
  {
    Transaction: Transaction,
    Search: Search,
  },
  {
    tabBarOptions: {
      activeTintColor: 'blue',
      inactiveTintColor: 'darkgray',
      style: { backgroundColor: 'gray' },
                    },

    defaultNavigationOptions: ({ navigation }) => {
      return({
        tabBarIcon: () => {
          if (navigation.state.routeName === 'Transaction') {
            return (
              <Image
                style={{ width: 50, height: 50 }}
                source={require('./assets2/book.png')}
              />
            );
          }
            else 
            {
              return (
              <Image
                style={{ width: 50, height: 50 }}
                source={require('./assets2/searchingbook.png')}
              />
            );
            }

          
        },
      })
    },
  }
);

const AppContainer = createAppContainer(TabNavigation);



