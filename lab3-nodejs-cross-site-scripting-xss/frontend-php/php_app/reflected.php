<h1>Cross Site Scrpting XSS</h1>

<h3>Reflected cross-site scripting</h3>

<?php

    echo '<p>Name: ' . $_GET["name"] .'</p>';

?>