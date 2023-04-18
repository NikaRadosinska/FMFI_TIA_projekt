package com.example.demo.controllers;

import com.example.demo.model.*;
import org.springframework.graphql.data.method.annotation.Argument;
import org.springframework.graphql.data.method.annotation.MutationMapping;
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

    @MutationMapping
    public boolean createRecommendation(@Argument int sender, @Argument Integer groupid, @Argument Integer receiver, @Argument String title,@Argument String description, @Argument int rating, @Argument Float progress, @Argument List<Integer> genresids){
        return Recommendation.createRecommendation(sender, groupid, receiver, title, description, rating, progress, genresids);
    }

    @QueryMapping
    public List<Genre> getFilmGenres(){
        return Genre.getFilmGenres();
    }
    @QueryMapping
    public List<Genre> getGameGenres(){
        return Genre.getGameGenres();
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
        return recommendation.isForFilm() ? Genre.getFilmGenres(recommendation.getGenres()) : Genre.getGameGenres(recommendation.getGenres());
    }

}
