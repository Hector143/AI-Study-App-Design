package com.example.AI_Study_App.repository;
import com.example.aistudyapp.model.studyModel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface studyRepository extends JpaRepository<studyModel, Long> {
}