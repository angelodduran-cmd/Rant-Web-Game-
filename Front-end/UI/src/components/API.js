import axios from 'axios'

//En efecto utilicé Axios porque me da flojera codificar los métodos HTTP  . . .

export const url="http://localhost:8000"
const Login=axios.create({baseURL:`${url}/api/Login`})
const Users=axios.create({baseURL:`${url}/api/Data/User`})
const Scores=axios.create({baseURL:`${url}/api/Data/Score`})

const adjuntarToken=(instancia)=>{
    instancia.interceptors.request.use((config)=>{
        const token=localStorage.getItem('token-access');
        if(token) config.headers.Authorization=`Bearer ${token}`
        return config;      
    }, (error)=> Promise.reject(error))
}

[Login,Users,Scores].forEach(adjuntarToken)

export const DoLogin=(datos)=>Login.post("",datos)
export const CreateUser=(datos)=>Users.post("/",datos)
export const GetScore=()=>Scores.get("/")

export const SaveScore=(datos)=>Scores.post("/",datos)
