package com.example.AI_Study_App.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "quiz_attempts")
public class QuizAttempt {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "attempt_id")
    private Long id;

    // This maps the JSON "score" from React to the DB "score_obtained"
    @Column(name = "score_obtained")
    private int score;

    // This maps the JSON "totalQuestions" from React to the DB "max_score"
    @Column(name = "max_score")
    private int totalQuestions;

    @Column(name = "xp_earned")
    private int xpEarned;

    @Column(name = "completed_at")
    private LocalDateTime timestamp = LocalDateTime.now();

    @Column(name = "user_id")
    private Long userId;

    // Add getter and setter
    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public Long getId() { return id; }
    public int getScore() { return score; }
    public void setScore(int score) { this.score = score; }
    public int getTotalQuestions() { return totalQuestions; }
    public void setTotalQuestions(int totalQuestions) { this.totalQuestions = totalQuestions; }
    public int getXpEarned() { return xpEarned; }
    public void setXpEarned(int xpEarned) { this.xpEarned = xpEarned; }
}