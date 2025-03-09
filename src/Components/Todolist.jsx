import React, { useState, useEffect } from 'react';
import Navbar from './Navbar';
import { Checkbox } from "antd";
import { readDataFirestore, addTaskFirestore, deleteTaskFirestore, updateTaskFirestore } from '../config/firestoreCalls';
import { userListener } from '../config/authCall';

const TodoList = () => {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');
  const [currentUser, setCurrentUser] = useState(null);
  const [userPermissions, setUserPermissions] = useState({
    create: false,
    delete: false,
    read: false
  });

  useEffect(() => {
    const unsubscribe = userListener((user) => {
      if (user) {
        setCurrentUser(user);
        fetchUserPermissions(user.email);
      } else {
        setCurrentUser(null);
        setUserPermissions({
          create: false,
          delete: false,
          read: false
        });
      }
    });

    return () => unsubscribe;
  }, []);

  useEffect(() => {
    if (currentUser && userPermissions.read) {
      loadTasks();
    }
  }, [currentUser, userPermissions]);

  const fetchUserPermissions = async (email) => {
    try {
      const querySnapshot = await readDataFirestore('Users');
      const users = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      const userDoc = users.find(user => user.email === email);
      
      if (userDoc && userDoc.permissions) {
        setUserPermissions({
          create: userDoc.permissions.create || false,
          delete: userDoc.permissions.delete || false,
          read: userDoc.permissions.read || false
        });
      } else {
        console.log("No se encontraron permisos para este usuario");
        setUserPermissions({
          create: false,
          delete: false,
          read: false
        });
      }
    } catch (error) {
      console.error("Error al obtener permisos:", error);
    }
  };

  const loadTasks = async () => {
    if (!userPermissions.read) return;
    
    const querySnapshot = await readDataFirestore('tasks');
    const tasksData = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    
   
    const sortedTasks = tasksData.sort((a, b) => {
      const dateA = a.createdAt instanceof Date ? a.createdAt : a.createdAt.toDate();
      const dateB = b.createdAt instanceof Date ? b.createdAt : b.createdAt.toDate();
      return dateB - dateA;
    });
    
    setTasks(sortedTasks);
  };

  const addTask = async () => {
    if (!currentUser || !userPermissions.create) {
      alert("No tienes permiso para crear tareas");
      return;
    }

    if (newTask.trim() !== '') {
      const task = {
        text: newTask,
        completed: false,
        createdBy: currentUser.email,
        createdAt: new Date()
      };
      const taskId = await addTaskFirestore('tasks', task);
      
      setTasks([{ id: taskId, ...task }, ...tasks]);
      setNewTask('');
    }
  };

  const toggleTask = async (id) => {
    const taskToUpdate = tasks.find(task => task.id === id);
    if (!taskToUpdate) return;

    const updatedTasks = tasks.map((task) =>
      task.id === id ? { ...task, completed: !task.completed } : task
    );
    
    
    const sortedTasks = [...updatedTasks].sort((a, b) => {
      const dateA = a.createdAt instanceof Date ? a.createdAt : a.createdAt.toDate();
      const dateB = b.createdAt instanceof Date ? b.createdAt : b.createdAt.toDate();
      return dateB - dateA;
    });
    
    setTasks(sortedTasks);
    await updateTaskFirestore('tasks', id, !taskToUpdate.completed);
  };

  const removeTask = async (id) => {
    if (!currentUser || !userPermissions.delete) {
      alert("No tienes permiso para eliminar tareas");
      return;
    }

    await deleteTaskFirestore('tasks', id);
    const filteredTasks = tasks.filter((task) => task.id !== id);
    setTasks(filteredTasks);
  };

  if (!userPermissions.read) {
    return (
      <div>
        <Navbar />
        <div className="todo-container">
          <h2>No tienes permiso para ver tareas</h2>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Navbar />
      <div className="todo-container">
        <h2>To-Do List</h2>
        {userPermissions.create ? (
          <div className="todo-input">
            <input
              type="text"
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
              placeholder="Agregar tarea..."
            />
            <button onClick={addTask}>Agregar</button>
          </div>
        ) : (
          <p className="permission-message">No tienes permiso para crear tareas</p>
        )}
        
        <ul className="todo-list">
          {tasks.length === 0 ? (
            <li className="empty-message">No hay tareas disponibles</li>
          ) : (
            tasks.map((task) => (
              <li key={task.id} className={`todo-item ${task.completed ? 'completed' : ''}`}>
                <div className="todo-text">
                  <Checkbox
                    checked={task.completed}
                    onChange={() => toggleTask(task.id)}
                  />
                  <span>{task.text}</span>
                  {task.createdBy && <small className="created-by"> (por: {task.createdBy})</small>}
                </div>
                {userPermissions.delete && (
                  <button className="delete-btn" onClick={() => removeTask(task.id)}>
                    Eliminar
                  </button>
                )}
              </li>
            ))
          )}
        </ul>
      </div>
    </div>
  );
};

export default TodoList;