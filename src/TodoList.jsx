import { useState, useRef } from "react";
import { AgGridReact } from 'ag-grid-react'; 
import "ag-grid-community/styles/ag-grid.css"; 
import "ag-grid-community/styles/ag-theme-material.css";
import Button from '@mui/material/Button';
import DeleteIcon from '@mui/icons-material/Delete';
import TextField from '@mui/material/TextField';
import Stack from '@mui/material/Stack';
import dayjs from 'dayjs';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';


function TodoList(){
    const [todo, setTodo] = useState({
        decription: "",
        priority: "",
        date:""
    });
    const [todos, setTodos] = useState([]);
    const gridRef = useRef();
    
    const [colDefs, setColDefs] = useState([
        {field: "description",
            filter: true,
            floatingFilter: true},
        {field: "priority", 
            filter:true, 
            cellStyle: params => 
            params.value ==="High" ? {color: "red"} : {color:"black"}, floatingFilter: true},
        {field: "date", 
            filter: true, 
            floatingFilter: true}
    ]);

    const handleAdd= () => {
        if(!todo.description.trim()){
            alert("Type description first!")
        } else {
        setTodos([todo, ...todos]);
        }
        setTodo({description: "", priority: "", date: ""});
    }
    
    const handleDelete= () => {
        if (gridRef.current.getSelectedNodes().length > 0) {
            setTodos(todos.filter((todo, index) => 
            index != gridRef.current.getSelectedNodes()[0].id));
        } else{
            alert("Select a row first!")
        }
    }
    const changeDate = (newDate) =>{
        setTodo({...todo, date:dayjs(newDate).format("DD.MM.YYYY")})
    }

    return(
        <>
            <Stack mt={2} direction="row" spacing={2} justifyContent="center" alignItems="center">
                <TextField 
                    label="Description"
                    value={todo.description}
                    onChange={event => setTodo({...todo, description: event.target.value})}
                />
                <TextField 
                    label="Priority"
                    value={todo.priority}
                    onChange={event => setTodo({...todo, priority: event.target.value})}
                />
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker 
                        label="Date"
                        defaultValue = {dayjs(Date.now())}
                        onChange={(newDate) => changeDate(newDate)} 
                    />
                </LocalizationProvider>
                <Button variant="contained" onClick={handleAdd}>Add Todo</Button>
                <Button variant="contained" color="error" endIcon={<DeleteIcon />} onClick={handleDelete}>Delete</Button>
            </Stack>
            <div 
            className="ag-theme-material"
            style={{height:500}}
            >
                <AgGridReact
                    rowData={todos}
                    columnDefs={colDefs}
                    rowSelection="single"
                    ref={gridRef}
                    onGridReady={ params => gridRef.current = params.api }
                />
            </div>
        </>
    );
}

export default TodoList;