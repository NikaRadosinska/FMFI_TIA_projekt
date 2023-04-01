package com.example.demo.model;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

public class Friends {
    private int id1;
    private int id2;

    public Friends(int id1, int id2){
        this.id1 = id1;
        this.id2 = id2;
    }

    private static List<Friends> friends = new ArrayList<>(Arrays.asList(
            new Friends(0,1),
            new Friends(1,2)
    ));

    public int getId1() {
        return id1;
    }

    public int getId2() {
        return id2;
    }

    public static List<String> getFriendsUsernames(int id){
        return friends.stream().filter(friends -> friends.id1 == id || friends.id2 == id).map(friends -> (friends.id1 == id) ? (friends.id2) : (friends.id1)).map(userId -> User.getById(userId).getUserName()).toList();
    }

    public static boolean addFriend(int id, String username){
        User friend = User.getByUsername(username);
        return friends.add(new Friends(id, friend.getId()));
    }

    public static boolean removeFriend(int id, String username){
        User friend = User.getByUsername(username);
        return friends.removeIf(pair -> (pair.id1 == id && pair.id2 == friend.getId()) || (pair.id1 == friend.getId() && pair.id2 == id));
    }
}
