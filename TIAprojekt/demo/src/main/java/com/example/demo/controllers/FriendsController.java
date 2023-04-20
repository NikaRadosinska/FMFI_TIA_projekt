package com.example.demo.controllers;

import com.example.demo.model.Friends;
import com.example.demo.model.UserInfo;
import org.springframework.graphql.data.method.annotation.Argument;
import org.springframework.graphql.data.method.annotation.MutationMapping;
import org.springframework.graphql.data.method.annotation.QueryMapping;
import org.springframework.graphql.data.method.annotation.SchemaMapping;
import org.springframework.stereotype.Controller;
import com.example.demo.model.User;
import org.springframework.web.bind.annotation.CrossOrigin;

import java.util.*;

@CrossOrigin(maxAge = 3600)
@Controller
public class FriendsController {
    @QueryMapping
    public List<UserInfo> getFriends(@Argument int id){
        return Friends.getFriendsUsernames(id);
    }

    @SchemaMapping
    public User userOne(Friends friend) {
        return User.getById(friend.getId1());
    }
    @SchemaMapping
    public User userTwo(Friends friend) {
        return User.getById(friend.getId2());
    }

    @MutationMapping
    public boolean addFriend(@Argument int id, @Argument String username){
        return Friends.addFriend(id, username);
    }
    @MutationMapping
    public boolean removeFriend(@Argument int id, @Argument String username){
        return Friends.removeFriend(id, username);
    }
}
