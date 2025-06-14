// ——————————————————————
// Navegação e Conta
// ——————————————————————

function showForm(formId) {
  document.querySelectorAll('.form-container').forEach(s => s.style.display = 'none');
  const f = document.getElementById('form-' + formId);
  if (f) f.style.display = 'block';
  mostrarTopProjetosMaisSeguidos();
  atualizarConta();
}

function showLoginForm(tipo) {
  document.querySelectorAll('.login-container').forEach(s => s.style.display = 'none');
  document.getElementById('login-' + tipo).style.display = 'block';
}

function showSignForm(tipo) {
  document.querySelectorAll('.sign-container').forEach(s => s.style.display = 'none');
  document.getElementById('cadastro-' + tipo).style.display = 'block';
}

function atualizarConta() {
  const user = JSON.parse(localStorage.getItem('usuarioLogado'));
  const contaLogada = document.getElementById('conta-logada');
  const contaDeslogada = document.getElementById('conta-deslogada');

  if (user) {
    let seguidoresCount = 0;
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key.startsWith('voluntario_') || key.startsWith('projeto_')) {
        const u = JSON.parse(localStorage.getItem(key));
        if ((u.seguindo || []).includes(user.email)) {
          seguidoresCount++;
        }
      }
    }
    document.getElementById('user-seguidores').textContent = seguidoresCount;
    document.getElementById('user-nome').textContent = 'Nome: ' + user.nome;
    document.getElementById('user-tipo').textContent = 'Tipo: ' + (user.tipo === 'voluntario' ? 'Voluntário' : 'Projeto Social');
    if (user.tipo === 'projeto') {
      document.getElementById('user-objetivo').textContent = 'Objetivo: ' + getTextoObjetivoPorId(user.objetivo);
      document.getElementById('user-objetivo').style.display = 'block';
    } else {
      document.getElementById('user-objetivo').style.display = 'none';
    }
    document.getElementById('user-foto').src = user.foto && user.foto.trim() !== '' ? user.foto : 'images/placeholder-perfil.jpeg';
    contaLogada.style.display = 'block';
    contaDeslogada.style.display = 'none';
  } else {
    contaLogada.style.display = 'none';
    contaDeslogada.style.display = 'block';
  }
}

function logout() {
  localStorage.removeItem('usuarioLogado');
  alert('Sessão encerrada.');
  showForm('home');
  carregarPostagens?.();
}

window.onload = function () {
  showForm('home');
};


// ——————————————————————
// Cadastro
// ——————————————————————

function cadastroVoluntario(event) {
  event.preventDefault();
  const nome = document.getElementById('cad-nome-voluntario').value;
  const email = document.getElementById('cad-email-voluntario').value;
  const senha = document.getElementById('cad-senha-voluntario').value;

  const dados = {
    nome,
    email,
    senha,
    tipo: 'voluntario',
    seguindo: [],
    foto: ''
  };

  const usuarios = JSON.parse(localStorage.getItem('usuariosVoluntarios') || '[]');
  if (usuarios.find(u => u.email === email)) {
    alert('E-mail já cadastrado.');
    return;
  }

  usuarios.push(dados);
  localStorage.setItem('usuariosVoluntarios', JSON.stringify(usuarios));
  localStorage.setItem('voluntario_' + email, JSON.stringify(dados));
  
  // Login automático
  localStorage.setItem('usuarioLogado', JSON.stringify(dados));
  alert('Cadastro realizado com sucesso! Você está logado.');

  atualizarConta();
  showForm('conta');
}

function cadastroProjeto(event) {
  event.preventDefault();
  const nome = document.getElementById('cad-nome-projeto').value;
  const objetivo = document.getElementById('cad-tipo-projeto').value;
  const email = document.getElementById('cad-email-projeto').value;
  const senha = document.getElementById('cad-senha-projeto').value;

  const dados = {
    nome,
    email,
    senha,
    objetivo,
    tipo: 'projeto',
    seguindo: [],
    foto: ''
  };

  const usuarios = JSON.parse(localStorage.getItem('usuariosProjetos') || '[]');
  if (usuarios.find(u => u.email === email)) {
    alert('E-mail já cadastrado.');
    return;
  }

  usuarios.push(dados);
  localStorage.setItem('usuariosProjetos', JSON.stringify(usuarios));
  localStorage.setItem('projeto_' + email, JSON.stringify(dados));

  // Login automático
  localStorage.setItem('usuarioLogado', JSON.stringify(dados));
  alert('Cadastro realizado com sucesso! Você está logado.');

  atualizarConta();
  showForm('conta');
}

// ——————————————————————
// Login
// ——————————————————————

