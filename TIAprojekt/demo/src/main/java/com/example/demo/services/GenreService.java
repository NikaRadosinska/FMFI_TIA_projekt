package com.example.demo.services;

import com.example.demo.model.EGenre;
import com.example.demo.model.Genre;
import com.example.demo.model.User;
import com.example.demo.repositories.GenreRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Arrays;
import java.util.List;

@Service
@Transactional
public class GenreService {

    private GenreRepository genreRepository;

    public GenreService(GenreRepository genreRepository) {
        this.genreRepository = genreRepository;
    }

    public EGenre getGenreById(int id){
        return genreRepository.findById(id);
    }

    public boolean deleteGenreById(int id){
        EGenre g = genreRepository.findById(id);
        genreRepository.deleteById(id);
        return g != null;
    }

    public Genre changeGenreName(int id, String name){
        EGenre g = genreRepository.findById(id);
        g.setName(name);
        return genreRepository.saveAndFlush(g).getGenre();
    }

    public Genre addGenre(String name, boolean isForGame){
        EGenre eg = genreRepository.saveAndFlush(new EGenre(name, isForGame));
        return eg.getGenre();
    }

    public void resetGenres(){
        genreRepository.deleteAll();
        for (Genre fg : filmGenres) {
            genreRepository.save(new EGenre(fg.getName(), false));
        }
        for (Genre gg : gameGenres) {
            genreRepository.save(new EGenre(gg.getName(), true));
        }
        genreRepository.flush();
    }

    public List<Genre> getFilmGenres(){
        return genreRepository.findAll().stream().filter(g -> !g.isForGame()).map(EGenre::getGenre).toList();
    }

    public List<Genre> getGenres(List<Integer> genresIds) {
        return genreRepository.findAllById(genresIds).stream().map(EGenre::getGenre).toList();
    }


    public List<Genre> getGameGenres(){
        return genreRepository.findAll().stream().filter(EGenre::isForGame).map(EGenre::getGenre).toList();
    }

    private static List<Genre> filmGenres = Arrays.asList(
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


    private static List<Genre> gameGenres = Arrays.asList(
            new Genre(0, "Action"),
            new Genre(1, "Fighting"),
            new Genre(2, "Platform"),
            new Genre(3, "Shooter"),
            new Genre(4, "Survival"),
            new Genre(5, "Battle royale"),
            new Genre(6, "Action-Adventure"),
            new Genre(7, "Stealth"),
            new Genre(8, "Interactive movie"),
            new Genre(9, "Visual novel"),
            new Genre(10, "Horror"),
            new Genre(11, "Role-Playing"),
            new Genre(12, "Sci-fi"),
            new Genre(13, "Simulation"),
            new Genre(14, "Sport"),
            new Genre(15, "Vehicle"),
            new Genre(16, "Strategy"),
            new Genre(17, "Real-time"),
            new Genre(18, "Turn-based"),
            new Genre(19, "Racing")
    );
}
