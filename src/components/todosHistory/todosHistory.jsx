import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Cookie from "js-cookie";
import env from "../../env.json";
import './todos.css';

function TodoHistory() {
    const [completedTasks, setCompletedTasks] = useState([]);
    const [showDescriptionModal, setShowDescriptionModal] = useState(false);
    const [selectedTask, setSelectedTask] = useState(null);
    const [showEditModal, setShowEditModal] = useState(false); // Modal for editing task
    const [editTask, setEditTask] = useState({ startDateTime: '', endDateTime: '' }); // Edit task state

    // Fetch completed tasks on component mount
    useEffect(() => {
        const user = JSON.parse(Cookie.get("signed_in_user"));
        axios.get(`${env.api}/task/user/${user._id}/${user.Email}/tasks`)
            .then((response) => {
                const tasks = response.data.tasks;
                const endedTasks = tasks.filter(task => new Date(task.endDateTime) < new Date());
                setCompletedTasks(endedTasks);
            })
            .catch((error) => {
                console.error("Error fetching tasks:", error);
            });
    }, []);

    // Open description modal
    const handleDescriptionClick = (task) => {
        setSelectedTask(task);
        setShowDescriptionModal(true);
    };

    // Close description modal
    const handleCloseDescriptionModal = () => {
        setShowDescriptionModal(false);
        setSelectedTask(null);
    };

    // Handle task update
    const handleEditTask = (task) => {
        setEditTask({
            ...task
        });
        setShowEditModal(true);
    };

    const handleEditInputChange = (e) => {
        const { name, value } = e.target;
        setEditTask((prevTask) => ({
            ...prevTask,
            [name]: value
        }));
    };

    const handleEditSubmit = (e) => {
        e.preventDefault();
        if (editTask.startDateTime.trim() === '' || editTask.endDateTime.trim() === '') return;

        const startDateTime = new Date(editTask.startDateTime);
        const endDateTime = new Date(editTask.endDateTime);

        if (endDateTime < startDateTime) {
            alert('End date and time cannot be before start date and time.');
            return;
        }

        const user = JSON.parse(Cookie.get("signed_in_user"));
        axios.put(`${env.api}/task/user/${user._id}/tasks/${editTask._id}`, editTask, {
            headers: {
                'Content-Type': 'application/json'
            }
        }).then((response) => {
            setCompletedTasks((prevTasks) => prevTasks.map((task) =>
                task._id === editTask._id ? { ...editTask } : task
            ));

            // Close modals
            setShowEditModal(false);
            setShowDescriptionModal(false);
            setSelectedTask(null);
        }).catch((error) => {
            console.log(error);
        });
    };

    // Render list of completed tasks
    const renderCompletedTasks = () => {
        if (completedTasks.length === 0) {
            return <p>No completed tasks found.</p>;
        }

        return completedTasks.map((task, index) => {
            const startDate = new Date(task.startDateTime);
            const endDate = new Date(task.endDateTime);

            const startDateStr = startDate.toLocaleDateString('en-GB');
            const startTimeStr = startDate.toLocaleTimeString('en-GB');
            const endDateStr = endDate.toLocaleDateString('en-GB');
            const endTimeStr = endDate.toLocaleTimeString('en-GB');

            return (
                <li key={index} className="task-item">
                    <div className="task-content">
                        <div
                            className="color-circle"
                            style={{ backgroundColor: task.color }}
                        ></div>
                        <span className={`task-name ${task.urgent ? 'urgent' : ''}`}>
                            {task.name}
                        </span>
                        <span className="task-date">
                            <i className="fas fa-calendar-alt start-calendar-icon"></i>
                            {" "}
                            {startDateStr}
                            {" "}
                            <i className="fas fa-clock start-clock-icon"></i>
                            {" "}
                            {startTimeStr} -
                            {" "}
                            <i className="fas fa-calendar-alt end-calendar-icon"></i>
                            {" "}
                            {endDateStr}
                            {" "}
                            <i className="fas fa-clock end-clock-icon"></i>
                            {" "}
                            {endTimeStr}
                        </span>
                        <button
                            className="description-button"
                            onClick={() => handleDescriptionClick(task)}
                        >
                            More
                        </button>
                    
                    </div>
                </li>
            );
        });
    };

    return (
        <div className="page-background">
            <div className="todo-container">
                <h1>Task History</h1>
                <div className="todo-list">
                    <ul>{renderCompletedTasks()}</ul>
                </div>
            </div>

            {/* Modal for Viewing Description */}
            {showDescriptionModal && selectedTask && (
                <div className="modal-overlay" onClick={handleCloseDescriptionModal}>
                    <div
                        className="modal-content"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <h2>Task Description</h2>
                        <p><strong>Name:</strong> {selectedTask.name}</p>
                        <p><strong>Start Time:</strong> {new Date(selectedTask.startDateTime).toLocaleString()}</p>
                        <p><strong>End Time:</strong> {new Date(selectedTask.endDateTime).toLocaleString()}</p>
                        <p><strong>Description:</strong> {selectedTask.description}</p>
                        <button
                            className="edit-task-button"
                            onClick={() => handleEditTask(selectedTask)} // Use selectedTask here
                        >
                           Update time
                        </button>
                        <button
                            className="close-description-button"
                            onClick={handleCloseDescriptionModal}
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}

            {/* Modal for Editing Task */}
            {showEditModal && (
                <div className="modal-overlay" onClick={() => setShowEditModal(false)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <h2>Edit Task</h2>
                        <form onSubmit={handleEditSubmit}>

                            <div className="form-group">
                                <label htmlFor="startDateTime">Start Date and Time:</label>
                                <input
                                    type="datetime-local"
                                    id="startDateTime"
                                    name="startDateTime"
                                    value={editTask.startDateTime}
                                    onChange={handleEditInputChange}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="endDateTime">End Date and Time:</label>
                                <input
                                    type="datetime-local"
                                    id="endDateTime"
                                    name="endDateTime"
                                    value={editTask.endDateTime}
                                    onChange={handleEditInputChange}
                                    required
                                />
                            </div>

                            <div className="modal-buttons">
                                <button type="submit" className="submit-button">
                                    Update Task
                                </button>
                                <button
                                    type="button"
                                    className="cancel-button"
                                    onClick={() => setShowEditModal(false)}
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

export default TodoHistory;
