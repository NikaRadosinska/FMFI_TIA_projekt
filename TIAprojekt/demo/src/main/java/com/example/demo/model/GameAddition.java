package com.example.demo.model;

import java.time.Duration;

public class GameAddition {
    private Duration playedTime;
    private Duration overallTime;

    public GameAddition(Duration playedTime, Duration overallTime){
        this.playedTime = playedTime;
        this.overallTime = overallTime;
    }
}
