package com.example.AI_Study_App.controller_Study_App;
import com.example.aistudyapp.model.studyModel;
import com.example.aistudyapp.repository.studyRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/study")
@CrossOrigin(origins = "*") 
public class studyController {

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