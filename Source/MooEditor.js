/*
---
description:     MooEditor

authors:
  - Fabio Polisini (http://www.jaaxo.it)

license:
  - MIT-style license

requires:
  core/1.2.5:   '*'

provides:
  - MooEditor
...
*/
var MooEditor = new Class({
				
		/* implements */		
		Implements: [Events],
		
		/* initialization */
		initialize: function(id) {
			
			this.doc = $(id);
			this.doc.set('contentEditable',true)
			this.doc.addClass('area');
			this.path_img  = "/views/img_admin/";
			this.toolbar   = $('for_toolbar');
			this.toolbar2  = $('toolbar2');
			this.text      = this.doc.get('html');
			this.view      = false;
			this.br_img    = this.path_img+'/br.png';
			this.hideBR    = false;

			
			var self = this;
			
			//firefox
			if(Browser.Engine.gecko) this.styleWithCSS.delay(100);
			
			this.doc.addEvent('keydown', function(event){
					
					var edoc = '<br>&para;'
							  
					if(event.key == 'enter'){ 
						if(Browser.Engine.webkit){ // Google Chrome - Safari
							  
							  document.execCommand('inserthtml',false,edoc);
							  //self.hide_br();
							  //self.hide_br.delay(500)
							  this.hideBR = true;
							  return false;
							  
						} else if(Browser.Engine.trident){ // IE
						
							  var range = document.selection.createRange();
							  range.pasteHTML(edoc);
							  this.hideBR = true;
							  return false;
						}
						
					
					}else{
						if(!event.shift && !event.control && !event.alt && this.hideBR){
							
						   if(Browser.Engine.webkit || Browser.Engine.trident) self.hide_br.delay(100);
						   
						   this.hideBR = false;
						}
					}
					
			})
			/*
			this.doc.addEvent('keyup', function(event){
					
					if(event.key == 'enter'){
						self.hide_br.delay(100);
					}
			})
			*/
			this.load_toolbar();
		},
		
		//////////////////////////////////////////////////////////////////////////////////////////////
		/* create toolbar *///////////////////////////////////////////////////////////////////////////
		//////////////////////////////////////////////////////////////////////////////////////////////
		//////////////////////////////////////////////////////////////////////////////////////////////
		//////////////////////////////////////////////////////////////////////////////////////////////
		
		load_toolbar: function() {
			var button          = ['bold','italic','underline','undo','redo','RemoveFormat'];
			var button_code     = ['php','quote','youtube','flash','code'];
			var paragraph_class = ['evid','evid_gr','evid_red','evid_ara'];
			var paragraph       = ['h1','h2','h3','h4','h5','h6','PRE','P'];
			var single          = ['[cut]'];
			
			var promptz         = ['createlink'];
			
			var self = this;
            
			/* --- */
			button.each(function(a){
				
				new Element('img', {'src': self.path_img + a +'.gif',
									          'class':'editor',
											  'events': {
											     'click': function(){ document.execCommand(a,false,null) }
								              }
									  }).inject(self.toolbar);
			});
			
			/* --- */
			promptz.each(function(a){
				
				new Element('img', {'src': self.path_img + a +'.gif',
									          'class':'editor',
											  'events': {
											     'click': function(){ 
												   
												   if(self.Check_selection()){
													   imagePath = prompt('', 'http://');
													   if ((imagePath != null) && (imagePath != "")) {
														 document.execCommand(a,false,imagePath) 
													   }
												   }else{
													   alert('You must select a text!');
												   }
												 }
								              }
									  }).inject(self.toolbar);
			});
			
			/* --- */
			button_code.each(function(a){
				
				new Element('img', {'src': self.path_img + a +'.gif',
									          'class':'editor',
											  'events': {
											     'click': function(){ self.add_obj(this,a) }
								              }
									  }).inject(self.toolbar);
			});
			
			/* --- */
			single.each(function(a){
				
				new Element('img', {'src': self.path_img + a +'.png',
									          'class':'editor',
											  'events': {
											     'click': function(){ self.add_obj(this,a,3) }
								              }
									  }).inject(self.toolbar);
			});
			
			
			
			/* --- */
			new Element('img', {"src": self.path_img + "Paste.gif",
							   'class':'editor',
							   'events': {
										'click': function(){ self.Paste() }
							   }
							   }).inject(self.toolbar);
			
			/* --- */
			new Element('img', {"src": self.path_img + "Paste_html.gif",
							   'class':'editor',
							   'events': {
										'click': function(){ self.Paste_html() }
							   }
							   }).inject(self.toolbar);
			
			/* --- */
            imgHtml = new Element('img', {"src": self.path_img + "imghtml.png",
							   'class':'editor',
							   'events': {
										'click': function(){ self.view_source() }
							   }
							   }).inject(self.toolbar);
			
			

			
			/* --- */
			var Sel_format = new Element('select',{'events':
										                   { 'change': function(){
															          if(this.value!=0) self.add_obj(this,this.value,2);
															    }
														   }
										 }).inject(self.toolbar2);
			Sel_format.appendChild( new Element('option', {'value' : 0}).appendText('class') );
			paragraph_class.each(function(a){
						Sel_format.appendChild( new Element('option', {'value' : a,
															           'class': a}).appendText(a) );
			});
			
			/* --- */
			var Sel_header = new Element('select',{'events':
										          { 'change': function(){
												   if(this.value!=0) self.add_obj(this,this.value,1);
															    }
														   }
										 }).inject(self.toolbar2);

			Sel_header.appendChild( new Element('option', {'value' : 0}).appendText('Paragraph') );
			paragraph.each(function(a){
						Sel_header.appendChild( new Element('option', {'value' : a
															          }).appendText(a) );
			});
			
			/* --- */
			
			var area = new Element('textarea', {"id": "my_area",
							                    'class':'area',
												'styles': {
                                                          border: '1px solid #0f0'
                                                }
							           }).inject(self.doc, 'before');
			area.setStyle('display', 'none');

		},
		
		//////////////////////////////////////////////////////////////////////////////////////////////
		//////////////////////////////////////////////////////////////////////////////////////////////
        /* Paste */
		//////////////////////////////////////////////////////////////////////////////////////////////
		
		Paste: function() {
		   this.doc.focus();
		   if(Browser.Engine.trident){ // EXPLORER
			   //this.doc.focus();
			   document.execCommand('paste');
		   }else{
			   var html_code = prompt('Paste here your code');
			   document.execCommand('inserthtml',false,html_code);
		   }
		},
		
		//////////////////////////////////////////////////////////////////////////////////////////////
		//////////////////////////////////////////////////////////////////////////////////////////////
		/* Paste html*/
		//////////////////////////////////////////////////////////////////////////////////////////////
		
		Paste_html: function() {
		    this.doc.focus();
			var html_code = prompt('Paste here your code');
			
			if(Browser.Engine.trident ){ // EXPLORER
				var range = document.selection.createRange();
				range.pasteHTML(html_code)
			} else {
				document.execCommand('inserthtml',false,html_code);
			}
			
		},
		
		//////////////////////////////////////////////////////////////////////////////////////////////
		//////////////////////////////////////////////////////////////////////////////////////////////
        /* check selection */
		//////////////////////////////////////////////////////////////////////////////////////////////
		
		Check_selection: function() {
			
			if(Browser.Engine.trident ){ // EXPLORER
			    var range = document.selection.createRange();
				var text  = range.text;

				if(text!='')  return true;
				
			} else {
				var selection = document.getSelection();
				var range = selection.getRangeAt(0);
				
				if(range!='') return true;
			}
			return false;
		},
		
		//////////////////////////////////////////////////////////////////////////////////////////////
		//////////////////////////////////////////////////////////////////////////////////////////////
		/* Add Object */
		//////////////////////////////////////////////////////////////////////////////////////////////
		
		add_obj: function(elem,tag,mode){
			
			//document.execCommand('RemoveFormat',false,null);
			
			
			switch(mode) {
			    
				case undefined:
				var sx_cod = '['+tag+']';
				var dx_cod = '[/'+tag+']';
			    break;
				
				case 1:
				var sx_cod = '<'+tag+'>';
				var dx_cod = '</'+tag+'>';
				break;
				
				case 2:
				var sx_cod = '<span class="'+tag+'">';
				var dx_cod = '</span>';
				break;
				
				case 3:
				var sx_cod = tag;
				var dx_cod = tag;
				break;
			
			}
			
			if(Browser.Engine.trident ){ // EXPLORER
			    var range = document.selection.createRange();
				var text  = range.text;

				if(text==''){ // if i haven't selection word
				
				  this.doc.focus();
				  //var range = document.selection.createRange();
				  if(elem.hasClass('evid_border'))
					  range.pasteHTML(dx_cod)
				  else
				      range.pasteHTML(sx_cod)
				  this.evidence(elem);
				 
				}else{
				  range.pasteHTML(sx_cod + text + dx_cod)
				  
				  /* resetto la select */
					elem[0].selected=true;
					
				}
			} else {
				
				var selection = document.getSelection(); 
				
				//if(selection=='') this.doc.focus();
				
				var range = selection.getRangeAt(0); 
				
				if(range=='')
				{
					//this.doc.focus();
					if(elem.hasClass('evid_border'))
					  document.execCommand('inserthtml',false,dx_cod);
					else
				      document.execCommand('inserthtml',false,sx_cod);
					this.evidence(elem);
					
				}else{
					
				    document.execCommand('inserthtml',false,sx_cod + range + dx_cod);
					/* resetto la select */
					elem[0].selected=true;
					
				}
				
			}
			
		},
		
		//////////////////////////////////////////////////////////////////////////////////////////////
		//////////////////////////////////////////////////////////////////////////////////////////////
		/* hide BR image */
		//////////////////////////////////////////////////////////////////////////////////////////////
		
		hide_br: function(){
			
			var ar = $$('.area');
			
			var co = ar[1].get('html');
			
            for( var x = 0; x < ar[1].childNodes.length; x++ ) {
				
				var string_type = ar[1].childNodes[x].nodeName.toLowerCase();
				var string_code = ar[1].childNodes[x].nodeValue;
                
				if(string_type == '#text')
				{
				  if(string_code.contains('¶'))
				  ar[1].childNodes[x].nodeValue = string_code.replace('¶','');
				}
				
				
			}
			
		},
		
		//////////////////////////////////////////////////////////////////////////////////////////////
		//////////////////////////////////////////////////////////////////////////////////////////////
		/* View Source */
		//////////////////////////////////////////////////////////////////////////////////////////////
		
		view_source: function(){
			
			if(!this.view){

				this.text   = this.doc.get('html');
				
				var text_br = "<br>";
				var r1      = new RegExp(text_br, 'gi');
				this.text   = this.text.replace(r1,"\n")
				
				$('my_area').value = this.text;
				$('my_area').setStyle('display', '');
				this.doc.setStyle('display', 'none');				
				
			}else{
				
				this.doc.set('html',$('my_area').value.replace(/[\n]/g, "<br>"));
				$('my_area').setStyle('display', 'none');
				this.doc.setStyle('display', '');
			}
			this.evidence(imgHtml);
			this.view = !this.view;
		},
		
		//////////////////////////////////////////////////////////////////////////////////////////////
		//////////////////////////////////////////////////////////////////////////////////////////////
		/* evidence last image pressed */
		//////////////////////////////////////////////////////////////////////////////////////////////
		
		evidence: function(el){
			el.toggleClass('evid_border');
		},
		
		//////////////////////////////////////////////////////////////////////////////////////////////
		//////////////////////////////////////////////////////////////////////////////////////////////
		/* For Firefox: transform <span style="font-weight: bold;"></span> in <b></b> */
		//////////////////////////////////////////////////////////////////////////////////////////////
		
		styleWithCSS: function() {
			document.execCommand('styleWithCSS',false,false);
		},
		


		//////////////////////////////////////////////////////////////////////////////////////////////
		//////////////////////////////////////////////////////////////////////////////////////////////
		/* Background Create */
		//////////////////////////////////////////////////////////////////////////////////////////////
		
		BG: function()
		{
			
		   if(!$('edit_bg')){
			   var edit_bg = new Element('div',{'id':'edit_bg'}).inject(document.body);
			   //alert('null')
			   edit_bg.setStyles({
				 'height': window.getScrollSize().y,
				 'width': window.getScrollSize().x,
				 'opacity': 0.1,
				 'background-color': '#000',
				 'position':'absolute',
				 'top':0,
				 'left':0
			   });
			   
			   edit_bg.fade(0.7);
		   }
			
		}
		
});