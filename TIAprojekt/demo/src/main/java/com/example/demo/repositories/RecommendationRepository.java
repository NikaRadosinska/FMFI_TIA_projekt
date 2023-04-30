package com.example.demo.repositories;

import com.example.demo.model.Feedback;
import com.example.demo.model.Recommendation;
import com.example.demo.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RecommendationRepository extends JpaRepository<Recommendation, Integer> {
    Recommendation  findById(int id);;
}