function loginVoluntario(event) {
  event.preventDefault();
  const email = document.getElementById('login-email-voluntario').value;
  const senha = document.getElementById('login-senha-voluntario').value;

  const usuarios = JSON.parse(localStorage.getItem('usuariosVoluntarios') || '[]');
  const user = usuarios.find(u => u.email === email && u.senha === senha);

  if (!user) {
    alert('E-mail ou senha inválidos.');
    return;
  }

  localStorage.setItem('usuarioLogado', JSON.stringify(user));
  alert('Login realizado com sucesso!');
  showForm('conta');
}

function loginProjeto(event) {
  event.preventDefault();
  const email = document.getElementById('login-email-projeto').value;
  const senha = document.getElementById('login-senha-projeto').value;

  const projetos = JSON.parse(localStorage.getItem('usuariosProjetos') || '[]');
  const user = projetos.find(p => p.email === email && p.senha === senha);

  if (!user) {
    alert('E-mail ou senha inválidos.');
    return;
  }

  localStorage.setItem('usuarioLogado', JSON.stringify(user));
  alert('Login realizado com sucesso!');
  showForm('conta');
}

// ——————————————————————
// Utils
// ——————————————————————

function getTextoObjetivoPorId(id) {
  const sel = document.getElementById('cad-tipo-projeto');
  if (!sel) return id;
  for (let opt of sel.options) if (opt.value === id) return opt.text;
  return id;
}

// ——————————————————————
// Upload da foto de perfil
// ——————————————————————

document.getElementById('user-foto').addEventListener('click', () => {
  document.getElementById('upload-foto').click();
});

document.getElementById('upload-foto').addEventListener('change', function () {
  const file = this.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function (e) {
    const fotoBase64 = e.target.result;
    document.getElementById('user-foto').src = fotoBase64;

    let user = JSON.parse(localStorage.getItem('usuarioLogado'));
    user.foto = fotoBase64;
    localStorage.setItem('usuarioLogado', JSON.stringify(user));

    const chave = user.tipo === 'voluntario' ? 'usuariosVoluntarios' : 'usuariosProjetos';
    const lista = JSON.parse(localStorage.getItem(chave)) || [];
    const index = lista.findIndex(u => u.email === user.email);
    if (index > -1) {
      lista[index].foto = fotoBase64;
      localStorage.setItem(chave, JSON.stringify(lista));
    }

    const chaveIndividual = user.tipo + '_' + user.email;
    const conta = JSON.parse(localStorage.getItem(chaveIndividual)) || {};
    conta.foto = fotoBase64;
    localStorage.setItem(chaveIndividual, JSON.stringify(conta));
  };
  reader.readAsDataURL(file);
});

// ——————————————————————
// Ver Perfil & Seguir/Deixar de Seguir
// ——————————————————————

function verPerfil(email) {
  let conta = JSON.parse(localStorage.getItem('projeto_' + email) || 'null')
            || JSON.parse(localStorage.getItem('voluntario_' + email) || 'null');
  if (!conta) return alert('Perfil não encontrado.');
  console.log('Conta:', conta);
  document.getElementById('perfil-foto').src = conta.foto && conta.foto.trim() !== '' ? conta.foto : 'images/placeholder-perfil.jpeg';
  document.getElementById('perfil-nome').textContent = conta.nome;
  document.getElementById('perfil-tipo').textContent = conta.tipo === 'projeto' ? 'Projeto Social' : 'Voluntário';

  let seguidoresCount = 0;
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key.startsWith('voluntario_') || key.startsWith('projeto_')) {
      const u = JSON.parse(localStorage.getItem(key));
      if ((u.seguindo || []).includes(email)) seguidoresCount++;
    }
  }
  document.getElementById('perfil-seguidores').textContent = seguidoresCount;

  const logado = JSON.parse(localStorage.getItem('usuarioLogado') || 'null');
  if (!logado) {
    document.getElementById('btn-seguir').style.display = 'none';
    document.getElementById('btn-unfollow').style.display = 'none';
  } else {
    const isProprioPerfil = logado.email === email;

    if (isProprioPerfil) {
      document.getElementById('btn-seguir').style.display = 'none';
      document.getElementById('btn-unfollow').style.display = 'none';
    } else {
      const isFollowing = (logado.seguindo || []).includes(email);
      document.getElementById('btn-seguir').style.display = isFollowing ? 'none' : 'inline-block';
      document.getElementById('btn-unfollow').style.display = isFollowing ? 'inline-block' : 'none';
      document.getElementById('btn-seguir').dataset.email = email;
      document.getElementById('btn-unfollow').dataset.email = email;
    }
  }

  showForm('perfil-externo');
  document.getElementById('perfil-externo').style.display = 'block';
}

