import React, {useState,useEffect} from 'react'; 
import { Button, FormControl, Input, InputLabel} from '@material-ui/core';
import './App.css';
import Todo from './Todo.js';
import db from './firebase';
import firebase from 'firebase';

function App() {

  const [todos, setTodos] =  useState([]);
  const [input, setInput] = useState('');

  //when the  app loads
  useEffect(() => {
    
    db.collection('todos').orderBy('timestamp','desc').onSnapshot(snapshot=>{
      console.log(setTodos(snapshot.docs.map(doc => doc.data().todo)));
      setTodos(snapshot.docs.map(doc => doc.data().todo))
    })
    
  }, [])

  console.log(input);
  

  const addTodo = (event)=>{
    //this will fire off when we click the button
    event.preventDefault(); 
    
    db.collection('todos').add({
      todo:input,
      timestamp:firebase.firestore.FieldValue.serverTimestamp() 
    })
    
    setInput('');
    
  }
  


  return (
    <div className="App">
      <h1>hello world</h1>
      <form>
      
       

      <FormControl>
        <InputLabel >Write a Todo</InputLabel>
        <Input value={input} onChange={event => setInput(event.target.value)} />
       
      </FormControl>



      <Button type='submit'onClick={addTodo} disabled={!input}  variant="contained" color="primary">
        AddTodo
    </Button>

      </form>
      
      <ul>
        {todos.map(todo=>(
          //<li>{todo}</li>
          <Todo text={todo} />
        ))}
        

      </ul>
    </div>
  );
}

export default App;
