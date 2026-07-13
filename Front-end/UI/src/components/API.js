import axios from 'axios'


const url="http://localhost:8000"
const Login=axios.create({baseURL:`${url}/api/Login`})



const adjuntarToken=(instancia)=>{
    instancia.interceptors.request.use((config)=>{
        const token=localStorage.getItem('token-access');
    if(token) config.headers.Authorization=`Bearer ${token}`

      return config;      }, (error)=> Promise.reject(error)
        
  )
}

[Login].forEach(adjuntarToken)

export const DoLogin=(datos)=>Login.post("",datos)