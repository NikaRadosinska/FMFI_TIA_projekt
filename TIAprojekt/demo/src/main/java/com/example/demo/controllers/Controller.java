package com.example.demo.controllers;

import com.example.demo.enums.FeedbackerState;
import com.example.demo.model.*;
import com.example.demo.services.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.graphql.data.method.annotation.Argument;
import org.springframework.graphql.data.method.annotation.MutationMapping;
import org.springframework.graphql.data.method.annotation.QueryMapping;
import org.springframework.graphql.data.method.annotation.SchemaMapping;
import org.springframework.web.bind.annotation.CrossOrigin;

import java.util.Arrays;
import java.util.List;

@CrossOrigin(maxAge = 3600)
@org.springframework.stereotype.Controller
public class Controller {

    public static Controller controller;

    @Autowired
    private FeedbacksService feedbacksService;
    @Autowired
    private GenreService genreService;
    @Autowired
    private FriendsService friendsService;
    @Autowired
    private GameAdditionService gameAdditionService;
    @Autowired
    private GroupService groupService;
    @Autowired
    private MemberService memberService;
    @Autowired
    private RecommendationService recommendationService;
    @Autowired
    private UsersService usersService;

    public Controller(FeedbacksService feedbacksService, GenreService genreService, FriendsService friendsService, GameAdditionService gameAdditionService, GroupService groupService, MemberService memberService, RecommendationService recommendationService, UsersService usersService) {
        this.feedbacksService = feedbacksService;
        this.genreService = genreService;
        this.friendsService = friendsService;
        this.gameAdditionService = gameAdditionService;
        this.groupService = groupService;
        this.memberService = memberService;
        this.recommendationService = recommendationService;
        this.usersService = usersService;
        controller = this;
    }

    public void InitialData(){
        addAdmin("admin", "admin123");
        addUser("userOne", "userOnePassword");
        resetGenres();
    }

    @MutationMapping
    public boolean resetGenres(){
        genreService.resetGenres();
        return true;
    }
    @QueryMapping
    public List<UserInfo> getFriends(@Argument int id){
        return friendsService.getFriendsUsernames(usersService.getUserById(id));
    }
    @MutationMapping
    public boolean addFriend(@Argument int id, @Argument String username){
        return friendsService.addFriend(usersService.getUserById(id), usersService.getUserByUsername(username));
    }
    @MutationMapping
    public boolean removeFriend(@Argument int id, @Argument String username){
        return friendsService.removeFriend(usersService.getUserById(id), usersService.getUserByUsername(username));
    }
    @QueryMapping
    public List<Group> getUsersGroups(@Argument int id){
        return memberService.getUsersGroups(usersService.getUserById(id));
    }
    @QueryMapping
    public List<UserInfo> getMembersOfGroup(@Argument int id){
        return memberService.getMembersOfGroup(groupService.getGroupById(id));
    }
    @MutationMapping
    public boolean addUserToGroup(@Argument int userid, @Argument int groupid){
        return memberService.addUserToGroup(usersService.getUserById(userid), groupService.getGroupById(groupid));
    }
    @MutationMapping
    public boolean createGroup(@Argument int id, @Argument String groupname){
        Group g = groupService.createGroup(groupname);
        if(g == null) return false;
        return memberService.addUserToGroup(usersService.getUserById(id), g);
    }
    @MutationMapping
    public boolean leaveGroup(@Argument int userid, @Argument int groupid){
        Group g = memberService.leaveGroup(usersService.getUserById(userid), groupService.getGroupById(groupid));
        if(g == null) return true;
        groupService.deleteGroup(g.getId());
        return true;
    }
    @QueryMapping
    public List<Recommendation> getUsersRecommendations(@Argument int id){
        User u = usersService.getUserById(id);
        return recommendationService.getUsersRecommendations(u, memberService.getUsersGroups(u));
    }
    @MutationMapping
    public boolean createRecommendation(@Argument int sender, @Argument Integer groupid, @Argument Integer receiver, @Argument String title,@Argument String description, @Argument int rating, @Argument Float progress, @Argument List<Integer> genresids){
        Recommendation r = recommendationService.createRecommendation(usersService.getUserById(sender), (groupid != null) ? (groupService.getGroupById(groupid)) : (null), (receiver != null) ? (usersService.getUserById(receiver)) : (null), title, description, rating, null, genresids);
        GameAddition ga = (progress != null) ? (gameAdditionService.createGameAddition(progress, r)) : (null);
        r.setGameAddition(ga);
        return true;
    }
    @MutationMapping
    public boolean createFeedback(@Argument int userId, @Argument FeedbackerState state, @Argument int rating, @Argument String commentary, @Argument int recommendationId){
        int feedbackId = feedbacksService.createFeedback(usersService.getUserById(userId), state, rating, commentary,recommendationService.getRecommendationById(recommendationId));
        return true;
    }
    @QueryMapping
    public List<Genre> getFilmGenres(){
        return genreService.getFilmGenres();
    }
    @QueryMapping
    public List<Genre> getGameGenres(){
        return genreService.getGameGenres();
    }
    @QueryMapping
    public List<String> getAllUsernames(){
        return usersService.getAllUserNames();
    }
    @QueryMapping
    public User userIfCorrectPassword(@Argument String username, @Argument String password){
        return usersService.userIfCorrectPassword(username, password);
    }
    @MutationMapping
    public User addUser(@Argument String username, @Argument String password){
        return usersService.addUser(username,password, false);
    }
    @MutationMapping
    public User addAdmin(@Argument String username, @Argument String password){
        return usersService.addUser(username,password,true);
    }

    @QueryMapping
    public List<User> getAllUsers(){
        return usersService.getAllUsers();
    }

    @QueryMapping
    public List<Group> getAllGroups(){
        return groupService.getAllGroups();
    }

    @QueryMapping
    public List<Member> getAllMembers(){
        return memberService.getAllMembers();
    }

    @QueryMapping
    public List<Recommendation> getAllRecommendations(){
        return recommendationService.getAllRecommendations();
    }

    @MutationMapping
    public boolean deleteUserById(@Argument int id){
        return usersService.deleteUserById(id);
    }
    @MutationMapping
    public boolean deleteGroupById(@Argument int id){
        return groupService.deleteGroupById(id);
    }
    @MutationMapping
    public boolean deleteRecommendationById(@Argument int id){
        return recommendationService.deleteRecommendationById(id);
    }
    @MutationMapping
    public boolean deleteFeedbackById(@Argument int id){
        feedbacksService.deleteFeedbackById(id);
        return true;
    }
    @MutationMapping
    public boolean deleteGenreById(@Argument int id){
        recommendationService.deleteGenreById(id);
        return genreService.deleteGenreById(id);
    }
    @MutationMapping
    public Genre addGenre(@Argument String name, @Argument boolean isForGame){
        return genreService.addGenre(name, isForGame);
    }

    @MutationMapping
    public Genre changeNameOfGenre(@Argument int id, @Argument String name){
        return genreService.changeGenreName(id, name);
    }

    @SchemaMapping
    public List<Genre> genres(Recommendation recommendation){
        return genreService.getGenres(Arrays.asList(recommendation.getGenres()));
    }
}
