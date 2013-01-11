/*
 *
 *TranslationTeacher module to handle speech and translation
 *Author: David Byman (david.byman@gmail.com)
 *
 *
 */


var TT = (function () {
	var my = {},
		DICTIONARY_ROOT = 'dictionary', DEFAULT_LANGUAGE = 'en', language = 'en', lastCursorPosition = 0, GOOGLE_API_KEY='XXX';
		//change the value of GOOGLE_API_KEY above to your personal Google API Key.
	
	function getLanguageDescription(languageCode) {
		
		var languageNames = new Array();
		languageNames['zh-CN']='Chinese';
		languageNames['de']='German';
		languageNames['es']='Spanish';
		languageNames['fr']='French';
		languageNames['en']='English';
		languageNames['la']='Latin';
		languageNames['sw']='Swahili';
		languageNames['sv']='Swedish';
		languageNames['hi']='Hindi';
		languageNames['ru']='Russian';
		languageNames['tr']='Turkish';
		languageNames['ar']='Arabic';
		return languageNames[languageCode];
	}
	

	
	my.moduleProperty = 1;
        
	my.baseWord = '';
	my.translateWord = '';
	
	my.editor = [];
	
        my.setLanguage = function (selectedLanguage) {
          
          language=selectedLanguage;
          
        };
	
	my.setTranslatedLanguage = function (language) {

          this.translatedLanguage=language;
          
        };
	
	
	my.getEditor = function (editorName) {
		return this.editor[editorName];
			
	};
	
	my.setEditor = function (editorName, editor) {
		this.editor[editorName]=editor;
			
	};	
	

	my.getTranslatedLanguage= function () {
          
          return this.translatedLanguage;
          
        };
	
	my.setUntranslatedLanguage= function (language) {
          
          this.untranslatedLanguage=language;
          
        };	

	my.getUntranslatedLanguage= function () {
          
          return this.untranslatedLanguage;
          
        };		
	

	my.setTranslatedText = function (text) {
          
          this.translatedText=text;
          
        };	

	my.getTranslatedText= function () {
          
          return translatedTextEditor.composer.getValue();

          
        };
	
	my.setUntranslatedText= function (text) {
          
          this.untranslatedText = text;
          
        };	

	my.getUntranslatedText= function () {

          return untranslatedTextEditor.composer.getValue();
          
        };		
	
        
        my.getLanguage = function () {
          if (language === undefined ) {
            return DEFAULT_LANGUAGE;
          }
          else {
            return language;
          }
        };

	my.getLanguageDescription = function (languageCode) {
		return getLanguageDescription(languageCode);

	}

        //more elegant with recursion?
        var getLastWord = function(text,position) {
  
          var leftSubString=text.substring(0,position), wordCount=leftSubString.split(' ').length;
          return leftSubString.split(' ')[wordCount-1];
        };
    
	my.setLastCursorPosition = function(index) {
		lastCursorPosition = index;
		
	}
	
	my.getLastCursorPosition = function() {
		return lastCursorPosition;	
		
	}

   	
	my.getCurrentCursorPosition = function(editor) {

	//	editor.composer.setValue(editor.composer.getValue().toString().replace(/&nbsp;/g,' '));
		return editor.composer.selection.getRange().startOffset;
		
	} 
	
    
        //split with underscore
        my.findSelectedWordz = function(editor) {
		var currentValue=editor.composer.getValue().toString().replace(/&nbsp;/g,' ');
		console.log('value is ' + currentValue);
		console.log('val is ' + editor.composer.getValue());
		console.log('post ' + my.getLastCursorPosition() + ' ' + my.getCurrentCursorPosition(editor));
		console.log('returning ' + currentValue.substring(my.getLastCursorPosition(), my.getCurrentCursorPosition(editor)));
		return currentValue.substring(my.getLastCursorPosition(), my.getCurrentCursorPosition(editor));
	
        };
        
        my.sayWord = function (word, language) {
          
            var snd = new Audio("dictionary/" + language + "/" + word + ".mp3");
            snd.play();
          
        };


        

	my.writeWord = function (word, language) {

        var trimmedWord=word.replace(/&nbsp;/g,'').replace(/\s$/,'');  

        $.get("talk.php", {
            lang: (language || this.getLanguage()),
	    bPhrase: trimmedWord,
            tPhrase: trimmedWord,
            format: 'mp3'
    
        }, function (data) {

              my.sayWord(data, language || my.getLanguage());
          });

   
        };
	


	
	
	//called after mic recognizes speech
	my.translateTextListener = function (response) {
	

		var untranslatedText=document.getElementById('translateMicrophone').value;
		untranslatedTextEditor.composer.setValue(untranslatedText);
		my.translateText(untranslatedText, my.getUntranslatedLanguage(), my.getTranslatedLanguage());


	};


	
	my.translateText = function (sourceText, sourceLanguage, targetLanguage) {

		var source = 'https://www.googleapis.com/language/translate/v2?key=' + GOOGLE_API_KEY + '&source=' + sourceLanguage + '&target=' + targetLanguage + '&callback=tt.translateTextCallback&q=' + sourceText, newScript = document.createElement('script');
		my.translateTextCallback = function (response) {

			var translatedText=response.data.translations[0].translatedText;
			console.log("translated text is " + translatedText);
			console.log("Translated language is " + targetLanguage);
			
			(function() {
				if (targetLanguage == my.getUntranslatedLanguage()) {
					my.getEditor('untranslated').composer.setValue(translatedText);
				}
				else {
			
					my.getEditor('translated').composer.setValue(translatedText);
				}
				my.writeWord(translatedText,targetLanguage);
			})();

		};


		newScript.type = 'text/javascript';
		newScript.src = source;

		document.getElementsByTagName('head')[0].appendChild(newScript);
	}
	


	return my;
}());
