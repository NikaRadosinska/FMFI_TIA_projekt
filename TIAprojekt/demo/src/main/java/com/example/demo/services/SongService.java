package com.example.demo.services;

import com.example.demo.model.Song;
import com.example.demo.repositories.SongRepository;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class SongService {

    private SongRepository songRepository;

    public SongService(SongRepository songRepository) {
        this.songRepository = songRepository;
    }

    public List<Song> getAllSongs() {
        return songRepository.findAll();
    }
}
