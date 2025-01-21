import axios from 'axios';
import Cookie from "js-cookie";
import { useEffect, useRef, useState } from "react";
import '../../App.css';
import env from "../../env.json";
import './calendar.css';

function getStartOfWeek(date) {
    const dayOfWeek = date.getDay();
    const difference = date.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1);
    return new Date(date.setDate(difference));
}

function addDays(date, days) {
    const newDate = new Date(date);
    newDate.setDate(date.getDate() + days);
    return newDate;
}

const filters = [
    '#1abc9c',
    '#2ecc71',
    '#3498db',
    '#9b59b6',
    '#f1c40f',
    '#e67e22',
    '#e74c3c',
    '#34495e',
    '#95a5a6',
    '#7f8c8d',
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

const tmpdata = [
    { "task_name": "overflow: hidden;", "description": "neke neke", "color": '#e74c3c', "start_time": "2024-10-22T14:00:00", "end_time": "2024-10-22T16:00:00" },
    { "task_name": "task2", "description": "neke neke", "color": '#9b59b6', "start_time": "2024-10-22T14:00:00", "end_time": "2024-10-23T16:00:00" },
    { "task_name": "task3", "description": "neke neke", "color": "#2ecc71", "start_time": "2024-10-23T18:00:00", "end_time": "2024-10-24T20:00:00" },
    { "task_name": "task4", "description": "neke neke", "color": "#7f8c8d", "start_time": "2024-10-24T22:00:00", "end_time": "2024-10-25T23:00:00" }
];


function Calendar() {
    const [signedIn, setSignedIn] = useState(false);
    const [currentWeek, setCurrentWeek] = useState(getStartOfWeek(new Date()));
    const [selectedFilter, setSelectedFilter] = useState(null);
    const [tasks, setTasks] = useState([]);
    const [schedules, setSchedules] = useState([]);
    const [groups, setGroups] = useState([]);
    const [selectedGroup, setSelectedGroup] = useState(null); // Add state for selected group
    const fileInputRef = useRef(null);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [legend, setLegend] = useState({});

    useEffect(() => {
        if (Cookie.get("signed_in_user") !== undefined) {
            const user = JSON.parse(Cookie.get("signed_in_user"));
            setSignedIn(user);
            setLegend(user.legend);

            axios.get(`${env.api}/group/${user.Email}/member-groups`)
                .then(response => {
                    const mappedGroups = response.data.map(group => ({
                        id: group._id || "",
                        name: group.name || "",
                    }));
                    setGroups(mappedGroups);
                })
                .catch(error => console.error("Error fetching groups:", error));


            // Fetch tasks and schedules in parallel
            Promise.all([
                axios.get(`${env.api}/task/user/${user._id}/${user.Email}/tasks`),
                axios.get(`${env.api}/schedule/schedules/all`)
            ])
                .then(([taskResponse, scheduleResponse]) => {
                    const userTasks = taskResponse.data.tasks;
                    const schedules = scheduleResponse.data.tasks;  // Assuming schedules are in 'tasks'

                    // Map over schedules to match task properties
                    const formattedSchedules = schedules.map(schedule => ({
                        _id: user._id,
                        name: schedule.name,
                        color: schedule.color,
                        startDateTime: schedule.start_time,  // Rename to match tasks' format
                        endDateTime: schedule.end_time       // Rename to match tasks' format
                    }));

                    // Combine user tasks and formatted schedules into a single array
                    const combinedTasks = [...userTasks, ...formattedSchedules];
                    setTasks(combinedTasks);

                    // Log the combined tasks array
                    console.log("Fetched and combined tasks:", combinedTasks);
                })
                .catch((error) => {
                    console.error("Error fetching tasks or schedules:", error);
                });
        } else {
            setSignedIn(false);

            axios.get(`${env.api}/task/public`)
                .then((response) => {
                    setTasks(response.data.tasks || []);
                    console.log("Fetched public tasks:", response.data.tasks);
                })
                .catch((error) => {
                    console.error("Error fetching public tasks:", error);
                });

        }
    }, []);


    const handlePrevWeek = () => {
        setCurrentWeek(addDays(currentWeek, -7));
    };

    const handleNextWeek = () => {
        setCurrentWeek(addDays(currentWeek, 7));
    };

    const weekDays = [];
    for (let i = 0; i < 7; i++) {
        weekDays.push(addDays(currentWeek, i));
    }

    const timeSlots = [];
    for (let i = 0; i < 24 * 2; i++) {
        const hours = Math.floor(i / 2);
        const minutes = i % 2 === 0 ? "00" : "30";
        timeSlots.push(`${hours.toString().padStart(2, '0')}:${minutes}`);
    }

    const isSameDay = (d1, d2) => {
        return d1.getFullYear() === d2.getFullYear() &&
            d1.getMonth() === d2.getMonth() &&
            d1.getDate() === d2.getDate();
    };

    const filteredTasks = tasks.filter(task => {
        const startDate = new Date(task.startDateTime);
        const endDate = new Date(task.endDateTime);

        return weekDays.some(day => (
            (startDate <= day && endDate >= day) // Checks if the task spans across the week
        ));
    });



    const renderTaskInTimeSlot = (day, slot) => {
        const slotHour = parseInt(slot.split(":")[0]);
        const slotMinutes = parseInt(slot.split(":")[1]);

        const slotStartTime = new Date(day);
        slotStartTime.setHours(slotHour, slotMinutes, 0, 0); 

        const slotEndTime = new Date(slotStartTime);
        slotEndTime.setMinutes(slotStartTime.getMinutes() + 30); 

        const dayTasks = tasks.filter(task => {
            const taskStart = new Date(task.startDateTime);
            const taskEnd = new Date(task.endDateTime);

            return (
                (taskStart >= slotStartTime && taskStart < slotEndTime) || 
                (taskStart < slotStartTime && taskEnd > slotStartTime)     
            );
        });

        return dayTasks.map((task, index) => {
            const taskStart = new Date(task.startDateTime);

            const isFirstSlot =
                taskStart >= slotStartTime &&
                taskStart < slotEndTime;

            return selectedFilter !== null && task.color !== filters[selectedFilter] ? null : (
                <p
                    key={index}
                    className="task-ribbon"
                    style={{
                        backgroundColor: task.color,
                        borderTop: isFirstSlot ? "1px solid #ddd" : "none",
                        marginTop: isFirstSlot ? "0" : "-1px", 
                        padding: 0,
                        boxSizing: "border-box"
                    }}
                >
                    {isFirstSlot && <b>{task.name}</b>}
                </p>
            );
        });
    };

    const handleFileImport = (event) => {
        const file = event.target.files[0];
        if (file && file.type === "application/json") {
            const reader = new FileReader();
            reader.onload = (e) => {
                const jsonData = JSON.parse(e.target.result);
                setTasks(prevTasks => [...prevTasks, jsonData]);
                console.log(jsonData);
            };
            reader.readAsText(file);
        } else {
            alert("Please select a valid JSON file.");
        }
    };

    const handleToggleDropdown = () => {
        setIsDropdownOpen(prev => !prev);
    };

    return (
        <div className='calendar-wrapper'>
            <div className="calendar-container">
                <div className="calendar-header">
                    <button className="change-week" onClick={handlePrevWeek}>←</button>
                    <h2>Week of {currentWeek.toDateString()}</h2>
                    <button className="change-week" onClick={handleNextWeek}>→</button>
                </div>

                {/* Dropdown Legend */}
                {signedIn !== false && (
                    <div className="dropdown-container">
                        {!isDropdownOpen ? (
                            <button className="dropdown-toggle" onClick={handleToggleDropdown}>
                                Open Legend
                            </button>
                        ) : (
                            <div className="dropdown-menu">
                                <button className="close-dropdown" onClick={handleToggleDropdown}>
                                    Close Legend
                                </button>
                                <p>Legend Content</p>
                                <div className="color-options-modal">
                                    {Object.entries(legend).map(([color, value], index) => (
                                        <div key={index} className="color-option" style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                                            <div
                                                className="color-circle"
                                                style={{ backgroundColor: colorMap[color] || color, width: '20px', height: '20px', borderRadius: '50%' }}
                                            ></div>
                                            <label className="legend-label">{value || `Legend for ${color}`}</label>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* Color Filters */}
                <div className="color-filters">
                    <div>Color:</div>
                    {filters.map((filter, index) => (
                        <div
                            key={index}
                            onClick={() => setSelectedFilter(index)}
                            className={`${selectedFilter === index ? 'active-filter' : ''}`}
                            style={{ backgroundColor: filter }}
                        ></div>
                    ))}
                    <div className="clear-filter" onClick={() => setSelectedFilter(null)}>Clear</div>
                </div>

                {/* Group Filters */}
                {signedIn !== false && (
                <div className="group-filters">
                    <div>Groups:</div>
                    {groups.map((group, index) => (
                        <div
                            key={index}
                            onClick={() => setSelectedGroup(index)}
                            className={`${selectedGroup === index ? 'active-filter' : ''}`}
                        >
                            {group.name}
                        </div>
                    ))}
                    <div className="clear-filter" onClick={() => setSelectedGroup(null)}>Clear</div>
                </div>
                )}
                
                {/* Calendar Grid */}
                <div className="calendar-grid-wrapper">
                    <div className="time-label-column">
                        {timeSlots.map((slot, slotIndex) => (
                            <div key={slotIndex} className="time-label">{slot}</div>
                        ))}
                    </div>
                    <div className="calendar-grid">
                        {weekDays.map((day, index) => (
                            <div key={index}>
                                <h3>{day.toDateString()}</h3>
                                <div className="calendar-day">
                                    <div className="time-slots">
                                        {timeSlots.map((slot, slotIndex) => (
                                            <div key={slotIndex} className="time-slot">
                                                <div className="content-area">
                                                    {renderTaskInTimeSlot(day, slot)}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Import Data */}
                {signedIn !== false && (
                    <div className="import-data">
                        <span>Import your own schedule: </span>
                        <input type="file" accept=".json" ref={fileInputRef} onChange={handleFileImport} />
                    </div>
                )}
            </div>
        </div>
    );

}

export default Calendar;
