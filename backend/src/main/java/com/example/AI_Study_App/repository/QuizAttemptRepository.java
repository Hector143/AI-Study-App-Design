package com.example.AI_Study_App.repository;

import com.example.AI_Study_App.model.QuizAttempt;
import org.springframework.data.jpa.repository.JpaRepository;

public interface QuizAttemptRepository extends JpaRepository<QuizAttempt, Long> {
}