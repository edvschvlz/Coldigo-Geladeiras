	$(document).ready(function () {
    $("header").load("/ProjetoTrilhaWeb/pages/site/general/cabecalho.html");
    $("nav").load("/ProjetoTrilhaWeb/pages/site/general/menu.html");
    $("footer").load("/ProjetoTrilhaWeb/pages/site/general/rodape.html");
});

function validaFaleConosco() {
    var nome = document.frmfaleconosco.txtnome.value;
    var expRegNome = new RegExp("^[A-zÀ-ü]{3,}([ ]{1}[A-zÀ-ü]{2,})+$");

    if (!expRegNome.test(nome)) {
        alert("Preencha o campo Nome.");
        document.frmfaleconosco.txtnome.focus();
        return false;
    }

    var fone = document.frmfaleconosco.txtfone.value;
    var expRegFone = new RegExp("^[(]{1}[1-9]{2}[)]{1}[ ]{1}[0-9]{4,5}[-]{1}[0-9]{4}$");

    if (!expRegFone.test(fone)) {
        alert("Preencha o campo Telefone.");
        document.frmfaleconosco.txtfone.focus();
        return false;
    }

    if (document.frmfaleconosco.txtemail.value == "") {
        alert("Preencha o campo Email.");
        document.frmfaleconosco.txtemail.focus();
        return false;
    }

    if (document.frmfaleconosco.selmotivo.value == "") {
        alert("Escolha um Motivo.");
        document.frmfaleconosco.selmotivo.focus();
        return false;
    }

    if (document.frmfaleconosco.selmotivo.value == "PR") {
        if (document.frmfaleconosco.selProduto.value == "") {
            alert("Selecione um Produto");
            document.frmfaleconosco.selProduto.focus();
            return false;
        }
    }

    if (document.frmfaleconosco.txacomentario.value == "") {
        alert("Escreva um Comentário.");
        document.frmfaleconosco.txacomentario.focus();
        return false;
    }

    return true;
}

function verificaMotivo(motivo) {
    var elemento = document.getElementById("opcaoProduto");

    if (motivo == "PR") {
        var select = document.createElement("select");

        select.setAttribute("name", "selProduto");

        //escolha
        var option = document.createElement("option");

        option.setAttribute("value", "");

        var texto = document.createTextNode("Escolha");

        option.appendChild(texto);

        select.appendChild(option);

        //freezer
        var option = document.createElement("option");

        option.setAttribute("value", "FR");

        var texto = document.createTextNode("Freezer");

        option.appendChild(texto);

        select.appendChild(option);

        //geladeira
        var option = document.createElement("option");

        option.setAttribute("value", "GE");

        var texto = document.createTextNode("Geladeira");

        option.appendChild(texto);

        select.appendChild(option);

        elemento.appendChild(select);
    } else {
        if (elemento.firstChild) {
            elemento.removeChild(elemento.firstChild);
        }
    }
}


