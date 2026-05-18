import React,{useEffect,useState} from "react";
import {Link} from "react-router-dom";

function ListDocuments(){

const [documents,setDocuments] = useState([]);

useEffect(()=>{

fetch("http://127.0.0.1:8000/api/documents")
.then(res => res.json())
.then(data => setDocuments(data))

},[])

const deleteDocument = (id)=>{

fetch(`http://127.0.0.1:8000/api/documents/${id}`,{
method:"DELETE"
})
.then(()=>{

setDocuments(documents.filter(d => d.id_document !== id))

})

}

return(

<div className="container mt-4">

<h2>Liste des Documents</h2>

<Link to="/documents/create" className="btn btn-primary mb-3">
Ajouter Document
</Link>

<table className="table table-bordered">

<thead>
<tr>

<th>ID</th>
<th>Fichier</th>
<th>Projet</th>
<th>Type</th>
<th>Date</th>
<th>Actions</th>

</tr>
</thead>

<tbody>

{documents.map(doc => (

<tr key={doc.id_document}>

<td>{doc.id_document}</td>
<td>{doc.fichier}</td>
<td>{doc.id_projet}</td>
<td>{doc.type_document}</td>
<td>{doc.date_upload}</td>

<td>

<Link
to={`/documents/edit/${doc.id_document}`}
className="btn btn-warning me-2"
>
Modifier
</Link>

<button
onClick={()=>deleteDocument(doc.id_document)}
className="btn btn-danger"
>
Supprimer
</button>

</td>

</tr>

))}

</tbody>

</table>

</div>

)

}

export default ListDocuments;