import React, { useState, useEffect } from 'react';
import axios from 'axios';
import env from "../../env.json";

function GroupDetails({ group, currentUserEmail, onClose }) {
  const [members, setMembers] = useState([]);
  const [roles, setRoles] = useState({});
  const [newMemberEmail, setNewMemberEmail] = useState('');
  const [newMemberRole, setNewMemberRole] = useState('');
  const [newCustomRole, setNewCustomRole] = useState('');
  const [customRoles, setCustomRoles] = useState([]);

  const rolesList = ['Member', 'Admin', 'Owner', ...customRoles]; 

  useEffect(() => {
    if (group) {
      setMembers(group.members || []);
      setRoles(group.roles || {});
      setCustomRoles(group.customRoles || []);
    }
  }, [group]);

  // Utility function to check if the current user can manage the group
  const canManageGroup = () => {
    const userRole = roles[currentUserEmail];
    console.log("User Role:", userRole);
    console.log("Email:", currentUserEmail);
    return ['Owner', 'Admin', 'Leader'].includes(userRole);
  };

  const handleAddMember = async () => {
    if (!canManageGroup()) return alert('You do not have permission to add members.');
    if (!newMemberEmail || !newMemberRole) return alert('Member email and role are required.');

    const memberExists = members.some(member => member.email === newMemberEmail);
    if (memberExists) return alert('This member is already part of the group.');

    try {
      const { data: user } = await axios.get(`${env.api}/auth/user/${newMemberEmail}/user-email`);
      const { Username: username, Email: email } = user;
      setMembers((prev) => [...prev, { username, email }]);
      setRoles((prev) => ({ ...prev, [email]: newMemberRole }));

      await axios.put(`${env.api}/group/${group.id}`, {
        members: [...members, { username, email }],
        roles: { ...roles, [email]: newMemberRole },
        customRoles: customRoles
      });

      setNewMemberEmail('');
      setNewMemberRole('');
    } catch (error) {
      console.error('Error adding member:', error);
    }
  };

  const handleRemoveMember = async (email) => {
    if (!canManageGroup()) return alert('You do not have permission to remove members.');

    const updatedMembers = members.filter(member => member.email !== email);
    const updatedRoles = { ...roles };
    delete updatedRoles[email];

    setMembers(updatedMembers);
    setRoles(updatedRoles);

    try {
      await axios.put(`${env.api}/group/${group.id}`, {
        members: updatedMembers,
        roles: updatedRoles,
        customRoles: customRoles
      });
    } catch (error) {
      console.error('Error removing member:', error);
    }
  };

  const handleRoleChange = async (email, newRole) => {
    if (!canManageGroup()) return alert('You do not have permission to change roles.');

    try {
      setRoles((prev) => ({ ...prev, [email]: newRole }));

      await axios.put(`${env.api}/group/${group.id}`, {
        roles: { ...roles, [email]: newRole },
        customRoles: customRoles
      });
    } catch (error) {
      console.error('Error updating role:', error);
    }
  };

  const handleCustomRoleChange = (e) => {
    setNewCustomRole(e.target.value);
  };

  const handleAddCustomRole = async () => {
    if (!canManageGroup()) return alert('You do not have permission to add custom roles.');
    if (newCustomRole && !customRoles.includes(newCustomRole)) {
      setCustomRoles((prev) => [...prev, newCustomRole]);
      await axios.put(`${env.api}/group/${group.id}`, {
        customRoles: customRoles
      });
      setNewCustomRole('');
    }
  };

  return (
    <div className="group-details">
      <h2>{group.name}</h2>
      <button onClick={onClose} className="back-button">Back to Groups</button>

      <h3>Members</h3>
      <ul className="member-list">
        {members.map(({ username, email }) => (
          <li key={email} className="member-item">
            {username} ({email})
            {canManageGroup() && (
              <>
                <button onClick={() => handleRemoveMember(email)} className="remove-member-button">Remove</button>
                <select
                  value={roles[email]}
                  onChange={(e) => handleRoleChange(email, e.target.value)}
                  className="role-dropdown"
                >
                  {rolesList.map((role) => (
                    <option key={role} value={role}>
                      {role}
                    </option>
                  ))}
                </select>
              </>
            )}
          </li>
        ))}
      </ul>

      {canManageGroup() && (
        <div className="add-member-section">
          <h3>Add Member</h3>
          <input
            type="email"
            value={newMemberEmail}
            onChange={(e) => setNewMemberEmail(e.target.value)}
            placeholder="Enter member email"
            className="email-input"
          />
          <select
            value={newMemberRole}
            onChange={(e) => setNewMemberRole(e.target.value)}
            className="role-dropdown"
          >
            <option value="">Select Role</option>
            {rolesList.map((role) => (
              <option key={role} value={role}>
                {role}
              </option>
            ))}
          </select>
          <button onClick={handleAddMember} className="add-button">
            Add Member
          </button>
        </div>
      )}

      {canManageGroup() && (
        <div className="custom-role-section">
          <h3>Add Custom Role</h3>
          <input
            type="text"
            value={newCustomRole}
            onChange={handleCustomRoleChange}
            placeholder="Enter custom role"
            className="role-input"
          />
          <button onClick={handleAddCustomRole} className="add-custom-role-button">
            Add Custom Role
          </button>
        </div>
      )}
    </div>
  );
}

export default GroupDetails;
