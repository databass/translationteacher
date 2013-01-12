/*jslint nomen: true*/
/*global $, _, document, Audio, console*/

/*
 *
 * TranslationTeacher module that handles voice recognition, integration with HTML5 audio output, and translation via Google API
 * Author: David Byman (david.byman@gmail.com)
 *
 *
 */



//change the value of GOOGLE_API_KEY below to your personal Google API Key.

var TT = (function () { "use strict"; var my = {}, DEFAULT_LANGUAGE = 'en', lastCursorPosition = 0, GOOGLE_API_KEY = 'XXX', languageNames = [{
        'code': 'zh-CN',
        'name': 'Chinese'
    }, {
        'code': 'de',
        'name': 'German'
    }, {
        'code': 'es',
        'name': 'Spanish'
    }, {
        'code': 'fr',
        'name': 'French'
    }, {
        'code': 'en',
        'name': 'English'
    }, {
        'code': 'la',
        'name': 'Latin'
    }, {
        'code': 'sw',
        'name': 'Swahili'
    }, {
        'code': 'sv',
        'name': 'Swedish'
    }, {
        'code': 'hi',
        'name': 'Hindi'
    }, {
        'code': 'ru',
        'name': 'Russian'
    }, {
        'code': 'tr',
        'name': 'Turkish'
    }, {
        'code': 'ar',
        'name': 'Arabic'
    }];


        my.moduleProperty = 1;
        my.baseWord = '';
        my.translateWord = '';
        my.editor = [];


        my.setTranslatedLanguage = function (language) {

            this.translatedLanguage = language;

        };


        my.getEditor = function (editorName) {

            return this.editor[editorName];

        };

        my.setEditor = function (editorName, editor) {

            this.editor[editorName] = editor;

        };


        my.getTranslatedLanguage = function () {

            return this.translatedLanguage;

        };

        my.setUntranslatedLanguage = function (language) {

            this.untranslatedLanguage = language;

        };

        my.getUntranslatedLanguage = function () {

            return this.untranslatedLanguage;

        };


        my.setTranslatedText = function (text) {

            this.translatedText = text;

        };


        my.getTranslatedText = function () {

            return my.getEditor('translated').composer.getValue();

        };

        my.setUntranslatedText = function (text) {

            this.untranslatedText = text;

        };

        my.getUntranslatedText = function () {

            return my.getEditor('untranslated').composer.getValue();

        };

        my.getLanguageName = function (code) {

            return _.find(languageNames, function (language) {
                return language.code === code;
            }).name;

        };

        my.setLastCursorPosition = function (index) {

            lastCursorPosition = index;

        };

        my.getLastCursorPosition = function () {

            return lastCursorPosition;

        };

        my.getCurrentCursorPosition = function (editor) {

            return editor.composer.selection.getRange().startOffset;

        };


        my.findSelectedWordz = function (editor) {

            var currentValue = editor.composer.getValue().toString().replace(/&nbsp;/g, ' ');
            return currentValue.substring(my.getLastCursorPosition(), my.getCurrentCursorPosition(editor));

        };

        my.sayWord = function (word, language) {

            var snd = new Audio("dictionary/" + language + "/" + word + ".mp3");
            snd.play();

        };


        my.writeWord = function (word, language) {

            var trimmedWord = word.replace(/&nbsp;/g, '').replace(/\s$/, '');
            $.get("talk.php", {
                lang: (language || DEFAULT_LANGUAGE),
                phrase: trimmedWord,
                format: 'mp3'

            }, function (data) {
                my.sayWord(data, language || DEFAULT_LANGUAGE);
            });

        };

        //called after the mic recognizes speech
        my.translateTextListener = function (response) {

            var untranslatedText = document.getElementById('translateMicrophone').value;
            my.getEditor('untranslated').composer.setValue(untranslatedText);
            my.translateText(untranslatedText, my.getUntranslatedLanguage(), my.getTranslatedLanguage());

        };

         //called whenever a translation request is made
         my.translateText = function (sourceText, sourceLanguage, targetLanguage) {

            var source = 'https://www.googleapis.com/language/translate/v2?key=' + GOOGLE_API_KEY + '&source=' + sourceLanguage + '&target=' + targetLanguage + '&callback=tt.translateTextCallback&q=' + sourceText,
                newScript = document.createElement('script');

            //JSONP callback for Google Translate API
            //using a closure allows the callback to contain additional details about the translation request.

            my.translateTextCallback = function (response) {
                var translatedText = response.data.translations[0].translatedText;
                console.log("untranslated language is " + sourceLanguage);
                console.log("translated language is " + targetLanguage);
                console.log("untranslated text is " + sourceText);
                console.log("translated text is " + translatedText + '\n');

                (function () {

                    if (targetLanguage === my.getUntranslatedLanguage()) {

                        my.getEditor('untranslated').composer.setValue(translatedText);

                    } else {

                        my.getEditor('translated').composer.setValue(translatedText);
                    }

                    my.writeWord(translatedText, targetLanguage);

                }());

            };


            newScript.type = 'text/javascript';
            newScript.src = source;

            document.getElementsByTagName('head')[0].appendChild(newScript);
        }

    return my;

}());
