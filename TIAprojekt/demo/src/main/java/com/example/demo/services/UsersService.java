package com.example.demo.services;

import com.example.demo.model.User;
import com.example.demo.repositories.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UsersService {

    private UserRepository userRepository;

    public UsersService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }


    public User getUserById(int id){
        return userRepository.getReferenceById(id);
    }

    public List<String> getAllUserNames(){
        return userRepository.findAll().stream().map(User::getUsername).toList();
    }

    public User userIfCorrectPassword(String username, String password){
        return userRepository.findByUsernameAndPassword(username, password);
    }

    public User addUser(String userName, String password, boolean isAdmin){
        User u = new User(userName,password,isAdmin);
        u = userRepository.saveAndFlush(u);
        return u;
    }

    public User getUserByUsername(String username){
        return userRepository.findByUsername(username);
    }
}
