let dadosFinanceiros = JSON.parse(localStorage.getItem("financeiro")) || {
  receitas: [],
  despesas: []
};

function adicionarDespesa(despesa) {
  dadosFinanceiros.despesas.push(despesa);
  localStorage.setItem("financeiro", JSON.stringify(dadosFinanceiros));
}

const categoriasFinanceiras = {
  receitas: {
    "Salário": ["Salário Mensal"],
    "Renda Extra": ["Hora Extra", "Freelance", "Bicos", "Serviços Ocasionais"],
    "Divisão de Despesas": ["Reembolso de amigos/família", "Rateios"],
    "Benefícios Trabalhistas": ["13º Salário", "Férias", "FGTS", "PIS/PASEP"],
    "Bônus / Gratificações": ["Gratificações", "Prêmios no Trabalho"],
    "Investimentos": ["Dividendos", "Juros", "Resgate de Aplicações"],
    "Reembolsos": ["Empresa (ex: viagens)", "Plano de Saúde", "Outros"],
    "Aluguéis / Venda de Bens": ["Aluguel de Imóveis", "Aluguel de Veículos", "Venda de Usados"],
    "Prêmios / Indenizações": ["Restituição de IR", "Seguros", "Loterias", "Outros Prêmios"]
  },
  despesas: {
    "Moradia": ["Aluguel", "Condomínio", "Luz", "Água", "Gás", "Internet", "Manutenção", "Telefone"],
    "Alimentação & Compras": ["Supermercado", "Feira", "Restaurante", "Delivery", "Eletrônicos"],
    "Transporte & Veículos": ["Combustível", "Transporte Público", "Manutenção", "Seguro", "Estacionamento"],
    "Saúde & Cuidados Pessoais": ["Plano de Saúde", "Consultas", "Exames", "Remédios", "Academia", "Higiene", "Procedimentos", "Vestuário"],
    "Educação & Desenvolvimento": ["Faculdade", "Cursos", "Livros", "Material Didático", "Equipamentos"],
    "Lazer & Viagens": ["Passeios", "Cinema", "Shows", "Viagens", "Hobbies", "Jogos"],
    "Assinaturas & Serviços": ["Streaming", "Personal Trainer", "Softwares"],
    "Presentes & Doações": ["Presentes", "Dízimos", "Caridade", "Ajuda a Terceiros"],
    "Impostos & Pagamentos Financeiros": ["Impostos", "Taxas Bancárias", "Juros", "Parcelamentos", "Empréstimos"],
    "Investimentos & Poupança": ["Aportes Mensais", "Reserva de Emergência", "Previdência"],
    "Outras Despesas": ["Gastos Imprevistos", "Despesas Únicas"],
    "Vestuário": ["Roupas", "Calçados", "Acessórios", "Perfumes"]
  }
};

function preencherCategorias(tipo) {
  const categoriaSelect = document.getElementById("categoria");
  categoriaSelect.innerHTML = "<option value=''>Selecione</option>";

  const categorias = categoriasFinanceiras[tipo];
  for (const categoria in categorias) {
    const option = document.createElement("option");
    option.value = categoria;
    option.textContent = categoria;
    categoriaSelect.appendChild(option);
  }

  categoriaSelect.onchange = () => preencherSubcategorias(tipo, categoriaSelect.value);
}

function preencherSubcategorias(tipo, categoriaSelecionada) {
  const subcategoriaSelect = document.getElementById("subcategoria");
  subcategoriaSelect.innerHTML = "<option value=''>Selecione</option>";

  const subcategorias = categoriasFinanceiras[tipo][categoriaSelecionada] || [];
  subcategorias.forEach(sub => {
    const option = document.createElement("option");
    option.value = sub;
    option.textContent = sub;
    subcategoriaSelect.appendChild(option);
  });
}

