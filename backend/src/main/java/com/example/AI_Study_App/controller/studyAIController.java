package com.example.AI_Study_App.controller;

import com.example.AI_Study_App.model.studyModel;
import com.example.AI_Study_App.repository.studyRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
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

    @PostMapping("/{userId}/add-xp")
    public ResponseEntity<?> addXp(@PathVariable Long userId, @RequestBody Map<String, Integer> body) {
    int xpToAdd = body.get("xp");
    // Pseudo-code:
    // UserStats stats = statsRepository.findByUserId(userId);
    // stats.setTotalXp(stats.getTotalXp() + xpToAdd);
    // statsRepository.save(stats);
    return ResponseEntity.ok("XP Updated");
}
    @PostMapping
    public studyModel createSession(@RequestBody studyModel session) {
        return studyRepository.save(session);
    }
}
