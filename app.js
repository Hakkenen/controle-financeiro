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
    "Aluguéis / Venda de Bens": ["Aluguel de Imóveis", "Aluguel de Veículos", "Venda de Usados (celular, carro, etc.)"],
    "Prêmios / Indenizações": ["Restituição de IR", "Seguros", "Loterias", "Outros Prêmios"]
  },
  despesas: {
    "Moradia": ["Aluguel", "Condomínio", "Luz", "Água", "Gás", "Internet", "Manutenção", "Telefone"],
    "Alimentação & Compras": ["Supermercado", "Feira", "Restaurante", "Delivery", "Eletrônicos/Peças Pequenas"],
    "Transporte & Veículos": ["Combustível", "Transporte Público", "Manutenção", "Seguro", "Estacionamento"],
    "Saúde & Cuidados Pessoais": ["Plano de Saúde", "Consultas", "Exames", "Remédios", "Academia", "Higiene Pessoal", "Procedimentos (cirurgias, etc.)", "Vestuário"],
    "Educação & Desenvolvimento": ["Faculdade", "Cursos", "Livros", "Material Didático", "Equipamentos de Estudo (ex: Notebook)"],
    "Lazer & Viagens": ["Passeios", "Cinema", "Shows", "Viagens", "Hobbies", "Jogos"],
    "Assinaturas & Serviços": ["Streaming", "Personal Trainer", "Softwares"],
    "Presentes & Doações": ["Presentes", "Dízimos", "Caridade", "Ajuda a Terceiros", "Ofertas"],
    "Impostos & Pagamentos Financeiros": ["Impostos", "Taxas Bancárias", "Juros", "Parcelamentos", "Empréstimos"],
    "Investimentos & Poupança": ["Aportes Mensais", "Reserva de Emergência", "Previdência"],
    "Outras Despesas": ["Gastos Imprevistos", "Despesas Únicas"],
    "Vestuário": ["Roupas do dia a dia", "Calçados", "Acessórios", "Roupas íntimas", "Moda esportiva / Fitness", "Roupas sociais", "Perfumes", "Outros itens de vestuário"]
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

  // Mostrar/ocultar campo de cartão
  document.getElementById("meioPagamento").addEventListener("change", function () {
    const meio = this.value;
    const cartaoContainer = document.getElementById("cartaoContainer");

    if (meio === "Cartão de Crédito" || meio === "Cartão de Débito") {
      cartaoContainer.style.display = "block";
    } else {
      cartaoContainer.style.display = "none";
      document.getElementById("cartao").value = "";
    }
  });

  // Captura e salva a despesa
  document.getElementById("formDespesa").addEventListener("submit", function (event) {
    event.preventDefault();

    const descricao = document.getElementById("descricao").value.trim();
    const valorBruto = document.getElementById("valor").value.trim();
    const valor = parseFloat(valorBruto.replace(",", "."));
    const data = document.getElementById("data").value;
    const categoria = document.getElementById("categoria").value;
    const subcategoria = document.getElementById("subcategoria").value;
    const formaPagamento = document.getElementById("formaPagamento").value;
    const meioPagamento = document.getElementById("meioPagamento").value;
    const cartao = document.getElementById("cartao").value;

    if (!descricao || isNaN(valor) || !data || !categoria || !subcategoria || !formaPagamento || !meioPagamento) {
      alert("Por favor, preencha todos os campos corretamente.");
      return;
    }

    if ((meioPagamento === "Cartão de Crédito" || meioPagamento === "Cartão de Débito") && !cartao) {
      alert("Selecione o cartão utilizado.");
      return;
    }

    const novaDespesa = {
      descricao,
      valor,
      data,
      categoria,
      subcategoria,
      formaPagamento,
      meioPagamento,
      cartao: cartao || null
    };

    adicionarDespesa(novaDespesa);

    alert("Despesa salva com sucesso!");
    document.getElementById("formDespesa").reset();
    document.getElementById("subcategoria").innerHTML = "<option value=''>Selecione</option>";
    document.getElementById("cartaoContainer").style.display = "none";
  });
});