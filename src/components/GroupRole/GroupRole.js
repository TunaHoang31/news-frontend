import './GroupRole.scss'
import { useEffect, useState } from "react";
import { fetchGroup } from '../../services/userService';
import { toast } from "react-toastify";
import { fetchAllRole, fetchRolesByGroup, assignRolesToGroup } from '../../services/roleService'
import _ from "lodash";

const GroupRole = () => {
    const [userGroups, setUserGroups] = useState([]);
    const [selectGroups, setSelectGroups] = useState("");
    const [listRoles, setListRoles] = useState([]);
    const [assignRolesByGroup, setAssignRolesByGroup] = useState([]);

    useEffect(() => {
        getGroups();
        getAllRoles();
    }, []);

    const getGroups = async () => {
        let res = await fetchGroup();
        if (res && res.EC === 0) {
            setUserGroups(res.DT);

        } else {
            toast.error(res.EM);
        }
    }
    const getAllRoles = async () => {
        let data = await fetchAllRole();
        if (data && +data.EC === 0) {
            setListRoles(data.DT);
        }
    }

    const handleOnChangeGroup = async (value) => {
        setSelectGroups(value);
        if (value) {
            let data = await fetchRolesByGroup(value);
            if (data && +data.EC === 0) {
                let result = buildDataRolesByGroup(data.DT.Roles, listRoles);
                setAssignRolesByGroup(result);
            }
        }
    }

    const buildDataRolesByGroup = (groupRoles, allRoles) => {
        let result = [];
        if (allRoles && allRoles.length > 0) {
            allRoles.map(role => {
                let object = {};
                object.url = role.url;
                object.id = role.id;
                object.description = role.description;
                object.isAssigned = false;
                if (groupRoles && groupRoles.length > 0) {
                    object.isAssigned = groupRoles.some(item => item.url === object.url)
                }
                result.push(object)
            })
        }
        return result;
    }

    const handleSelectRole = (value) => {
        const _assignRolesByGroup = _.cloneDeep(assignRolesByGroup);
        let foundIndex = _assignRolesByGroup.findIndex(item => +item.id === +value);
        if (foundIndex > -1) {
            _assignRolesByGroup[foundIndex].isAssigned = !_assignRolesByGroup[foundIndex].isAssigned;
        }
        setAssignRolesByGroup(_assignRolesByGroup);
    }

    const buildDataToSave = () => {
        let result = {};
        const _assignRolesByGroup = _.cloneDeep(assignRolesByGroup);
        result.groupId = selectGroups;
        let groupRolesFilter = _assignRolesByGroup.filter(item => item.isAssigned === true);
        let finalGroupRoles = groupRolesFilter.map(item => {
            let data = { groupId: +selectGroups, roleId: +item.id };
            return data;
        })

        result.groupRoles = finalGroupRoles;
        return result;
    }
    const handleSave = async () => {
        let data = buildDataToSave();
        let res = await assignRolesToGroup(data);
        if (res && res.EC === 0) {
            toast.success(res.EM)
        } else {
            toast.error(res.EM)
        }
    }

    return (
        <div className='group-role-container'>
            <div className='container'>
                <div className='container mt-3'>
                    <h3>Danh sách quyền của người dùng</h3>
                    <div className='assign-group-role'>
                        <div className='col-12 col-sm-6 form-group'>
                            <label> <h6>Nhóm Tài khoản: (<span className='red'>*</span>) :</h6></label>
                            <select
                                className={'form-select'}
                                onChange={(event) => handleOnChangeGroup(event.target.value)}
                            >
                                <option value=''>Hãy chọn nhóm người dùng</option>

                                {userGroups.length > 0 && userGroups.map((item, index) => {
                                    return (
                                        <option key={`group-${index}`} value={item.id} >{item.name}</option>
                                    )
                                })
                                }
                            </select>
                        </div>
                        <hr />
                        {selectGroups &&
                            <div className='roles'>
                                <h5> Vai trò:</h5>
                                {
                                    assignRolesByGroup && assignRolesByGroup.length > 0
                                    && assignRolesByGroup.map((item, index) => {
                                        return (
                                            <div className="form-check" key={`list-role-${index}`}>
                                                <input
                                                    className="form-check-input"
                                                    type="checkbox"
                                                    value={item.id}
                                                    id={`list-role-${index}`}
                                                    checked={item.isAssigned}
                                                    onChange={(event) => handleSelectRole(event.target.value)}
                                                />
                                                <label className="form-check-label" htmlFor={`list-role-${index}`}>
                                                    {item.url}
                                                </label>
                                            </div>
                                        )
                                    })
                                }
                                <div className='mt-3'>
                                    <button className='btn btn-warning' onClick={() => handleSave()}>Lưu</button>
                                </div>
                            </div>
                        }
                    </div>
                </div>
            </div>
        </div >
    )
}

export default GroupRole;