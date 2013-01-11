translationteacher
==================

Translation Teacher is a browser-based, HTML5 language translation tool and teacher. 

www.translationteacher.com

Translation Teacher currently only runs on non-mobile Google Chrome browsers. 

It uses the webkit speech input and the Google Translate API for both language translation and audio input.

To get this running, you'll need get get your own Google Translate API key, 
and then you only have to make two minor file modificatons:

1. /lib/WritePhrase.php   line 17, change the path of your dictionary root on your server
2. /public_html/js/TT.js  line 12, change XXX to your own personal Google API key. 

You can get your Google API at https://code.google.com/apis/console

Also, make sure that your Translation Google API is authorized to work with your own domain.
Finally, you'll want to make sure that /public_html/dictionary are writeable on your server, as this is where the translated sound files will be stored.

Feel free to contact me with any questions, comments, etc. 
David Byman
david.byman@gmail.com
