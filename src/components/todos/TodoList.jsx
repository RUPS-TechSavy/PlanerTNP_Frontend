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
  const [groups, setGroups] = useState([]);
  const [showEditModal, setShowEditModal] = useState(false);  // Modal for editing task
  const [showColorModal, setShowColorModal] = useState(false);
  const [newTask, setNewTask] = useState({
    name: '',
    urgent: false,
    public: false,
    color: '#3498db',
    startDateTime: '',
    endDateTime: '',
    groups: [],
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
    axios.get(`${env.api}/task/user/${user._id}/${user.Email}/tasks`).then((response) => {
      setTasks(response.data.tasks);
      setLegend(user.legend || {}); // Default to an empty object if no legend exists
    }).catch((error) => {
      console.log(error);
    });
  }, [showModal, showColorModal]);

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const user = JSON.parse(Cookie.get('signed_in_user'));
        const response = await axios.get(`${env.api}/group/${user.Email}/member-groups`);
        console.log("Groups Response:", response.data);

        const mappedGroups = response.data.map((group) => ({
          id: group._id || "", // Map "_id" to "id"
          name: group.name || "", // Map "name" to "name"
          members: group.members || [], // Map "members" to "members"
          roles: group.roles || {}, // Map "roles" to "roles"
          customRoles: group.customRoles || [], // Map "customRoles" to "customRoles"
        }));

        setGroups(mappedGroups);
      } catch (error) {
        console.error('Error fetching groups:', error);
      }
    };

    fetchGroups();
  }, []);

  const handleDeleteTask = async (id) => {
    //delete task
    try {
      const user = JSON.parse(Cookie.get('signed_in_user'));
      await axios.delete(`${env.api}/task/user/${user._id}/tasks/${id}`);
      setTasks((prevTasks) => prevTasks.filter((task) => task._id !== id));
      setShowDescriptionModal(false);
      setSelectedTask(null);
    } catch (error) {
      console.error('Error deleting task:', error);
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

  // Handle input changes in the modal
  const handleInputChange = (e) => {
    const { name, value, type, checked, multiple } = e.target;

    if (multiple) {
      const selectedOptions = Array.from(e.target.selectedOptions, (option) => option.value);
      setNewTask((prevTask) => ({
        ...prevTask,
        [name]: selectedOptions,
      }));
    } else {
      setNewTask((prevTask) => ({
        ...prevTask,
        [name]: type === 'checkbox' ? checked : value,
      }));
    }
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

  const renderTasks = () => {
    const now = new Date();
    return tasks
      .filter(task => new Date(task.endDateTime) > now) // Exclude finished tasks
      .map((task, index) => {
        const startDate = new Date(task.startDateTime);
        const endDate = new Date(task.endDateTime);

        // Format start and end dates and times
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

  const handleDescriptionClick = (task) => {
    setSelectedTask(task);
    setShowDescriptionModal(true);
  };

  const handleCloseDescriptionModal = () => {
    setShowDescriptionModal(false);
    setSelectedTask(null);
  };

  const calculateTimeLeft = (endDateTime) => {
    const now = new Date();
    const endDate = new Date(endDateTime);
    const diff = endDate - now;

    if (diff <= 0) {
      return "Deadline passed";
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)); // Calculate remaining minutes

    if (days === 0 && hours === 0) {
      return `${minutes} minute(s) left`;
    }

    return `${days} day(s), ${hours} hour(s), and ${minutes} minute(s) left`;
  };

  const filterUpcomingTasks = () => {
    const now = new Date();
    const next24Hours = new Date(now.getTime() + 24 * 60 * 60 * 1000);
    return tasks.filter(task => {
      const startDateTime = new Date(task.startDateTime);
      return startDateTime > now && startDateTime <= next24Hours;
    });
  };

  const handleEditTask = (task) => {
    setEditTask({
      ...task
    });
    setShowEditModal(true);
  };

  const handleEditInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setEditTask((prevTask) => ({
      ...prevTask,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    if (editTask.name.trim() === '') return;

    const startDateTime = new Date(editTask.startDateTime);
    const endDateTime = new Date(editTask.endDateTime);

    if (endDateTime < startDateTime) {
      alert('End date and time cannot be before start date and time.');
      return;
    }

    const user = JSON.parse(Cookie.get("signed_in_user"));
    //update task
    axios.put(`${env.api}/task/tasks/${editTask._id}`, editTask)
      .then((response) => {
        setTasks((prevTasks) => prevTasks.map((task) =>
          task._id === editTask._id ? { ...editTask } : task
        ));

        // Close edit modal
        setShowEditModal(false);

        // Close description modal if open
        setShowDescriptionModal(false);
        setSelectedTask(null);
      }).catch((error) => {
        console.log(error);
      });
  };

  const renderUpcomingTasks = () => {
    const upcomingTasks = filterUpcomingTasks();

    if (upcomingTasks.length === 0) {
      return <p>No tasks starting in the next 24 hours.</p>;
    }

    return upcomingTasks.map((task, index) => {
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
        <h1>My Todos</h1>
        <div className="todo-list">
          <div className="todo-header">
            <button className="color-modal-button" onClick={() => setShowColorModal(true)}
              style={{
                marginRight: '10px', backgroundColor: '#3498db',
                color: '#fff',
                border: 'none',
                height: '35px',
                borderRadius: '50%',
                padding: '0 15px',
                fontSize: '16px',
                textAlign: 'center',
                lineHeight: '35px',
                cursor: 'pointer',
                transition: 'background-color 0.3s'
              }} onMouseOver={() => {
                document.querySelector('.color-modal-button').style.backgroundColor = '#2980b9';
              }} onMouseOut={() => {
                document.querySelector('.color-modal-button').style.backgroundColor = '#3498db';
              }}>
              Color Legend
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

              <div className="form-group">
                <label htmlFor="groups">Select Groups:</label>
                <select
                  id="groups"
                  name="groups"
                  multiple
                  value={editTask.groups}
                  onChange={handleInputChange}
                  style={{
                    display: 'block',
                    margin: 'auto',
                    width: '80%',
                    height: '120px',
                    borderRadius: '10px',
                    padding: '10px',
                    border: '2px solid #ddd',
                    backgroundColor: '#fff',
                  }}
                >
                  {groups.map((group, index) => (
                    <option key={index} value={group.id}>
                      {group.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Urgent Checkbox */}
              <div className="form-group checkbox-group">
                <label>
                  <input
                    type="checkbox"
                    name="urgent"
                    checked={editTask.urgent}
                    onChange={handleInputChange}
                  />
                  Mark as urgent
                </label>
              </div>

              {/* Public Checkbox */}
              <div className="form-group checkbox-group">
                <label>
                  <input
                    type="checkbox"
                    name="public"
                    checked={editTask.public}
                    onChange={handleInputChange}
                  />
                  Make this task public
                </label>
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

              {/* Select Groups */}
              <div className="form-group">
                <label htmlFor="groups">Select Groups:</label>
                <select
                  id="groups"
                  name="groups"
                  multiple
                  value={newTask.groups}
                  onChange={handleInputChange}
                  style={{
                    display: 'block',
                    margin: 'auto',
                    width: '80%',
                    height: '120px',
                    borderRadius: '10px',
                    padding: '10px',
                    border: '2px solid #ddd',
                    backgroundColor: '#fff',
                  }}
                >
                  {groups.map((group, index) => (
                    <option key={index} value={group.id}>
                      {group.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Urgent Checkbox */}
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

              {/* Public Checkbox */}
              <div className="form-group checkbox-group">
                <label>
                  <input
                    type="checkbox"
                    name="public"
                    checked={newTask.public}
                    onChange={handleInputChange}
                  />
                  Make this task public
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
                    style={{ backgroundColor: colorMap[color] }} // Uporabi preslikavo
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
