document.addEventListener('DOMContentLoaded', () => {
  
  const modal = document.getElementById('modal-compra');
  const btnFechar = document.querySelector('.modal__fechar');
  const fundoModal = document.querySelector('.modal__fundo');

  const imgModal = document.querySelector('.compra__imagem');
  const nomeModal = document.getElementById('compra-nome');
  const descModal = document.querySelector('.compra__descricao');
  const precoBaseModal = document.querySelector('.compra__preco-base');
  const rotuloQtd = document.getElementById('rotulo-qtd');
  const valorQtd = document.querySelector('.contador__valor');
  const valorTotal = document.querySelector('.compra__total-valor');
  
  const btnMais = document.querySelector('.contador__mais');
  const btnMenos = document.querySelector('.contador__menos');
  const btnAdicionar = document.querySelector('.compra__adicionar');

  let precoUnitario = 0;
  let quantidade = 0.5;
  let unidade = 'kg';
  let ehMassa = false;
  let ehLasanha = false;

  let containerSabores = document.getElementById('compra-sabores-wrap');
  if (!containerSabores && modal) {
    containerSabores = document.createElement('div');
    containerSabores.id = 'compra-sabores-wrap';
    containerSabores.style.margin = '1rem 0';
    
    const areaQtd = document.querySelector('.compra__quantidade');
    if (areaQtd) {
      areaQtd.parentNode.insertBefore(containerSabores, areaQtd);
    }
  }

  function atualizarCalculos() {
    const total = precoUnitario * quantidade;

    if (valorQtd) {
      valorQtd.textContent = unidade === 'kg' 
        ? `${quantidade.toFixed(1).replace('.', ',')} kg` 
        : `${quantidade} un`;
    }

    if (valorTotal) {
      valorTotal.textContent = `R$ ${total.toFixed(2).replace('.', ',')}`;
    }
  }

  document.addEventListener('click', (e) => {
    const btnComprar = e.target.closest('.js-comprar, .item-menu');
    
    if (btnComprar && !e.target.closest('.modal')) {
      e.preventDefault();

      const dataset = btnComprar.dataset;

      const nome = dataset.nome || btnComprar.querySelector('.item-menu__nome')?.textContent.trim() || 'Produto';
      const descricao = dataset.descricao || btnComprar.querySelector('.item-menu__descricao')?.textContent.trim() || '';
      const precoRaw = dataset.preco || btnComprar.querySelector('.item-menu__preco')?.textContent || '0';
      const imgSrc = dataset.imagem || btnComprar.querySelector('img')?.getAttribute('src') || '';
      const sabores = dataset.sabores ? dataset.sabores.split(',') : null;
      ehMassa = Number(dataset.produtoId) >= 201 && Number(dataset.produtoId) <= 206;
      ehLasanha = Number(dataset.produtoId) === 201;

      precoUnitario = parseFloat(String(precoRaw).replace(/[^\d,-]/g, '').replace(',', '.')) || 0;
      unidade = dataset.unidade || (String(precoRaw).toLowerCase().includes('un') ? 'un' : 'kg');
      quantidade = unidade === 'kg' ? 0.5 : 1;

      if (nomeModal) nomeModal.textContent = nome;
      if (descModal) descModal.textContent = descricao;
      
      if (imgModal) {
        if (imgSrc) {
          imgModal.src = imgSrc;
          imgModal.alt = nome;
          imgModal.style.display = 'block';
        } else {
          imgModal.style.display = 'none';
        }
      }

      if (precoBaseModal) {
        precoBaseModal.textContent = `R$ ${precoUnitario.toFixed(2).replace('.', ',')} / ${unidade}`;
      }
      
      if (rotuloQtd) {
        rotuloQtd.textContent = `Quantidade (${unidade})`;
      }

      const areaQtd = document.querySelector(".compra__quantidade");

if (ehMassa) {

  areaQtd.style.display = "none";

  let html = `
    <div style="margin-bottom:1rem;">
      <label style="display:block;font-weight:bold;margin-bottom:.5rem;">
        Tamanho
      </label>

      <select id="select-tamanho"
        style="width:100%;padding:.6rem;border:1px solid #ccc;border-radius:6px;font-family:inherit;font-size:1rem;color:inherit;background:#fff;">
        <option value="700g">Pequeno (700g)</option>
        <option value="1,2kg">Médio (1,2kg)</option>
        <option value="1,7kg">Grande (1,7kg)</option>
      </select>
    </div>
  `;

  if (ehLasanha) {

    html += `
      <div style="margin-bottom:1rem;">
        <label style="display:block;font-weight:bold;margin-bottom:.5rem;">
          Sabor
        </label>

        <select id="select-sabor"
          style="width:100%;padding:.6rem;border:1px solid #ccc;border-radius:6px;font-family:inherit;font-size:1rem;color:inherit;background:#fff;">
          <option>Sugo</option>
          <option>Mista</option>
          <option>Bolonhesa</option>
          <option>4 queijos</option>
        </select>
      </div>
    `;
  }

  containerSabores.innerHTML = html;
  containerSabores.style.display = "block";

} else {

  areaQtd.style.display = "block";

  if (sabores && sabores.length > 0) {

    let html = `
      <label style="display:block;font-weight:bold;margin-bottom:.5rem;">
        Escolha o sabor
      </label>

      <select id="select-sabor"
        style="width:100%;padding:.6rem;border:1px solid #ccc;border-radius:6px;font-family:inherit;font-size:1rem;color:inherit;background:#fff;">
    `;

    sabores.forEach(sabor=>{
      html += `<option>${sabor.trim()}</option>`;
    });

    html += `</select>`;

    containerSabores.innerHTML = html;
    containerSabores.style.display = "block";

  } else {

    containerSabores.innerHTML = "";
    containerSabores.style.display = "none";

  }

}

      atualizarCalculos();

      if (modal) {
        modal.removeAttribute('hidden');
      }
    }
  });

  if (btnMais) {
    btnMais.addEventListener('click', (e) => {
      e.preventDefault();
      const passo = unidade === 'kg' ? 0.5 : 1;
      quantidade += passo;
      atualizarCalculos();
    });
  }

  if (btnMenos) {
    btnMenos.addEventListener('click', (e) => {
      e.preventDefault();
      const passo = unidade === 'kg' ? 0.5 : 1;
      const minimo = unidade === 'kg' ? 0.5 : 1;

      if (quantidade > minimo) {
        quantidade -= passo;
        atualizarCalculos();
      }
    });
  }

  if (btnAdicionar) {
    btnAdicionar.addEventListener('click', (e) => {
      e.preventDefault();
      
      const selectSabor = document.getElementById('select-sabor');
      const saborEscolhido = selectSabor ? ` (${selectSabor.value})` : '';

      const textoOriginal = btnAdicionar.textContent;
      const corOriginal = btnAdicionar.style.backgroundColor;

      btnAdicionar.textContent = '✓ Adicionado!';
      btnAdicionar.style.backgroundColor = '#2e7d32';
      btnAdicionar.disabled = true;

      setTimeout(() => {
        fecharModal();
        btnAdicionar.textContent = textoOriginal;
        btnAdicionar.style.backgroundColor = corOriginal;
        btnAdicionar.disabled = false;
      }, 1200);
    });
  }

  function fecharModal() {
    if (modal) {
      modal.setAttribute('hidden', '');
    }
  }

  if (btnFechar) btnFechar.addEventListener('click', fecharModal);
  if (fundoModal) fundoModal.addEventListener('click', fecharModal);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') fecharModal();
  });

});