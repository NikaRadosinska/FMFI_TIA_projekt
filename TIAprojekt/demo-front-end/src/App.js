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
import Select from 'react-select';

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

const GET_FILM_GENRES = gql`
query getFilmGenres {
  getFilmGenres{
    id
    name
  }
}
`;

const GET_GAME_GENRES = gql`
query getGameGenres {
  getGameGenres{
    id
    name
  }
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
  addUser(username: $username, password: $password){
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

const GET_RECOMMENDATIONS = gql`
query getUsersRecommendations($id: Int!) {
  getUsersRecommendations(id: $id){
    id
    sender{
      id
      username
    }
    group{
      id
      name
    }
    receiver{
      id
      username
    }
    title
    description
    rating
    gameAddition{
      progress
    }
    postTime
    genres{
      id
      name
    }
    feedbacks{
      id
      user{
        id
        username
      }
      state
      rating
      state
    }
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

const CREATE_RECOMMENDATION = gql`
mutation createRecommendation($userid: Int!, $groupid: Int, $receiver: Int, $title: String!, $description: String, $rating: Int!, $progress: Float, $genresids: [Int]!) {
  createRecommendation(sender: $userid, groupid: $groupid, receiver: $receiver, title: $title, description: $description, rating: $rating, progress: $progress, genresids: $genresids)
}
`;



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
    alreadyInGroup: "this friend is already part of the group",
    atLeastOne: "you need to select at least one friend or group"
  };

  //STATES
  const [isLoginForm, setIsLoginForm] = useState(true);
  const [toReloadFriends, setToReloadFriends] = useState(false);
  const [toReloadGroups, setToReloadGroups] = useState(false);
  const [toReloadRecommendations, setToReloadRecommendations] = useState(false);
  const [leftGroup, setLeftGroup] = useState(false);
  const [errorMessages, setErrorMessages] = useState({});
  const [link, setLink] = useState("");
  const [selectedGroup, setSelectedGroup] = useState("");
  const [toCreateRecommendation, setToCreateRecommendation] = useState(false);
  const [recommendationForFilm, setRecommendationForFilm] = useState(true);
  const { loading, error, data } = useQuery(GET_ALL_USERNAMES);
  const { loading: loadingFilmGenres, error: errorFilmGenres, data: dataFilmGenres } = useQuery(GET_FILM_GENRES, { queryKey: ['filmGenres'] });
  const { loading: loadingGameGenres, error: errorGameGenres, data: dataGameGenres } = useQuery(GET_GAME_GENRES, { queryKey: ['gameGenres'] });
  const [getUserByPassword, { loading: loadingUser, error: errorUser, data: dataUser }] = useLazyQuery(GET_USER_IF_CORRECT_PASSWORD);
  const [getAddUserData, { loading: loadingAddUser, error: errorAddUser, data: dataAddUser }] = useMutation(ADD_USER);
  const [getFriends, { loading: loadingFriends, error: errorFriends, data: dataFriends, refetch: refetchFriends }] = useLazyQuery(GET_FRIENDS);
  const [getGroups, { loading: loadingGroups, error: errorGroups, data: dataGroups, refetch: refetchGroups }] = useLazyQuery(GET_GROUPS);
  const [getRecommendations, { loading: loadingRecommendations, error: errorRecommendations, data: dataRecommendations, refetch: refetchRecommendations }] = useLazyQuery(GET_RECOMMENDATIONS);
  const [getAddFriend, { loading: loadingAddFriend, error: errorAddFriend, data: dataAddFriend }] = useMutation(ADD_FRIEND);
  const [getRemoveFriend, { loading: loadingRemoveFriend, error: errorRemoveFriend, data: dataRemoveFriend }] = useMutation(REMOVE_FRIEND);
  const [getCreateGroup, { loading: loadingCreateGroup, error: errorCreateGroup, data: dataCreateGroup }] = useMutation(CREATE_GROUP);
  const [getLeaveGroup, { loading: loadingLeaveGroup, error: errorLeaveGroup, data: dataLeaveGroup }] = useMutation(LEAVE_GROUP);
  const [getGroupsMembers, { loading: loadingGroupsMembers, error: errorGroupsMembers, data: dataGroupsMembers, refetch: refetchGroupsMembers }] = useLazyQuery(GET_GROUP_MEMBERS);
  const [fetchedGroupMembersName, setFetchedGroupMembersName] = useState("");
  const [getAddUserToGroup, { loading: loadingAddUserToGroup, error: errorAddUserToGroup, data: dataAddUserToGroup }] = useMutation(ADD_USER_TO_GROUP);
  const [getCreateRecommendation, { loading: loadingCreateRecommendation, error: errorCreateRecommendation, data: dataCreateRecommendation }] = useMutation(CREATE_RECOMMENDATION);
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
        getAddUserData({ variables: { username: uname.value, password: passOne.value } });
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
    var friendId = document.getElementById("addFriendToThisGroupSelect").value;
    console.log(dataGroupsMembers.getMembersOfGroup);
    setErrorMessages({});
    if (dataGroupsMembers.getMembersOfGroup.find(userInfo => userInfo.id == friendId)) {
      setErrorMessages({ name: "alreadyInGroup", message: errors.alreadyInGroup });
    }
    else {
      getAddUserToGroup({ variables: { userid: friendId, groupid: selectedGroup.id } });
      setFetchedGroupMembersName("");
    }
  }

  const HandleNavigation = (eventKey) => {
    if (eventKey != "") {
      //console.log(eventKey);
      setErrorMessages({});
      setSelectedGroup("");
      setLink(eventKey);
    }
  }

  const [selectedGroups, setSelectedGroups] = useState([]);
  const [selectedFriends, setSelectedFriends] = useState([]);
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [selectedRating, setSelectedRating] = useState();

  const onGroupsChange = (selectedOptions) => setSelectedGroups(selectedOptions);
  const onFriendsChange = (selectedOptions) => setSelectedFriends(selectedOptions);
  const onGenresChange = (selectedOptions) => { setSelectedGenres(selectedOptions); console.log(selectedOptions); }
  const onRatingChange = (selectedOption) => { setSelectedRating(selectedOption); console.log(selectedOption); }

  const HandleCreateRecommendation = (event) => {
    event.preventDefault();
    var { title, description, progress } = document.forms[0];

    if (selectedGroups.length + selectedFriends.length <= 0) {
      setErrorMessages({ name: "atLeastOne", message: errors.atLeastOne });
    } else {
      selectedFriends.forEach(element => {
        getCreateRecommendation({
          variables: {
            userid: dataUser.userIfCorrectPassword.id,
            receiver: element.value,
            title: title.value,
            description: description.value,
            rating: selectedRating.value,
            progress: (progress) ? (progress.value / 100) : (null),
            genresids: selectedGenres.map(genre => genre.value)
          }
        });
      })
      selectedGroups.forEach(element => {
        getCreateRecommendation({
          variables: {
            userid: dataUser.userIfCorrectPassword.id,
            groupid: element.value,
            title: title.value,
            description: description.value,
            rating: selectedRating.value,
            progress: (progress) ? (progress.value / 100) : (null),
            genresids: selectedGenres.map(genre => genre.value)
          }
        });
      })
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

  const renderCreateRecommendation = (
    <div>
      <h3>Create Recommendation</h3>
      <Button className="recommendationButton" onClick={() => { setRecommendationForFilm(!recommendationForFilm); setSelectedGenres(); }}>{(recommendationForFilm) ? (<>Show form for game</>) : (<>Show form for movie</>)}</Button>
      <form id='createRecommendationForm' onSubmit={HandleCreateRecommendation}>
        {/*<div>
          <label>For Groups:</label>
          <Select isMulti onChange={onGroupsChange} options={(dataGroups) ? (dataGroups.getUsersGroups.map(group => ({ value: group.id, label: group.name }))) : (<></>)} />
        </div>}*/}
        <div>
          <label>For Friends:</label>
          <Select isMulti onChange={onFriendsChange} options={(dataFriends) ? (dataFriends.getFriends.map(friend => ({ value: friend.id, label: friend.username }))) : (<></>)} />
        </div>
        {renderErrorMessage("atLeastOne")}
        <div className="input-container">
          <label>Title </label>
          <input type="text" name="title" required />
        </div>
        <div className="input-container">
          <label>Description </label>
          <textarea name="description"></textarea>
        </div>
        <div>
          <label>Your rating </label>
          <Select id="rating" required onChange={onRatingChange} options={[
            { value: 0, label: 0 },
            { value: 1, label: 1 },
            { value: 2, label: 2 },
            { value: 3, label: 3 },
            { value: 4, label: 4 },
            { value: 5, label: 5 },
            { value: 6, label: 6 },
            { value: 7, label: 7 },
            { value: 8, label: 8 },
            { value: 9, label: 9 },
            { value: 10, label: 10 }
          ]} />
        </div>
        {
          (recommendationForFilm) ? (<></>) : (<div>
            <label>Your progress (%)</label>
            <input type="number" name="progress" min="1" max="100" required />
          </div>)
        }
        <div>
          <label>Genres:</label>
          {
            (recommendationForFilm) ? (
              <Select key="filmGenresSelect" isMulti required onChange={onGenresChange} closeMenuOnSelect={false} options={(dataFilmGenres && !loadingFilmGenres) ? (dataFilmGenres.getFilmGenres.map(genre => ({ value: genre.id, label: genre.name }))) : (<></>)} />
            ) : (
              <Select key="gameGenresSelect" isMulti required onChange={onGenresChange} closeMenuOnSelect={false} options={(dataGameGenres && !loadingGameGenres) ? (dataGameGenres.getGameGenres.map(genre => ({ value: genre.id, label: genre.name }))) : (<></>)} />
            )
          }
        </div>
        <div className="button-container">
          <input type="submit" />
        </div>
      </form>
    </div>
  )

  const renderShowRecommendations = (
    <div>
      <h3>Recommendations:</h3>
      <Button onClick={() => setToReloadRecommendations(true)}>Reload Recommendations</Button>
      {
        (loadingRecommendations || !dataRecommendations) ? (<p>Loading...</p>) : ((errorRecommendations) ? (<p>Error : {errorRecommendations.message}</p>) : (dataRecommendations.getUsersRecommendations.map(rec =>
          <div>
            <p></p>
            <h5>{(rec.gameAddition) ? (<>Game </>) : (<></>)}Title: {rec.title}</h5>
            {(rec.description) ? (<p>Description: {rec.description}</p>) : (<></>)}
            <p>From: {(rec.group) ? (<>{rec.group.name} ({rec.sender.username})</>) : (<>{rec.sender.username}</>)}</p>
            <p>To: {(rec.group) ? (rec.group.name) : (rec.receiver.username)}</p>
            <p>Sender rating: {rec.rating}/10</p>
            {(rec.gameAddition) ? (<p>Percentage of played: {rec.gameAddition.progress * 100}</p>) : (<></>)}
            <p>Genres: {rec.genres.map(genre => <> {genre.name}</>)}</p>
            <p></p>
          </div>
        )))
      }
    </div>
  )

  const renderRecommendations = (
    <div className='part'>
      {(toCreateRecommendation) ? (renderCreateRecommendation) : (renderShowRecommendations)}
      <div className="bottomPanel">
        <Button className="recommendationButton" onClick={() => setToCreateRecommendation(!toCreateRecommendation)}>{(toCreateRecommendation) ? (<>Back to Recommendations</>) : (<>Create NEW Recommendation</>)}</Button>
      </div>
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
            <p>{member.username}</p>
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
            <select id="addFriendToThisGroupSelect">
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
        {(selectedGroup === "") ? (renderCreateGroup) : ((loadingAddUserToGroup) ? (<></>) : (renderAddUserToGroup))}
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
      getRecommendations({ variables: { id: dataUser.userIfCorrectPassword.id } });
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
    if (toReloadRecommendations) {
      setToReloadRecommendations(false);
      refetchRecommendations({ id: dataUser.userIfCorrectPassword.id });
    }
    if (selectedGroup != "" && fetchedGroupMembersName != selectedGroup.name && !loadingAddUserToGroup) {
      setFetchedGroupMembersName(selectedGroup.name);
      if (dataGroupsMembers) refetchGroupsMembers({ id: selectedGroup.id });
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