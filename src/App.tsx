import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import InicialJogos from "./components/InicialJogos";
import TelaPlay from "./components/TelaPlay";
import Cadastro from "./components/Cadastro";
import Entrar from "./components/Entrar";
import CanGame from "./components/CanGame";
import ClownGame from "./components/ClownGame";
import Voucher from "./components/Vouches";
import Perfil from "./components/Perfil";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
        <Route path="/InicialJogos" element={<InicialJogos />} />
        <Route path="/" element={<TelaPlay />} />
        <Route path="/cadastrar" element={<Cadastro />} />
        <Route path="/entrar" element={<Entrar />} />
        <Route path="/JogoBocaDoPalhaço" element={<ClownGame />} />
        <Route path="/JogoLatas" element={<CanGame />} />
        <Route path="/vouchers" element={<Voucher />} />
        <Route path="/perfil" element={<Perfil />} />
        </Routes>
      </BrowserRouter>
  </QueryClientProvider>
);

export default App;




