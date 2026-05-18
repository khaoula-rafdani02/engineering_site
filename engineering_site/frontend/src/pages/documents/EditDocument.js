import React,{useState,useEffect} from "react";
import {useParams,useNavigate} from "react-router-dom";

function EditDocument(){

const {id} = useParams();
const navigate = useNavigate();

const [fichier,setFichier] = useState("");
const [id_projet,setProjet] = useState("");
const [type_document,setType] = useState("");

useEffect(()=>{

fetch(`http://127.0.0.1:8000/api/documents/${id}`)
.then(res => res.json())
.then(data =>{

setFichier(data.fichier)
setProjet(data.id_projet)
setType(data.type_document)

})

},[id])

const handleSubmit = (e)=>{

e.preventDefault();

fetch(`http://127.0.0.1:8000/api/documents/${id}`,{

method:"PUT",

headers:{
"Content-Type":"application/json"
},

body:JSON.stringify({

fichier:fichier,
id_projet:id_projet,
type_document:type_document

})

})
.then(()=>{

navigate("/documents")

})

}

return(

<div className="container mt-4">

<h2>Modifier Document</h2>

<form onSubmit={handleSubmit}>

<div className="mb-3">

<label>Fichier</label>

<input
type="text"
className="form-control"
value={fichier}
onChange={(e)=>setFichier(e.target.value)}
/>

</div>

<div className="mb-3">

<label>ID Projet</label>

<input
type="number"
className="form-control"
value={id_projet}
onChange={(e)=>setProjet(e.target.value)}
/>

</div>

<div className="mb-3">

<label>Type Document</label>

<input
type="text"
className="form-control"
value={type_document}
onChange={(e)=>setType(e.target.value)}
/>

</div>

<button className="btn btn-success">
Modifier
</button>

</form>

</div>

)

}

export default EditDocument;