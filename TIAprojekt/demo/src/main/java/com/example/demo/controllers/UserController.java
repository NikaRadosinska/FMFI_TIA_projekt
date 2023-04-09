package com.example.demo.controllers;

import com.example.demo.model.Author;
import com.example.demo.model.Friends;
import org.springframework.graphql.data.method.annotation.Argument;
import org.springframework.graphql.data.method.annotation.MutationMapping;
import org.springframework.graphql.data.method.annotation.QueryMapping;
import org.springframework.graphql.data.method.annotation.SchemaMapping;
import org.springframework.stereotype.Controller;
import com.example.demo.model.User;

import java.util.*;

@Controller
public class UserController {
    @QueryMapping
    public List<String> getAllUsernames(){
        return User.getAllUserNames();
    }

    @QueryMapping
    public User userIfCorrectPassword(@Argument String username, @Argument String password){
        return User.userIfCorrectPassword(username, password);
    }

    @MutationMapping
    public User addUser(@Argument String username, @Argument String password){
        return User.addUser(username,password);
    }

    @MutationMapping
    public User addAdmin(@Argument String username, @Argument String password){
        return User.addAdmin(username,password);
    }

}
