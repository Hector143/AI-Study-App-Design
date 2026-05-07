package com.example.AI_Study_App.controller;

import com.example.AI_Study_App.model.QuizAttempt;
import com.example.AI_Study_App.repository.QuizAttemptRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/quizzes")
@CrossOrigin(origins = "http://localhost:5173")
public class QuizController {

    @Autowired
    private QuizAttemptRepository quizAttemptRepository;

    @PostMapping("/save")
    public QuizAttempt saveAttempt(@RequestBody QuizAttempt attempt) {
        return quizAttemptRepository.save(attempt);
    }

    @getMapping("/history")
    public List<QuizAttempt> getHistory() {
        return quizAttemptRepository.findAll();
    }
}