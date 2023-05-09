package com.example.demo.model;

import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

import javax.persistence.*;
import java.util.Objects;

@Entity
@Table(name="friends")
public class Friends {

    @Id
    @GeneratedValue(strategy=GenerationType.SEQUENCE)
    private int id;
    @OneToOne
    @JoinColumn(name = "id1", nullable = false)
    @OnDelete(action = OnDeleteAction.CASCADE)
    private User userOne;
    @OneToOne
    @JoinColumn(name = "id2", nullable = false)
    @OnDelete(action = OnDeleteAction.CASCADE)
    private User userTwo;

    public Friends(){}

    public Friends(User user1, User user2) {
        this.userOne = user1;
        this.userTwo = user2;
    }

    public int getId() {
        return id;
    }

    public User getUserOne() {
        return userOne;
    }

    public User getUserTwo() {
        return userTwo;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Friends friends = (Friends) o;
        return id == friends.id;
    }

    @Override
    public int hashCode() {
        return Objects.hash(id);
    }
}
