package com.example.demo.model;

import org.springframework.graphql.data.method.annotation.Argument;

import java.util.Arrays;
import java.util.List;
import java.util.Objects;

public class User {
    private int id;
    private String userName;
    private String password;
    private Boolean isAdmin;

    public User(int id, String userName, String password, Boolean isAdmin){
        this.id = id;
        this.userName = userName;
        this.password = password;
        this.isAdmin = isAdmin;
    }

    private static List<User> users = Arrays.asList(
            new User(0,"admin", "admin123", true),
            new User(1,"userOne", "userOnePassword", false),
            new User(2,"userTwo", "userTwoPassword", false)
    );

    public static List<String> getAllUserNames(){
        return users.stream().map(user -> user.userName).toList();
    }

    public static User userIfCorrectPassword(String userName, String password){
        return users.stream().filter(user -> user.userName.equals(userName) &&  user.password.equals(password)).findFirst().orElse(null);
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
}
