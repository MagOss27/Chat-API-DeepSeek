document.addEventListener('DOMContentLoaded', function () {
  const chatForm = document.getElementById('chat-form');
  const chatBox = document.getElementById('chat-box');
  const userInput = document.getElementById('user-input');

  chatForm.addEventListener('submit', function (e) {
      e.preventDefault(); // Impede o recarregamento da página

      const userMessage = userInput.value.trim();

      if (userMessage) {
          // Adiciona a mensagem do usuário ao chat
          addMessageToChat('user', userMessage);

          // Limpa o campo de entrada
          userInput.value = '';

          // Faz a requisição à API do DeepSeek
          fetchDeepSeekResponse(userMessage)
              .then(response => {
                  // Adiciona a resposta do bot ao chat
                  addMessageToChat('bot', response);
              })
              .catch(error => {
                  console.error('Erro ao buscar resposta da API:', error);
                  addMessageToChat('bot', 'Desculpe, ocorreu um erro ao processar sua mensagem.');
              });
      }
  });

  function addMessageToChat(sender, message) {
      const messageElement = document.createElement('div');
      messageElement.classList.add('message', sender);

      const avatar = document.createElement('div');
      avatar.classList.add('avatar');

      if (sender === 'bot') {
          avatar.innerHTML = '<img src="https://cdn-icons-png.flaticon.com/512/4712/4712027.png" alt="Bot">';
      }

      const content = document.createElement('div');
      content.classList.add('content');
      content.innerHTML = `<p>${message}</p>`;

      messageElement.appendChild(avatar);
      messageElement.appendChild(content);

      chatBox.appendChild(messageElement);

      // Rola para a última mensagem
      chatBox.scrollTop = chatBox.scrollHeight;
  }

  async function fetchDeepSeekResponse(userMessage) {
    //Chave de teste, gerar a cada dia uma chave novamente https://openrouter.ai/settings/keys
      const apiKey = "INFORME A CHAVE API"; // Substitua pela sua chave de API do DeepSeek
      const apiUrl = "https://openrouter.ai/api/v1/chat/completions"; // URL da API do DeepSeek

      try {
          const response = await fetch(apiUrl, {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${apiKey}` // Envia a chave de API no cabeçalho
              },
              body: JSON.stringify({
                  model: 'deepseek/deepseek-chat:free', // Modelo que você deseja usar
                  messages: [
                      {
                          role: 'user',
                          content: userMessage
                      }
                  ]
              })
          });

          // Verifica se a resposta da API é válida
          if (!response.ok) {
              throw new Error(`Erro na requisição: ${response.status} ${response.statusText}`);
          }

          const data = await response.json();

          // Verifica se a resposta contém a mensagem esperada
          if (!data.choices || !data.choices[0] || !data.choices[0].message) {
              throw new Error('Resposta da API inválida');
          }

          // Retorna a resposta do bot
          return data.choices[0].message.content;
      } catch (error) {
          console.error('Erro ao buscar resposta da API:', error);
          throw error; // Repassa o erro para ser tratado no catch do fetchDeepSeekResponse
      }
  }
  
});