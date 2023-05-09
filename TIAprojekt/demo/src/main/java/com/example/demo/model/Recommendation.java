package com.example.demo.model;

import com.example.demo.repositories.RecommendationRepository;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.graphql.data.method.annotation.Argument;
import org.springframework.lang.Nullable;

import javax.persistence.*;
import java.time.LocalDateTime;
import java.util.*;
import java.util.function.UnaryOperator;

@Entity
@Table(name = "recommendations")
public class Recommendation {
    @Id
    @GeneratedValue(strategy=GenerationType.SEQUENCE)
    private int id;
    @OneToOne
    @JoinColumn(name = "sender_id", nullable = false)
    @OnDelete(action = OnDeleteAction.CASCADE)
    private User sender;
    @OneToOne
    @JoinColumn(name = "group_id")
    @OnDelete(action = OnDeleteAction.CASCADE)
    private Group group;
    @OneToOne
    @JoinColumn(name = "receiver_id")
    @OnDelete(action = OnDeleteAction.CASCADE)
    private User receiver;
    @Column(nullable = false)
    private String title;
    @Column
    private String description;
    @Column(nullable = false)
    private int rating;
    @OneToOne(mappedBy = "recommendation")
    private GameAddition gameAddition;
    @Column(nullable = false)
    private LocalDateTime postTime;
    @Column(nullable = false)
    private Integer[] genres;

    @OneToMany(mappedBy = "recommendation")
    private List<Feedback> feedbacks;


    public Recommendation(){}

    public Recommendation(User sender, Group group, User receiver, String title, String description, int rating, GameAddition gameAddition, List<Integer> genres) {
        this.sender = sender;
        this.group = group;
        this.receiver = receiver;
        this.title = title;
        this.description = description;
        this.rating = rating;
        this.gameAddition = gameAddition;
        this.postTime = LocalDateTime.now();
        this.genres = genres.toArray(new Integer[0]);
    }

    public int getId() {
        return id;
    }

    public User getSender() {
        return sender;
    }

    public Group getGroup() {
        return group;
    }

    public User getReceiver() {
        return receiver;
    }

    public String getTitle() {
        return title;
    }

    public String getDescription() {
        return description;
    }

    public int getRating() {
        return rating;
    }

    public GameAddition getGameAddition() {
        return gameAddition;
    }

    public void setGameAddition(@Nullable GameAddition gameAddition) {
        this.gameAddition = gameAddition;
    }

    public LocalDateTime getPostTime() {
        return postTime;
    }

    public Integer[] getGenres() {
        return genres;
    }

    public void setGenres(Integer[] genres) {
        this.genres = genres;
    }

    public List<Feedback> getFeedbacks() {
        return feedbacks;
    }

    public boolean isForFilm(){
        return gameAddition == null;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Recommendation that = (Recommendation) o;
        return id == that.id;
    }

    @Override
    public int hashCode() {
        return Objects.hash(id);
    }
}
