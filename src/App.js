import React, { Component } from 'react';
import * as firebase from 'firebase';
import queryString from 'query-string';

var config = {
  apiKey: "AIzaSyCuStMpf__lrMHc_IxKfTc_NPcbNKgOUbo",
  authDomain: "allen-archive.firebaseapp.com",
  databaseURL: "https://allen-archive.firebaseio.com",
  projectId: "allen-archive",
  storageBucket: "allen-archive.appspot.com",
  messagingSenderId: "993905900622"
};
const database = firebase.initializeApp(config).database();

class Title extends Component {
  render() {
    return (
      <div>
        <h1 style={{ color: "#84bd00" }}>{this.user.name}'s Archive</h1>
      </div>
    )
  }
}

class TopArtists extends Component {
  render() {
    return (
      <div>
        <h3>
          <ul>
            <li>{this.user.topArtists[0]}</li><li>{this.user.topArtists[1]}</li><li>{this.user.topArtists[2]}</li>
          </ul>
        </h3>
      </div>
    )
  }
}

class Filter extends Component {
  render() {
    return (
      <div>
        <img />
        <input type="text" onKeyUp={event =>
          this.props.onTextChange(event.target.value)}
          style={{
            color: 'black',
            'font-size': '20px',
            padding: '10px'
          }} />
      </div>
    );
  }
}

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: null,
      filterString: '',
      lastFilterString: '',
      matches: null
    }
  }

  componentDidUpdate() {

    if ( this.state.filterString.valueOf() !== this.state.lastFilterString.valueOf() ) {
      console.log(this.state.filterString)
      console.log('true')
      let usersRef = database.ref('users/' + this.state.filterString);
      usersRef.on('value', snapshot => this.setState({
        matches: {
          userID: snapshot.child('userID').val(),
          longTermArtists: snapshot.child('longTermArtists').val(),
          shortTermArtists: snapshot.child('shortTermArtists').val(),
          longTermTracks: snapshot.child('longTermTracks').val(),
          shortTermTracks: snapshot.child('shortTermTracks').val(),
          country: snapshot.child('country').val(),
        },
        lastFilterString: this.state.filterString
      }))
      console.log(this.state.matches)
    }
  }

  componentDidMount() {
    let parsed = queryString.parse(window.location.search);
    let accessToken = parsed.access_token;
    console.log(accessToken)
    if (!accessToken) {
      alert('error!')
      return;
    }

    fetch('http://localhost:8888/getuserdata', {
      //'mode':'no-cors',
      headers: { 'Authorization': 'Bearer ' + accessToken },
      method: 'GET'
    })
      .then(response => response.json())
      .then(data => this.setState({
        user: {
          userID: data.userID,
          longTermArtists: data.longTermArtists,
          shortTermArtists: data.shortTermArtists,
          longTermTracks: data.longTermTracks,
          shortTermTracks: data.shortTermTracks,
          country: data.country
        }
      })).then(data => {
      database.ref('users/' + this.state.user.userID).set({
        userID: this.state.user.userID,
        longTermArtists: this.state.user.longTermArtists,
        shortTermArtists: this.state.user.shortTermArtists,
        longTermTracks: this.state.user.longTermTracks,
        shortTermTracks: this.state.user.shortTermTracks,
        country: this.state.user.country
      })})
      console.log('saved')
  }

  render() {
    return (
      <div className="App">
        {this.state.user ?
          <div>
            <h1 style={{ color: "#84bd00", fontSize: '32px' }}>{this.state.user.userID}</h1>
            <h3 style={{ color: "#84bd00" }}>Top Artists:
              <ul>
                <li>{this.state.user.shortTermArtists.items[0].name}</li>
                <li>{this.state.user.shortTermArtists.items[1].name}</li>
                <li>{this.state.user.shortTermArtists.items[2].name}</li>
              </ul>
            </h3>
            <h1 style={{ color: "#84bd00", fontSize: '28px' }}>Search:</h1>
            <Filter onTextChange={text => {
              this.setState({ 
                lastFilterString: this.state.filterString,
                filterString: text })
            }} />

          </div>
          : <button onClick={() => {
            window.location = window.location.href.includes('localhost')
              ? 'http://localhost:8888/login'
              : 'https://archive-backend.firebaseapp.com/login'
          }
          }
            style={{ padding: '20px', 'font-size': '50px', 'margin-top': '20px' }}>Sign in with Spotify</button>
        }
        {this.state.matches && this.state.matches.userID
          ? <div>
              <h3 style={{ color: "#84bd00" }}>Maches:</h3>
              <ul>
                <li>{this.state.matches.userID}:</li>
                <ul>
                  <li>{this.state.matches.shortTermArtists.items[0].name}</li>
                  <li>{this.state.matches.shortTermArtists.items[1].name}</li>
                  <li>{this.state.matches.shortTermArtists.items[2].name}</li>
                </ul>
              </ul>
              <button onClick={() => {
                //
          }}
            style={{ padding: '20px', 'font-size': '20px' }}>Create Playlist</button>
          </div>
          : <div>
              <h3 style={{ color: "#84bd00" }}>Search for users</h3>
              <h3>{this.state.filterString}</h3>
          </div>
        }
      </div>
    );
  }
}
export default App;