package br.com.coldigogeladeiras.jdbc;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.ArrayList;
import java.util.List;

import com.google.gson.JsonObject;

import br.com.coldigogeladeiras.jdbcinterface.MarcaDAO;
import br.com.coldigogeladeiras.modelo.Marca;

public class JDBCMarcaDAO implements MarcaDAO {
	private Connection conexao;

	public JDBCMarcaDAO(Connection conexao) {
		this.conexao = conexao;
	}

	public boolean inserir(Marca marca) {
		String comando = "INSERT INTO marcas (id, nome) VALUES (?, ?)";
		PreparedStatement p;

		try {
			p = this.conexao.prepareStatement(comando);
			p.setInt(1, marca.getId());
			p.setString(2, marca.getNome());

			p.execute();

		} catch (SQLException e) {
			e.printStackTrace();
			return false;
		}
		return true;
	}

	public String deletar(int id) {
		String comando = "SELECT * FROM produtos WHERE marcas_id = ?";
		PreparedStatement p;

		try {
			p = this.conexao.prepareStatement(comando);
			p.setInt(1, id);

			if (!p.executeQuery().next()) {
				comando = "DELETE FROM marcas WHERE id = ?";

				p = this.conexao.prepareStatement(comando);
				p.setInt(1, id);
				p.execute();

				return "Marca excluída com sucesso!";
			} else {
				return "A marca possui produtos vinculados! Atualize a página para ver os registros atuais.";
			}

		} catch (SQLException e) {
			e.printStackTrace();
			return "Erro ao excluir marca!";
		}
	}

	public List<JsonObject> buscarPorNome(String nomeBusca) {
		// Inicia a criação do comando SQL de busca
		String comando = "SELECT * FROM marcas";

		// Se o nome não estiver vazio...
		if (!nomeBusca.equals("")) {
			// concatena no comando o WHERE buscando o nome do produto
			// o texto da variável nome

			comando += " WHERE nome LIKE '%" + nomeBusca + "%'";
		}

		// Finaliza o comando ordenado alfabeticamente por
		// categoria, marca e depois modelo.
		comando += " ORDER BY nome ASC;";

		List<JsonObject> listaMarcas = new ArrayList<JsonObject>();
		JsonObject marca = null;

		try {

			Statement stmt = conexao.createStatement();
			ResultSet rs = stmt.executeQuery(comando);

			while (rs.next()) {

				int id = rs.getInt("id");
				String nome = rs.getString("nome");

				marca = new JsonObject();
				marca.addProperty("id", id);
				marca.addProperty("nome", nome);

				listaMarcas.add(marca);
			}

		} catch (Exception e) {
			e.printStackTrace();
		}

		return listaMarcas;
	}

	public List<Marca> buscar() {
		// Criação da instrução SQL para busca de todas as marcas
		String comando = "SELECT * FROM marcas";

		// Criação de uma lista para armazenar cada marca encontrada
		List<Marca> listMarcas = new ArrayList<Marca>();

		// Criação do objeto marca com o valor null (ou seja, sem instancialo)
		Marca marca = null;

		// Abertura do try-catch
		try {

			Statement stmt = conexao.createStatement();

			// Execução da instrução criada previamente e armazenamento do resultado no
			// objeto rs
			ResultSet rs = stmt.executeQuery(comando);

			while (rs.next()) {

				// Criação da instancia da classe Marca, assim criando sempre uma nova cópia do
				// objeto Marca
				marca = new Marca();

				// Recebimento dos 2 dados retornados do BD para cada linha encontrada
				int id = rs.getInt("id");
				String nome = rs.getString("nome");

				// Setando no objeto marca os valores encontrados
				marca.setId(id);
				marca.setNome(nome);

				// Adição da instância contida no objeto Marca na lista de marcas
				listMarcas.add(marca);
			}

			// Caso alguma Exception seja gerada no try, recebe-a no objeto "e"
		} catch (Exception e) {
			// Recebe a exceção no console
			e.printStackTrace();
		}

		// Retorna para quem chamou o método a lista criada
		return listMarcas;
	}

	public boolean alterar(Marca marca) {
		String comando = "UPDATE marcas SET nome = ? WHERE id = ?";

		PreparedStatement p;

		try {
			p = this.conexao.prepareStatement(comando);
			p.setString(1, marca.getNome());
			p.setInt(2, marca.getId());
			p.executeUpdate();
		} catch (Exception e) {
			e.printStackTrace();
			return false;
		}
		return true;

	}

	public Marca buscarPorId(int id) {
		String comando = "SELECT * FROM marcas WHERE id = ?";
		Marca marca = new Marca();
		try {
			PreparedStatement p = this.conexao.prepareStatement(comando);
			p.setInt(1, id);
			ResultSet rs = p.executeQuery();

			while (rs.next()) {
				String nome = rs.getString("nome");

				marca.setId(id);
				marca.setNome(nome);

			}

		} catch (Exception e) {
			e.printStackTrace();
		}
		return marca;
	}

}
