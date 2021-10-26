<h1>Cross Site Scrpting XSS</h1>

<h3>Lista de Produtos</h3>

<table>
    <thead>
    <tr>
        <th>Nome</th>
        <th>Valor</th>
        <th>Descrição</th>
    </tr>
    </thead>
    <tbody>

        <?php
            $response = file_get_contents('http://172.17.0.1:3000/products');
            $response = json_decode($response, TRUE );

            foreach ($response as $product){
                echo "<tr>";
                echo "<td>" . $product['name'] . "</td>";
                echo "<td>" . $product['value'] . "</td>";
                echo "<td>" . $product['description'] . "</td>";
                echo "</tr>";
            }
        ?>
      </tbody>
</table>

