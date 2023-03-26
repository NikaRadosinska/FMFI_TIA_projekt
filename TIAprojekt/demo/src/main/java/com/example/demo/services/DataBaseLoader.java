package com.example.demo.services;

import com.example.demo.model.Artist;
import com.example.demo.model.Song;
import com.example.demo.repositories.ArtistRepository;
import com.example.demo.repositories.SongRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class DataBaseLoader implements CommandLineRunner {


    private final ArtistRepository artistRepository;
    private final SongRepository songRepository;

    public DataBaseLoader(ArtistRepository artistRepository, SongRepository songRepository) {
        this.artistRepository = artistRepository;
        this.songRepository = songRepository;
    }

    @Override
    public void run(String... args) throws Exception {

        Artist jt = new Artist("Justin", "Timberlake");
        Song suitTie = new Song("Suit & Tie(feat. Jay-Z)");
        Song cryMeARiver = new Song("Cry Me a River");

        jt.getSongs().add(suitTie);
        artistRepository.save(jt);
        suitTie.setArtist(jt);
        cryMeARiver.setArtist(jt);
        songRepository.save(cryMeARiver);
        songRepository.save(suitTie);



        Artist harry = new Artist("Harry", "Styles");
        Song lonely = new Song("To Be So Lonely");

        harry.getSongs().add(lonely);
        artistRepository.save(harry);
        lonely.setArtist(harry);
        songRepository.save(lonely);

        System.out.println("Number of songs: "+ songRepository.count());
        System.out.println("Number of artists: "+ artistRepository.count());
    }
}