document.getElementById('btn-seguir').addEventListener('click', () => {
  const email = document.getElementById('btn-seguir').dataset.email;
  const user = JSON.parse(localStorage.getItem('usuarioLogado') || 'null');
  if (!user) return alert('Faça login primeiro.');
  user.seguindo = user.seguindo || [];
  if (!user.seguindo.includes(email)) user.seguindo.push(email);
  localStorage.setItem('usuarioLogado', JSON.stringify(user));
  const key = user.tipo + '_' + user.email;
  const data = JSON.parse(localStorage.getItem(key));
  data.seguindo = user.seguindo;
  localStorage.setItem(key, JSON.stringify(data));
  verPerfil(email);
});

document.getElementById('btn-unfollow').addEventListener('click', () => {
  const email = document.getElementById('btn-unfollow').dataset.email;
  const user = JSON.parse(localStorage.getItem('usuarioLogado') || 'null');
  if (!user) return;
  user.seguindo = (user.seguindo || []).filter(e => e !== email);
  localStorage.setItem('usuarioLogado', JSON.stringify(user));
  const key = user.tipo + '_' + user.email;
  const data = JSON.parse(localStorage.getItem(key));
  data.seguindo = user.seguindo;
  localStorage.setItem(key, JSON.stringify(data));
  verPerfil(email);
});

// ——————————————————————
// Postagens
// ——————————————————————

const btnNova = document.getElementById('btn-nova-postagem');
const modal = document.getElementById('modal-postagem');
const btnFechar = document.getElementById('fechar-postagem');
const formPost = document.getElementById('form-postagem');

btnNova.addEventListener('click', () => modal.style.display = 'block');
btnFechar.addEventListener('click', () => modal.style.display = 'none');
window.addEventListener('click', e => {
  if (e.target === modal) modal.style.display = 'none';
});

formPost.addEventListener('submit', e => {
  e.preventDefault();
  const titulo = formPost.titulo.value.trim();
  if (!titulo) return alert('Título obrigatório.');
  const texto = formPost.texto.value.trim();
  const link = formPost.link.value.trim();
  const user = JSON.parse(localStorage.getItem('usuarioLogado') || 'null');
  if (!user) return alert('Faça login para postar.');

  const imagemInput = document.getElementById('upload-imagem');
  const imagemArquivo = imagemInput.files[0];

  if (imagemArquivo) {
    const reader = new FileReader();
    reader.onload = function (e) {
      salvarPostagem(e.target.result); 
    };
    reader.readAsDataURL(imagemArquivo);
  } else {
    salvarPostagem('');
  }

  function salvarPostagem(imagemBase64) {
    const nova = {
      id: Date.now().toString(),
      titulo, texto, imagem: imagemBase64, link,
      dataCriacao: new Date().toISOString(),
      likes: [],
      autor: user.email,
      autorNome: user.nome
    };

    let list = JSON.parse(localStorage.getItem('postagens') || '[]');
    list.push(nova);
    localStorage.setItem('postagens', JSON.stringify(list));

    formPost.reset();
    modal.style.display = 'none';
    carregarPostagens();
  }
});

function isCurtido(p) {
  const u = JSON.parse(localStorage.getItem('usuarioLogado')||'null');
  return u && p.likes.includes(u.email);
}
function toggleCurtir(postId) {
  let list = JSON.parse(localStorage.getItem('postagens')||'[]');
  const u = JSON.parse(localStorage.getItem('usuarioLogado')||'null');
  if (!u) return alert('Faça login para curtir.');
  list = list.map(p => {
    if (p.id === postId) {
      const idx = p.likes.indexOf(u.email);
      if (idx > -1) p.likes.splice(idx,1);
      else           p.likes.push(u.email);
    }
    return p;
  });
  localStorage.setItem('postagens', JSON.stringify(list));
}

function deletarPostagem(postId) {
  let list = JSON.parse(localStorage.getItem('postagens')||'[]');
  const u = JSON.parse(localStorage.getItem('usuarioLogado')||'null');
  list = list.filter(p => !(p.id===postId && p.autor===u.email));
  localStorage.setItem('postagens', JSON.stringify(list));
}

