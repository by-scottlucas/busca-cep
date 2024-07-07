import './App.css';

import { useState } from 'react';
import { FiSearch } from 'react-icons/fi';

import logotipo from './assets/logo.png';
import cepService from './services/cep.service';
import Map from './components/Map/Map';


export default function App() {

  const [input, setInput] = useState('');
  const [cep, setCep] = useState({});

  function formataCep(value) {

    // Remove caracteres não numéricos
    const formatCep = value.replace(/\D/g, '');

    // Adiciona a máscara ao CEP
    return formatCep.replace(/(\d{5})(\d{3})/, '$1-$2');
  }

  async function handleSearch() {

    if (input === '') {
      alert("Preencha com algum CEP");
      return;
    }

    try {

      const response = await cepService.get(`${input}/json`);
      setCep(response.data);
      setInput("");

    } catch {

      alert("Erro ao buscar o CEP");
      setInput("");

    }
  }

  function handleInputChange(event) {
    const mascaraCep = formataCep(event.target.value);
    setInput(mascaraCep);
  }

  return (

    <main className="container">

      <img src={logotipo} className='logo' />

      <section className="input-box">

        <input type="text" placeholder="Digite o CEP..."
          value={input} onChange={handleInputChange}
        />

        <button className="search-btn" onClick={handleSearch}>
          <FiSearch size={25} />
        </button>

      </section>

      {Object.keys(cep).length > 0 && (

        <section className='result-box'>

          <h2>{cep.cep}</h2>

          <div className='result-info'>

            <span className='box-info'>
              <p className='label'>Logradouro</p>
              <p className='sub-label'>{cep.logradouro}</p>
            </span>

            <span className='box-info'>
              <p className='label'>Bairro</p>
              <p className='sub-label'>{cep.bairro}</p>
            </span>

            <span className='box-info'>
              <p className='label'>Localidade/UF</p>
              <p className='sub-label'>{cep.localidade}/{cep.uf}</p>
            </span>

            {Object.keys(cep.complemento).length > 0 ? (

              <span className='complemento'>
                <p className='label'>Complemento</p>
                {cep.complemento}
              </span>

            ) : ""}

          </div>

          <Map cep={cep.cep} />

        </section>


      )}

    </main>
  );
}
