MooEditor
=========

MooEditor is a simple WYSIWYG editor for Mootools.

![Screenshot](http://www.jaaxo.it/public/www/img_big/50/editor.png)


How to Use
----------

MooEditor can be initialized at any time but is generally initialized at the top of the document during the page's normal load.

	#JS
        window.addEvent('domready', function(){
                var myEdit = new MooEditor('oContent');
        });

       #HMTL

      <div id="editor_gest">
      <div id="for_toolbar"></div>
      <br />
      <div id="toolbar2"></div>
      <br />
      <div id="oContent">Questo testo è editabile!</div>
      </div>
	

For specific usage and options, please read the documentation or visit [http://www.jaaxo.it/blog/mooeditor.html](http://www.jaaxo.it/blog/mooeditor.html)