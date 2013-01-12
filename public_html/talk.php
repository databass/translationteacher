<?php

/*
 *  Converts text into an mp3 or wav file, in the supplied language. 
 *
 *  @param $phrase string The text to be written
 *  @param $lang string Two-character language code. Defaults to 'en' (English)
 *  @param $format String Audio format. Currently supported values are 'wav' and 'mp3'. Defaults to 'mp3' Currently only'mp3' will work with native voices in non-English languages 
 *
 *  Author: David Byman david.byman@gmail.com
 */


require "../lib/WritePhrase.php";

$phrase = $_GET['phrase'];
$lang   = $_GET['lang'];
$format = $_GET['format'];

$writePhrase = new WritePhrase($phrase, $lang, $format);


?>
