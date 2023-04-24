package com.example.demo.model;

import org.springframework.graphql.data.method.annotation.Argument;
import org.springframework.lang.Nullable;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Comparator;
import java.util.List;
import java.util.function.UnaryOperator;

public class Recommendation {
    private int id;
    private int sender;
    private Integer group;
    private Integer receiver;
    private String title;
    private String description;
    private int rating;
    private GameAddition gameAddition;
    private LocalDateTime postTime;
    private List<Integer> genres;

    public List<Integer> getFeedbacks() {
        return feedbacks;
    }

    private List<Integer> feedbacks;

    public int getSender(){
        return sender;
    }

    public Integer getGroup() {
        return group;
    }

    public Integer getReceiver() {
        return receiver;
    }

    public List<Integer> getGenres(){
        return genres;
    }

    public boolean isForFilm(){
        return gameAddition == null;
    }

    public Recommendation(int id, int sender, @Nullable Integer group,@Nullable Integer receiver, String title,@Nullable String description, int rating, @Nullable GameAddition gameAddition, List<Integer> genres){
        this.id = id;
        this.sender = sender;
        this.group = group;
        this.receiver = receiver;
        this.title = title;
        this.description = description;
        this.rating = rating;
        this.gameAddition = gameAddition;
        postTime = LocalDateTime.now();
        this.genres = genres;
        this.feedbacks = new ArrayList<>();
    }

    public Recommendation(int id, int sender, @Nullable Integer group, @Nullable Integer receiver, String title, @Nullable String description, int rating, @Nullable GameAddition gameAddition, List<Integer> genres, List<Integer> feedbacks) {
        this.id = id;
        this.sender = sender;
        this.group = group;
        this.receiver = receiver;
        this.title = title;
        this.description = description;
        this.rating = rating;
        this.gameAddition = gameAddition;
        postTime = LocalDateTime.now();
        this.genres = genres;
        this.feedbacks = feedbacks;
    }
    public Recommendation(int id, int sender, @Nullable Integer group, @Nullable Integer receiver, String title, @Nullable String description, int rating, @Nullable GameAddition gameAddition, LocalDateTime postTime, List<Integer> genres, List<Integer> feedbacks) {
        this.id = id;
        this.sender = sender;
        this.group = group;
        this.receiver = receiver;
        this.title = title;
        this.description = description;
        this.rating = rating;
        this.gameAddition = gameAddition;
        this.postTime = postTime;
        this.genres = genres;
        this.feedbacks = feedbacks;
    }

    private static List<Recommendation> recommendations = new ArrayList<>(Arrays.asList(
            new Recommendation(0, 0, null, 1, "Simsonovci", null, 6, null, Arrays.asList(4,23,28), List.of(0))
    ));

    public static List<Recommendation> getUsersRecommendations(int userId){
        List<Integer> groups =  Member.getUsersGroups(userId).stream().map(Group::getId).toList();
        List<Recommendation> recs = new java.util.ArrayList<>(recommendations.stream().filter(rec -> (rec.group != null && groups.contains(rec.group)) || (rec.receiver != null && rec.receiver == userId) || (rec.sender == userId)).toList());
        recs.sort(Comparator.comparing(o -> o.postTime));
        return recs;
    }

    public static boolean createRecommendation(int sender, Integer groupid, Integer receiver, String title, String description, int rating, Float progress, List<Integer> genresids){
        Recommendation rec = new Recommendation(recommendations.get(recommendations.size()-1).id + 1, sender, groupid, receiver, title, description, rating, (progress != null) ? (new GameAddition(progress)) : (null), genresids);
        return recommendations.add(rec);
    }

    public static void addFeedback(int recommendationId, int feedbackId){
        recommendations.replaceAll(r -> {
            if(r.id == recommendationId){
                List<Integer> feedbacks = new ArrayList<>(r.feedbacks);
                feedbacks.add(feedbackId);
                return new Recommendation(r.id, r.sender, r.group, r.receiver, r.title, r.description, r.rating, r.gameAddition, r.postTime, r.genres, feedbacks);
            }
            return r;
        });
    }
}
