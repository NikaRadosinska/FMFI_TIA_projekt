package com.example.demo.model;

import com.example.demo.repositories.GameAdditionRepository;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;
import org.springframework.beans.factory.annotation.Autowired;

import javax.persistence.*;
import java.util.Objects;

@Entity
@Table(name = "game_additions")
public class GameAddition {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE)
    private int id;
    @Column(nullable = false)
    private float progress;
    @OneToOne
    @JoinColumn(name = "recommendation_id", nullable = false)
    @OnDelete(action = OnDeleteAction.CASCADE)
    private Recommendation recommendation;

    public GameAddition() {
    }

    public GameAddition(float progress, Recommendation rec) {
        this.progress = progress;
        recommendation = rec;
    }

    public int getId() {
        return id;
    }

    public float getProgress() {
        return progress;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        GameAddition that = (GameAddition) o;
        return id == that.id;
    }

    @Override
    public int hashCode() {
        return Objects.hash(id);
    }
}
