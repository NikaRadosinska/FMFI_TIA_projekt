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
import { Component } from "react";
import Select, { components } from "react-select";
import Form from 'react-bootstrap/Form';
import Card from 'react-bootstrap/Card';
import ListGroup from 'react-bootstrap/ListGroup';
import Offcanvas from 'react-bootstrap/Offcanvas';

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

const ADD_ADMIN = gql`
mutation getAddAdmin($username: String!, $password: String!) {
  addAdmin(username: $username, password: $password){
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
      commentary
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

const CREATE_FEEDBACK = gql`
mutation createFeedback($recommendationId: Int!, $userId: Int!, $state: FeedbackerState!, $rating: Int!, $commentary: String) {
  createFeedback(recommendationId: $recommendationId, userId: $userId, state: $state, rating: $rating, commentary: $commentary)
}
`;

const GET_ALL_USERS = gql`
query getAllUsers {
  getAllUsers{
    id
    username
    password
    isAdmin
  }
}
`;

const GET_ALL_RECOMMENDATIONS = gql`
query getAllRecommendations {
  getAllRecommendations{
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
      commentary
    }
  }
}
`;

const GET_ALL_GROUPS = gql`
query getAllGroups {
  getAllGroups{
    id
    name
  }
}
`;

const GET_ALL_MEMBERS = gql`
query getAllMembers {
  getAllMembers{
    group{
      id
      name
    }
    user{
      id
      username
      password
      isAdmin
    }
  }
}
`;

const DELETE_USER = gql`
mutation deleteUserById($id: Int!) {
  deleteUserById(id: $id)
}
`;

const DELETE_GROUP = gql`
mutation deleteGroupById($id: Int!) {
  deleteGroupById(id: $id)
}
`;

const DELETE_RECOMMENDATION = gql`
mutation deleteRecommendationById($id: Int!) {
  deleteRecommendationById(id: $id)
}
`;

const DELETE_FEEDBACK = gql`
mutation deleteFeedbackById($id: Int!) {
  deleteFeedbackById(id: $id)
}
`;

const DELETE_GENRE = gql`
mutation deleteGenreById($id: Int!) {
  deleteGenreById(id: $id)
}
`;

const ADD_GENRE = gql`
mutation addGenre($name: String!, $isForGame: Boolean!) {
  addGenre(name: $name, isForGame: $isForGame){
    id
    name
  }
}
`;

const CHANGE_NAME_OF_GENRE = gql`
mutation changeNameOfGenre($id: Int!, $name: String!) {
  changeNameOfGenre(id: $id, name: $name){
    id
    name
  }
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
    atLeastOne: "you need to select at least one friend or group",
    notValidId: "id does not exists in current context",
    sameGenreNameExists: "Change genre name becouse that one already exists"
  };

  //STATES
  const [isLoginForm, setIsLoginForm] = useState(true);
  const [toReloadGroups, setToReloadGroups] = useState(false);
  const [toReloadRecommendations, setToReloadRecommendations] = useState(false);
  const [leftGroup, setLeftGroup] = useState(false);
  const [errorMessages, setErrorMessages] = useState({});
  const [link, setLink] = useState("");
  const [adminLink, setAdminLink] = useState("users");
  const [selectedGroup, setSelectedGroup] = useState("");
  const [toCreateRecommendation, setToCreateRecommendation] = useState(false);
  const [recommendationForFilm, setRecommendationForFilm] = useState(true);
  const [showRecsGroup, setShowRecsGroup] = useState(-1);
  const [showRecsFromFriend, setShowRecsFromFriend] = useState(-1);
  const [showRecsToFriend, setShowRecsToFriend] = useState(-1);
  const { loading, error, data, refetch } = useQuery(GET_ALL_USERNAMES);
  const { loading: loadingFilmGenres, error: errorFilmGenres, data: dataFilmGenres, refetch: refetchFilmGenres } = useQuery(GET_FILM_GENRES, { queryKey: ['filmGenres'] });
  const { loading: loadingGameGenres, error: errorGameGenres, data: dataGameGenres, refetch: refetchGameGenres } = useQuery(GET_GAME_GENRES, { queryKey: ['gameGenres'] });
  const [getUserByPassword, { loading: loadingUser, error: errorUser, data: dataUser }] = useLazyQuery(GET_USER_IF_CORRECT_PASSWORD);
  const [getAddUserData, { loading: loadingAddUser, error: errorAddUser, data: dataAddUser }] = useMutation(ADD_USER);
  const [getAddAdminData, { loading: loadingAddAdmin, error: errorAddAdmin, data: dataAddAdmin }] = useMutation(ADD_ADMIN, {
    refetchQueries: [
      //GET_POST, // DocumentNode object parsed with gql
      'allUsernames',
      'getAllUsers' // Query name
    ],
  });
  const [getFriends, { loading: loadingFriends, error: errorFriends, data: dataFriends, refetch: refetchFriends }] = useLazyQuery(GET_FRIENDS);
  const [getGroups, { loading: loadingGroups, error: errorGroups, data: dataGroups, refetch: refetchGroups }] = useLazyQuery(GET_GROUPS);
  const [getRecommendations, { loading: loadingRecommendations, error: errorRecommendations, data: dataRecommendations, refetch: refetchRecommendations }] = useLazyQuery(GET_RECOMMENDATIONS);
  const [getAddFriend, { loading: loadingAddFriend, error: errorAddFriend, data: dataAddFriend }] = useMutation(ADD_FRIEND, {
    refetchQueries: [
      //GET_POST, // DocumentNode object parsed with gql
      'getFriends' // Query name
    ],
  });
  const [getRemoveFriend, { loading: loadingRemoveFriend, error: errorRemoveFriend, data: dataRemoveFriend }] = useMutation(REMOVE_FRIEND, {
    refetchQueries: [
      //GET_POST, // DocumentNode object parsed with gql
      'getFriends' // Query name
    ],
  });
  const [getCreateGroup, { loading: loadingCreateGroup, error: errorCreateGroup, data: dataCreateGroup }] = useMutation(CREATE_GROUP, {
    refetchQueries: [
      //GET_POST, // DocumentNode object parsed with gql
      'getUsersGroups' // Query name
    ],
  });
  const [getLeaveGroup, { loading: loadingLeaveGroup, error: errorLeaveGroup, data: dataLeaveGroup }] = useMutation(LEAVE_GROUP, {
    refetchQueries: [
      //GET_POST, // DocumentNode object parsed with gql
      'getUsersGroups' // Query name
    ],
  });
  const [getGroupsMembers, { loading: loadingGroupsMembers, error: errorGroupsMembers, data: dataGroupsMembers, refetch: refetchGroupsMembers }] = useLazyQuery(GET_GROUP_MEMBERS);
  const [fetchedGroupMembersName, setFetchedGroupMembersName] = useState("");
  const [getAddUserToGroup, { loading: loadingAddUserToGroup, error: errorAddUserToGroup, data: dataAddUserToGroup }] = useMutation(ADD_USER_TO_GROUP, {
    refetchQueries: [
      //GET_POST, // DocumentNode object parsed with gql
      'getMembersOfGroup' // Query name
    ],
  });
  const [getCreateRecommendation, { loading: loadingCreateRecommendation, error: errorCreateRecommendation, data: dataCreateRecommendation }] = useMutation(CREATE_RECOMMENDATION, {
    refetchQueries: [
      //GET_POST, // DocumentNode object parsed with gql
      'getUsersRecommendations' // Query name
    ],
  });
  const [getCreateFeedback, { loading: loadingCreateFeedback, error: errorCreateFeedback, data: dataCreateFeedback }] = useMutation(CREATE_FEEDBACK, {
    refetchQueries: [
      //GET_POST, // DocumentNode object parsed with gql
      'getUsersRecommendations' // Query name
    ],
  });
  const [getAllUsers, { loading: loadingAllUsers, error: errorAllUsers, data: dataAllUsers, refetch: refetchAllUsers }] = useLazyQuery(GET_ALL_USERS);
  const [getAllGroups, { loading: loadingAllGroups, error: errorAllGroups, data: dataAllGroups, refetch: refetchAllGroups }] = useLazyQuery(GET_ALL_GROUPS);
  const [getAllMembers, { loading: loadingAllMembers, error: errorAllMembers, data: dataAllMembers, refetch: refetchAllMembers }] = useLazyQuery(GET_ALL_MEMBERS);
  const [getAllRecommendation, { loading: loadingAllRecommendations, error: errorAllRecommendations, data: dataAllRecommendations, refetch: refetchAllRecommendations }] = useLazyQuery(GET_ALL_RECOMMENDATIONS);
  const [toReloadAdministrationInfo, setToReloadAdministrationInfo] = useState(false);
  const [deleteUser, { loading: loadingDeleteUser, error: errorDeleteUser, data: dataDeleteUser }] = useMutation(DELETE_USER, {
    refetchQueries: [
      //GET_POST, // DocumentNode object parsed with gql
      'allUsernames',
      'getAllUsers' // Query name
    ],
  });
  const [deleteGroup, { loading: loadingDeleteGroup, error: errorDeleteGroup, data: dataDeleteGroup }] = useMutation(DELETE_GROUP, {
    refetchQueries: [
      //GET_POST, // DocumentNode object parsed with gql
      'getAllGroups' // Query name
    ],
  });
  const [deleteRecommendation, { loading: loadingDeleteRecommendation, error: errorDeleteRecommendation, data: dataDeleteRecommendation }] = useMutation(DELETE_RECOMMENDATION, {
    refetchQueries: [
      //GET_POST, // DocumentNode object parsed with gql
      'getAllRecommendations' // Query name
    ],
  });
  const [deleteFeedback, { loading: loadingDeleteFeedback, error: errorDeleteFeedback, data: dataDeleteFeedback }] = useMutation(DELETE_FEEDBACK, {
    refetchQueries: [
      //GET_POST, // DocumentNode object parsed with gql
      'getAllRecommendations',
      'getUsersRecommendations' // Query name
    ],
  });
  const [deleteGenre, { loading: loadingDeleteGenre, error: errorDeleteGenre, data: dataDeleteGenre }] = useMutation(DELETE_GENRE, {
    refetchQueries: [
      //GET_POST, // DocumentNode object parsed with gql
      'getFilmGenres',
      'getGameGenres' // Query name
    ],
  });
  const [addGenre, { loading: loadingAddGenre, error: errorAddGenre, data: dataAddGenre }] = useMutation(ADD_GENRE, {
    refetchQueries: [
      //GET_POST, // DocumentNode object parsed with gql
      'getFilmGenres',
      'getGameGenres' // Query name
    ],
  });
  const [changeNameOfGenre, { loading: loadingChangeNameOdGenre, error: errorChangeNameOdGenre, data: dataChangeNameOdGenre }] = useMutation(CHANGE_NAME_OF_GENRE, {
    refetchQueries: [
      //GET_POST, // DocumentNode object parsed with gql
      'getFilmGenres',
      'getGameGenres' // Query name
    ],
  });
  const isEnteredPassword = loadingUser === false && dataUser != undefined;
  const isEnteredCorrectPassword = isEnteredPassword && dataUser.userIfCorrectPassword != null;
  const isSignin = loadingAddUser == false && dataAddUser;
  var imIdToDelete = -1;
  const [idToDelete, setIdToDelete] = useState(-1);
  const [newIsForGame, setNewIsForGame] = useState("false");

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

  const HandleAddAdminSubmit = (event) => {
    event.preventDefault();
    setErrorMessages({});
    var { uname, passOne, passTwo } = document.forms[0];
    const userData = data.getAllUsernames.find((user) => user === uname.value);
    if (userData) {
      setErrorMessages({ name: "usedUsername", message: errors.usedUsername });
    }
    else {
      if (passOne.value === passTwo.value) {
        getAddAdminData({ variables: { username: uname.value, password: passOne.value } });
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

  const [selectedFriend, setSelectedFriend] = useState();

  const HandleAddUserToGroup = (event) => {
    event.preventDefault();
    setErrorMessages({});
    if (dataGroupsMembers.getMembersOfGroup.find(userInfo => userInfo.id == selectedFriend.value)) {
      setErrorMessages({ name: "alreadyInGroup", message: errors.alreadyInGroup });
    }
    else {
      getAddUserToGroup({ variables: { userid: selectedFriend.value, groupid: selectedGroup.id } });
      setFetchedGroupMembersName("");
    }
  }

  const HandleNavigation = (eventKey) => {
    if (eventKey != "") {
      //console.log(eventKey);
      setErrorMessages({});
      setSelectedGroup("");
      setToCreateRecommendation(false);
      setSelectedFriends([]);
      setSelectedGroups([]);
      setLink(eventKey);
    }
  }

  const HandleAdminNavigation = (eventKey) => {
    if (eventKey != "") {
      //console.log(eventKey);
      setIdToDelete(-1);
      setErrorMessages({});
      setAdminLink(eventKey);
    }
  }

  const HandleDeleteUser = () => {
    //log({idToDelete});
    //console.log({imIdToDelete});
    deleteUser({ variables: { id: imIdToDelete } });
  }
  const HandleDeleteGroup = (event) => {
    event.preventDefault();
    deleteGroup({ variables: { id: idToDelete } })
  }
  const HandleDeleteRecommendation = (event) => {
    deleteRecommendation({ variables: { id: imIdToDelete } })
  }
  const HandleDeleteFeedback = (event) => {
    deleteFeedback({ variables: { id: imIdToDelete } })
  }
  const HandleDeleteGenre = (event) => {
    event.preventDefault();
    deleteGenre({ variables: { id: idToDelete } })
  }
  const HandleAddGenre = (event) => {
    event.preventDefault();
    setErrorMessages({});

    var { genre_name } = document.forms[1];

    const gamegenre = dataGameGenres.getGameGenres.find(g => g.name === genre_name.value);
    const filmgenre = dataFilmGenres.getFilmGenres.find(g => g.name === genre_name.value);

    if ((newIsForGame === "true" && gamegenre) || (newIsForGame === "false" && filmgenre)) {
      setErrorMessages({ name: "sameGenreNameExists", message: errors.sameGenreNameExists });
    } else {
      addGenre({ variables: { name: genre_name.value, isForGame: newIsForGame === "true" } });
    }
  }

  const [selectedGroups, setSelectedGroups] = useState([]);
  const [selectedFriends, setSelectedFriends] = useState([]);
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [selectedRating, setSelectedRating] = useState();

  const onGroupsChange = (selectedOptions) => setSelectedGroups(selectedOptions);
  const onFriendsChange = (selectedOptions) => setSelectedFriends(selectedOptions);
  const onGenresChange = (selectedOptions) => { setSelectedGenres(selectedOptions); }
  const onRatingChange = (selectedOption) => { setSelectedRating(selectedOption); }

  const HandleEmpty = (event) => {
    event.preventDefault();
  }

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

    setSelectedFriends([]);
    setSelectedGenres([]);
    setSelectedGroup([]);
    setToCreateRecommendation(false);
  }

  const HandleCreateFeedback = (event) => {
    event.preventDefault();
    var { commentary } = document.forms[0];
    getCreateFeedback({
      variables: {
        recommendationId: recToGiveFeedback,
        userId: dataUser.userIfCorrectPassword.id,
        state: feedbackersState.value,
        rating: myRating.value,
        commentary: commentary.value
      }
    });
    setFeedbackersState();
    setMyRating();
    setRecToGiveFeedback();
  }

  //HTML RETURN_FUNCTIONS/VARIABLES
  const renderErrorMessage = (name) =>
    name === errorMessages.name && (
      <div className="error">{errorMessages.message}</div>
    );

  const renderNav = (
    <Navbar bg="dark" variant="dark" expand="md" collapseOnSelect>
      {/*<Navbar.Brand href="#home">React-Bootstrap</Navbar.Brand>*/}
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="me-auto" variant="pills" defaultActiveKey={"recommendations"} onSelect={HandleNavigation}>
          <Nav.Link eventKey={"recommendations"}>Recommendations</Nav.Link>
          <Nav.Link eventKey={"friends"}>Friends</Nav.Link>
          <Nav.Link eventKey={"groups"}>Groups</Nav.Link>
          {(isEnteredCorrectPassword && dataUser.userIfCorrectPassword.isAdmin) ? (<Nav.Link eventKey={"admin"}>Administration</Nav.Link>) : (<></>)}
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  )

  const renderLoginForm = (
    <div className="login-form">
      <div className="title">Log In</div>
      <form onSubmit={(!loadingUser) ? (HandleLoginFormSubmit) : (HandleEmpty)}>
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
          <input type="submit" value={((!loadingUser) ? ("Submit") : ("Loading..."))} />
        </div>
      </form>
    </div>
  );

  const renderSigninForm = (
    <div className="SigninForm">
      <form onSubmit={(!loadingAddUser) ? (HandleSigninFormSubmit) : (HandleEmpty)}>
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
          <input type="submit" value={(!loadingAddUser) ? ("Submit") : ("Loading...")} />
        </div>
      </form>
    </div>
  );

  const renderRecommendationButton = (
    <div className='midPanel'>
      <Button className="recommendationButton" onClick={() => { setToCreateRecommendation(!toCreateRecommendation); setSelectedFriends([]); setSelectedGroups([]); }}>{(toCreateRecommendation) ? (<>Back to Recommendations</>) : (<>Create NEW Recommendation</>)}</Button>
    </div>
  )

  const renderCreateRecommendation = (
    <div>
      <h3>Create Recommendation</h3>
      <Button onClick={() => { setRecommendationForFilm(!recommendationForFilm); setSelectedGenres(); }}>{(recommendationForFilm) ? (<>Show form for game</>) : (<>Show form for movie</>)}</Button>
      <form id='createRecommendationForm' onSubmit={HandleCreateRecommendation}>
        <div className="input-container">
          <label>For Groups:</label>
          <Select isMulti onChange={onGroupsChange} options={(dataGroups) ? (dataGroups.getUsersGroups.map(group => ({ value: group.id, label: group.name }))) : (<></>)} />
        </div>
        <div className="input-container">
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
        <div className="input-container">
          <label>Your rating </label>
          <Select menuPlacement="top" id="rating" required onChange={onRatingChange} options={[
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
          (recommendationForFilm) ? (<></>) : (<div className="input-container">
            <label>Your progress (%)</label>
            <input type="number" name="progress" min="1" max="100" required />
          </div>)
        }
        <div className="input-container">
          <label>Genres:</label>
          {
            (recommendationForFilm) ? (
              <Select menuPlacement="top" key="filmGenresSelect" isMulti required onChange={onGenresChange} closeMenuOnSelect={false} options={(dataFilmGenres && !loadingFilmGenres) ? (dataFilmGenres.getFilmGenres.map(genre => ({ value: genre.id, label: genre.name }))) : (<></>)} />
            ) : (
              <Select menuPlacement="top" key="gameGenresSelect" isMulti required onChange={onGenresChange} closeMenuOnSelect={false} options={(dataGameGenres && !loadingGameGenres) ? (dataGameGenres.getGameGenres.map(genre => ({ value: genre.id, label: genre.name }))) : (<></>)} />
            )
          }
        </div>
        <div className="button-container">
          <input type="submit" value={"Submit"} />
        </div>
      </form>
    </div>
  )


  const [showRecDesc, setShowRecDesc] = useState({
    recid: -1,
    toShowDesc: false
  })

  const [showRecFeeds, setShowRecFeeds] = useState({
    recommendation: {
      id: -1,
      sender: {
        id: -1,
        username: ""
      },
      group: {
        id: -1,
        name: ""
      },
      receiver: {
        id: -1,
        username: ""
      },
      title: "",
      description: "",
      rating: 0,
      gameAddition: {
        progress: 0
      },
      postTime: -1,
      genres: [{
        id: -1,
        name: ""
      }],
      feedbacks: [{
        id: -1,
        user: {
          id: -1,
          username: ""
        },
        state: 0,
        rating: 0,
        commentary: ""
      }]
    },
    toShowFeeds: false
  })

  const renderRecFromMe = (rec) => (
    <Card>
      {(rec.description) ? (
        <Card.Header>
          <Nav variant="tabs" defaultActiveKey={"info"} onSelect={(eventKey) => { setShowRecDesc({ recid: rec.id, toShowDesc: eventKey === "description" }) }} >
            <Nav.Item>
              <Nav.Link eventKey="info" style={{ color: 'black' }}>Info</Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="description" style={{ color: 'black' }}>Description</Nav.Link>
            </Nav.Item>
          </Nav>
        </Card.Header>
      ) : (<></>)}
      <Card.Body>
        <Card.Title>{(rec.gameAddition) ? (<>Game </>) : (<></>)}Title: {rec.title}</Card.Title>
      </Card.Body>
      {(showRecDesc.recid === rec.id && showRecDesc.toShowDesc) ? (
        <Card.Body>
          <Card.Text>
            {rec.description}
          </Card.Text>
        </Card.Body>
      ) : (
        <ListGroup className="list-group-flush">
          <ListGroup.Item>To: {(rec.group) ? (rec.group.name + " (group)") : (rec.receiver.username)}</ListGroup.Item>
          <ListGroup.Item>My rating: {rec.rating}/10</ListGroup.Item>
          {(rec.gameAddition) ? (<ListGroup.Item>Percentage of played: {rec.gameAddition.progress * 100}</ListGroup.Item>) : (<></>)}
          <ListGroup.Item>Genres: {rec.genres.map(genre => <> {genre.name}</>)}</ListGroup.Item>
        </ListGroup>
      )
      }
      <Card.Footer>
        {(rec.group) ? (<>
          <Button onClick={() => { setShowRecFeeds({ recommendation: rec, toShowFeeds: true }) }}>Show Feedbacks</Button>
          <Offcanvas show={showRecFeeds.toShowFeeds} onHide={() => setShowRecFeeds({ recommendation: rec, toShowFeeds: false })}>
            <Offcanvas.Header closeButton>
              <Offcanvas.Title>{showRecFeeds.recommendation.title}</Offcanvas.Title>
            </Offcanvas.Header>
            <Offcanvas.Body>
              {showRecFeeds.recommendation.feedbacks.map(feed =>
                <Card style={{ width: '100%' }}>
                  <Card.Header>{feed.user.username} {(feed.user.id === dataUser.userIfCorrectPassword.id) ? (<>(me)</>) : (<></>)}</Card.Header>
                  <ListGroup variant="flush">
                    <ListGroup.Item>state: {feed.state}</ListGroup.Item>
                    <ListGroup.Item>rating: {feed.rating}</ListGroup.Item>
                    {(feed.commentary) ? (<ListGroup.Item>{feed.commentary}</ListGroup.Item>) : (<></>)}
                  </ListGroup>
                </Card>)}
            </Offcanvas.Body>
          </Offcanvas></>) :
          ((rec.feedbacks.length > 0) ? (<>
            <h5>Feedback:</h5>
            <p>state: {rec.feedbacks[0].state}<br />rating: {rec.feedbacks[0].rating}<br />
              {(rec.feedbacks[0].commentary) ? (<>{rec.feedbacks[0].commentary}</>) : (<></>)}</p>
          </>) : (<>No Feedback Yet</>))}

      </Card.Footer>
    </Card>
  )

  const [recToGiveFeedback, setRecToGiveFeedback] = useState();
  const [recToShowFeedbacks, setRecToShowFeedbacks] = useState();
  const [feedbackersState, setFeedbackersState] = useState();
  const [myRating, setMyRating] = useState();

  const onMyRatingChange = (selectedOption) => { setMyRating(selectedOption); }
  const onFeedbackersStateChange = (selectedOption) => { setFeedbackersState(selectedOption); }

  const renderFeedbackForm = (
    <form id='feedbackForm' onSubmit={(!loadingCreateFeedback) ? (HandleCreateFeedback) : (HandleEmpty)}>
      <div className="input-container">
        <label>My rating </label>
        <Select id="rating" required onChange={onMyRatingChange} options={[
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
      <div className="input-container">
        <label>My state</label>
        <Select id="state" required onChange={onFeedbackersStateChange} options={[
          { value: "INTEREST", label: "It looks interesting" },
          { value: "DISINTEREST", label: "It's not interesting for me" },
          { value: "SEEN_OR_PLAYED", label: "I have seen or played it already" }
        ]} />
      </div>
      <div className="input-container">
        <label>Commentary </label>
        <textarea name="commentary"></textarea>
      </div>
      <div className="button-container">
        <input type="submit" value={(!loadingCreateFeedback) ? ("Submit") : ("Loading..")} />
      </div>
    </form>
  )


  const renderRecToMe = (rec, haveReacted) => (
    <Card>
      {(rec.description) ? (
        <Card.Header>
          <Nav variant="tabs" defaultActiveKey={"info"} onSelect={(eventKey) => { setShowRecDesc({ recid: rec.id, toShowDesc: eventKey === "description" }) }} >
            <Nav.Item>
              <Nav.Link eventKey="info" style={{ color: 'black' }}>Info</Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="description" style={{ color: 'black' }}>Description</Nav.Link>
            </Nav.Item>
          </Nav>
        </Card.Header>
      ) : (<></>)}
      <Card.Body>
        <Card.Title>{(rec.gameAddition) ? (<>Game </>) : (<></>)}Title: {rec.title}</Card.Title>
      </Card.Body>
      {(showRecDesc.recid === rec.id && showRecDesc.toShowDesc) ? (
        <Card.Body>
          <Card.Text>
            {rec.description}
          </Card.Text>
        </Card.Body>
      ) : (
        <ListGroup className="list-group-flush">
          <ListGroup.Item>{(rec.group) ? (<>Group: {rec.group.name} ({rec.sender.username})</>) : (<>From: {rec.sender.username}</>)}</ListGroup.Item>
          <ListGroup.Item>Sender rating: {rec.rating}/10</ListGroup.Item>
          {(rec.gameAddition) ? (<ListGroup.Item>Percentage of played: {rec.gameAddition.progress * 100}</ListGroup.Item>) : (<></>)}
          <ListGroup.Item>Genres: {rec.genres.map(genre => <> {genre.name}</>)}</ListGroup.Item>
        </ListGroup>
      )
      }
      <Card.Footer>
        {(haveReacted) ?
          ((rec.group) ? (
            <>
              <Button onClick={() => { setShowRecFeeds({ recommendation: rec, toShowFeeds: true }) }}>Show Feedbacks</Button>
              <Offcanvas show={showRecFeeds.toShowFeeds} onHide={() => setShowRecFeeds({ recommendation: showRecFeeds.recommendation, toShowFeeds: false })}>
                <Offcanvas.Header closeButton>
                  <Offcanvas.Title>{showRecFeeds.recommendation.title}</Offcanvas.Title>
                </Offcanvas.Header>
                <Offcanvas.Body>
                  {showRecFeeds.recommendation.feedbacks.map(feed =>
                    <Card style={{ width: '100%' }}>
                      <Card.Header>{feed.user.username} {(feed.user.id === dataUser.userIfCorrectPassword.id) ? (<>(me)</>) : (<></>)}</Card.Header>
                      <ListGroup variant="flush">
                        <ListGroup.Item>state: {feed.state}</ListGroup.Item>
                        <ListGroup.Item>rating: {feed.rating}</ListGroup.Item>
                        {(feed.commentary) ? (<ListGroup.Item>{feed.commentary}</ListGroup.Item>) : (<></>)}
                      </ListGroup>
                      {(feed.user.id === dataUser.userIfCorrectPassword.id) ? (
                        <Card.Footer>
                          <Button onClick={() => { imIdToDelete = feed.id; HandleDeleteFeedback(); }}>Delete My Feedback</Button>
                        </Card.Footer>) : (<></>)}
                    </Card>)}
                </Offcanvas.Body>
              </Offcanvas>
            </>) : (
            <>
              <h5>My Feedback:</h5>
              <p>state: {rec.feedbacks[0].state}<br />rating: {rec.feedbacks[0].rating}<br />
                {(rec.feedbacks[0].commentary) ? (<>{rec.feedbacks[0].commentary}</>) : (<></>)}</p>
              <Button onClick={() => { imIdToDelete = rec.feedbacks[0].id; HandleDeleteFeedback(); setShowRecFeeds({ recommendation: showRecFeeds.rec, toShowFeeds: false }) }}>Delete My Feedback</Button>
            </>
          )) :
          (<div>
            {(rec.id === recToGiveFeedback) ? (renderFeedbackForm) : (<Button variant='danger' onClick={() => setRecToGiveFeedback(rec.id)}>Create Feedback</Button>)}
          </div>)}
      </Card.Footer>
    </Card>
  )

  const { ValueContainer, Placeholder } = components;
  const CustomValueContainer = ({ children, ...props }) => {
    return (
      <ValueContainer {...props}>
        <Placeholder {...props} isFocused={props.isFocused}>
          {props.selectProps.placeholder}
        </Placeholder>
        {React.Children.map(children, child =>
          child && child.type !== Placeholder ? child : null
        )}
      </ValueContainer>
    );
  };

  const renderShowRecommendations = (
    <>
      <div>
        <Button onClick={() => setToReloadRecommendations(true)}>{(loadingRecommendations) ? (<>Loading...</>) : (<>Reload Recommendations</>)}</Button>
      </div>

      <div className='holderHorizontalGap'>
        <Select
          components={{
            ValueContainer: CustomValueContainer
          }}
          placeholder="Group"
          styles={{
            container: (provided, state) => ({
              ...provided,
              marginTop: 25
            }),
            valueContainer: (provided, state) => ({
              ...provided,
              overflow: "visible"
            }),
            placeholder: (provided, state) => ({
              ...provided,
              position: "absolute",
              top: state.hasValue || state.selectProps.inputValue ? -27 : "50%",
              transition: "top 0.1s, font-size 0.1s",
              fontSize: (state.hasValue || state.selectProps.inputValue) && 16
            })
          }}
          defaultValue={{ value: -1, label: "No selected group" }}
          onChange={(eventKey) => setShowRecsGroup(eventKey.value)}
          options={(dataGroups) ? ([{ value: -1, label: "No selected group" }].concat(dataGroups.getUsersGroups.map(group => ({ value: group.id, label: group.name })))) : (<></>)} />
        <Select
          components={{
            ValueContainer: CustomValueContainer
          }}
          placeholder="From Friend"
          styles={{
            container: (provided, state) => ({
              ...provided,
              marginTop: 25
            }),
            valueContainer: (provided, state) => ({
              ...provided,
              overflow: "visible"
            }),
            placeholder: (provided, state) => ({
              ...provided,
              position: "absolute",
              top: state.hasValue || state.selectProps.inputValue ? -27 : "50%",
              transition: "top 0.1s, font-size 0.1s",
              fontSize: (state.hasValue || state.selectProps.inputValue) && 16
            })
          }}
          defaultValue={{ value: -1, label: "No selected friend" }}
          onChange={(eventKey) => setShowRecsFromFriend(eventKey.value)}
          options={(dataFriends) ? ([{ value: -1, label: "No selected friend" }, { value: dataUser.userIfCorrectPassword.id, label: dataUser.userIfCorrectPassword.username + " (me)" }].concat(dataFriends.getFriends.map(friend => ({ value: friend.id, label: friend.username })))) : (<></>)} />
        <Select
          components={{
            ValueContainer: CustomValueContainer
          }}
          placeholder="To Friend"
          styles={{
            container: (provided, state) => ({
              ...provided,
              marginTop: 25
            }),
            valueContainer: (provided, state) => ({
              ...provided,
              overflow: "visible"
            }),
            placeholder: (provided, state) => ({
              ...provided,
              position: "absolute",
              top: state.hasValue || state.selectProps.inputValue ? -27 : "50%",
              transition: "top 0.1s, font-size 0.1s",
              fontSize: (state.hasValue || state.selectProps.inputValue) && 16
            })
          }}
          defaultValue={{ value: -1, label: "No selected friend" }}
          onChange={(eventKey) => setShowRecsToFriend(eventKey.value)}
          options={(dataFriends) ? ([{ value: -1, label: "No selected friend" }, { value: dataUser.userIfCorrectPassword.id, label: dataUser.userIfCorrectPassword.username + " (me)" }].concat(dataFriends.getFriends.map(friend => ({ value: friend.id, label: friend.username })))) : (<></>)} />
      </div>
      <h3>Recommendations:</h3>
      <Container>
        <Row xs={1} md={2} lg={3} className="g-4">
          {
            (loadingRecommendations || !dataRecommendations) ? (<p>Loading...</p>) : ((errorRecommendations) ? (<p>Error : {errorRecommendations.message}</p>) : (dataRecommendations.getUsersRecommendations.filter(rec => showRecsGroup === -1 || (rec.group && rec.group.id === showRecsGroup)).filter(rec => showRecsFromFriend === -1 || (rec.sender.id === showRecsFromFriend && !rec.group)).filter(rec => showRecsToFriend === -1 || (rec.receiver && rec.receiver.id === showRecsToFriend)).map(rec =>
              <Col>
                {(rec.sender.id === dataUser.userIfCorrectPassword.id) ? (renderRecFromMe(rec)) : (renderRecToMe(rec, rec.feedbacks.find(fb => fb.user.id === dataUser.userIfCorrectPassword.id)))}
              </Col>
            )))
          }
        </Row>
      </Container>
    </>
  )

  const renderRecommendations = (
    <div className='part'>
      <div className='midPanel'>{(toCreateRecommendation) ? (renderCreateRecommendation) : (renderShowRecommendations)}</div>
    </div>
  )

  const renderFriendsForms = (
    <div className='midPanel'>
      <h4>Manage Your Friends</h4>
      <div className='holderBiggerHorizontalGap'>
        <div className="addFriendForm">
          <form onSubmit={(!loadingAddFriend) ? (HandleAddFriend) : (HandleEmpty)}>
            <label>add user: </label>
            <input type="text" name="username" required />
            {renderErrorMessage("noSuchUser")}
            {renderErrorMessage("yourUsername")}
            {renderErrorMessage("alreadyYourFriend")}
            <div className="button-container">
              <input type="submit" value={(!loadingAddFriend) ? ("Submit") : ("Loading")} />
            </div>
          </form>
        </div>
        <div className="removeFriendForm">
          <form onSubmit={(!loadingRemoveFriend) ? (HandleRemoveFriend) : (HandleEmpty)}>
            <label>remove friend: </label>
            <input type="text" name="username" required />
            {renderErrorMessage("notYourFriend")}
            <div className="button-container">
              <input type="submit" value={(!loadingRemoveFriend) ? ("Submit") : ("Loading")} />
            </div>
          </form>
        </div>
      </div>
    </div>
  )

  const renderFriends = (
    <div className='part'>
      <div className='midPanel'>
        <h3>Your Friends:</h3>
        {
          (loadingFriends || !dataFriends) ? (<p>Loading...</p>) : ((errorFriends) ? (<p>Error : {errorFriends.message}</p>) : (dataFriends.getFriends.map(user =>
            <p>{user.username}</p>
          )))
        }
      </div>
    </div>
  )

  const renderAllGroups = (
    <div>
      <h3>Your Groups:</h3>
      <div className='holderHorizontalGap'>
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
      <div className='holderHorizontalGap'>
        <Button className="backToAllGroups" onClick={() => setSelectedGroup("")}>&#60; back to all groups</Button>
        <Button variant='danger' className="leaveGroup" onClick={HandleLeaveGroup}>Leave group</Button>
      </div>
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
    <div className='midPanel'>
      <h4>Create new group</h4>
      <form onSubmit={(!loadingCreateGroup) ? (HandleCreateGroup) : (HandleEmpty)}>
        <label>name of your new group: </label>
        <input type="text" name="groupname" required />
        {renderErrorMessage("existingGroup")}
        <div className="button-container">
          <input type="submit" value={(!loadingCreateGroup) ? ("Submit") : ("Loading")} />
        </div>
      </form>
    </div>
  )

  const renderAddUserToGroup = (
    <div className='midPanel'>
      <h4>Add User To Group</h4>
      <div className="addUserToGroupForm">
        <form onSubmit={(!loadingAddUserToGroup) ? (HandleAddUserToGroup) : (HandleEmpty)}>
          <div className='input-container'>
            <label>
              Pick your friend:
              <div style={{ color: "black" }}>
                <Select menuPlacement="auto" required id="addFriendToThisGroupSelect" onChange={(eventKey) => { setSelectedFriend(eventKey.value) }} options=
                  {
                    (loadingFriends || !dataFriends) ? (<></>) : (dataFriends.getFriends.map(user => ({ value: user.id, label: user.username })))
                  }
                />
              </div>
            </label>
          </div>
          {renderErrorMessage("alreadyInGroup")}
          <div className="button-container">
            <input type="submit" value={(!loadingAddUserToGroup) ? ("Submit") : ("Loading")} />
          </div>
        </form>
      </div>
    </div>
  )

  const renderGroups = (
    <div className="part">
      <div className='midPanel'>{(selectedGroup === "") ? (renderAllGroups) : (renderSelectedGroup)}</div>
    </div>
  )

  const renderAdminUsers = (
    <div className='midPanel'>
      <h3>Add admin:</h3>
      <form onSubmit={(!loadingAddAdmin) ? (HandleAddAdminSubmit) : (HandleEmpty)}>
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
        <div>
          <input type="submit" value={(!loadingAddAdmin) ? ("Submit") : ("Loading...")} />
        </div>
      </form>
      <h3>Show All Users:</h3>
      {
        (loadingAllUsers || !dataAllUsers) ? (<p>Loading...</p>) : ((errorAllUsers) ? (<p>Error : {errorAllUsers.message}</p>) : (dataAllUsers.getAllUsers.map(user =>
          <p>ID: {user.id}, username: {user.username}, password: {user.password}, isAdmin: {(user.isAdmin) ? (<>true</>) : (<>false</>)},       {<Button onClick={(!loadingDeleteUser) ? (() => { imIdToDelete = user.id; HandleDeleteUser(); }) : (HandleEmpty)}>{(!loadingDeleteUser) ? (<>Delete</>) : (<>Wait</>)}</Button>}</p>
        )))
      }
    </div>
  )

  const renderAdminGenres = (
    <div className='midPanel'>
      <form onSubmit={(!loadingDeleteGenre) ? (HandleDeleteGenre) : (HandleEmpty)}>
        <div>
          <label>Genre to delete: <Select required onChange={(eventKey) => setIdToDelete(eventKey.value)} options={
            (dataGameGenres && dataFilmGenres)
              ? ([
                {
                  label: "Game Genres",
                  options: dataGameGenres.getGameGenres.map(genre => ({ value: genre.id, label: genre.name }))
                },
                {
                  label: "Movie Genres",
                  options: dataFilmGenres.getFilmGenres.map(genre => ({ value: genre.id, label: genre.name }))
                }
              ])
              : (<></>)} /></label>
          <input type="submit" value={((!loadingDeleteGenre) ? ("Submit") : ("Loading..."))} />
        </div>
      </form>
      <form onSubmit={(!loadingAddGenre) ? (HandleAddGenre) : (HandleEmpty)}>
        <div>
          Add Genre:
          <label><input
            type="radio"
            name="isForGame"
            value="false"
            id="isForMovie"
            onChange={() => setNewIsForGame("false")}
            checked={newIsForGame === "false"}
          />is for movie</label>
          <label><input
            type="radio"
            name="isForGame"
            value="true"
            id="isForGame"
            onChange={() => setNewIsForGame("true")}
            checked={newIsForGame === "true"}
          />is for game</label>
          <label>name:
            <input type="text" name="genre_name" required /></label>
          <input type="submit" value={((!loadingAddGenre) ? ("Submit") : ("Loading..."))} />
          {renderErrorMessage("sameGenreNameExists")}
        </div>
      </form>
      <h3>Game Genres:</h3>
      {
        (loadingGameGenres || !dataGameGenres) ? (<p>Loading...</p>) : ((errorGameGenres) ? (<p>Error : {errorGameGenres.message}</p>) : (dataGameGenres.getGameGenres.map(genre =>
          <p>ID: {genre.id}, name: {genre.name}</p>
        )))
      }
      <h3>Movie Genres:</h3>
      {
        (loadingFilmGenres || !dataFilmGenres) ? (<p>Loading...</p>) : ((errorFilmGenres) ? (<p>Error : {errorFilmGenres.message}</p>) : (dataFilmGenres.getFilmGenres.map(genre =>
          <p>ID: {genre.id}, name: {genre.name}</p>
        )))
      }
    </div>
  )

  const renderAdminGroups = (
    <div className='midPanel'>
      <form onSubmit={(!loadingDeleteGenre) ? (HandleDeleteGroup) : (HandleEmpty)}>
        <div>
          <label>Group to delete: <Select required onChange={(eventKey) => setIdToDelete(eventKey.value)} options={
            (dataAllGroups)
              ? (dataAllGroups.getAllGroups.map(group =>
                ({ value: group.id, label: group.name })))
              : (<></>)} /></label>
          <input type="submit" value={((!loadingDeleteGroup) ? ("Submit") : ("Loading..."))} />
        </div>
      </form>
      <h3>All Groups:</h3>
      {(dataAllGroups && dataAllMembers)
        ? (dataAllGroups.getAllGroups.map(group =>
          <div><h5>ID: {group.id}, name: {group.name}, members:</h5>
            {dataAllMembers.getAllMembers.filter(member => member.group.id == group.id).map(member => <>member id: {member.user.id}, member username: {member.user.username}, <br /></>)}
          </div>
        ))
        : (<>loading...</>)}
    </div>
  )

  const renderAdminRecommendations = (
    <div className='midPanel'>
      <h3>Recommendations:</h3>
      {
        (loadingAllRecommendations || !dataAllRecommendations) ? (<p>Loading...</p>) : ((errorAllRecommendations) ? (<p>Error : {errorAllRecommendations.message}</p>) : (dataAllRecommendations.getAllRecommendations.map(rec =>
          <div>
            <p>----</p>
            <h4>{(rec.gameAddition) ? (<>Game </>) : (<></>)}Title: {rec.title}</h4>
            {(rec.description) ? (<p>Description: {rec.description}</p>) : (<></>)}
            From: {rec.sender.username}<br />
            To: {(rec.group) ? (rec.group.name + " (group)") : (rec.receiver.username)}<br />
            Sender rating: {rec.rating}/10<br />
            {(rec.gameAddition) ? (<p>Percentage of played: {rec.gameAddition.progress * 100}</p>) : (<></>)}
            Genres: {rec.genres.map(genre => <> {genre.name}</>)}<br />
            <Button onClick={() => { imIdToDelete = rec.id; HandleDeleteRecommendation(); }}>{(!loadingDeleteRecommendation) ? (<>Delete</>) : (<>WAIT</>)}</Button>
            {rec.feedbacks.map(fb =>
              <div>
                <h5>Feedback: </h5>
                <p>From: {fb.user.username}, Feedbacker's state: {fb.state}, Rating: {fb.rating}<br />
                  Commentary: {fb.commentary}<br />
                </p>
                <Button onClick={() => { imIdToDelete = rec.id; HandleDeleteFeedback(); }}>{(!loadingDeleteFeedback) ? (<>Delete</>) : (<>WAIT</>)}</Button>
              </div>
            )}
            <p>----</p>
          </div>
        )))
      }
    </div>
  )

  const renderReloadAdminInfo = (
    <Button className="admininstartionButton" onClick={() => setToReloadAdministrationInfo(!toReloadAdministrationInfo)}>{(toReloadAdministrationInfo) ? (<>WAIT</>) : (<>Reload Administration Info</>)}</Button>
  )

  const renderAdmin = (
    <div className='part'>
      <Navbar bg="dark" variant="dark" expand="md">
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto" variant="pills" defaultActiveKey={"users"} onSelect={HandleAdminNavigation}>
            <Nav.Link eventKey={"users"}>Users</Nav.Link>
            <Nav.Link eventKey={"genres"}>Genres</Nav.Link>
            <Nav.Link eventKey={"groups"}>Groups</Nav.Link>
            <Nav.Link eventKey={"recommendations"}>Recommendations</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Navbar>
      {(adminLink === "users")
        ? (renderAdminUsers)
        : ((adminLink === "genres")
          ? (renderAdminGenres)
          : ((adminLink === "groups")
            ? (renderAdminGroups)
            : (renderAdminRecommendations)))}
    </div>
  )

  const renderUserIsLoginComponent = (
    <div key="userIsLoginComponent" className="user-is-login">
      {(link === "" || link === "recommendations")
        ? (renderRecommendations)
        : ((link === "friends")
          ? (renderFriends)
          : ((link === "groups")
            ? (renderGroups)
            : (renderAdmin)))}
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
    if (isEnteredPassword && isEnteredCorrectPassword && !loadingAllUsers && !dataAllUsers && dataUser.userIfCorrectPassword.isAdmin) {
      getAllUsers();
      getAllGroups();
      getAllRecommendation();
      getAllMembers();
    }
    if (toReloadAdministrationInfo) {
      refetchAllGroups();
      refetchAllMembers();
      refetchAllRecommendations();
      refetchAllUsers();
      refetchFilmGenres();
      refetchGameGenres();
      setToReloadAdministrationInfo(false);
    }
    if (toReloadGroups && !loadingCreateGroup && !loadingLeaveGroup) {
      setToReloadGroups(false);

      if ((dataCreateGroup && dataCreateGroup.createGroup) || (leftGroup)) {
        refetchGroups({ id: dataUser.userIfCorrectPassword.id });
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
      <div className="mainPanel">
        {(isEnteredPassword && isEnteredCorrectPassword) ? (renderUserIsLoginComponent) : (renderLoginForm)}
      </div>
    )
  }
  else {
    //console.log("signin form");
    toReturn = (
      <div className='mainPanel'>
        <div className="signin-form">
          <div className="title">Sign In</div>
          {(isSignin) ? <div>User is successfully signed in</div> : (renderSigninForm)}
        </div>
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
      {toReturn}
      <div className='bottomPanel'>{
        ((isEnteredPassword && isEnteredCorrectPassword)) ?
          ((link === "" || link === "recommendations") ?
            (renderRecommendationButton) :
            ((link === "friends") ?
              (renderFriendsForms) :
              ((link === "groups")) ?
                ((selectedGroup === "") ?
                  (renderCreateGroup) :
                  (renderAddUserToGroup)) :
                (renderReloadAdminInfo))) :
          (<></>)}</div>
    </div>
  )
}

const App = () => {
  return (
    <InitialData />
  )
}
export default App;