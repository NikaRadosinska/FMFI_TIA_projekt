package com.example.demo.model;

import org.springframework.lang.Nullable;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.Comparator;
import java.util.List;

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

    public Recommendation(int id, int sender, @Nullable Integer group,@Nullable Integer receiver, String title,@Nullable String description, int rating,@Nullable GameAddition gameAddition, List<Integer> genres){
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
    }

    private static List<Recommendation> recommendations = Arrays.asList(
            new Recommendation(0, 0, null, 1, "Simsonovci", null, 4, null, Arrays.asList(4,23,28))
    );

    public static List<Recommendation> getUsersRecommendations(int userId){
        List<Integer> groups =  Member.getUsersGroups(userId).stream().map(Group::getId).toList();
        List<Recommendation> recs = new java.util.ArrayList<>(recommendations.stream().filter(rec -> (rec.group != null && groups.contains(rec.group)) || (rec.receiver != null && rec.receiver == userId)).toList());
        recs.sort(Comparator.comparing(o -> o.postTime));
        return recs;
    }

}
