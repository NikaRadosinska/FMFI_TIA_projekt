package com.example.demo.services;

import com.example.demo.enums.FeedbackerState;
import com.example.demo.model.Feedback;
import com.example.demo.model.Recommendation;
import com.example.demo.model.User;
import com.example.demo.repositories.FeedbackRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class FeedbacksService {

    private FeedbackRepository feedbackRepository;

    public FeedbacksService(FeedbackRepository feedbackRepository){
        this.feedbackRepository = feedbackRepository;
    }

    public Feedback getFeedbackById(int id){
        return feedbackRepository.getReferenceById(id);
    }

    public int createFeedback(User userId, FeedbackerState state, int rating, String commentary, Recommendation recommendation){
        Feedback f = new Feedback(userId, state, rating, commentary, recommendation);
        f = feedbackRepository.saveAndFlush(f);
        return f.getId();
    }

    public List<Feedback> getFeedbacks(List<Integer> ids){
        return feedbackRepository.findAll().stream().filter(feedback -> ids.contains(feedback.getId())).toList();
    }
}
