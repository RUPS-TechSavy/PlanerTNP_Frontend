import React, { useState } from 'react';
import axios from 'axios';
import Cookie from 'js-cookie';
import env from "../../env.json";

function AddGroup({ onGroupAdded }) {
  const [groupName, setGroupName] = useState('');

  const handleAddGroup = async () => {
    if (!groupName) return alert('Group name is required.');
    try {
      const user = JSON.parse(Cookie.get('signed_in_user'));
      
      const { data: userData } = await axios.get(`${env.api}/auth/user/${user._id}/get-profile`);
      const { Email, Username } = userData;

      const response = await axios.post(`${env.api}/group/`, {
        name: groupName,
        members: [{ email: Email, username: Username }], // Adjust structure based on your backend
        roles: { [Email]: 'Owner' },
      });

      onGroupAdded(response.data.group);
      setGroupName('');
    } catch (error) {
      console.error('Error adding group:', error);
    }
  };

  return (
    <div className="add-group">
      <h2>Add New Group</h2>
      <input
        type="text"
        value={groupName}
        onChange={(e) => setGroupName(e.target.value)}
        placeholder="Enter group name"
      />
      <button onClick={handleAddGroup}>Add Group</button>
    </div>
  );
}

export default AddGroup;
