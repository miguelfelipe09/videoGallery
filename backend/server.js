const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors')
const app = express();
const PORT = 3000;
app.use(cors())
// Caminho da pasta de vídeos
const videoDirectory = path.join(__dirname, 'videos');

// Endpoint para listar vídeos
app.get('/videos', (req, res) => {
  fs.readdir(videoDirectory, (err, files) => {
    if (err) {
      return res.status(500).json({ error: 'Erro ao listar vídeos' });
    }
    // Filtrar para retornar apenas arquivos de vídeo (mp4, avi, etc.)
    const videoFiles = files.filter(file => file.endsWith('.mp4'));
    res.json(videoFiles);
  });
});

// Servir vídeos diretamente da pasta
app.use('/videos', express.static(videoDirectory));

const deleteOldVideos = () => {
    fs.readdir(videoDirectory, (err, files) => {
      if (err) {
        console.error('Erro ao ler a pasta de vídeos:', err);
        return;
      }
  
      files.forEach(file => {
        const filePath = path.join(videoDirectory, file);
  
        // Obtém as informações do arquivo
        fs.stat(filePath, (err, stats) => {
          if (err) {
            console.error('Erro ao obter informações do arquivo:', err);
            return;
          }
  
          // Verifica o tempo de criação/modificação do arquivo
          const now = Date.now();
          const fileAgeInMs = now - stats.mtimeMs; // mtimeMs é a última modificação
          const ageInHours = fileAgeInMs / (1000 * 60); // Converter para horas
  
          // Se o arquivo tiver mais de 24 horas, apague-o
          if (ageInHours > 5) {
            fs.unlink(filePath, err => {
              if (err) {
                console.error(`Erro ao deletar o arquivo ${file}:`, err);
                return;
              }
              console.log(`Arquivo ${file} foi deletado.`);
            });
          }
        });
      });
    });
  };
  
  // Executa a função deleteOldVideos a cada hora
  setInterval(deleteOldVideos, 1000 * 60 * 5); // 1000 ms * 60 * 60 = 1 hora

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
