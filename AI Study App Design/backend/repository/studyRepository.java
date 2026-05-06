package backend.repository;

import backend.model.StudyModel;
import java.util.ArrayList;
import java.util.List;

/**
 * Repository class for managing Study data persistence.
 * Handles database operations for Study entities.
 */
public class StudyRepository {

    private static List<StudyModel> studies = new ArrayList<>();

    /**
     * Retrieve all studies
     */
    public List<StudyModel> findAll() {
        return new ArrayList<>(studies);
    }

    /**
     * Find a study by ID
     */
    public StudyModel findById(Long id) {
        return studies.stream()
                .filter(study -> study.getId().equals(id))
                .findFirst()
                .orElse(null);
    }

    /**
     * Save a study
     */
    public StudyModel save(StudyModel study) {
        studies.add(study);
        return study;
    }

    /**
     * Delete a study by ID
     */
    public void deleteById(Long id) {
        studies.removeIf(study -> study.getId().equals(id));
    }

    /**
     * Update an existing study
     */
    public StudyModel update(StudyModel study) {
        deleteById(study.getId());
        return save(study);
    }
}
