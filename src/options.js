// Saves options to chrome.storage
function save_options() {
	var style = document.getElementById('style').value;
	var collapsed = document.getElementById('collapsed').checked;
	var antialiased = document.getElementById('antialiased').checked;
	var size = document.getElementById('size').value;
	chrome.storage.sync.set({
		collapsed: collapsed,
		style: style,
		size: size,
		antialiased: antialiased
	}, function() {
		// Update status to let user know options were saved.
		var status = document.getElementById('status');
		status.textContent = 'Options saved.';
		status.style.display = "block";
		setTimeout(function() {
			status.textContent = '';
			status.style.display = "none";
		}, 2000);
	});
}

// Restores select box and checkbox state using the preferences
// stored in chrome.storage.
function restore_options() {
	// Use default value color = 'red' and likesColor = true.
	chrome.storage.sync.get({
		collapsed: true,
		style: "monokai-sublime",
		antialiased: false,
		size: '12px'
	}, function(items) {
		document.getElementById('style').value = items.style;
		document.getElementById('size').value = items.size;
		document.getElementById('collapsed').checked = items.collapsed;
		document.getElementById('antialiased').checked = items.antialiased;
	});
}
document.addEventListener('DOMContentLoaded', restore_options);
document.getElementById('save').addEventListener('click',
	save_options);