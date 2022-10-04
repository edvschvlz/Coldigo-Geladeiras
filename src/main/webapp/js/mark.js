COLDIGO.marca = new Object();

$(document).ready(function() {
	COLDIGO.marca.cadastrar = function() {
		var marca = new Object();
		marca.nome = document.frmAddMarca.nome.value;

		if (marca.nome == "") {
			COLDIGO.exibirAviso("Preencha o campo nome!");
		} else {
			$.ajax({
				type: "POST",
				url: COLDIGO.PATH + "marca/inserir",
				data: JSON.stringify(marca),
				success: function(msg) {
					COLDIGO.marca.buscar();
					COLDIGO.exibirAviso(msg);
					$("#addMarca").trigger("reset");
				},
				error: function(info) {
					COLDIGO.exibirAviso("Erro ao cadastrar uma nova marca: " + info.status + " - " + info.statusText);
				}
			})
		}
	}

	COLDIGO.marca.buscar = function() {
		var valorBusca = $("#campoBuscaMarca").val();

		$.ajax({
			type: "GET",
			url: COLDIGO.PATH + "marca/buscarPorNome",
			data: "valorBusca=" + valorBusca,
			success: function(dados) {
				dados = JSON.parse(dados);
				$("#listaMarcas").html(COLDIGO.marca.exibir(dados));
			},
			error: function(info) {
				COLDIGO.exibirAviso("Erro ao consultar os contatos: " + info.status + " - " + info.statusText);
			}
		})
	}

	COLDIGO.marca.exibir = function(listaDeMarcas) {
		var tabela = "<table>" +
			"<tr>" +
			"<th>Nome</th>" +
			"<th class='acoes'>Ações</th>" +
			"</tr>";

		if (listaDeMarcas != undefined && listaDeMarcas.length > 0) {
			for (var x = 0; x < listaDeMarcas.length; x++) {
				tabela += "<tr>" +
					"<td>" + listaDeMarcas[x].nome + "</td>" +
					"<td>" +
					"<a onclick=\"COLDIGO.marca.exibirEdicao('" + listaDeMarcas[x].id + "')\"><img src='../../imgs/edit.png' alt='Editar registro'</a> " +
					"<a onclick=\"COLDIGO.marca.excluir('" + listaDeMarcas[x].id + "')\"><img src='../../imgs/delete.png' alt='Excluir registro'</a> " +
					"</td>" +
					"</tr>"
			}
		} else if (listaDeMarcas == "") {
			tabela += "<tr><td colspan='2'>Nenhum registro encontrado</td></tr>";
		}
		tabela += "</table>";

		return tabela;
	}

	COLDIGO.marca.buscar();

	COLDIGO.marca.excluir = function(id) {
		var modalExclusaoMarca = {
			title: "Excluir Marca",
			height: 200,
			width: 400,
			modal: true,
			buttons: {
				"OK": function() {
					$.ajax({
						type: "DELETE",
						url: COLDIGO.PATH + "marca/excluir/" + id,
						success: function(msg) {
							COLDIGO.exibirAviso(msg);
							COLDIGO.marca.buscar();
						},
						error: function(info) {
							COLDIGO.exibirAviso("Erro ao excluir marca: " + info.status + " - " + info.statusText);
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

		$("#modalAviso").html("Deseja realmente excluir esse marca?");
		$("#modalAviso").dialog(modalExclusaoMarca);

	}

	COLDIGO.marca.editar = function() {
		var marca = new Object();
		marca.id = document.frmEditaMarca.idMarca.value;
		marca.nome = document.frmEditaMarca.nome.value;

		$.ajax({
			type: "PUT",
			url: COLDIGO.PATH + "marca/alterar",
			data: JSON.stringify(marca),
			success: function(msg) {
				COLDIGO.exibirAviso(msg);
				COLDIGO.marca.buscar();
				$("#modalEditaMarca").dialog("close");
			},
			error: function(info) {
				COLDIGO.exibirAviso("Erro ao editar marca: " + info.status + " - " + info.statusText);
			}
		})
	}

	COLDIGO.marca.exibirEdicao = function(id) {
		$.ajax({
			type: "GET",
			url: COLDIGO.PATH + "marca/buscarPorId",
			data: "id=" + id,
			success: function(marca) {
				document.frmEditaMarca.idMarca.value = marca.id;
				document.frmEditaMarca.nome.value = marca.nome;

				var modalEditaMarca = {
					title: "Editar Marca",
					height: 200,
					width: 350,
					modal: true,
					buttons: {
						"Salvar": function() {
							COLDIGO.marca.editar();
						},
						"Cancelar": function() {
							$(this).dialog("close");
						}
					},
					close: function() {
						//caso o usuário simplesmente feche a caixa de edição não deve acontecer nada
					}
				}

				$("#modalEditaMarca").dialog(modalEditaMarca);
			},
			error: function(info) {
				COLDIGO.exibirAviso("Erro ao buscar marca para edição: " + info.status + " - " + info.statusText);
			}
		})
	}

});
