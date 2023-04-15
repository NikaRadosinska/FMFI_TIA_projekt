package com.example.demo.model;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

public class Group {
    private int id;
    private String name;

    public Group(int id, String name){
        this.id = id;
        this.name = name;
    }

    private static List<Group> groups = new ArrayList<>(Arrays.asList(
            new Group(0,"adminGroup"),
            new Group(1,"userOneGroup")
    ));

    public int getId(){
        return id;
    }

    public static Group getById(int id){
        return groups.stream().filter(group -> group.id == id).findFirst().get();
    }

    public static boolean createGroup(int id, String groupname){
        if (groups.stream().anyMatch(g -> g.name.equals(groupname))) return false;

        Group ng = new Group(groups.get(groups.size()-1).id + 1, groupname);
        groups.add(ng);
        Member.addUserToGroup(id, ng.id);
        return true;
    }

    public static boolean deleteGroup(int id){
        return groups.removeIf(group -> group.id == id);
    }
}
