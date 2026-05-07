package com.example.AI_Study_App.repository;

import com.example.AI_Study_App.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    // This line is what was missing! 
    Optional<User> findByEmail(String email);
}