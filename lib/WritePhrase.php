<?php
//WritePhrase

/*
 *  A PHP Class that converts words into speech using Google's Text to Speech API for MP3 or SpeechUtil for Wav
 *
 *  @param $phrase string The text to be written
 *  @param $lang string Two-character language code. Defaults to 'en' (English)
 *  @param $format String Audio format. Currently supported values are 'wav' and 'mp3'. Defaults to 'mp3' Currently only'mp3' will work with native voices in non-English languages 
 *
 *  Author: David Byman david.byman@gmail.com
 */

class WritePhrase
{
    function __construct($phrase = "", $lang = "en", $format = "mp3")
    {
        //modify the line below to point to dictionary root on your server
        $dictionaryRoot = "D:\\xxx\\xxx\\xxx\\translationteacher.com\\public_html\\dictionary\\";
        
        
        $phrase      = urlencode(trim($phrase));
        $md5Filename = md5($phrase);
        $lang        = trim($lang);
        $format      = trim($format);
        $soundData   = null;
        $wordPath    = $dictionaryRoot . $lang . "\\" . $md5Filename . "." . $format;
        
        
        if (!file_exists($wordPath)) {
            if (!empty($phrase)) {
                if ($format == 'wav') {
                    $soundData = $this->get_data("http://speechutil.appspot.com/convert/wav?text={$phrase}", $format, $md5Filename);
                }
                
                else {
                    $soundData = $this->get_data("http://translate.google.com/translate_tts?ie=UTF-8&tl=" . $lang . "&q={$phrase}", $format, $md5Filename);
                }
                
            }
            
            file_put_contents($wordPath, $soundData);
            
        } else {
            echo $md5Filename;
            return false;
        }
        
        
    }
    
    
    
    
    function get_data($url, $format, $filename)
    {
        $ch      = curl_init($url);
        $timeout = 555;
        
        
        curl_setopt($ch, CURLOPT_HEADER, 0);
        
        //for google mp3
        if ($format == 'mp3') {
            curl_setopt($ch, CURLOPT_HEADER, 1);
        }
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_CONNECTTIMEOUT, $timeout);
        curl_setopt($ch, CURLOPT_BINARYTRANSFER, true);
        $data = curl_exec($ch);
        curl_close($ch);
        echo $filename;
        return $data;
        
        
        
        
    }
    
    
    
}
?>
