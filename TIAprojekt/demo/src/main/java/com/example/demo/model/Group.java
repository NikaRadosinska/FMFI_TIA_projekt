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

    public static Group getById(int id){
        return groups.get(id);
    }
}
