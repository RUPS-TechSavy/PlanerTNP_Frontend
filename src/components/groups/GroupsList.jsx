import React from 'react';
import './groups.css';

function GroupsList({ groups, onSelectGroup, selectedGroupId }) {
  return (
    <div className="groups-list">
      <h2>Your Groups</h2>
      <ul>
        {groups.map((group) => (
          <li
            key={group.id}
            onClick={() => onSelectGroup(group)}
            className={selectedGroupId === group.id ? 'selected' : ''}
          >
            {group.name}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default GroupsList;
