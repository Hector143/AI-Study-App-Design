package backend.controller;

import backend.model.StudyModel;
import backend.repository.StudyRepository;
import java.util.List;

/**
 * Controller class handling Study-related API endpoints.
 * Manages business logic and request routing for Study operations.
 */
public class StudyController {

    private StudyRepository studyRepository;

    public StudyController() {
        this.studyRepository = new StudyRepository();
    }

    /**
     * Get all studies
     */
    public List<StudyModel> getAllStudies() {
        return studyRepository.findAll();
    }

    /**
     * Get a study by ID
     */
    public StudyModel getStudyById(Long id) {
        return studyRepository.findById(id);
    }

    /**
     * Create a new study
     */
    public StudyModel createStudy(StudyModel study) {
        return studyRepository.save(study);
    }

    /**
     * Update an existing study
     */
    public StudyModel updateStudy(StudyModel study) {
        return studyRepository.update(study);
    }

    /**
     * Delete a study
     */
    public void deleteStudy(Long id) {
        studyRepository.deleteById(id);
    }
}
