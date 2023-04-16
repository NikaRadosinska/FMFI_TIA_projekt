package com.example.demo.controllers;

import com.example.demo.model.*;
import org.springframework.graphql.data.method.annotation.Argument;
import org.springframework.graphql.data.method.annotation.QueryMapping;
import org.springframework.graphql.data.method.annotation.SchemaMapping;
import org.springframework.stereotype.Controller;

import java.util.List;

@Controller
public class RecommendationController {

    @QueryMapping
    public List<Recommendation> getUsersRecommendations(@Argument int id){
        return Recommendation.getUsersRecommendations(id);
    }

    @SchemaMapping
    public UserInfo sender(Recommendation recommendation){
        return User.getById(recommendation.getSender()).getUserInfo();
    }
    @SchemaMapping
    public Group group(Recommendation recommendation){
        return (recommendation.getGroup() == null) ? (null) : (Group.getById(recommendation.getGroup()));
    }
    @SchemaMapping
    public UserInfo receiver(Recommendation recommendation){
        return (recommendation.getReceiver() == null) ? (null) : (User.getById(recommendation.getReceiver()).getUserInfo());
    }
    @SchemaMapping
    public List<Genre> genres(Recommendation recommendation) {
        return Genre.getGenres(recommendation.getGenres());
    }

}
