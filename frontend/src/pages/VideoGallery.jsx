import React, { useEffect, useState } from 'react';

function VideoGallery() {
  const [videos, setVideos] = useState([]);

  const fetchVideos = () => {
    fetch('http://localhost:3000/videos')
      .then(response => {
        if (!response.ok) {
          throw new Error(`Erro HTTP! Status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        setVideos(data);
      })
      .catch((error) => {
        console.error('Erro ao carregar vídeos:', error);
      });
  };
  useEffect(() => {
    // Requisição para pegar a lista de vídeos
    fetchVideos()
    const interval = setInterval(fetchVideos, 10000); // 10000 ms = 10 segundos

    // Limpa o intervalo quando o componente for desmontado
    return () => clearInterval(interval);
  }, []);

  return (
    <div>
      <h1>Galeria de Vídeos</h1>
      <div className="video-grid">
        {videos.map((video, index) => (
          <div key={index} className="video-item">
            <p>{video}</p>
            <video controls>
              <source src={`http://localhost:3000/videos/${video}`} type="video/mp4" />
              Seu navegador não suporta a tag de vídeo.
            </video>
          </div>
        ))}
      </div>
    </div>
  );
}

export default VideoGallery;