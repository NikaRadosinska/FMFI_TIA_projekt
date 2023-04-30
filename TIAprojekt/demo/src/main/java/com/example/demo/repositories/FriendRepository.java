package com.example.demo.repositories;

import com.example.demo.model.Friends;
import com.example.demo.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface FriendRepository extends JpaRepository<Friends, Integer> {
    long deleteByUserOneAndUserTwo(User userOne, User userTwo);
}
