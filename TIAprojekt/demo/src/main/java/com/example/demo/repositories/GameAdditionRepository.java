package com.example.demo.repositories;

import com.example.demo.model.Friends;
import com.example.demo.model.GameAddition;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface GameAdditionRepository extends JpaRepository<GameAddition, Integer> {
    GameAddition  findById(int id);;
}

