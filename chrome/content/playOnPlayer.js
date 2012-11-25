/*
#   http://code.google.com/media-translate/
#   Copyright (C) 2010  Serge A. Timchenko
#
#   This program is free software: you can redistribute it and/or modify
#   it under the terms of the GNU General Public License as published by
#   the Free Software Foundation, either version 3 of the License, or
#   (at your option) any later version.
#
#   This program is distributed in the hope that it will be useful,
#   but WITHOUT ANY WARRANTY; without even the implied warranty of
#   MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
#   GNU General Public License for more details.
#
#   You should have received a copy of the GNU General Public License
#   along with this program. If not, see <http://www.gnu.org/licenses/>.
*/

var playOnPlayer = function () {

  var makeRequest = function(url) {
    var http_request = false;
    if (window.XMLHttpRequest) { // Mozilla, Safari, ...
      http_request = new XMLHttpRequest();
      if (http_request.overrideMimeType) {
              http_request.overrideMimeType('text/xml');
      }
    } else if (window.ActiveXObject) { // IE
      try {
        http_request = new ActiveXObject("Msxml2.XMLHTTP");
      } catch (e) {
        try {
          http_request = new ActiveXObject("Microsoft.XMLHTTP");
        } catch (e) {}
      }
    }
    if (!http_request) {
      alert('errorXMLHTTP');
      return null;
    }
    http_request.open('get', url, false);
    http_request.setRequestHeader("If-Modified-Since", "Thu, 1 Jan 1970 00:00:00 GMT");
    http_request.setRequestHeader("Cache-Control", "no-cache");    
    http_request.send(null);
    return http_request.status;
  }

	var prefManager = Components.classes["@mozilla.org/preferences-service;1"].getService(Components.interfaces.nsIPrefBranch);
	
	return {
		init : function () {},
		run : function () {
		  var w = content;
		  var playerName = prefManager.getCharPref("extensions.playonplayer.player");
      try {
        var streamUrl = '';
        var url = "http://"+playerName+"/cgi-bin/translate?renderer,,";
        
        if(w.document.selection)
        {
          var sel = w.document.selection;
          if(sel.type.toLowerCase() == 'text')
          {
            streamUrl = sel.createRange().text.replace(/(^\s+|\s+$)/, '');
          }
        }
        
        if(!streamUrl)
        {
          var active = w.document.activeElement;
          while(active && active.tagName.toLowerCase() != 'a' && active.tagName.toLowerCase() != 'body' )
            active = active.parentNode;
          if(!active || active.tagName.toLowerCase() == 'body')
            streamUrl = w.document.URL;
          else
            streamUrl = active.href;
        }
        
        var res = makeRequest(url + encodeURIComponent(streamUrl));
        if(res)
        {
          var msg = "Сcылка '"+streamUrl+"' отправлена на плеер '"+playerName+"'";
          w.status = msg;
          //alert("("+res+") "+msg);
        }
      }
      catch(exception) { alert("ERROR: "+exception.description); }
    }
  };
}();

window.addEventListener("load", playOnPlayer.init, false);