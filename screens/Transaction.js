import React, { Component } from 'react';
import {
  Text,
  TouchableOpacity,
  View,
  StyleSheet,
  ImageBackground,
  Image,
  TextInput,
  Alert,
  KeyboardAvoidingView,
  ToastAndroid,
} from 'react-native';
import * as Permissions from 'expo-permissions';
import { BarCodeScanner } from 'expo-barcode-scanner';
import db from '../config';
import firebase from 'firebase';

export default class Transaction extends Component {
  constructor() {
    super();
    this.state = {
      hasCameraPermission: false,
      buttonState: 'normal',
      studentId: '',
      bookId: '',
    };
  }
  getCameraPermission = async (id) => {
    const { status } = await Permissions.askAsync(Permissions.CAMERA);

    this.setState({
      hasCameraPermission: status === 'granted',
      buttonState: id,
    });
  };
  handleBarCodeScanned = async ({ type, data }) => {
    if (this.state.buttonState === 'studentId')
      this.setState({
        buttonState: 'normal',
        studentId: data,
      });
    if (this.state.buttonState === 'bookId')
      this.setState({
        buttonState: 'normal',
        bookId: data,
      });
  };

  handleTransaction = async () => {
    var bookEligibility = await this.checkBookEligibility(); //returns false ,issued , returned

    if (!bookEligibility) {
      alert('book doesnt exist in library database');
    } else if (bookEligibility == 'issued') {
      var studentEligibility = await this.studentEligibilityForBookIssue(); //return false, true

      if (studentEligibility) {
        this.bookIssued();
      }
    } else {
      var studentEligibilit = await this.studentEligibilityForBookReturn(); //return false, true

      if (studentEligibilit) {
        this.bookReturned();
      }
    }

    this.setState({
      studentId: '',
      bookId: '',
    });
  };

  bookIssued = async () => {
    alert('bookIssued');
    // ToastAndroid.show("bookIssued",ToastAndroid.SHORT )

    //change book status to false in db
    db.collection('books').doc(this.state.bookId).update({
      bookAvail: false,
    });

    //increase no.of bookissued for each student
    db.collection('students')
      .doc(this.state.studentId)
      .update({
        noOfBooksIssued: firebase.firestore.FieldValue.increment(1),
      });

    // add transaction details in db
    db.collection('transactions').add({
      studentId: this.state.studentId,
      bookId: this.state.bookId,
      date: firebase.firestore.Timestamp.now().toDate(),
      transactionType: 'issued',
    });
  };

  bookReturned = async () => {
    alert('bookReturned');
    //ToastAndroid.show("bookReturned",ToastAndroid.SHORT )

    //change book status to true in db
    db.collection('books').doc(this.state.bookId).update({
      bookAvail: true,
    });

    //decrease no.of bookissued for each student
    db.collection('students')
      .doc(this.state.studentId)
      .update({
        noOfBooksIssued: firebase.firestore.FieldValue.increment(-1),
      });

    // add transaction details in db
    db.collection('transactions').add({
      studentId: this.state.studentId,
      bookId: this.state.bookId,
      date: firebase.firestore.Timestamp.now().toDate(),
      transactionType: 'returned',
    });
  };

  checkBookEligibility = async () => {
    var returnData = '';
    var bookRef = await db
      .collection('books')
      .where('bookId', '==', this.state.bookId)
      .get();

    if (bookRef.docs.length == 0) {
      returnData = false;
    } else {
      bookRef.docs.map((memb) => {
        var book = memb.data();

        if (book.bookAvail) {
          returnData = 'issued';
        } else {
          returnData = 'returned';
        }
      });
    }
    return returnData;
  };

  studentEligibilityForBookIssue = async () => {
    var returnData = '';
    var studentRef = await db
      .collection('students')
      .where('studentId', '==', this.state.studentId)
      .get();

    if (studentRef.docs.length == 0) {
      returnData = false;
      alert('student doesnt exist in the school');
    } else {
      studentRef.docs.map((memb) => {
        var student = memb.data();

        if (student.noOfBooksIssued < 2) {
          returnData = true;
        } else {
          alert(' already assighned two books');
          returnData = false;
        }
      });
    }
    return returnData;
  };

  studentEligibilityForBookReturn = async () => {
    var returnData = '';

    var studentRef = await db
      .collection('transactions')
      .where('studentId', '==', this.state.studentId)
      .get();

    if (studentRef.docs.length == 0) {
      returnData = false;
      alert('student doesnt exist in the school');
    } else {

      studentRef.docs.map((memb)=>{
        var student= memb.data()

        if(student.bookId===this.state.bookId){
          returnData=true
        }

        else{
          returnData= false
          alert('book issued by another student')
        }
      })
    }
    return returnData
  };
  render() {
    if (this.state.buttonState !== 'normal') {
      return (
        <BarCodeScanner
          style={StyleSheet.absoluteFillObject}
          onBarCodeScanned={this.handleBarCodeScanned}
        />
      );
    }

    return (
      <KeyboardAvoidingView
        behavior="padding"
        style={{
          flex: 1,
          backgroundColor: 'teal',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <ImageBackground
          style={{
            flex: 1,
            width: '100%',
            justifyContent: 'center',
            alignItems: 'center',
          }}
          source={require('../assets2/background.png')}>
          <Image
            style={{ width: 200, height: 200 }}
            source={require('../assets2/booklogo.jpg')}
          />

          <View style={styles.inputView}>
            <TextInput
              placeholder="student id"
              placeholderTextColor="white"
              onChangeText={(data) => {
                this.setState({ studentId: data });
              }}
              value={this.state.studentId}
              style={styles.inputBox}
            />
            <TouchableOpacity
              onPress={() => this.getCameraPermission('studentId')}
              style={styles.scanBox}>
              <Text>scan</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.inputView}>
            <TextInput
              placeholder="book id"
              placeholderTextColor="white"
              onChangeText={(data) => {
                this.setState({ bookId: data });
              }}
              value={this.state.bookId}
              style={styles.inputBox}
            />
            <TouchableOpacity
              onPress={() => this.getCameraPermission('bookId')}
              style={styles.scanBox}>
              <Text>scan</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={styles.submit}
            onPress={this.handleTransaction}>
            <Text>submit</Text>
          </TouchableOpacity>
        </ImageBackground>
      </KeyboardAvoidingView>
    );
  }
}

const styles = StyleSheet.create({
  inputView: { flexDirection: 'row', marginTop: 20 },
  inputBox: { backgroundColor: 'teal', width: 200, height: 40 },
  scanBox: {
    backgroundColor: 'red',
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  submit: {
    backgroundColor: 'orange',
    marginTop: 50,
    width: 100,
    alignItems: 'center',
    borderRadius: 3,
    borderWidth: 2,
  },
});
