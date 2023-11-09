import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css'
import styled from "styled-components";
import dayjs from 'dayjs'
const App = () => {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const url = "http://localhost:3001"
  useEffect(() => {
    axios.get(`${url}/api/tasks`)
      .then(response => {
        setTasks(response.data);
      })
      .catch(error => {
        console.error(error);
      });
  }, []);

  const handleAddTask = () => {
    if (title === "" || description === "" || date === "") {
      alert("Please fill all the information!")
    }else {
      axios.post(`${url}/api/tasks`, { title, description, date })
      .then(response => {
        setTasks([...tasks, response.data]);
        setTitle('');
        setDescription('');
        setDate('');
      })
      .catch(error => {
        console.error(error);
      });
    }
    
  };

  const handleCompleteTask = (id) => {
    axios.patch(`${url}/api/tasks/${id}`)
      .then(response => {
        setTasks(tasks.map(task => (task._id === id ? { ...task, completed: true } : task)));
      })
      .catch(error => {
        console.error(error);
      });
  };

  return (
    <div>
      <h1>To-Do Planner</h1>
      <Inputs>
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <input
          type="text"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <input
          type="date"
          value={date}
          onChange={(e) =>setDate(e.target.value)}
/>
        <button onClick={handleAddTask}>Add Task</button>
      </Inputs>
      <div>
        <h2>Tasks</h2>
        <ul>
          {tasks.map(task => (
            <li style={{listStyle: "circle"}} key={task._id}>
              {task.title} - {task.description} - { dayjs(task.date).format('YYYY/MM/DD')}
              {/* // dayjs(task.date).format('yyyy/mm/dd')  2023-11-08T00:00:00.000Z */}
              {!task.completed && <button style={{marginLeft: "20px"}} onClick={() => handleCompleteTask(task._id)}>Complete</button>}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default App;

const Inputs = styled.div`
display: flex;
flex-direction: column;
input {
  padding: 10px;
  border-radius: 10px;
  margin: 4px;
}

`