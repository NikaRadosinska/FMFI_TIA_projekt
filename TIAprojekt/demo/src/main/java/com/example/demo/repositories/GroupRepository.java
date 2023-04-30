package com.example.demo.repositories;

import com.example.demo.model.GameAddition;
import com.example.demo.model.Group;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface GroupRepository extends JpaRepository<Group, Integer> {
    Group  findById(int id);;
}
