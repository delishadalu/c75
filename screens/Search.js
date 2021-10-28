import React, { Component } from 'react';
import {
  Text,
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  FlatList,
} from 'react-native';
import db from '../config';

export default class Search extends Component {
  constructor() {
    super();
    this.state = { text: '', allTransactions: [], lastTransaction: null };
  }

  searchTransaction = async () => {
    var firstLetter = this.state.text.split('')[0];

    if (firstLetter === 'b') {
      var query = await db
        .collection('transactions')
        .where('bookId', '==', this.state.text)
        .limit(10)
        .get();

      query.docs.map((doc) => {
        this.setState({
          allTransactions: [...this.state.allTransactions, doc.data()],
          lastTransaction: doc,
        });
      });
    } else if (firstLetter === 's') {
      var query = await db
        .collection('transactions')
        .where('studentId', '==', this.state.text)
        .limit(10)
        .get();

      query.docs.map((doc) => {
        this.setState({
          allTransactions: [...this.state.allTransactions, doc.data()],
          lastTransaction: doc,
        });
      });
    }
  };

  fetchMore = async () => {
    var firstLetter = this.state.text.split('')[0];

    if (firstLetter === 'b') {
      var query = await db
        .collection('transactions')
        .where('bookId', '==', this.state.text)
        .startAfter(this.state.lastTransaction)
        .limit(5)
        .get();

      query.docs.map((doc) => {
        this.setState({
          allTransactions: [...this.state.allTransactions, doc.data()],
          lastTransaction: doc,
        });
      });
    } else if (firstLetter === 's') {
      var query = await db
        .collection('transactions')
        .where('studentId', '==', this.state.text)
        .startAfter(this.state.lastTransaction)
        .limit(5)
        .get();

      query.docs.map((doc) => {
        this.setState({
          allTransactions: [...this.state.allTransactions, doc.data()],
          lastTransaction: doc,
        });
      });
    }
    console.log(this.state.lastTransaction.id);
  };

  render() {
    console.log(this.state.allTransactions.length);
    return (
      <View style={{ flex: 1, backgroundColor: 'teal' }}>
        <View style={{ flexDirection: 'row' }}>
          <TextInput
            onChangeText={(data) => this.setState({ text: data.toLowerCase() })}
            placeholder="type studentid or booid"
            style={styles.textBox}
          />
          <TouchableOpacity
            style={styles.searchBox}
            onPress={this.searchTransaction}>
            <Text>SEARCH</Text>
          </TouchableOpacity>
        </View>

        <FlatList
          data={this.state.allTransactions}
          renderItem={({ item }) => {
            return (
              <View style={{ borderBottomWidth: 3 }}>
                <Text>bookId:{item.bookId}</Text>
                <Text>studentId:{item.studentId}</Text>
                <Text>transactiontype:{item.transactionType}</Text>
                <Text>date:{item.date.toDate().toString()}</Text>
              </View>
            );
          }}
          keyExtractor={(item, index) => index.toString()}
          onEndReached={this.fetchMore}
          onEndReachedThreshold={0.7}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  textBox: { borderWidth: 4, marginTop: 50, width: 300, height: 30 },
  searchBox: { width: 60, height: 30, backgroundColor: 'red', marginTop: 50 },
});
