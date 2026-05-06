package com.example.AI_Study_App.controller;

import com.example.AI_Study_App.model.studyModel;
import com.example.AI_Study_App.repository.studyRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/study")
@CrossOrigin(origins = "*") 
public class studyAIController {

    @Autowired
    private studyRepository studyRepository;

    @GetMapping
    public List<studyModel> getAllSessions() {
        return studyRepository.findAll();
    }

    @PostMapping
    public studyModel createSession(@RequestBody studyModel session) {
        return studyRepository.save(session);
    }
}
