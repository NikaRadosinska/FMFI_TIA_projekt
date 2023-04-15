package com.example.demo.controllers;

import com.example.demo.model.*;
import org.springframework.graphql.data.method.annotation.Argument;
import org.springframework.graphql.data.method.annotation.MutationMapping;
import org.springframework.graphql.data.method.annotation.QueryMapping;
import org.springframework.graphql.data.method.annotation.SchemaMapping;
import org.springframework.stereotype.Controller;

import javax.swing.*;
import java.util.*;

@Controller
public class GroupController {

    @QueryMapping
    public List<Group> getUsersGroups(@Argument int id){
        return Member.getUsersGroups(id);
    }

    @QueryMapping
    public List<UserInfo> getMembersOfGroup(@Argument int id){
        return Member.getMembersOfGroup(id);
    }

    @MutationMapping
    public boolean addUserToGroup(@Argument int userid, @Argument int groupid){
        return Member.addUserToGroup(userid, groupid);
    }

    @MutationMapping
    public boolean createGroup(@Argument int id, @Argument String groupname){
        return Group.createGroup(id, groupname);
    }
    @MutationMapping
    public boolean leaveGroup(@Argument int userid, @Argument int groupid){
        return Member.leaveGroup(userid, groupid);
    }


}
