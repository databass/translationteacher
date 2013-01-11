<?php

require "../lib/WritePhrase.php";
$bPhrase=$_GET['bPhrase'];
$tPhrase=$_GET['tPhrase'];
$lang=$_GET['lang'];
$format=$_GET['format'];

$writePhrase = new WritePhrase($bPhrase, $tPhrase, $lang, $format);


?>

