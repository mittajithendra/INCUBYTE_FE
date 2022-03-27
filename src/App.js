import { useEffect, useState } from 'react';

import './App.css';

function App() {
  const [words,setWords] = useState([]);
  const [input,setInput] = useState("");
  const [editid,setEditId] = useState("");
  const [editvalue,setEditValue] = useState("");

  const fetchWords = ()=>{
    fetch("https://incubyte-be.herokuapp.com/")
    .then(function(res){
      return res.json();
    })
    .then(function(res){
      let serviceData = [];
      function* iterate_object(o){
        var keys = Object.keys(o);
        for(let i=0;i<keys.length;i++){
          yield [keys[i],o[keys[i]]];
        }
      }
      for(var [key,val] of iterate_object(res)){
        console.log(val.id)
        serviceData.push(val);
      }
      setWords(serviceData);
      console.log(res);
    })
    .catch((err)=>{
      console.log(err);
    });
  }
  useEffect(()=>{
    fetchWords();
  },[])
  
  const addWord = function(){
    console.log(input)
    fetch('https://incubyte-be.herokuapp.com/', {
      method: 'post',
      headers: {'Content-Type':'application/json'},
      body: 
       JSON.stringify({"word": input})
      
     }).then(()=>{
      setInput("");
      fetchWords();
     })
   
  }

  const deleteWord = function(id){
    console.log(id);
    fetch('https://incubyte-be.herokuapp.com/delete', {
      method: 'post',
      headers: {'Content-Type':'application/json'},
      body: 
       JSON.stringify({"id": id})
      
     }).then(()=>{
      fetchWords();
     })
  }

  const editWord = function(id,word){
    setEditId(id);
    setEditValue(word);
  }

  const addeditWord = function(id){
    console.log(input)
    fetch('https://incubyte-be.herokuapp.com/update', {
      method: 'post',
      headers: {'Content-Type':'application/json'},
      body: 
       JSON.stringify({"id":id,"word": editvalue})
      
     }).then(()=>{
      setEditId("");
      fetchWords();
     })
  }

  return (

    <div className="wordsContainer">
      <div className='inputContainer'>
        <input type="text" value={input} onChange={(event)=>setInput(event.target.value)} />
        <button onClick={addWord}>ADD WORD</button>
      </div>
      <div class="word">
        {words.map((word)=>
          <div key={word.id}>
            {editid != word.id && <li>
              {word.word}
            </li>}
            {editid==word.id && <input type="text" value={editvalue} onChange={(event)=>setEditValue(event.target.value)} />}
            
            <button onClick={()=>{deleteWord(word.id)}}>Delete</button>
            {editid == word.id && <button onClick={()=>{addeditWord(word.id)}}>Done</button>}
            {editid != word.id && <button onClick={()=>{editWord(word.id,word.word)}}>Edit</button>}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
