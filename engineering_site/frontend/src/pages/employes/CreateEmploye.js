import React,{useState} from "react";
import {useNavigate} from "react-router-dom";

function CreateEmploye(){

const navigate = useNavigate();

const [nom,setNom] = useState("");
const [email,setEmail] = useState("");
const [mot_de_passe,setPassword] = useState("");
const [role,setRole] = useState("");
const [specialite,setSpecialite] = useState("");
const [date_embauche,setDate] = useState("");

const handleSubmit=(e)=>{

e.preventDefault();

fetch("http://127.0.0.1:8000/api/employes",{

method:"POST",

headers:{
"Content-Type":"application/json"
},

body:JSON.stringify({

nom,
email,
mot_de_passe,
role,
specialite,
date_embauche

})

})

.then(()=>{

navigate("/employes")

})

}

return(

<div className="container">

<h2>Ajouter Employé</h2>

<form onSubmit={handleSubmit}>

<input
type="text"
placeholder="Nom"
className="form-control mb-2"
onChange={(e)=>setNom(e.target.value)}
/>

<input
type="email"
placeholder="Email"
className="form-control mb-2"
onChange={(e)=>setEmail(e.target.value)}
/>

<input
type="password"
placeholder="Mot de passe"
className="form-control mb-2"
onChange={(e)=>setPassword(e.target.value)}
/>

<select
className="form-control mb-2"
onChange={(e)=>setRole(e.target.value)}
>

<option value="">Choisir Role</option>
<option value="Employé">Employé</option>
<option value="Administrateur">Administrateur</option>

</select>

<input
type="text"
placeholder="Specialite"
className="form-control mb-2"
onChange={(e)=>setSpecialite(e.target.value)}
/>

<input
type="date"
className="form-control mb-2"
onChange={(e)=>setDate(e.target.value)}
/>

<button className="btn btn-success">
Ajouter
</button>

</form>

</div>

)

}

export default CreateEmploye;