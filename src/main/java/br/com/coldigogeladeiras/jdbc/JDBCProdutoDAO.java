package br.com.coldigogeladeiras.jdbc;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.ArrayList;
import java.util.List;

import com.google.gson.JsonObject;

import br.com.coldigogeladeiras.jdbcinterface.ProdutoDAO;
import br.com.coldigogeladeiras.modelo.Produto;

public class JDBCProdutoDAO implements ProdutoDAO {
	private Connection conexao;

	public JDBCProdutoDAO(Connection conexao) {
		this.conexao = conexao;
	}

	public String inserir(Produto produto) {
		String comando = "SELECT id FROM produtos WHERE categoria = ? AND marcas_id = ? AND modelo = ?";
		PreparedStatement p;

		try {
			p = this.conexao.prepareStatement(comando);
			p.setString(1, produto.getCategoria());
			p.setInt(2, produto.getMarcaId());
			p.setString(3, produto.getModelo());
			
			if (p.executeQuery().next()) {
				return "Produto existente!";
			}
			
			comando = "SELECT * FROM marcas WHERE id = ?";
			p = this.conexao.prepareStatement(comando);
			p.setInt(1, produto.getMarcaId());

			if (p.executeQuery().next()) {
				comando = "INSERT INTO produtos " + "(id, categoria, modelo, capacidade, valor, marcas_id) "
						+ "VALUES (?,?,?,?,?,?)";

				// Prepara o comando para execução no BD em que nos conectamos
				p = this.conexao.prepareStatement(comando);

				// Substitui no comando os "?" pelos valores do produto
				p.setInt(1, produto.getId());
				p.setString(2, produto.getCategoria());
				p.setString(3, produto.getModelo());
				p.setInt(4, produto.getCapacidade());
				p.setFloat(5, produto.getValor());
				p.setInt(6, produto.getMarcaId());

				// Executa o comando no BD
				p.execute();

				return "Produto cadastrado com sucesso.";
			} else {
				return "Marca inexistente! Atualize a página para ver os registros atuais.";
			}

		} catch (SQLException e) {
			e.printStackTrace();
			return "Erro ao cadastrar produto.";
		}
	}

	public List<JsonObject> buscarPorNome(String nome) {
		// Inicia a criação do comando SQL de busca
		String comando = "SELECT produtos.*, m1.nome as marca FROM produtos INNER JOIN marcas m1 ON (produtos.marcas_id = m1.id)";

		// Se o nome não estiver vazio...
		if (!nome.equals("")) {
			// concatena no comando o WHERE buscando o nome do produto
			// o texto da variável nome

			comando += "WHERE modelo LIKE '%" + nome + "%' ";
		}

		// Finaliza o comando ordenado alfabeticamente por
		// categoria, marca e depois modelo.
		comando += "ORDER BY categoria ASC, m1.nome ASC, modelo ASC";

		List<JsonObject> listaProdutos = new ArrayList<JsonObject>();
		JsonObject produto = null;

		try {

			Statement stmt = conexao.createStatement();
			ResultSet rs = stmt.executeQuery(comando);

			while (rs.next()) {

				int id = rs.getInt("id");
				String categoria = rs.getString("categoria");
				String modelo = rs.getString("modelo");
				int capacidade = rs.getInt("capacidade");
				float valor = rs.getFloat("valor");
				String marcaNome = rs.getString("marca");

				if (categoria.equals("1")) {
					categoria = "Geladeira";
				} else if (categoria.equals("2")) {
					categoria = "Freezer";
				}

				produto = new JsonObject();
				produto.addProperty("id", id);
				produto.addProperty("categoria", categoria);
				produto.addProperty("modelo", modelo);
				produto.addProperty("capacidade", capacidade);
				produto.addProperty("valor", valor);
				produto.addProperty("marcaNome", marcaNome);

				listaProdutos.add(produto);

			}

		} catch (Exception e) {
			e.printStackTrace();
		}

		return listaProdutos;
	}

	public boolean deletar(int id) {
		String comando = "DELETE FROM produtos WHERE id = ?";
		PreparedStatement p;
		try {
			p = this.conexao.prepareStatement(comando);
			p.setInt(1, id);
			p.execute();
		} catch (SQLException e) {
			e.printStackTrace();
			return false;
		}
		return true;
	}

	public Produto buscarPorId(int id) {
		String comando = "SELECT * FROM produtos WHERE id = ?";
		Produto produto = new Produto();
		try {
			PreparedStatement p = this.conexao.prepareStatement(comando);
			p.setInt(1, id);
			ResultSet rs = p.executeQuery();

			while (rs.next()) {

				String categoria = rs.getString("categoria");
				String modelo = rs.getString("modelo");
				int capacidade = rs.getInt("capacidade");
				float valor = rs.getFloat("valor");
				int marcaId = rs.getInt("marcas_id");

				produto.setId(id);
				produto.setCategoria(categoria);
				produto.setModelo(modelo);
				produto.setCapacidade(capacidade);
				produto.setValor(valor);
				produto.setMarcaId(marcaId);

			}

		} catch (Exception e) {
			e.printStackTrace();
		}
		return produto;
	}

	public boolean alterar(Produto produto) {
		String comando = "UPDATE produtos SET categoria = ?, modelo = ?, capacidade = ?, valor = ?, marcas_id = ? WHERE id = ?";

		PreparedStatement p;

		try {
			p = this.conexao.prepareStatement(comando);
			p.setString(1, produto.getCategoria());
			p.setString(2, produto.getModelo());
			p.setInt(3, produto.getCapacidade());
			p.setFloat(4, produto.getValor());
			p.setInt(5, produto.getMarcaId());
			p.setInt(6, produto.getId());
			p.executeUpdate();
		} catch (Exception e) {
			e.printStackTrace();
			return false;
		}
		return true;

	}

}
