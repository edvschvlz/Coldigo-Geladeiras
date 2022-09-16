COLDIGO.produto = new Object();

$(document).ready(function() {
	//Carrega as marcas registradas no BD no select do formulário de inserir
	COLDIGO.produto.carregarMarcas = function(id) {
		if (id != undefined) {
			select = "#selMarcaEdicao";
		} else {
			select = "#selMarca";
		}

		$.ajax({
			type: "GET",
			url: COLDIGO.PATH + "marca/buscar",
			success: function(marcas) {
				if (marcas != "") {

					$(select).html("");

					var option = document.createElement("option");
					option.setAttribute("value", "");
					option.innerHTML = ("Escolha");
					$(select).append(option);

					for (var i = 0; i < marcas.length; i++) {
						var option = document.createElement("option");
						option.setAttribute("value", marcas[i].id);

						if ((id != undefined) && (id == marcas[i].id)) {
							option.setAttribute("selected", "selected");
						}

						option.innerHTML = (marcas[i].nome);
						$(select).append(option);
					}

				} else {
					$(select).html("");
					var option = document.createElement("option");
					option.setAttribute("value", "");
					option.innerHTML = ("Cadastre uma marca primeiro!");
					$(select).append(option);
					$(select).addClass("aviso");
				}
			},
			error: function(info) {
				COLDIGO.exibirAviso("Erro ao buscar as marcas: " + info.status + " - " + info.statusText);

				$(select).html("");
				var option = document.createElement("option");
				option.innerHTML = ("Erro ao carregar marcas!");
				option.setAttribute("value", "");
				$(select).append(option);
				$(select).addClass("aviso");
			}
		})
	}
	COLDIGO.produto.carregarMarcas();

	//Cadastra no BD o produto informado
	COLDIGO.produto.cadastrar = function() {
		var produto = new Object();
		produto.categoria = document.frmAddProduto.categoria.value;
		produto.marcaId = document.frmAddProduto.marcaId.value;
		produto.modelo = document.frmAddProduto.modelo.value;
		produto.capacidade = document.frmAddProduto.capacidade.value;
		produto.valor = document.frmAddProduto.valor.value;

		if ((produto.categoria == "") || (produto.marcaId) == "" || (produto.modelo) == "" || (produto.capacidade) == "" || (produto.valor) == "") {
			COLDIGO.exibirAviso("Preencha todos os campos!");
		} else {
			$.ajax({
				type: "POST",
				url: COLDIGO.PATH + "produto/inserir",
				data: JSON.stringify(produto),
				success: function(msg) {
					COLDIGO.exibirAviso(msg);
					$("#addProduto").trigger("reset");
				},
				error: function(info) {
					COLDIGO.exibirAviso("Erro ao cadastrar um novo produto: " + info.status + " - " + info.statusText);
				}
			})
		}
	}

	//Busca no BD e exibe na página os produtos que atendam à solicitação do usuário
	COLDIGO.produto.buscar = function() {
		var valorBusca = $("#campoBuscaProduto").val();

		$.ajax({
			type: "GET",
			url: COLDIGO.PATH + "produto/buscar",
			data: "valorBusca=" + valorBusca,
			success: function(dados) {
				dados = JSON.parse(dados);
				$("#listaProdutos").html(COLDIGO.produto.exibir(dados));
			},
			error: function(info) {
				COLDIGO.exibirAviso("Erro ao consultar os contatos: " + info.status + " - " + info.statusText);
			}
		})
	}

	//Transforma os dados dos produtos recebidos do servidor em uma tabela HTML
	COLDIGO.produto.exibir = function(listaDeProdutos) {

		var tabela = "<table>" +
			"<tr>" +
			"<th>Categoria</th>" +
			"<th>Marca</th>" +
			"<th>Modelo</th>" +
			"<th>Cap.(1)</th>" +
			"<th>Valor</th>" +
			"<th class='acoes'>Ações</th>" +
			"</tr>";

		if (listaDeProdutos != undefined && listaDeProdutos.length > 0) {
			for (var x = 0; x < listaDeProdutos.length; x++) {
				tabela += "<tr>" +
					"<td>" + listaDeProdutos[x].categoria + "</td>" +
					"<td>" + listaDeProdutos[x].marcaNome + "</td>" +
					"<td>" + listaDeProdutos[x].modelo + "</td>" +
					"<td>" + listaDeProdutos[x].capacidade + "</td>" +
					"<td>R$ " + COLDIGO.formatarDinheiro(listaDeProdutos[x].valor) + "</td>" +
					"<td>" +
					"<a onclick=\"COLDIGO.produto.exibirEdicao('" + listaDeProdutos[x].id + "')\"><img src='../../imgs/edit.png' alt='Editar registro'</a> " +
					"<a onclick=\"COLDIGO.produto.excluir('" + listaDeProdutos[x].id + "')\"><img src='../../imgs/delete.png' alt='Excluir registro'</a> " +
					"</td>" +
					"</tr>"
			}
		} else if (listaDeProdutos == "") {
			tabela += "<tr><td colspan='6'>Nenhum registro encontrado</td></tr>";
		}
		tabela += "</table>";

		return tabela;
	}

	//Executa a função de buscar ao carregar a página
	COLDIGO.produto.buscar();

	COLDIGO.produto.excluir = function(id) {
		var modalExclusaoProduto = {
			title: "Excluir Produto",
			height: 200,
			width: 400,
			modal: true,
			buttons: {
				"OK": function() {
					$.ajax({
						type: "DELETE",
						url: COLDIGO.PATH + "produto/excluir/" + id,
						success: function(msg) {
							COLDIGO.exibirAviso(msg);
							COLDIGO.produto.buscar();
						},
						error: function(info) {
							COLDIGO.exibirAviso("Erro ao excluir produto: " + info.status + " - " + info.statusText);
						}
					})
				},
				"Cancelar": function() {
					$(this).dialog("close");
				}
			},
			close: function() {
				//caso o usuário simplesmente feche a caixa de edição não deve acontecer nada
			}
		}
		
		$("#modalAviso").html("Deseja realmente excluir esse produto?");
		$("#modalAviso").dialog(modalExclusaoProduto);
		
	}

	//Carrega no BD os dados do produto selecionado para alteracao e coloca-os no formulário de alteração
	COLDIGO.produto.exibirEdicao = function(id) {
		$.ajax({
			type: "GET",
			url: COLDIGO.PATH + "produto/buscarPorId",
			data: "id=" + id,
			success: function(produto) {
				document.frmEditaProduto.idProduto.value = produto.id;
				document.frmEditaProduto.modelo.value = produto.modelo;
				document.frmEditaProduto.capacidade.value = produto.capacidade;
				document.frmEditaProduto.valor.value = produto.valor;

				var selCategoria = document.getElementById("selCategoriaEdicao");
				for (var i = 0; i < selCategoria.length; i++) {
					if (selCategoria.options[i].value == produto.categoria) {
						selCategoria.options[i].setAttribute("selected", "selected");
					} else {
						selCategoria.options[i].removeAttribute("selected");
					}
				}

				COLDIGO.produto.carregarMarcas(produto.marcaId);

				var modalEditaProduto = {
					title: "Editar Produto",
					height: 400,
					width: 550,
					modal: true,
					buttons: {
						"Salvar": function() {
							COLDIGO.produto.editar();
						},
						"Cancelar": function() {
							$(this).dialog("close");
						}
					},
					close: function() {
						//caso o usuário simplesmente feche a caixa de edição não deve acontecer nada
					}
				}

				$("#modalEditaProduto").dialog(modalEditaProduto);
			},
			error: function(info) {
				COLDIGO.exibirAviso("Erro ao buscar produto para edição: " + info.status + " - " + info.statusText);
			}
		})
	}

	COLDIGO.produto.editar = function() {
		var produto = new Object();
		produto.id = document.frmEditaProduto.idProduto.value;
		produto.categoria = document.frmEditaProduto.categoria.value;
		produto.marcaId = document.frmEditaProduto.marcaId.value;
		produto.modelo = document.frmEditaProduto.modelo.value;
		produto.capacidade = document.frmEditaProduto.capacidade.value;
		produto.valor = document.frmEditaProduto.valor.value;

		$.ajax({
			type: "PUT",
			url: COLDIGO.PATH + "produto/alterar",
			data: JSON.stringify(produto),
			success: function(msg) {
				COLDIGO.exibirAviso(msg);
				COLDIGO.produto.buscar();
				$("#modalEditaProduto").dialog("close");
			},
			error: function(info) {
				COLDIGO.exibirAviso("Erro ao editar produto: " + info.status + " - " + info.statusText);
			}
		})
	}

});