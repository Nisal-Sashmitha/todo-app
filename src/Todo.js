import React from 'react';
import './Todo.css';
import {List, ListItem, ListItemText, ListItemAvatar,} from '@material-ui/core';

function Todo(props) {
    return (
        <div>
            <List className='todo_list'>
                <ListItem >
                    <ListItemAvatar>
                       
                    </ListItemAvatar>    
         
                        <ListItemText primary={props.text} secondary="Dummy deadline"/>
                </ListItem>
        
            </List>
           
        </div>
    )
}

export default Todo;
