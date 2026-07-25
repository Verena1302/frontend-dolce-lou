document.addEventListener('DOMContentLoaded', () => {
const formAcesso = document.querySelector('.login__painel form');
const btnAlternar = document.querySelector('.js-alternar-login');
const btnConvidado = document.querySelector('.js-entrar-convidado');
const campoConfirmarSenha = document.querySelector('.campo--confirmar');
const campoTipoConta = document.querySelector('.campo--tipo-conta');
const tituloForm = document.getElementById('acesso-titulo');
const btnSubmit = document.querySelector('.js-enviar-acesso');

let modoCadastro = true;

if (btnAlternar) {
  btnAlternar.addEventListener('click', () => {
    modoCadastro = !modoCadastro;

    if (modoCadastro) {
      tituloForm.textContent = 'Crie sua conta';
      btnSubmit.textContent = 'Cadastrar';
      btnAlternar.textContent = 'Já tem conta? Entrar';
      if (campoConfirmarSenha) campoConfirmarSenha.style.display = 'block';
      if (campoTipoConta) campoTipoConta.style.display = 'block';
    } else {
      tituloForm.textContent = 'Acesse sua conta';
      btnSubmit.textContent = 'Entrar';
      btnAlternar.textContent = 'Não tem conta? Cadastre-se';
      if (campoConfirmarSenha) campoConfirmarSenha.style.display = 'none';
      if (campoTipoConta) campoTipoConta.style.display = 'none';
    }
  });
}

if (formAcesso) {
  formAcesso.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value.trim();
    const senha = document.getElementById('senha').value;
    const tipoContaSelect = document.getElementById('tipo-conta');
    const tipoConta = tipoContaSelect ? tipoContaSelect.value : 'COMPRADOR';

    if (!email || !senha) {
      alert('Por favor, preencha todos os campos.');
      return;
    }

    if (modoCadastro) {
      const confirmarSenha = document.getElementById('confirmar-senha')?.value;
      if (senha !== confirmarSenha) {
        alert('As senhas não coincidem!');
        return;
      }
    }

    const usuarioLogado = { email, tipoConta };
    localStorage.setItem('dolce_lou_user', JSON.stringify(usuarioLogado));

    alert(`${modoCadastro ? 'Cadastro realizado' : 'Login efetuado'} com sucesso!`);

    if (tipoConta === 'FUNCIONARIO') {
      window.location.href = 'dashboard.html';
    } else {
      window.location.href = 'index.html';
    }
  });
}

if (btnConvidado) {
  btnConvidado.addEventListener('click', () => {
    localStorage.setItem('dolce_lou_user', JSON.stringify({ email: 'convidado@dolcelou.com', tipoConta: 'COMPRADOR' }));
    window.location.href = 'index.html';
  });
}

const btnSair = document.getElementById('botao-sair');
if (btnSair) {
  btnSair.addEventListener('click', () => {
    localStorage.removeItem('dolce_lou_user');
    window.location.href = 'login.html';
  });
}
});