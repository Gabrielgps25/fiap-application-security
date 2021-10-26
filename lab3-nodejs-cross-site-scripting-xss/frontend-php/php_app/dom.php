<h1>Cross Site Scrpting XSS</h1>

<h3>Reflected cross-site scripting</h3>

<?php

    echo '<img src=https://cdn.iconscout.com/icon/premium/png-256-thumb/search-not-found-2489522-2089222.png alt="Busca não encontrada para: \'' . $_GET["search"] .'\'"/>';

?>