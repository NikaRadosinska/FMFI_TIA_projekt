import logo from './logo.svg';
import './App.css';
import { useQuery, gql, useLazyQuery, useMutation } from '@apollo/client';
import React, { useEffect, useState } from 'react'
import SongCard from './SongCard';
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Button from 'react-bootstrap/Button';

const initialState = {
  isLoading: true,
  usernames: []
}

const GET_BOOK_ONE = gql`
    query bookDetails {
      bookById(id: "book-1") {
        id
        name
        pageCount
        author {
          id
          firstName
          lastName
        }
      }
    }
`;

const GET_ALL_USERNAMES = gql`
query allUsernames {
  getAllUserNames
}
`;
const GET_USER_IF_CORRECT_PASSWORD = gql`
query getUserIfCorrectPassword($userName: String!, $password: String!) {
  userIfCorrectPassword(userName: $userName, password: $password){
    id
    userName
    password
    isAdmin
  }
}
`;

const ADD_USER = gql`
mutation getAddUser($userName: String!, $password: String!) {
  addUser(userName: $userName, password: $password){
    id
    userName
    password
    isAdmin
  }
}
`;

const GET_FRIENDS = gql`
query getFriends($id: Int!) {
  getFriends(id: $id)
}
`;

const ADD_FRIEND = gql`
mutation addFriend($id: Int!, $username: String!) {
  addFriend(id: $id, username: $username)
}
`;

const REMOVE_FRIEND = gql`
mutation removeFriend($id: Int!, $username: String!) {
  removeFriend(id: $id, username: $username)
}
`;



function DisplayBook() {
  const { loading, error, data } = useQuery(GET_BOOK_ONE);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error : {error.message}</p>;
  console.log(data.bookById);
  return (
    <div key={data.bookById.id}>
      <h3>{data.bookById.name}</h3>
      <br />
      <b>About this book:</b>
      <p>page count:{data.bookById.pageCount}, author: {data.bookById.author.firstName} {data.bookById.author.lastName}</p>
      <br />
    </div>
  );
}


