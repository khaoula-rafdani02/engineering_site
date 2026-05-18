import React,{useState} from "react";
import {useNavigate} from "react-router-dom";

function CreateDocument(){

const navigate = useNavigate();

const [fichier,setFichier] = useState("");
const [id_projet,setProjet] = useState("");
const [type_document,setType] = useState("");

const handleSubmit = (e)=>{

e.preventDefault();

fetch("http://127.0.0.1:8000/api/documents",{

method:"POST",

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

<h2>Ajouter Document</h2>

<form onSubmit={handleSubmit}>

<div className="mb-3">

<label>Nom Fichier</label>

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
Enregistrer
</button>

</form>

</div>

)

}

export default CreateDocument;