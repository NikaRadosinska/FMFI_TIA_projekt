package com.example.demo.services;

import com.example.demo.model.Friends;
import com.example.demo.model.User;
import com.example.demo.model.UserInfo;
import com.example.demo.repositories.FriendRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class FriendsService {
    private FriendRepository friendsRepository;

    public FriendsService(FriendRepository friendsRepository){
        this.friendsRepository = friendsRepository;
    }

    public Friends getFriendsById(int id){
        return friendsRepository.getReferenceById(id);
    }

    public List<UserInfo> getFriendsUsernames(User user){
        return friendsRepository.findAll().stream().filter(pair -> pair.getUserOne().equals(user) || pair.getUserTwo().equals(user)).map(pair2 -> (pair2.getUserOne().equals(user)) ? (pair2.getUserTwo()) : (pair2.getUserOne())).map(User::getUserInfo).toList();
    }

    public boolean addFriend(User userOne, User userTwo){
        friendsRepository.saveAndFlush(new Friends(userOne, userTwo));
        return true;
    }

    public boolean removeFriend(User userOne, User userTwo){
        long n = friendsRepository.deleteByUserOneAndUserTwo(userOne, userTwo);
        n += friendsRepository.deleteByUserOneAndUserTwo(userTwo, userOne);
        return n > 0;
    }
}