function InitialData() {
  //ENUMS
  const errors = {
    wrongUsername: "invalid username",
    wrongPassword: "invalid password",
    waitForResponseAboutPassword: "wait",
    usedUsername: "username is already used",
    differentControlPassword: "second password is not the same",
    waitForResponseAboutAddUser: "wait",
    noSuchUser: "no existing user with such username",
    yourUsername: "you can not add yourself as a friend",
    notYourFriend: "user is not in your fiend list"
  };

  //STATES
  const [isLoginForm, setIsLoginForm] = useState(true);
  const [reloadFriends, setReloadFriends] = useState(false);
  const [toReloadFriends, setToReloadFriends] = useState(false);
  const [errorMessages, setErrorMessages] = useState({});
  const { loading, error, data } = useQuery(GET_ALL_USERNAMES);
  const [getUserByPassword, { loading: loadingUser, error: errorUser, data: dataUser }] = useLazyQuery(GET_USER_IF_CORRECT_PASSWORD);
  const [getAddUserData, { loading: loadingAddUser, error: errorAddUser, data: dataAddUser }] = useMutation(ADD_USER);
  const [getFriends, { loading: loadingFriends, error: errorFriends, data: dataFriends, refetch: refetchFriends }] = useLazyQuery(GET_FRIENDS);
  const [getAddFriend, {loading: loadingAddFriend, error: errorAddFriend, data: dataAddFriend}] = useMutation(ADD_FRIEND);
  const [getRemoveFriend, {loading: loadingRemoveFriend, error: errorRemoveFriend, data: dataRemoveFriend}] = useMutation(REMOVE_FRIEND);
  const isEnteredPassword = loadingUser === false && dataUser != undefined;
  const isEnteredCorrectPassword = isEnteredPassword && dataUser.userIfCorrectPassword != null;
  const isSignin = loadingAddUser == false && dataAddUser;


  //HANDLERS
  const HandleChangeLoginSigin = (event) => {
    //event.preventDefault();
    console.log("change form");
    if (!isLoginForm) window.location.reload(false);
    else setIsLoginForm(!isLoginForm);
  }

  const HandleSigninFormSubmit = (event) => {
    event.preventDefault();
    console.log(document.forms);
    var { uname, passOne, passTwo } = document.forms[0];
    const userData = data.getAllUserNames.find((user) => user === uname.value);
    if (userData) {
      setErrorMessages({ name: "usedUsername", message: errors.usedUsername });
    }
    else {
      if (passOne.value === passTwo.value) {
        getAddUserData({ variables: { userName: uname.value, password: passOne.value } });
      }
      else {
        setErrorMessages({ name: "differentControlPassword", message: errors.differentControlPassword });
      }
    }
  }

  const HandleLoginFormSubmit = (event) => {
    event.preventDefault();
    var { uname, pass } = document.forms[0];

    const userData = data.getAllUserNames.find((user) => user === uname.value);

    if (userData) {
      console.log("Should be set" + uname.value + " " + pass.value);
      getUserByPassword({ variables: { userName: uname.value, password: pass.value } });
    } else {
      setErrorMessages({ name: "wrongUsername", message: errors.wrongUsername });
    }
  }

  const HandleAddFriend = (event) => {
    event.preventDefault();
    var { username } = document.forms[0];

    const userData = data.getAllUserNames.find((user) => user === username.value);
    if (userData) {
      if (userData == dataUser.userIfCorrectPassword.userName) {
        setErrorMessages({ name: "yourUsername", message: errors.yourUsername });
      }
      else {
        getAddFriend({ variables: { id: dataUser.userIfCorrectPassword.id, username: username.value } });
        setToReloadFriends(true);
      }
    }
    else {
      setErrorMessages({ name: "noSuchUser", message: errors.noSuchUser });
    }
  }

  const HandleRemoveFriend = (event) => {
    event.preventDefault();
    var { username } = document.forms[1];
    console.log(username.value);
    const userData = dataFriends.getFriends.find((user) => user === username.value);
    console.log(userData);
    if (userData) {
      getRemoveFriend({ variables: { id: dataUser.userIfCorrectPassword.id, username: username.value } });
      setToReloadFriends(true);
    }
    else {
      setErrorMessages({ name: "notYourFriend", message: errors.notYourFriend });
    }
  }

  //HTML RETURN_FUNCTIONS/VARIABLES
  const renderErrorMessage = (name) =>
    name === errorMessages.name && (
      <div className="error">{errorMessages.message}</div>
    );

  const renderLoginForm = (
    <div className="LoginForm">
      <form onSubmit={HandleLoginFormSubmit}>
        {renderErrorMessage("waitForResponseAboutPassword")}
        <div className="input-container">
          <label>Username </label>
          <input type="text" name="uname" required />
          {renderErrorMessage("wrongUsername")}
        </div>
        <div className="input-container">
          <label>Password </label>
          <input type="password" name="pass" required />
          {renderErrorMessage("wrongPassword")}
        </div>
        <div className="button-container">
          <input type="submit" />
        </div>
      </form>
    </div>
  );

  const renderSigninForm = (
    <div className="SigninForm">
      <form onSubmit={HandleSigninFormSubmit}>
        {renderErrorMessage("waitForResponseAboutAddUser")}
        <div className="input-container">
          <label>Username </label>
          <input type="text" name="uname" required />
          {renderErrorMessage("usedUsername")}
        </div>
        <div className="input-container">
          <label>Password </label>
          <input type="password" name="passOne" required />
        </div>
        <div className="input-container">
          <label>Password second time</label>
          <input type="password" name="passTwo" required />
          {renderErrorMessage("differentControlPassword")}
        </div>
        <div className="button-container">
          <input type="submit" />
        </div>
      </form>
    </div>
  );

  const renderFriendsComponent = (
    <div key="friendList" className='friends-list'>
      <div>User is successfully logged in</div>
      <h3>Your Friends:</h3>
      {
        (loadingFriends || !dataFriends) ? (<p>Loading...</p>) : ((errorFriends) ? (<p>Error : {errorFriends.message}</p>) : (dataFriends.getFriends.map(name =>
          <p>{name}</p>
        )))
      }
      <h3>Manage Your Friends</h3>
      <div className="addFriendForm">
        <form onSubmit={HandleAddFriend}>
          <label>add user: </label>
          <input type="text" name="username" required />
          {renderErrorMessage("noSuchUser")}
          {renderErrorMessage("yourUsername")}
          <div className="button-container">
            <input type="submit" />
          </div>
        </form>
      </div>
      <div className="removeFriendForm">
        <form onSubmit={HandleRemoveFriend}>
          <label>remove friend: </label>
          <input type="text" name="username" required />
          {renderErrorMessage("notYourFriend")}
          <div className="button-container">
            <input type="submit" />
          </div>
        </form>
      </div>


    </div>
  );

  //CODE
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error : {error.message}</p>;

  let toReturn;

  if (isLoginForm) {
    //console.log("login form");
    if (isEnteredPassword && !isEnteredCorrectPassword && errorMessages.name != "wrongPassword") setErrorMessages({ name: "wrongPassword", message: errors.wrongPassword })
    if (isEnteredPassword && isEnteredCorrectPassword && !loadingFriends && !dataFriends) getFriends({ variables: { id: dataUser.userIfCorrectPassword.id } });
    if (toReloadFriends && ((dataAddFriend && dataAddFriend.addFriend) || (dataRemoveFriend && dataRemoveFriend.removeFriend))) {
      setToReloadFriends(false);
      refetchFriends({ variables: { id: dataUser.userIfCorrectPassword.id } });
    }
    toReturn = (
      <div key="form" className="login-form">
        <div className="title">Log In</div>
        {(isEnteredPassword && isEnteredCorrectPassword) ? (renderFriendsComponent) : (renderLoginForm)}
      </div>
    )
  }
  else {
    //console.log("signin form");
    toReturn = (
      <div key="form" className="signin-form">
        <div className="title">Sign In</div>
        {(isSignin) ? <div>User is successfully signed in</div> : (renderSigninForm)}
      </div>
    )
  }

  return [
    toReturn,
    <Button key="changeFormButton" onClick={(e) => HandleChangeLoginSigin(e)}>{(isLoginForm) ? (<>Sign in</>) : (<>Log in</>)}</Button>
  ]
}

const App = () => {
  {/*const [data, setData] = useState(initialState)

  const getData = async () => {
    const response = await fetch('/api/songs');
    const body = await response.json()
    setData({ songs: body, isLoading: false })
  }

  useEffect(() => {
    getData()
  }, [])*/}



  {/*
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <Container>
        
          <div className="App-intro">
          <h2 style={{color: 'white'}}>Song List</h2>
          <hr></hr>
          <Row>
          {data.songs.map(song =>
              <Col>
                 <SongCard key={song.id} song={song} />
              </Col>
           
          )}
          </Row>
        </div>
          
      </Container>
        
      </header>
      <div>
        <h2>My first Apollo app 🚀</h2>
        <br/>
        <DisplayBook />
      </div>
      */}

  return (
    <div className="App">
      <InitialData />
    </div>
  )
}
export default App;