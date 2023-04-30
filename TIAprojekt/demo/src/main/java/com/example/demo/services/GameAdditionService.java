package com.example.demo.services;

import com.example.demo.model.GameAddition;
import com.example.demo.repositories.GameAdditionRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class GameAdditionService {
    private GameAdditionRepository gameAdditionRepository;

    public GameAdditionService(GameAdditionRepository gameAdditionRepository) {
        this.gameAdditionRepository = gameAdditionRepository;
    }


    public GameAddition getGameAdditionById(int id){
        return gameAdditionRepository.findById(id);
    }

    public GameAddition createGameAddition(float progress){
        GameAddition ga = new GameAddition(progress);
        ga = gameAdditionRepository.saveAndFlush(ga);
        return ga;
    }
}
