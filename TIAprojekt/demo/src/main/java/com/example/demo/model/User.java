package com.example.demo.model;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

public class User {
    private int id;
    private String username;
    private String password;
    private Boolean isAdmin;

    public User(int id, String userName, String password, Boolean isAdmin){
        this.id = id;
        this.username = userName;
        this.password = password;
        this.isAdmin = isAdmin;
    }

    private static List<User> users = new ArrayList<>(Arrays.asList(
            new User(0,"admin", "admin123", true),
            new User(1,"userOne", "userOnePassword", false),
            new User(2,"userTwo", "userTwoPassword", false)
    ));

    public static List<String> getAllUserNames(){
        return users.stream().map(user -> user.username).toList();
    }

    public static User userIfCorrectPassword(String userName, String password){
        return users.stream().filter(user -> user.username.equals(userName) &&  user.password.equals(password)).findFirst().orElse(null);
    }

    public static User addUser(String userName, String password){
        User u = new User(users.size(), userName,password,false);
        users.add(u);
        return u;
    }

    public static User addAdmin(String userName, String password){
        User u = new User(users.size(), userName,password,true);
        users.add(u);
        return u;
    }

    public static User getById(int id){
        return users.get(id);
    }
    public static User getByUsername(String userName){
        return users.stream().filter(user -> user.username.equals(userName)).findFirst().orElse(null);
    }

    public String getUsername(){
        return username;
    }
    public int getId(){
        return id;
    }

    public UserInfo getUserInfo(){
        return new UserInfo(id, username);
    }
}