function carregarPostagens(ord = 'data') {
  let list = JSON.parse(localStorage.getItem('postagens')||'[]');
  const u = JSON.parse(localStorage.getItem('usuarioLogado')||'null');

  if (ord==='likes')
    list.sort((a,b)=>b.likes.length-a.likes.length);
  else
    list.sort((a,b)=> new Date(b.dataCriacao)-new Date(a.dataCriacao));

  const feed = document.getElementById('feed-postagens');
  feed.innerHTML = '';
  if (!list.length) {
    feed.innerHTML = '<p>Nenhuma postagem.</p>';
    return;
  }

  list.forEach(p => {
    const liked = isCurtido(p);
    const auth  = u && u.email===p.autor;
    const div = document.createElement('div');
    div.classList.add('postagem');
    div.innerHTML = `
      <h3>${p.titulo}</h3>
      <p>${p.texto||''}</p>
      ${p.imagem? `</br><img src="${p.imagem}" alt="">` : ''}
      ${p.link? `</br><a href="${p.link}" target="_blank">${p.link}</a>` : ''}
      </br><p><small>Por: <a href="#" class="link-autor" data-email="${p.autor}">${p.autorNome}</a></small></p>
      </br><p><small>${new Date(p.dataCriacao).toLocaleString()}</small></p>
      <button class="btn-curtir" data-id="${p.id}">
        ${liked?'❤️':'🤍'} (${p.likes.length})
      </button>
      ${auth? `</br><button class="btn-deletar" data-id="${p.id}">🗑️ Deletar</button>` : ''}
    `;
    feed.appendChild(div);
  });

  document.querySelectorAll('.btn-curtir').forEach(b=>b.addEventListener('click', ()=>{
    toggleCurtir(b.dataset.id);
    carregarPostagens(ord);
  }));
  document.querySelectorAll('.btn-deletar').forEach(b=>b.addEventListener('click', ()=>{
    deletarPostagem(b.dataset.id);
    carregarPostagens(ord);
  }));

  document.querySelectorAll('.link-autor').forEach(link => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    const email = link.dataset.email;
    verPerfil(email);
  });
});

}

function ordenarPor(c) { carregarPostagens(c); }

// ——————————————————————
// Projetos
// ——————————————————————

function mostrarTopProjetosMaisSeguidos() {
  const projetos = [];

  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key.startsWith('projeto_')) {
      const proj = JSON.parse(localStorage.getItem(key));
      if (proj) projetos.push(proj);
    }
  }

  // Função para contar seguidores de um projeto pelo email
  function contarSeguidores(emailProjeto) {
    let count = 0;
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key.startsWith('voluntario_') || key.startsWith('projeto_')) {
        const u = JSON.parse(localStorage.getItem(key));
        if ((u.seguindo || []).includes(emailProjeto)) count++;
      }
    }
    return count;
  }

  projetos.forEach(proj => {
    proj.seguidoresCount = contarSeguidores(proj.email);
  });

  projetos.sort((a, b) => {
  if (b.seguidoresCount === a.seguidoresCount) {
    return a.nome.localeCompare(b.nome);
  }
  return b.seguidoresCount - a.seguidoresCount;
});

  const topProjetos = projetos.slice(0, 10);

  const container = document.getElementById('projetos-mais-seguidos');
  container.innerHTML = '';

  if (topProjetos.length === 0) {
    container.textContent = 'Nenhum projeto cadastrado.';
    return;
  }

  topProjetos.forEach(proj => {
    const card = document.createElement('div');
    card.classList.add('projeto-card');
    card.style.width = '48%';

    card.setAttribute('data-email', proj.email);
    card.style.cursor = 'pointer';
    card.addEventListener('click', () => {
      const email = card.getAttribute('data-email');
      verPerfil(email);
    });

    const img = document.createElement('img');
    img.src = proj.foto && proj.foto.trim() !== '' ? proj.foto : 'images/placeholder-perfil.jpeg';
    img.alt = proj.nome || 'Projeto';
    card.appendChild(img);

    const nome = document.createElement('h3');
    nome.textContent = proj.nome || 'Projeto sem nome';
    card.appendChild(nome);

    const objetivo = document.createElement('p');
    objetivo.textContent = proj.objetivo ? getTextoObjetivoPorId(proj.objetivo) : '';
    card.appendChild(objetivo);
    
    const seguidores = document.createElement('p');
    seguidores.textContent = `Seguidores: ${proj.seguidoresCount || 0}`;
    card.appendChild(seguidores);

    container.appendChild(card);
  });
}

// ——————————————————————
// Dark Mode
// ——————————————————————
function inicializarTema() {
    const toggleButton = document.getElementById('toggle-dark-mode');

    const temaSalvo = localStorage.getItem('modoEscuro');
    if (temaSalvo === 'true') {
        document.body.classList.add('dark-mode');
        toggleButton.textContent = '☀️ Modo Claro';
    }

    toggleButton.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
        const modoEscuroAtivo = document.body.classList.contains('dark-mode');
        localStorage.setItem('modoEscuro', modoEscuroAtivo);

        toggleButton.textContent = modoEscuroAtivo ? '☀️ Modo Claro' : '🌙 Modo Escuro';
    });
}

window.onload = () => {
  showForm('home');
  carregarPostagens('data');
  inicializarTema();
};