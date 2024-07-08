import './Map.css';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { useEffect } from 'react';

export default function Map({ cep }) {
  useEffect(() => {
    const map = L.map('map').setView([-24.0058, -46.4025], 13);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 20,
    }).addTo(map);

    const customIcon = L.icon({
      iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
      shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41],
      className: 'custom-marker'
    });

    let marker = null;

    function buscarEnderecoPorCEP() {
      const viaCepUrl = `https://viacep.com.br/ws/${cep}/json/`;
      console.log('URL do ViaCEP:', viaCepUrl);

      fetch(viaCepUrl)
        .then(response => response.json())
        .then(data => {
          console.log('Resposta do ViaCEP:', data);
          if (!data.erro) {
            const endereco = `${data.logradouro}, ${data.bairro}, ${data.localidade} - ${data.uf}`;
            buscarCoordenadasPorEndereco(endereco);
          } else {
            alert('CEP não encontrado.');
          }
        })
        .catch(error => {
          console.error('Erro ao buscar endereço pelo CEP:', error);
          console.log('Ocorreu um erro ao buscar o endereço.');
        });
    }

    function buscarCoordenadasPorEndereco(endereco) {
      var apiUrl = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(endereco)}`;
      fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
          if (data.length > 0) {
            var coordenadas = {
              latitude: parseFloat(data[0].lat),
              longitude: parseFloat(data[0].lon)
            };
            adicionarMarcador(coordenadas);
            centralizarMapa(coordenadas.latitude, coordenadas.longitude);
          } else {
            console.log('Endereço não encontrado.');
          }
        })
        .catch(error => {
          console.error('Erro ao buscar coordenadas:', error);
          console.log('Ocorreu um erro ao buscar as coordenadas. Verifique a conexão ou tente novamente mais tarde.');
        });
    }

    function centralizarMapa(latitude, longitude) {
      map.setView([latitude, longitude], 18);
    }

    function adicionarMarcador(coordenadas) {
      if (marker) {
        map.removeLayer(marker);
      }
      marker = L.marker([coordenadas.latitude, coordenadas.longitude], { icon: customIcon }).addTo(map);
    }

    if (cep) {
      buscarEnderecoPorCEP();
    }

    return () => {
      map.remove();
    };
  }, [cep]);

  return (
    <div className="main">
      <div id="map" className="map-container"></div>
    </div>
  );
}