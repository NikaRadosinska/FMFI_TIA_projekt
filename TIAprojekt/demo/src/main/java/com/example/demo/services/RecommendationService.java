package com.example.demo.services;

import com.example.demo.model.*;
import com.example.demo.repositories.RecommendationRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Comparator;
import java.util.List;

@Service
@Transactional
public class RecommendationService {
    private RecommendationRepository recommendationRepository;

    public RecommendationService(RecommendationRepository recommendationRepository) {
        this.recommendationRepository = recommendationRepository;
    }

    public boolean deleteRecommendationById(int id){
        Recommendation r = recommendationRepository.findById(id);
        recommendationRepository.deleteById(id);
        return r != null;
    }

    public void deleteGenreById(int id){
        List<Recommendation> recs = recommendationRepository.findAll();
        recommendationRepository.deleteAll();
        recs.forEach(recommendation -> {
            Integer[] genres = recommendation.getGenres();
            genres = Arrays.stream(genres).filter(i -> i == id).toArray(Integer[]::new);
            recommendation.setGenres(genres);
        });
    }

    public List<Recommendation> getAllRecommendations(){
        return recommendationRepository.findAll();
    }

    public Recommendation getRecommendationById(int id){
        return recommendationRepository.findById(id);
    }

    public List<Recommendation> getUsersRecommendations(User user, List<Group> usersGroups){
        List<Recommendation> recs = new ArrayList<>(recommendationRepository.findAll().stream().filter(rec -> (rec.getSender().equals(user)) || (rec.getGroup() != null && usersGroups.contains(rec.getGroup())) || (rec.getReceiver() != null && rec.getReceiver().equals(user))).toList());
        recs.sort(Comparator.comparing(Recommendation::getPostTime));
        return recs;
    }

    public Recommendation createRecommendation(User sender, Group group, User receiver, String title, String description, int rating, GameAddition gameAddition, List<Integer> genresids){
        Recommendation rec = new Recommendation(sender, group, receiver, title, description, rating, gameAddition, genresids);
        recommendationRepository.saveAndFlush(rec);
        return rec;
    }

}
