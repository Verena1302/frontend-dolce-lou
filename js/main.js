document.addEventListener('DOMContentLoaded', () => {
 
  const API_URL = 'https://dolceloubackend.onrender.com';

  async function criarPedido(pedido) {
    try {
      const response = await fetch(`${API_URL}/v1/carrinho/create`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(pedido)
      });

      if (!response.ok) {
        throw new Error(`Erro ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    } catch (erro) {
      console.error('Erro ao criar pedido:', erro);
      throw erro;
    }
  }

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

  let produtoAtual = null;

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

      produtoAtual = {
        id: dataset.produtoId,
        nome,
        descricao,
        preco: parseFloat(String(precoRaw).replace(/[^\d,-]/g, '').replace(',', '.')) || 0,
        unidade: dataset.unidade || (String(precoRaw).toLowerCase().includes('un') ? 'un' : 'kg'),
        imagem: imgSrc
      };

      precoUnitario = produtoAtual.preco;
      unidade = produtoAtual.unidade;
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
        if (areaQtd) areaQtd.style.display = "none";

        let html = `
          <div style="margin-bottom:1rem;">
            <label style="display:block;font-weight:bold;margin-bottom:.5rem;">
              Tamanho
            </label>

            <select id="select-tamanho"
              style="width:100%;padding:.6rem;border:1px solid #ccc;border-radius:6px;font-family:inherit;font-size:1rem;color:inherit;background:#fff;">
              <option value="700g" data-qtd="0.7">Pequeno (700g)</option>
              <option value="1,2kg" data-qtd="1.2">Médio (1,2kg)</option>
              <option value="1,7kg" data-qtd="1.7">Grande (1,7kg)</option>
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

        setTimeout(() => {
          const selectTamanho = document.getElementById('select-tamanho');
          if (selectTamanho) {
            const opcaoSelecionada = selectTamanho.options[selectTamanho.selectedIndex];
            quantidade = parseFloat(opcaoSelecionada.dataset.qtd) || 0.7;
            atualizarCalculos();

            selectTamanho.addEventListener('change', () => {
              const opcao = selectTamanho.options[selectTamanho.selectedIndex];
              quantidade = parseFloat(opcao.dataset.qtd) || 0.7;
              atualizarCalculos();
            });
          }
        }, 0);

      } else {
        if (areaQtd) areaQtd.style.display = "block";

        if (sabores && sabores.length > 0) {
          let html = `
            <label style="display:block;font-weight:bold;margin-bottom:.5rem;">
              Escolha o sabor
            </label>

            <select id="select-sabor"
              style="width:100%;padding:.6rem;border:1px solid #ccc;border-radius:6px;font-family:inherit;font-size:1rem;color:inherit;background:#fff;">
          `;

          sabores.forEach(sabor => {
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
    btnAdicionar.addEventListener('click', async (e) => {
      e.preventDefault();
     
      const selectSabor = document.getElementById('select-sabor');
      const saborEscolhido = selectSabor ? ` (${selectSabor.value})` : '';
      const selectTamanho = document.getElementById('select-tamanho');
      const tamanhoSelecionado = selectTamanho ? selectTamanho.value : '';

      let nomeProduto = produtoAtual?.nome || 'Produto';
      if (saborEscolhido.trim()) nomeProduto += saborEscolhido;
      if (tamanhoSelecionado) nomeProduto += ` - ${tamanhoSelecionado}`;

      const subtotal = precoUnitario * quantidade;

      const pedido = {
        quantidade: Math.round(quantidade),
        preco_produto: subtotal,
        frete: 15.00,
        cep: "0",
        preco_total: subtotal + 15.00,
        acesso: { id: "1" }
      };

      const textoOriginal = btnAdicionar.textContent;
      const corOriginal = btnAdicionar.style.backgroundColor;

      btnAdicionar.textContent = '✓ Adicionado!';
      btnAdicionar.style.backgroundColor = '#2e7d32';
      btnAdicionar.disabled = true;

      try {
        const resposta = await criarPedido(pedido);
        console.log('Pedido criado com sucesso:', resposta);

        const carrinhoLocal = JSON.parse(localStorage.getItem('carrinho') || '[]');
        carrinhoLocal.push({
          id: produtoAtual?.id,
          nome: nomeProduto,
          preco: precoUnitario,
          quantidade,
          unidade,
          subtotal,
          pedidoId: resposta?.id ?? null
        });
        localStorage.setItem('carrinho', JSON.stringify(carrinhoLocal));

      } catch (erro) {
        console.error('Falha ao enviar pedido:', erro);
        btnAdicionar.textContent = 'Erro ao enviar';
        btnAdicionar.style.backgroundColor = '#c62828';
      }

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