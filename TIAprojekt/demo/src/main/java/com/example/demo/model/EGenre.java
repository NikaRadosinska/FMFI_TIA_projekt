package com.example.demo.model;

import javax.persistence.*;
import java.util.Objects;

@Entity
@Table(name = "genre")
public class EGenre {

    @Id
    @GeneratedValue(strategy= GenerationType.SEQUENCE)
    private int id;
    @Column(nullable = false)
    private String name;
    @Column(nullable = false)
    private boolean isForGame;

    public int getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public boolean isForGame() {
        return isForGame;
    }

    public Genre getGenre(){
        return new Genre(id, name);
    }

    public EGenre() {
    }

    public EGenre(String name, boolean isForGame) {
        this.name = name;
        this.isForGame = isForGame;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        EGenre genre = (EGenre) o;
        return id == genre.id;
    }

    @Override
    public int hashCode() {
        return Objects.hash(id);
    }
}
