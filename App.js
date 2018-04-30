import React from 'react';
import { StyleSheet, Text, View, StatusBar, ListView } from 'react-native';

import * as firebase from 'firebase';

// Initialize Firebase
const config = {
  apiKey: "AIzaSyBuDdjtT75A-RBSxBvQodkcdO6b6H9NwK0",
  authDomain: "swipeable-reactnative-firebase.firebaseapp.com",
  databaseURL: "https://swipeable-reactnative-firebase.firebaseio.com",
  projectId: "swipeable-reactnative-firebase",
  storageBucket: "",
  messagingSenderId: "759526944488"
};
firebase.initializeApp(config);

var data = []

import { Container, Content, Header, Form, Item, Button, Label, Input, Icon, List, ListItem } from 'native-base';

export default class App extends React.Component {

  constructor(props) {
    super(props);

    this.ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});

    this.state = {
      basic: true,
      listViewData: data,
      newContact: ""
    }
  }

  componentDidMount(){

    var that = this

    firebase.database().ref('/contacts').on('child_added', function(data) {

      var newData = [...that.state.listViewData]
      newData.push(data)
      that.setState({listViewData : newData})

    })
  }

  addRow(data){
    var key = firebase.database().ref('/contacts').push().key
    firebase.database().ref('/contacts').child(key).set({ name:data })
  }

  async deleteRow(secId, rowId, rowMap, data) {
    await firebase.database().ref('contacts/'+data.key).set(null)

    rowMap[`${secId}${rowId}`].props.closeRow();
    var newData = [...this.state.listViewData];
    newData.splice(rowId, 1)
    this.setState({ listViewData:newData });
  }

  showInformation(){

  }

  render() {
    const ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
    return (
      <Container style={styles.container}>
        <Header style={{ marginTop:StatusBar.currentHeight, backgroundColor: '#eeeeee' }}>
          <Content>
            <Item>
              <Input
              onChangeText = {(newContact) =>this.setState({ newContact })} 
                placeholder="Add name"
              />
              <Button style={{ marginTop: 5 }}
                onPress={() =>alert('Add')}
              >
                <Icon name="add" />
              </Button>
            </Item>
          </Content>
        </Header>

        <Content>
          <List
          enableEmptySections
            dataSource={this.ds.cloneWithRows(this.state.listViewData)}
            renderRow={data=>
              <ListItem>
                <Text> {data.val().name} </Text>
              </ListItem>
            }
            renderLeftHiddenRow={data => 
              <Button full onPress={() => this.addRow(data)}>
                <Icon name="information-circle"/>
              </Button>
            }

            renderRightHiddenRow={(data, secId, rowId, rowMap) => 
              <Button danger onPress={() =>this.deleteRow(secId, rowId, rowMap, data)}>
                <Icon name="trash"/>
              </Button>
            }

            leftOpenValue={75}
            rightOpenValue={-75}
          />
        </Content>
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff'
  },
});
