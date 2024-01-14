function Validation(values){
   let error = {}
   const email_pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
   const password_pattern = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[a-zA-Z0-9]{8,}$/

   if(values.email === ""){
    error.email = "L'email ne peut pas être vide"
   }

   else if(!email_pattern.test(values.email)) {
    error.email = "L'email n'est pas dans un format valide"
   }

   else{
    error.email = ""
   }

   if(values.password === ""){
    error.password ="Le mot de passe ne peut pas être vide"
   }

   // else if(!password_pattern.test(values.password)) {
   //  error.password = "Le mot de passe ne correspond à aucun compte valide"
   // }

   // else{
   //  error.password = ""
   // }
   return error;
}

export default Validation