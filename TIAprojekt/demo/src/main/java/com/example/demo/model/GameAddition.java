package com.example.demo.model;

import com.example.demo.repositories.GameAdditionRepository;
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

    public GameAddition() {
    }

    public GameAddition(float progress) {
        this.progress = progress;
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
