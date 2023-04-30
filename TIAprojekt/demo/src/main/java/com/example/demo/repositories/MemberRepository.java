package com.example.demo.repositories;

import com.example.demo.model.GameAddition;
import com.example.demo.model.Group;
import com.example.demo.model.Member;
import com.example.demo.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MemberRepository extends JpaRepository<Member, Integer> {
    Member  findById(int id);;
    long deleteByGroupAndUser(Group group, User user);
    List<Member> findAllByGroup(Group group);
}
