import React, { useEffect, useState } from 'react';
import { Container, Card, Button, ProgressBar, Form, Alert, Modal } from 'react-bootstrap';
import axios from 'axios';
import Cookies from 'js-cookie';

const LearningBucket = () => {
  const [learningCourses, setLearningCourses] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [selectedSkills, setSelectedSkills] = useState({});
  const [scores, setScores] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [currentCourseId, setCurrentCourseId] = useState(null);

  useEffect(() => {
    const fetchLearningCourses = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/user/learning-bucket', {
          headers: { Authorization: `Bearer ${Cookies.get('token')}` },
        });
        setLearningCourses(response.data.courses);
      } catch (error) {
        console.error('Error fetching learning courses:', error);
        setErrorMessage('Failed to load courses.');
      }
    };

    fetchLearningCourses();
  }, []);

  const updateCourseProgress = async (courseId, progress) => {
    if (progress > 100 || progress < 0) return;
    try {
      await axios.put(
        `http://localhost:3000/api/user/update-course/${courseId}`,
        { progress },
        { headers: { Authorization: `Bearer ${Cookies.get('token')}` } }
      );

      setLearningCourses((prevCourses) =>
        prevCourses.map((course) =>
          course._id === courseId ? { ...course, progress } : course
        )
      );
    } catch (error) {
      console.error('Error updating course progress:', error);
      setErrorMessage('Error updating course progress.');
    }
  };

  const handleProgressChange = (courseId, newProgress) => {
    updateCourseProgress(courseId, newProgress);
  };

  const handleMarkAsComplete = (courseId) => {
    setScores((prev) => ({ ...prev, [courseId]: 0 }));
    const courseSkills = learningCourses.find(course => course._id === courseId)?.courseId.skills || [];
    setSelectedSkills((prev) => ({
      ...prev,
      [courseId]: courseSkills
    }));
    setCurrentCourseId(courseId);
    setShowModal(true);
  };

  const submitForReview = async () => {
    const skills = selectedSkills[currentCourseId] || [];
    const score = scores[currentCourseId] || 0;

    try {
        const completionDate = new Date(); // Get the current date

        await axios.post(
            `http://localhost:3000/api/user/submit/${currentCourseId}`,
            { selectedSkills: skills, score, completionDate }, // Send the completion date to the server
            { headers: { Authorization: `Bearer ${Cookies.get('token')}` } }
        );

        alert('Course submitted for review successfully!');

        // Reset states as needed
        setSelectedSkills((prev) => ({ ...prev, [currentCourseId]: [] }));
        setScores((prev) => ({ ...prev, [currentCourseId]: 0 }));
        setShowModal(false);

        // Update the learningCourses state to include the completion date
        setLearningCourses((prevCourses) =>
            prevCourses.map((course) =>
                course.courseId._id === currentCourseId ? { ...course, completionDate, status: 'submitted' } : course
            )
        );
    } catch (error) {
        console.error('Error submitting course for review:', error);
        setErrorMessage('Error submitting course for review.');
    }
};


  const handleSkillSelection = (skill) => {
    setSelectedSkills((prev) => {
      const currentSkills = prev[currentCourseId] || [];
      if (currentSkills.includes(skill)) {
        return { ...prev, [currentCourseId]: currentSkills.filter((s) => s !== skill) };
      } else {
        return { ...prev, [currentCourseId]: [...currentSkills, skill] };
      }
    });
  };

  const handleScoreChange = (score) => {
    setScores((prev) => ({ ...prev, [currentCourseId]: score }));
  };

  return (
    <Container className="mt-4">
      <h4>Your Learning Bucket</h4>

      {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}

      {learningCourses.length > 0 ? (
        learningCourses.map((learning) => (
            <Card key={learning._id} className="mb-3">
              <Card.Body>
                <Card.Title>{learning.courseId.course || 'Unnamed Course'}</Card.Title>
                <p>Partner: {learning.courseId.partner || 'No partner available'}</p>
                <p>Skills: {Array.isArray(learning.courseId.skills) && learning.courseId.skills.length > 0 ? learning.courseId.skills.join(', ') : 'No skills associated'}</p>
                <p>Level: {learning.courseId.level || 'Not specified'}</p>
                <p>Duration: {learning.courseId.duration || 'Not available'}</p>
                <p>Rating: {learning.courseId.rating || 'No rating'} ({learning.courseId.reviewCount || 0} reviews)</p>
                <p>Certificate: {learning.courseId.certificateType || 'No certificate'}</p>
                <p>Credit Eligible: {learning.courseId.creditEligibility ? 'Yes' : 'No'}</p>
          
                <ProgressBar now={learning.progress || 0} label={`${learning.progress || 0}%`} className="mb-2" />
          
                <Form.Group controlId={`progress-${learning._id}`}>
                  <Form.Label>Adjust Progress</Form.Label>
                  <Form.Control
                    type="range"
                    value={learning.progress || 0}
                    onChange={(e) => handleProgressChange(learning.courseId._id, parseInt(e.target.value))}
                    min="0"
                    max="100"
                  />
                </Form.Group>
          
                {/* Check if the course is verified */}
                {learning.isVerified ? (
                  <>
                    <p>Status: Completed</p>
                    <p>Completion Date: {learning.completionDate ? new Date(learning.completionDate).toLocaleDateString() : 'N/A'}</p>
                  </>
                ) : (
                  <>
                    {learning.completionDate ? (
                      <Button variant="secondary" disabled>
                        Submitted for Review
                      </Button>
                    ) : (
                      <Button
                        variant="success"
                        onClick={() => handleMarkAsComplete(learning.courseId._id)}
                        className="mr-2"
                        disabled={learning.progress < 100}
                      >
                        Mark as Complete
                      </Button>
                    )}
                    {learning.status === 'submitted' && <p>Status: Submitted for Review</p>}
                  </>
                )}
              </Card.Body>
            </Card>
          ))
      ) : (
        <p>No courses in your learning bucket yet. Start adding courses!</p>
      )}

      {/* Modal for selecting skills and score */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Select Skills and Score</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group>
            <Form.Label>Select Skills</Form.Label>
            {learningCourses.find(course => course.courseId._id === currentCourseId)?.courseId.skills.map((skill) => (
              <Form.Check
                key={skill}
                type="checkbox"
                label={skill}
                checked={selectedSkills[currentCourseId]?.includes(skill) || false}
                onChange={() => handleSkillSelection(skill)}
              />
            ))}
          </Form.Group>
          <Form.Group>
            <Form.Label>Score</Form.Label>
            <Form.Control
              type="number"
              value={scores[currentCourseId] || 0}
              onChange={(e) => handleScoreChange(parseInt(e.target.value))}
              min="0"
              max="100"
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Close
          </Button>
          <Button variant="primary" onClick={submitForReview}>
            Submit for Review
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default LearningBucket;
