package com.example.demo.model;

import com.example.demo.enums.FeedbackerState;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

import javax.persistence.*;
import java.util.Objects;

@Entity
@Table(name = "feedbacks")
public class Feedback {
    @Id
    @GeneratedValue(strategy=GenerationType.SEQUENCE)
    private int id;
    @OneToOne
    @JoinColumn(name = "user_id", nullable = false)
    @OnDelete(action = OnDeleteAction.CASCADE)
    private User user;
    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private FeedbackerState state;
    @Column(nullable = false)
    private int rating;
    private String commentary;
    @ManyToOne
    @JoinColumn(name = "recommendation_id", nullable = false)
    @OnDelete(action = OnDeleteAction.CASCADE)
    private Recommendation recommendation;


    public Feedback() {}

    public Feedback(User userId, FeedbackerState state, int rating, String commentary, Recommendation recommendation) {
        this.user = userId;
        this.state = state;
        this.rating = rating;
        this.commentary = commentary;
        this.recommendation = recommendation;
    }

    public int getId() {
        return id;
    }

    public User getUser() {
        return user;
    }

    public FeedbackerState getState() {
        return state;
    }

    public int getRating() {
        return rating;
    }

    public String getCommentary() {
        return commentary;
    }

    public Recommendation getRecommendation() {
        return recommendation;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Feedback feedback = (Feedback) o;
        return id == feedback.id;
    }

    @Override
    public int hashCode() {
        return Objects.hash(id);
    }
}
