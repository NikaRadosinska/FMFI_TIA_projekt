import logo from './logo.svg';
import './App.css';
import { useQuery, gql, useLazyQuery, useMutation } from '@apollo/client';
import React, { useEffect, useState } from 'react'
import SongCard from './SongCard';
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Button from 'react-bootstrap/Button';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';

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
  getAllUsernames
}
`;
const GET_USER_IF_CORRECT_PASSWORD = gql`
query getUserIfCorrectPassword($username: String!, $password: String!) {
  userIfCorrectPassword(username: $username, password: $password){
    id
    username
    password
    isAdmin
  }
}
`;

const ADD_USER = gql`
mutation getAddUser($username: String!, $password: String!) {
  addUser(userName: $username, password: $password){
    id
    username
    password
    isAdmin
  }
}
`;

const GET_FRIENDS = gql`
query getFriends($id: Int!) {
  getFriends(id: $id){
    id
    username
  }
}
`;

const GET_GROUPS = gql`
query getUsersGroups($id: Int!) {
  getUsersGroups(id: $id){
    id
    name
  }
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

const CREATE_GROUP = gql`
mutation createGroup($id: Int!, $groupname: String!) {
  createGroup(id: $id, groupname: $groupname)
}
`;

const LEAVE_GROUP = gql`
mutation leaveGroup($userid: Int!, $groupid: Int!) {
  leaveGroup(userid: $userid, groupid: $groupid)
}
`;

const GET_GROUP_MEMBERS = gql`
query getMembersOfGroup($id: Int!) {
  getMembersOfGroup(id: $id){
    id
    username
  }
}
`;

const ADD_USER_TO_GROUP = gql`
mutation addUserToGroup($userid: Int!, $groupid: Int!) {
  addUserToGroup(userid: $userid, groupid: $groupid)
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
    notYourFriend: "user is not in your fiend list",
    alreadyYourFriend: "user is already your friend",
    userAlreadyInGroup: "user is already in group",
    existingGroup: "group with such name already exists",
    alreadyInGroup: "this friend is already part of the group"
  };

  //STATES
  const [isLoginForm, setIsLoginForm] = useState(true);
  const [toReloadFriends, setToReloadFriends] = useState(false);
  const [toReloadGroups, setToReloadGroups] = useState(false);
  const [leftGroup, setLeftGroup] = useState(false);
  const [errorMessages, setErrorMessages] = useState({});
  const [link, setLink] = useState("");
  const [selectedGroup, setSelectedGroup] = useState("");
  const { loading, error, data } = useQuery(GET_ALL_USERNAMES);
  const [getUserByPassword, { loading: loadingUser, error: errorUser, data: dataUser }] = useLazyQuery(GET_USER_IF_CORRECT_PASSWORD);
  const [getAddUserData, { loading: loadingAddUser, error: errorAddUser, data: dataAddUser }] = useMutation(ADD_USER);
  const [getFriends, { loading: loadingFriends, error: errorFriends, data: dataFriends, refetch: refetchFriends }] = useLazyQuery(GET_FRIENDS);
  const [getGroups, { loading: loadingGroups, error: errorGroups, data: dataGroups, refetch: refetchGroups }] = useLazyQuery(GET_GROUPS);
  //const [getRecommendations, {loading: loadingRecommendations, error: errorRecommendations, data: dataRecommendations, refetch: refetchRecommendations}] = useLazyQuery()
  const [getAddFriend, { loading: loadingAddFriend, error: errorAddFriend, data: dataAddFriend }] = useMutation(ADD_FRIEND);
  const [getRemoveFriend, { loading: loadingRemoveFriend, error: errorRemoveFriend, data: dataRemoveFriend }] = useMutation(REMOVE_FRIEND);
  const [getCreateGroup, { loading: loadingCreateGroup, error: errorCreateGroup, data: dataCreateGroup }] = useMutation(CREATE_GROUP);
  const [getLeaveGroup, { loading: loadingLeaveGroup, error: errorLeaveGroup, data: dataLeaveGroup }] = useMutation(LEAVE_GROUP);
  const [getGroupsMembers, { loading: loadingGroupsMembers, error: errorGroupsMembers, data: dataGroupsMembers, refetch: refetchGroupsMembers }] = useLazyQuery(GET_GROUP_MEMBERS);
  const [fetchedGroupMembersName, setFetchedGroupMembersName] = useState("");
  const [getAddUserToGroup, { loading: loadingAddUserToGroup, error: errorAddUserToGroup, data: dataAddUserToGroup }] = useMutation(ADD_USER_TO_GROUP);
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

  const HandleLogOut = (event) => {
    window.location.reload(false);
  }

  const HandleSigninFormSubmit = (event) => {
    event.preventDefault();
    setErrorMessages({});
    console.log(document.forms);
    var { uname, passOne, passTwo } = document.forms[0];
    const userData = data.getAllUsernames.find((user) => user === uname.value);
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
    setErrorMessages({});
    var { uname, pass } = document.forms[0];

    const userData = data.getAllUsernames.find((user) => user === uname.value);

    if (userData) {
      console.log("Should be set" + uname.value + " " + pass.value);
      getUserByPassword({ variables: { username: uname.value, password: pass.value } });
    } else {
      setErrorMessages({ name: "wrongUsername", message: errors.wrongUsername });
    }
  }

  const HandleAddFriend = (event) => {
    event.preventDefault();
    setErrorMessages({});
    var { username } = document.forms[0];

    const userData = data.getAllUsernames.find((user) => user === username.value);
    if (userData) {
      if (userData == dataUser.userIfCorrectPassword.username) {
        setErrorMessages({ name: "yourUsername", message: errors.yourUsername });
      }
      else if (dataFriends.getFriends.find((user) => user.username === username.value)) {
        setErrorMessages({ name: "alreadyYourFriend", message: errors.alreadyYourFriend });
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
    setErrorMessages({});
    var { username } = document.forms[1];
    console.log(username.value);
    const userData = dataFriends.getFriends.find((user) => user.username === username.value);
    console.log(userData);
    if (userData) {
      getRemoveFriend({ variables: { id: dataUser.userIfCorrectPassword.id, username: username.value } });
      setToReloadFriends(true);
    }
    else {
      setErrorMessages({ name: "notYourFriend", message: errors.notYourFriend });
    }
  }

  const HandleCreateGroup = (event) => {
    event.preventDefault();
    setErrorMessages({});

    var { groupname } = document.forms[0];
    getCreateGroup({ variables: { id: dataUser.userIfCorrectPassword.id, groupname: groupname.value } });
    setToReloadGroups(true);
  }

  const HandleLeaveGroup = (event) => {
    event.preventDefault();
    setErrorMessages({});
    getLeaveGroup({ variables: { userid: dataUser.userIfCorrectPassword.id, groupid: selectedGroup.id } });
    setSelectedGroup("");
    setToReloadGroups(true);
    setLeftGroup(true);
  }

  const HandleAddUserToGroup = (event) => {
    event.preventDefault();
    var { username } = document.forms[0];
    setErrorMessages({});
    if (dataGroupsMembers.getMembersOfGroup.map(userInfo => userInfo.username).contains(username)){
      setErrorMessages({ name: "alreadyInGroup", message: errors.alreadyInGroup })
    }
  }

  const HandleNavigation = (eventKey) => {
    if (eventKey != "") {
      console.log(eventKey);
      setSelectedGroup("");
      setLink(eventKey);
    }
  }

  //HTML RETURN_FUNCTIONS/VARIABLES
  const renderErrorMessage = (name) =>
    name === errorMessages.name && (
      <div className="error">{errorMessages.message}</div>
    );

  const renderNav = (
    <Navbar bg="dark" variant="dark" expand="md">
      {/*<Navbar.Brand href="#home">React-Bootstrap</Navbar.Brand>*/}
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="me-auto" variant="pills" defaultActiveKey={"recommendations"} onSelect={HandleNavigation}>
          <Nav.Link eventKey={"recommendations"}>Recommendations</Nav.Link>
          <Nav.Link eventKey={"friends"}>Friends</Nav.Link>
          <Nav.Link eventKey={"groups"}>Groups</Nav.Link>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  )

  const renderLoginForm = (
    <div className="login-form">
      <div className="title">Log In</div>
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

  const renderRecommendations = (
    <div className='part'>
      Recommendations
    </div>
  )

  const renderFriendsForms = (
    <div className="bottomPanel">
      <h4>Manage Your Friends</h4>
      <div className="addFriendForm">
        <form onSubmit={HandleAddFriend}>
          <label>add user: </label>
          <input type="text" name="username" required />
          {renderErrorMessage("noSuchUser")}
          {renderErrorMessage("yourUsername")}
          {renderErrorMessage("alreadyYourFriend")}
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
  )

  const renderFriends = (
    <div className='part'>
      <h3>Your Friends:</h3>
      {
        (loadingFriends || !dataFriends) ? (<p>Loading...</p>) : ((errorFriends) ? (<p>Error : {errorFriends.message}</p>) : (dataFriends.getFriends.map(user =>
          <p>{user.username}</p>
        )))
      }
      {(!toReloadFriends && !loadingFriends && dataFriends && dataFriends.getFriends) ? (renderFriendsForms) : (<>Loading...</>)}
    </div>
  )

  const renderAllGroups = (
    <div>
      <h3>Your Groups:</h3>
      <div>
        {
          (loadingGroups || !dataGroups) ? (<p>Loading...</p>) : ((errorGroups) ? (<p>Error : {errorGroups.message}</p>) : (dataGroups.getUsersGroups.map(group =>
            <Button className="groupButton" onClick={() => setSelectedGroup(group)}>{group.name}</Button>
          )))
        }
      </div>
    </div>
  )

  const renderSelectedGroup = (
    <div>
      <Button className="backToAllGroups" onClick={() => setSelectedGroup("")}>&#60; back to all groups</Button>
      <Button className="leaveGroup" onClick={HandleLeaveGroup}>Leave group</Button>
      <h3>Group: {selectedGroup.name}</h3>
      <div>
        {
          (loadingGroupsMembers || !dataGroupsMembers) ? (<p>Loading...</p>) : ((errorGroupsMembers) ? (<p>Error: {errorGroupsMembers.message}</p>) : (dataGroupsMembers.getMembersOfGroup.map(member =>
            <p>{member.name}</p>
          )))
        }
      </div>
    </div>
  )

  const renderCreateGroup = (
    <div>
      <h4>Create new group</h4>
      <form onSubmit={HandleCreateGroup}>
        <label>name of your new group: </label>
        <input type="text" name="groupname" required />
        {renderErrorMessage("existingGroup")}
        <div className="button-container">
          <input type="submit" />
        </div>
      </form>
    </div>
  )

  const renderAddUserToGroup = (
    <div>
      <h4>Add User To {selectedGroup.name}</h4>
      <div className="addUserToGroupForm">
        <form onSubmit={HandleAddUserToGroup}>
          <label>
            Pick your friend:
            <select name="friend">
              {
                (loadingFriends || !dataFriends) ? (<p>Loading...</p>) : ((errorFriends) ? (<p>Error : {errorFriends.message}</p>) : (dataFriends.getFriends.map(user =>
                  <option value={user.id}>{user.username}</option>
                )))
              }
            </select>
          </label>
          {renderErrorMessage("alreadyInGroup")}
          <div className="button-container">
            <input type="submit" />
          </div>
        </form>
      </div>
    </div>
  )

  const renderGroups = (
    <div className="part">
      {(selectedGroup === "") ? (renderAllGroups) : (renderSelectedGroup)}
      <div className="bottomPanel">
        {(selectedGroup === "") ? (renderCreateGroup) : (renderAddUserToGroup)}
      </div>
    </div>
  )

  const renderUserIsLoginComponent = (
    <div key="userIsLoginComponent" className="user-is-login">
      {(link === "" || link === "recommendations")
        ? (renderRecommendations)
        : ((link === "friends") ? (renderFriends) : (renderGroups))}
    </div>
  );



  //CODE
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error : {error.message}</p>;

  let toReturn;

  if (isLoginForm) {
    //console.log("login form");
    if (isEnteredPassword && !isEnteredCorrectPassword && errorMessages.name != "wrongPassword") setErrorMessages({ name: "wrongPassword", message: errors.wrongPassword })
    if (isEnteredPassword && isEnteredCorrectPassword && !loadingFriends && !dataFriends) {
      getFriends({ variables: { id: dataUser.userIfCorrectPassword.id } });
      getGroups({ variables: { id: dataUser.userIfCorrectPassword.id } });
    }
    if (toReloadFriends && !loadingAddFriend && !loadingRemoveFriend) {
      console.log("reload friends");
      refetchFriends({ id: dataUser.userIfCorrectPassword.id });
      setToReloadFriends(false);
    }
    if (toReloadGroups && !loadingCreateGroup && !loadingLeaveGroup) {
      setToReloadGroups(false);

      if ((dataCreateGroup && dataCreateGroup.createGroup) || (leftGroup)) {
        refetchGroups({ variables: { id: dataUser.userIfCorrectPassword.id } });
        if (leftGroup) setLeftGroup(false);
      }
      else setErrorMessages({ name: "existingGroup", message: errors.existingGroup });
    }
    if (selectedGroup != "" && fetchedGroupMembersName != selectedGroup.name) {
      setFetchedGroupMembersName(selectedGroup.name);
      console.log()
      if (dataGroupsMembers) refetchGroupsMembers({ variables: { id: selectedGroup.id } });
      else getGroupsMembers({ variables: { id: selectedGroup.id } });
    }
    toReturn = (
      <div>
        {(isEnteredPassword && isEnteredCorrectPassword) ? (renderUserIsLoginComponent) : (renderLoginForm)}
      </div>
    )
  }
  else {
    //console.log("signin form");
    toReturn = (
      <div className="signin-form">
        <div className="title">Sign In</div>
        {(isSignin) ? <div>User is successfully signed in</div> : (renderSigninForm)}
      </div>
    )
  }

  return (
    <div className="app">
      <Container fluid className="upperPanel">
        <Row>
          <Col>{(isEnteredPassword && isEnteredCorrectPassword) ? (renderNav) : (<>Need to login</>)}</Col>
          <Col xs="auto" className="buttonHolder">
            {(isEnteredPassword && isEnteredCorrectPassword)
              ? (<Button className="logOutButton" onClick={(e) => HandleLogOut(e)}>Log out</Button>)
              : (<Button className="changeFormButton" onClick={(e) => HandleChangeLoginSigin(e)}>{(isLoginForm) ? (<>Sign in</>) : (<>Log in</>)}</Button>)}
          </Col>
        </Row>
      </Container>
      <div className="mainPanel">{toReturn}</div>
    </div>
  )
}

const App = () => {
  return (
    <InitialData />
  )
}
export default App;