document.addEventListener("DOMContentLoaded", () => {
  preencherCategorias("despesas");

  const meioPagamento = document.getElementById("meioPagamento");
  const cartaoContainer = document.getElementById("cartaoContainer");

  meioPagamento.addEventListener("change", function () {
    const meio = this.value;
    cartaoContainer.style.display = (meio === "Cartão de Crédito" || meio === "Cartão de Débito") ? "block" : "none";
    if (meio !== "Cartão de Crédito" && meio !== "Cartão de Débito") {
      document.getElementById("cartao").value = "";
    }
  });

  const formaPagamento = document.getElementById("formaPagamento");
  const parcelasContainer = document.getElementById("parcelasContainer");
  const dataInicialContainer = document.getElementById("dataInicialContainer");
  const valorParcelaContainer = document.getElementById("valorParcelaContainer");
  const qtdParcelasInput = document.getElementById("qtdParcelas");
  const valorInput = document.getElementById("valor");
  const valorParcela = document.getElementById("valorParcela");

  formaPagamento.addEventListener("change", () => {
    const isParcelado = formaPagamento.value === "Parcelado";
    parcelasContainer.classList.toggle("d-none", !isParcelado);
    dataInicialContainer.classList.toggle("d-none", !isParcelado);
    valorParcelaContainer.classList.toggle("d-none", !isParcelado);
  });

  function calcularValorParcela() {
    const valor = parseFloat(valorInput.value);
    const parcelas = parseInt(qtdParcelasInput.value);
    if (valor && parcelas && parcelas > 0) {
      valorParcela.textContent = `R$ ${(valor / parcelas).toFixed(2)}`;
    } else {
      valorParcela.textContent = '';
    }
  }

  valorInput.addEventListener("input", calcularValorParcela);
  qtdParcelasInput.addEventListener("input", calcularValorParcela);

  document.getElementById("formDespesa").addEventListener("submit", function (event) {
    event.preventDefault();

    const descricao = document.getElementById("descricao").value.trim();
    const valor = parseFloat(document.getElementById("valor").value);
    const data = document.getElementById("data").value;
    const categoria = document.getElementById("categoria").value;
    const subcategoria = document.getElementById("subcategoria").value;
    const forma = formaPagamento.value;
    const meio = meioPagamento.value;
    const cartao = document.getElementById("cartao").value;

    if (!descricao || isNaN(valor) || !data || !categoria || !subcategoria || !forma || !meio) {
      alert("Por favor, preencha todos os campos corretamente.");
      return;
    }

    if ((meio === "Cartão de Crédito" || meio === "Cartão de Débito") && !cartao) {
      alert("Selecione o cartão utilizado.");
      return;
    }

    if (forma === "Parcelado") {
      const qtdParcelas = parseInt(qtdParcelasInput.value);
      const dataInicial = new Date(document.getElementById("dataInicial").value);
      const valorUnitario = (valor / qtdParcelas).toFixed(2);

      for (let i = 0; i < qtdParcelas; i++) {
        const dataParcela = new Date(dataInicial);
        dataParcela.setMonth(dataParcela.getMonth() + i);

        const despesa = {
          descricao: `${descricao} - Parcela ${i + 1}/${qtdParcelas}`,
          valor: parseFloat(valorUnitario),
          data: dataParcela.toLocaleDateString('pt-BR'),
          categoria,
          subcategoria,
          formaPagamento: forma,
          meioPagamento: meio,
          cartao: cartao || null
        };

        adicionarDespesa(despesa);
      }
    } else {
      const despesa = {
        descricao,
        valor,
        data,
        categoria,
        subcategoria,
        formaPagamento: forma,
        meioPagamento: meio,
        cartao: cartao || null
      };

      adicionarDespesa(despesa);
    }

    alert("Despesa registrada com sucesso!");
    this.reset();
    document.getElementById("subcategoria").innerHTML = "<option value=''>Selecione</option>";
    cartaoContainer.style.display = "none";
    parcelasContainer.classList.add("d-none");
    dataInicialContainer.classList.add("d-none");
    valorParcelaContainer.classList.add("d-none");
    valorParcela.textContent = '';
  });
});