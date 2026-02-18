import API from './api';

export const createTask = async (taskData) => {
    const { data } = await API.post('/tasks', taskData);
    return data;
};

export const getTasks = async (params = {}) => {
    const { data } = await API.get('/tasks', { params });
    return data.tasks || [];
};

export const getTask = async (id) => {
    const { data } = await API.get(`/tasks/${id}`);
    return data;
};

export const updateTask = async (id, taskData) => {
    const { data } = await API.put(`/tasks/${id}`, taskData);
    return data;
};

export const updateTaskStatus = async (id, status) => {
    const { data } = await API.patch(`/tasks/${id}/status`, { status });
    return data;
};

export const deleteTask = async (id) => {
    const { data } = await API.delete(`/tasks/${id}`);
    return data;
};
