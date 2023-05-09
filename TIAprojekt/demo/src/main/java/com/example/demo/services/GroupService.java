package com.example.demo.services;

import com.example.demo.model.Group;
import com.example.demo.model.User;
import com.example.demo.repositories.GroupRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class GroupService {
    private GroupRepository groupRepository;

    public GroupService(GroupRepository groupRepository) {
        this.groupRepository = groupRepository;
    }

    public List<Group> getAllGroups(){
        return groupRepository.findAll();
    }

    public Group getGroupById(int id){
        return groupRepository.findById(id);
    }

    public boolean deleteGroupById(int id){
        Group g = groupRepository.findById(id);
        groupRepository.deleteById(id);
        return g != null;
    }

    public Group createGroup(String groupname){
        if (groupRepository.findAll().stream().anyMatch(g -> g.getName().equals(groupname))) return null;

        Group ng = new Group(groupname);
        ng = groupRepository.saveAndFlush(ng);
        return ng;
    }

    public boolean deleteGroup(int id){
        groupRepository.deleteById(id);
        return true;
    }
}
