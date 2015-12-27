
var ROOT_ELEMENT_CLASS = ".userContent";
var TEXT_CONTENT_ELEMENT = "p";
var collapsed = true;
var style = "monokai-sublime";

var hasCode = function(str){
	if(typeof str != "undefined") {
		var codeInit = str.match(/\{code:([a-zA-Z]*)}/ig);
		var codeEnd = str.match(/\{\/code}/ig);
		return (codeInit.length > 0 && codeEnd.length > 0);
	}else{
		return false;
	}
};

var cleanString = function(str){
	return str
		.replace('<span class="text_exposed_hide">...</span>', '')
		.replace('<span class="text_exposed_show">', '')
		.replace('</span>', '');
};

var extractCode = function(str, start, offset){
	var index = str.indexOf(start, offset);
	index += start.length;
	var end = str.indexOf("{/code}", index);
	var code = str.substr(index, end-index);
	return [
		str, code, end
	]
};

var trimCode = function(code){
	// FIXME: I have to find a way to clean the code
	code = code.replace(/^\s+|\s+$/gm,'');
	code = code.replace(/^(<br>)*/gm,'');
	code = code.replace(/^\s+|\s+$/gm,'');
	return code;
};

var parseCode = function(str){
	var codes = str.match(/\{code:([a-zA-Z]*)}/ig);
	var codeExtrated = [str, null, 0];
	for (index in codes) {
		//	Separate tag
		var m = codes[index].match(/\{code:([a-zA-Z]*)}/i);
		if(typeof m[1] == "undefined" ||
			m[1].length == 0 || m[1] == "text") {
			m[1] = "nohighlight";
		}
		codeExtrated = extractCode(str, m[0], codeExtrated[2]);
		// Open every code
		str = str.replace(m[0], "<div class='code-box "+style+"'><div class='view-hide-buttons'><span class='language'>"+m[1].toUpperCase()+"</span><a class='see_more_link expand-button'>Expand Code </a><a class='see_more_link collapse-button'>Collapse Code</a></div><pre><code class='"+m[1]+" code-extension'>");
		// Clean the code
		str = str.replace(codeExtrated[1], trimCode(codeExtrated[1]));
	}
	// Close every code
	str = str.replace(/\{\/code}/ig, "</code></pre></div>");
	return str;
};

var addEventsButton = function(str, element){
	$(element).find("p").html(str);
	var rootBlock = $(element).find("p");
	$(rootBlock).find("a.collapse-button").each(function() {
		$(this).on("click", function(){
			collapseCode(this)
		})
	});
	$(rootBlock).find("a.expand-button").each(function() {
		$(this).on("click", function(){
			expandCode(this)
		})
	});
	if(collapsed) {
		$(rootBlock).find("a.collapse-button").addClass("hide");
	}else{
		$(rootBlock).find("a.expand-button").addClass("hide");
	}
};

var highlightElement = function(element){
	//hljs.configure({useBR: true});
	var rootBlock = $(element).find("p");
	var codeBlocks = $(rootBlock).find("pre code");
	codeBlocks.each(function(i, block){
		hljs.highlightBlock(block);
		if(collapsed) {
			$(block).slideUp(0);
		}
	});
};

var expandCode = function(button){
	var parentButton = $(button).parent();
	var element = $(parentButton).parents(".code-box").find("pre code");
	$(parentButton).parent().find("a.collapse-button").show();
	$(parentButton).parent().find("a.expand-button").hide();
	$(element).slideDown(350);
};

var collapseCode = function(button){
	var parentButton = $(button).parent();
	var element = $(parentButton).parents(".code-box").find("pre code");
	$(parentButton).parent().find("a.expand-button").show();
	$(parentButton).parent().find("a.collapse-button").hide();
	$(element).slideUp(200);
};

var removeSeeMoreButton = function(element){
	$(element).find(".text_exposed_hide").remove();
};

$(document).ready(function(){
	chrome.storage.sync.get({
		collapsed: true,
		style: "monokai-sublime"
	}, function(items){
		collapsed = !items.collapsed;
		style = items.style;
	});

	setInterval(function(){
		var rootElement = $(ROOT_ELEMENT_CLASS).not(".prettycode-viewed");
		rootElement.each(function(){
			$(this).addClass("prettycode-viewed"); // Mark as viewed
			// Get html string of element
			var str = $(this).find(TEXT_CONTENT_ELEMENT).html();
			if(hasCode(str)){ // has code?
				removeSeeMoreButton(this); // remove See more button
				str = cleanString(str); // remove extra element from content
				str = parseCode(str); // parse object tag to html tag code
				addEventsButton(str, this);
				highlightElement(this);
			}
		});
	}, 500)
});