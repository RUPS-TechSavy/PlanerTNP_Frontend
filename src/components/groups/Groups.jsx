import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Cookie from 'js-cookie';
import env from "../../env.json";
import './groups.css';

import GroupsList from './GroupsList';
import AddGroup from './AddGroup';
import GroupDetails from './GroupDetails';

function Groups() {
    const [groups, setGroups] = useState([]);
    const [selectedGroup, setSelectedGroup] = useState(null);
    const user = JSON.parse(Cookie.get('signed_in_user'));

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

    const handleGroupAdded = (newGroup) => {
        setGroups((prevGroups) => [...prevGroups, newGroup]);
    };

    return (
        <div className="groups-container">
            <div className="groups-content-wrapper">
                <div className="groups-heading">Groups</div>
                <div className="groups-content">
                    <div className="groups-list">
                        <GroupsList
                            groups={groups}
                            onSelectGroup={setSelectedGroup}
                            selectedGroupId={selectedGroup?.id}
                        />
                    </div>
                    <div className="add-group">
                        {selectedGroup ? (
                            <GroupDetails
                                group={selectedGroup}
                                currentUserEmail={user.Email}
                                onClose={() => setSelectedGroup(null)}
                            />
                        ) : (
                            <AddGroup onGroupAdded={handleGroupAdded} />
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Groups;
