package com.example.AI_Study_App.controller;

import com.example.AI_Study_App.model.User;
import com.example.AI_Study_App.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "http://localhost:5173") // Crucial for Frontend communication
public class UserController {

    @Autowired
    private UserRepository userRepository;

    @GetMapping
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    @PostMapping("/signup")
    public User signUp(@RequestBody User user) {
        // This takes the JSON from your frontend and saves it to MySQL
        return userRepository.save(user);
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
    @PostMapping("/login")
    public User login(@RequestBody User user) {
    return userRepository.findByEmail(user.getEmail())
        .filter(u -> u.getPassword_hash().equals(user.getPassword_hash()))
        .orElseThrow(() -> new RuntimeException("Invalid Credentials"));
}
}
