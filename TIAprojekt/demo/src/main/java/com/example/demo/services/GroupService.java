package com.example.demo.services;

import com.example.demo.model.Group;
import com.example.demo.repositories.GroupRepository;
import org.springframework.stereotype.Service;

@Service
public class GroupService {
    private GroupRepository groupRepository;

    public GroupService(GroupRepository groupRepository) {
        this.groupRepository = groupRepository;
    }


    public Group getGroupById(int id){
        return groupRepository.getReferenceById(id);
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
