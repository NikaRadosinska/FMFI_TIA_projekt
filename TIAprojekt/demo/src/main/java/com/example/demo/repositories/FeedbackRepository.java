package com.example.demo.repositories;

import com.example.demo.model.Feedback;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface FeedbackRepository extends JpaRepository<Feedback, Integer> {
    Feedback findById(int id);
}
