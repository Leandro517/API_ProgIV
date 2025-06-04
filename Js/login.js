const card = document.getElementById('card'); 
const toRegister = document.getElementById('toRegister');
const toLogin = document.getElementById('toLogin');

const registerForm = document.querySelector('.back form');
const loginForm = document.querySelector('.front form');

toRegister.addEventListener('click', () => {
  card.classList.add('flipped');
});

toLogin.addEventListener('click', () => {
  card.classList.remove('flipped');
});

const apiUrl = "https://umfgcloud-autenticacao-service-7e27ead80532.herokuapp.com";

// Função de cadastro
document.querySelector('.back form').addEventListener('submit', async (e) => {
  e.preventDefault();

  const form = document.querySelector('.back form');
  const email = form.querySelector('input[placeholder="E-mail"]').value;
  const senha = form.querySelector('input[placeholder="Senha"]').value;
  const senhaConfirmada = form.querySelector('input[placeholder="Confirmar senha"]').value;

  if (senha !== senhaConfirmada) {
    alert('As senhas não coincidem!');
    return;
  }

  try {
    const response = await fetch(`${apiUrl}/Autenticacao/registar`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, senha, senhaConfirmada}),
    });

    // Se a resposta for 200 e não tiver corpo, ainda consideramos sucesso
    if (response.ok) {
      const text = await response.text();
      if (!text) {
        // resposta vazia, mas sucesso
        alert('Cadastro bem-sucedido! Redirecionando...');
        window.location.href = 'index.html';
        return;
      }

      // se houver texto, tentar transformar em JSON (opcional)
      try {
        const data = JSON.parse(text);
        alert(data.message || 'Cadastro realizado com sucesso!');
        window.location.href = 'index.html';
      } catch {
        alert('Cadastro bem-sucedido! Redirecionando...');
        window.location.href = 'index.html';
      }
    } else {
      const errorText = await response.text();
      alert(errorText || 'Erro no cadastro.');
    }
  } catch (error) {
    console.error('Erro na requisição:', error);
    alert('Erro na comunicação com a API.');
  }
});


// Função de login
document.querySelector('.front form').addEventListener('submit', async (e) => {
  e.preventDefault();

  const email = document.querySelector('input[placeholder="E-mail"]').value;
  const senha = document.querySelector('input[placeholder="Senha"]').value;

  try {
    const response = await fetch(`${apiUrl}/Autenticacao/autenticar`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, senha }),
    });

    const data = await response.json();

    if (response.ok) {
      localStorage.setItem('authToken', data.token);
      localStorage.setItem('userEmail', email);

      // Define a expiração como 1 hora a partir de agora
      const expiry = new Date(Date.now() + 60 * 60 * 1000);
      localStorage.setItem('tokenExpiry', expiry.toISOString());

      window.location.href = `welcome.html?token=${data.token}`;
    } else {
      alert(data.message || 'Erro no login.');
    }
  } catch (error) {
    alert('Erro na comunicação com a API.');
  }
});
