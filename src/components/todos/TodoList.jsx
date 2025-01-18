import axios from 'axios';
import Cookie from "js-cookie";
import React, { useEffect, useState } from 'react';
import env from "../../env.json";
import './todoList.css';

function TodoList() {
    const [tasks, setTasks] = useState([]);
    const [legend, setLegend] = useState({});
    const [showDescriptionModal, setShowDescriptionModal] = useState(false);
    const [selectedTask, setSelectedTask] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);  // Modal for editing task
    const [newTask, setNewTask] = useState({
        name: '',
        urgent: false,
        color: '#3498db', // Default color
        startDateTime: '',
        endDateTime: '',
        description: '',
    });

    const [editTask, setEditTask] = useState({
        name: '',
        urgent: false,
        color: '#3498db',
        startDateTime: '',
        endDateTime: '',
        description: '',
    });

    const filters = [
        '#1abc9c', '#2ecc71', '#3498db', '#9b59b6', '#f1c40f', '#e67e22', '#e74c3c', '#34495e', '#95a5a6', '#7f8c8d'
    ];

    const colorMap = {
      green1: '#1abc9c', // turquoise
      green2: '#2ecc71', // green
      blue: '#3498db',   // blue
      purple: '#9b59b6', // purple
      yellow: '#f1c40f', // yellow
      orange: '#e67e22', // orange
      red: '#e74c3c',    // red
      black: '#34495e',  // navy
      silver: '#95a5a6', // gray
      gray: '#7f8c8d',   // darkgray
    };

    useEffect(() => {
        const user = JSON.parse(Cookie.get("signed_in_user"));
        console.log("Parsed Cookie Data:", user);
    axios.get(`${env.api}/task/user/${user._id}/tasks`).then((response) => {
            setTasks(response.data.tasks);
          setLegend(user.legend || {}); // Default to an empty object if no legend exists
    }).catch((error) => {
            console.log(error);
        });
    }, [showModal,showColorModal]);

    const handleDeleteTask = async (id) => {
        const user = JSON.parse(Cookie.get("signed_in_user"));
        if (window.confirm('Are you sure you want to delete this task?')) {
            try {
                const response = await fetch(`${env.api}/task/user/${user._id}/tasks/${id}`, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });

                if (response.ok) {
                    setTasks((prevTasks) => prevTasks.filter((task) => task._id !== id)); // Use _id to filter
                    alert('Task deleted successfully.');

                    // Close the modal and reset selectedTask
                    setShowDescriptionModal(false);
                    setSelectedTask(null);
                } else {
                    const errorData = await response.json();
                    alert(`Failed to delete task: ${errorData.message}`);
                }
            } catch (error) {
                alert(`Error: ${error.message}`);
            }
        }
    };


    const handleAddTask = () => {
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setNewTask({
            name: '',
            urgent: false,
            color: '#3498db',
            startDateTime: '',
            endDateTime: '',
            description: '',
        });
    };

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setNewTask((prevTask) => ({
            ...prevTask,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };

  const saveLegend = () => {
    const user = JSON.parse(Cookie.get("signed_in_user"));
    console.log("Saved Legend Data:", legend);
    const updatedUser = { ...user, legend }; // Posodobi samo legend
    const updatedLegend = {
      legend: legend, // Predpostavlja se, da imaš spremenljivko "legend", ki vsebuje nove podatke
  };
    axios.put(`${env.api}/auth/user/${user._id}/update-data`, updatedLegend)
    .then((response) => {
      alert("Legend updated successfully!");
      setShowColorModal(false); // Close modal
      Cookie.set("signed_in_user", JSON.stringify(updatedUser)); // Posodobi Cookie
    })
    .catch((error) => {
      console.error("Error updating legend:", error);
      alert("Failed to update legend.");
    });
    
  };
  

  // Handle submitting the new task
  const handleSubmit = (e) => {
    
    e.preventDefault();
    if (newTask.name.trim() === '') return;

        const startDateTime = new Date(newTask.startDateTime);
        const endDateTime = new Date(newTask.endDateTime);

        if (endDateTime < startDateTime) {
            alert('End date and time cannot be before start date and time.');
            return;
        }

        const user = JSON.parse(Cookie.get("signed_in_user"));
        axios.post(`${env.api}/task/user/${user._id}/tasks`, newTask, {
            headers: {
                'Content-Type': 'application/json'
            }
        }).then((response) => {
            handleCloseModal();
        }).catch((error) => {
            console.log(error);
        });
    };

  // Render tasks
  const renderTasks = () => {
    return tasks.map((task, index) => (
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
            {/* Display start date and end date with time */}
            {new Date(task.startDateTime).toLocaleString('en-GB')} -{' '}
            {new Date(task.endDateTime).toLocaleString('en-GB')}
          </span>
        </div>
      </li>
    ));
  };

  return (
    <div className="page-background">
      <div className="todo-container">
        <h1>My Todos</h1>
        <div className="todo-list">
          <div className="todo-header">
            <button className="color-modal-button" onClick={() => setShowColorModal(true)} 
            style={{ marginRight: '10px', backgroundColor: '#3498db',
                  color: '#fff',
                  border: 'none',
                  height: '35px',
                  borderRadius: '50%',
                  padding: '0 15px',
                  fontSize: '16px',
                  textAlign:'center',
                  lineHeight: '35px',
                  cursor: 'pointer',
                  transition: 'background-color 0.3s'}} onMouseOver={() => {
                    document.querySelector('.color-modal-button').style.backgroundColor = '#2980b9';
                  }} onMouseOut={() => {
                    document.querySelector('.color-modal-button').style.backgroundColor = '#3498db';
                  }}>
              Colorr Legend
            </button>
            <button className="add-task-button" onClick={handleAddTask}>
              +
            </button>
          </div>
          <ul>{renderTasks()}</ul>
        </div>
      </div>

            <div className="todo-container">
                <h1>Upcoming Tasks (Next 24 Hours)</h1>
                <div className="todo-list">
                        <ul>{renderUpcomingTasks()}</ul>
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
                        <p>
                            <strong>Time Left Until Deadline:</strong> {calculateTimeLeft(selectedTask.endDateTime)}
                        </p>
                        <p><strong>Description:</strong> {selectedTask.description}</p>

                        <button
                            className="edit-task-button"
                            onClick={() => handleEditTask(selectedTask)} // Use selectedTask here
                        >
                            Edit
                        </button>

                        <button
                            className="close-description-button"
                            onClick={handleCloseDescriptionModal}
                        >
                            Close
                        </button>

                        <button
                            className="delete-task-button"
                            onClick={() => handleDeleteTask(selectedTask._id)}
                        >
                            Delete Task
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
                                <label htmlFor="taskName">Task Name:</label>
                                <input
                                    type="text"
                                    id="taskName"
                                    name="name"
                                    value={editTask.name}
                                    onChange={handleEditInputChange}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Select Color:</label>
                                <div className="color-options">
                                    {filters.map((color, index) => (
                                        <div
                                            key={index}
                                            className={`color-circle ${editTask.color === color ? 'selected' : ''}`}
                                            style={{ backgroundColor: color }}
                                            onClick={() => setEditTask((prev) => ({ ...prev, color }))}
                                        />
                                    ))}
                                </div>
                            </div>

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

                            <div className="form-group">
                                <label htmlFor="description">Description:</label>
                                <textarea
                                    id="description"
                                    name="description"
                                    value={editTask.description}
                                    onChange={handleEditInputChange}
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

            {/* Modal for Adding New Task */}
            {showModal && (
                <div className="modal-overlay" onClick={handleCloseModal}>
                    <div
                        className="modal-content"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <h2>Add New Task</h2>
                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label htmlFor="taskName">Task Name:</label>
                                <input
                                    type="text"
                                    id="taskName"
                                    name="name"
                                    value={newTask.name}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label>Select Color:</label>
                                <div className="color-options">
                                    {filters.map((color, index) => (
                                        <div
                                            key={index}
                                            className={`color-circle ${newTask.color === color ? 'selected' : ''}`}
                                            style={{ backgroundColor: color }}
                                            onClick={() => setNewTask((prevTask) => ({ ...prevTask, color }))}
                                        />
                                    ))}
                                </div>
                            </div>

                            <div className="form-group">
                                <label htmlFor="startDateTime">Start Date and Time:</label>
                                <input
                                    type="datetime-local"
                                    id="startDateTime"
                                    name="startDateTime"
                                    value={newTask.startDateTime}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="endDateTime">End Date and Time:</label>
                                <input
                                    type="datetime-local"
                                    id="endDateTime"
                                    name="endDateTime"
                                    value={newTask.endDateTime}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="description">Description:</label>
                                <textarea
                                    id="description"
                                    name="description"
                                    value={newTask.description}
                                    onChange={handleInputChange}
                                    placeholder="Enter task description"
                                />
                            </div>

                            <div className="form-group checkbox-group">
                                <label>
                                    <input
                                        type="checkbox"
                                        name="urgent"
                                        checked={newTask.urgent}
                                        onChange={handleInputChange}
                                    />
                                    Mark as urgent
                                </label>
                            </div>

              {/* Buttons */}
              <div className="modal-buttons">
                <button type="submit" className="submit-button">
                  Add Task
                </button>
                <button
                  type="button"
                  className="cancel-button"
                  onClick={handleCloseModal}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {showColorModal && (
      <div className="modal-overlay" onClick={() => setShowColorModal(false)}>
        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
          <h2>Edit Legend</h2>
          <div className="color-options-modal">
            {Object.entries(legend).map(([color, value], index) => (
              <div key={index} className="color-option">
                <div
                  className="color-circle"
                  style={{ backgroundColor: colorMap[color]}} // Uporabi preslikavo
                ></div>
                <input
                  type="text"
                  value={value}
                  onChange={(e) => 
                    setLegend((prev) => ({ ...prev, [color]: e.target.value }))
                  }
                  placeholder={`Enter legend for ${color}`}
                />
              </div>
            ))}
          </div>
          <div className="modal-buttons">
            <button
              className="save-legend-button"
              onClick={() => saveLegend()}
            >
              Save Legend
            </button>
          </div>
        </div>
      </div>
    )}

    </div>
  );
}

export default TodoList;
