import { BrowserRouter, Routes, Route } from 'react-router-dom'
import TelaPlay from './components/TelaPlay'
import InicialJogos from './components/InicialJogos'
import './App.css'
import Cadastro from './components/Cadastro'
import Entrar from './components/Entrar'
import ClownGame from './components/ClownGame'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={
            <TelaPlay />
        } />
        <Route path="/InicialJogos" element={<InicialJogos/>} />

        <Route path="/cadastrar" element={<Cadastro/>} />

        <Route path="/entrar" element={<Entrar/>} />

        <Route path="/JogoBocaDoPalhaço" element={<ClownGame/>} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
