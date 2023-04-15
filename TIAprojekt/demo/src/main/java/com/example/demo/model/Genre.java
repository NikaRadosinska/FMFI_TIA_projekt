package com.example.demo.model;

import java.util.Arrays;
import java.util.List;

public class Genre {
    private int id;
    private String name;

    public Genre(int id, String name){
        this.id = id;
        this.name = name;
    }

    private static List<Genre> genres = Arrays.asList(
            new Genre(0, "Horror"),
            new Genre(1,"Action"),
            new Genre(2,"Thriller"),
            new Genre(3,"Drama"),
            new Genre(4,"Comedy"),
            new Genre(5,"Adventure"),
            new Genre(6,"Western"),
            new Genre(7,"Romance"),
            new Genre(8,"Crime"),
            new Genre(9,"Fantasy"),
            new Genre(10,"Documentary"),
            new Genre(11,"Science fiction"),
            new Genre(12,"War"),
            new Genre(13,"Musical"),
            new Genre(14,"Music"),
            new Genre(15,"Experimental"),
            new Genre(16,"Historical Fiction"),
            new Genre(17,"Noir"),
            new Genre(18,"History"),
            new Genre(19,"Science"),
            new Genre(20,"Short"),
            new Genre(21,"Teen"),
            new Genre(22,"Gangster"),
            new Genre(23,"Animated"),
            new Genre(24,"Narrative"),
            new Genre(25,"Dark"),
            new Genre(26,"Mystery"),
            new Genre(27,"Biographical"),
            new Genre(28,"Family")
    );

    public static List<Genre> getGenres(List<Integer> genresIds) {
        return genres.stream().filter(genre -> genresIds.contains(genre.id)).toList();
    }
}
