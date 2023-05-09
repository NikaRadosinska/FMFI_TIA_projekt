package com.example.demo.services;

import com.example.demo.model.*;
import com.example.demo.repositories.FeedbackRepository;
import com.example.demo.repositories.MemberRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class MemberService {
    private MemberRepository memberRepository;

    public MemberService(MemberRepository memberRepository) {
        this.memberRepository = memberRepository;
    }


    public Member getMemberById(int id){
        return memberRepository.findById(id);
    }

    public List<Group> getUsersGroups(User user){
        return memberRepository.findAll().stream().filter(member -> member.getUser().equals(user)).map(Member::getGroup).toList();
    }

    public List<Member> getAllMembers(){
        return memberRepository.findAll();
    }

    public boolean addUserToGroup(User user, Group group){
        if (memberRepository.findAll().stream().anyMatch(m -> m.getUser().equals(user) && m.getGroup().equals(group))) return false;
        memberRepository.saveAndFlush(new Member(group, user));
        return true;
    }

    public Group leaveGroup(User user, Group group){
        long n = memberRepository.deleteByGroupAndUser(group,user);
        if(memberRepository.findAll().stream().noneMatch(m -> m.getGroup().equals(group))) return group;
        return null;
    }

    public List<UserInfo> getMembersOfGroup(Group group){
        return memberRepository.findAllByGroup(group).stream().map(m -> m.getUser().getUserInfo()).toList();
    }


}
