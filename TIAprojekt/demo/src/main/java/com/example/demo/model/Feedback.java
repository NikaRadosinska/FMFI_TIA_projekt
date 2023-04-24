package com.example.demo.model;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

public class Feedback {

    private int id;

    public int getUserId() {
        return userId;
    }

    private int userId;
    private FeedbackerState state;
    private int rating;
    private String commentary;

    public Feedback(int id, int userId, FeedbackerState state, int rating, String commentary) {
        this.id = id;
        this.userId = userId;
        this.state = state;
        this.rating = rating;
        this.commentary = commentary;
    }


    private static List<Feedback> feedbacks = new ArrayList<>(Arrays.asList(
            new Feedback(0, 1, FeedbackerState.SEEN_OR_PLAYED, 8, "funny")
    ));

    public static int createFeedback(int userId, FeedbackerState state, int rating, String commentary){
        Feedback f = new Feedback(feedbacks.get(feedbacks.size()-1).id + 1, userId, state, rating, commentary);
        feedbacks.add(f);
        return f.id;
    }

    public static List<Feedback> getFeedbacks(List<Integer> ids){
        return feedbacks.stream().filter(feedback -> ids.contains(feedback.id)).toList();
    }
}
