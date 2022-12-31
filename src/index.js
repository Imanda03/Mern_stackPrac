import React from 'react'
import {createRoot} from "react-dom"
import Axios  from 'axios'
import CreateNewForm from './components/CreateNewForm'
import AnimalCard from './components/AnimalCard'

const App = () => {

    const [animals, setAnimals] = React.useState([]);

    React.useEffect(()=>{
            async function go(){
                const response = await Axios.get("/api/animal")
                setAnimals(response.data)
            }
            go();
    },[])

  return (
    <div className='container'>
        <p><a href="/">&laquo; Back to home page</a></p>
        <CreateNewForm setAnimals={setAnimals}/>
        <div className="animal-grid">

        { animals.map(animal =>{
            return <AnimalCard key={animal._id} name={animal.name} species={animal.species} photo={animal.photo} id={animal._id} setAnimals={setAnimals}/>
        })}
        </div>
    </div>
  )
}
const root = createRoot(document.querySelector("#app"));
root.render(<App />)