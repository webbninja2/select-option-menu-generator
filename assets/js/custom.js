document.addEventListener('DOMContentLoaded', function () {
	// DRAG FEATURE START ***********************************
		function initializeDragAndDrop() {
			const lists = document.querySelectorAll('.lists');
			lists.forEach(list => {
				list.draggable = true;
				list.addEventListener('dragstart', handleDragStart);
				list.addEventListener('dragover', handleDragOver);
				list.addEventListener('dragenter', handleDragEnter);
				list.addEventListener('dragleave', handleDragLeave);
				list.addEventListener('drop', handleDrop);
				list.addEventListener('dragend', handleDragEnd);
			});
			const removeIcons = document.querySelectorAll('.removeList i');
			removeIcons.forEach(icon => {
				icon.addEventListener('click', handleRemoveList);
			});
			const errorElement = document.querySelector('.errorValList');
			function handleRemoveList(e) {
				const listItem = e.target.closest('.lists');
				const listItems = document.querySelectorAll('.lists');
				if (listItems.length > 2) {
					if (listItem) {
						listItem.remove();
						updateListNumbers();
						errorElement.textContent = '';
					}
				} else {
					errorElement.textContent = "*You must have at least two links to make a list.";
				}
			}
		}
		function updateListNumbers() {
			const listItems = document.querySelectorAll('.lists');
			listItems.forEach((item, index) => {
				item.querySelector('.nbr').textContent = index + 1;
			});
		}
		let draggedItem = null;
		function handleDragStart(e) {
			draggedItem = this;
			setTimeout(() => {
				this.style.display = 'none';
			}, 0);
		}
		function handleDragOver(e) {
			e.preventDefault();
		}
		function handleDragEnter(e) {
			e.preventDefault();
		}
		function handleDragLeave() {
			// Do something when the item is dragged out
		}
		function handleDrop() {
			this.parentNode.insertBefore(draggedItem, this.nextSibling);
		}
		function handleDragEnd() {
			this.style.display = 'block';
			draggedItem = null;
		}
		const addLinkButton = document.getElementById('addNewLink');
		addLinkButton.addEventListener('click', function (e) {
			e.preventDefault();
			addListItem();
		});
		const error = document.querySelector('.errorValList');
		function addListItem() {
			const urlList = document.getElementById('urlList');
			const newItem = document.createElement('li');
			newItem.className = 'lists';
			newItem.innerHTML = `
				<div class="drg"><i class="fa fa-sort"></i></div>
				<div class="nbr">${urlList.children.length + 1}</div>
				<label class="lbl">Name:</label>
				<input type="text" id="imageURL${urlList.children.length + 1}" class="inputsText" placeholder="Or enter image URL" value="New Item">
				<label class="lbl">URL:</label>
				<input type="text" id="url${urlList.children.length + 1}" class="inputsText" placeholder="Or enter image URL" value="New URL">
				<div class="removeList"><i class="fa fa-close"></i></div>
			`;
			urlList.appendChild(newItem);
			initializeDragAndDrop();
			error.textContent = '';
		}
	// DRAG FEATURE END ***********************************
	
	// COLOR STYLE START ***********************************
		document.getElementById('bgcolorPicker').addEventListener('change', function () {
			document.getElementById('bgcolor').value = this.value;
		});
		document.getElementById('borderColorPicker').addEventListener('change', function () {
			document.getElementById('borderColor').value = this.value;
		});
		document.getElementById('fontColorPicker').addEventListener('change', function () {
			document.getElementById('fontColor').value = this.value;
		});
		document.getElementById('bgcolor').addEventListener('input', function () {
			document.getElementById('bgcolorPicker').value = this.value;
		});
		document.getElementById('borderColor').addEventListener('input', function () {
			document.getElementById('borderColorPicker').value = this.value;
		});
		document.getElementById('fontColor').addEventListener('input', function () {
			document.getElementById('fontColorPicker').value = this.value;
		});
	// COLOR STYLE END ***********************************
	
	// LINK TARGET START ***********************************
		const linkTargetRadioButtons = document.querySelectorAll('input[name="link-target"]');
		linkTargetRadioButtons.forEach(function (radioButton) {
			radioButton.addEventListener('change', function () {
				const popupOptions = document.querySelector('.popup-options');
				if (this.value === 'open-popup-window') {
					popupOptions.style.display = 'block';
				} else {
					popupOptions.style.display = 'none';
				}
				updateGeneratedCode();
			});
		});
	// LINK TARGET END ***********************************
	initializeDragAndDrop();
	updateListNumbers();
});
// DRAG FEATURE END ***********************************
	
// GENERATE CODE START ***********************************
document.getElementById("generateCodeButton").addEventListener("click", function () {
	const options = {
		linkOpen: document.querySelector('input[name="link-open"]:checked').value,
		linkTarget: document.querySelector('input[name="link-target"]:checked').value,
		style: {
			width: document.getElementById("width").value,
			"background-color": document.getElementById("bgcolor").value,
			"font-size": document.getElementById("fontSize").value,
			"border-color": document.getElementById("borderColor").value,
			padding: document.getElementById("padding").value,
			"color": document.getElementById("fontColor").value,
		},
		links: [],
		popupOptions: {
			width: document.getElementById("popup-width").value,
			height: document.getElementById("popup-height").value,
		},
	};
	const urlInputs = document.querySelectorAll('input[id^="url"]');
	const nameInputs = document.querySelectorAll('input[id^="imageURL"]');
	for (let i = 0; i < urlInputs.length; i++) {
		options.links.push({
			url: urlInputs[i].value,
			name: nameInputs[i].value,
		});
	}
	const htmlCode = generateHTML(options);
	document.getElementById("generatedCode").value = htmlCode;
});
function generateHTML(options) {
	let html = '';
	let linkTarget;
	if (options.linkTarget === 'open-same-window') {
		linkTarget = '_self';
	} else if (options.linkTarget === 'open-new-window') {
		linkTarget = '_blank';
	} else if (options.linkTarget === 'open-popup-window') {
		linkTarget = 'popup_window';
	} else if (options.linkTarget === 'open-frame-window') {
		linkTarget = 'iframe_window';
	}
	
	// Start the <select> tag and set its attributes
	html += '<select name="select_name" id="select_name" style="width:' + options.style.width + 'px; font-size:' + options.style["font-size"] + 'px; padding:' + options.style.padding + 'px; background-color:' + options.style["background-color"] + '; border: solid 1px ' + options.style["border-color"] + '; color:' + options.style.color + ';"';
	
	// Check the linkOpen option and add the appropriate behavior
	if (options.linkOpen === 'on-change') {
		html += ' onchange="';
		if (linkTarget === '_self' || linkTarget === '_blank') {
		html += 'window.open(this.value, \'' + linkTarget + '\');';
		} else if (linkTarget === 'popup_window') {
		html += 'window.open(this.value, \'popup_window\', \'width=' + options.popupOptions.width + ',height=' + options.popupOptions.height + '\');';
		} else if (linkTarget === 'iframe_window') {
		html += 'document.getElementById(\'iframe_window\').src = this.value;';
		}
		html += '"';
	}
	
	html += '>\n';

	// Add options to the <select> tag
	options.links.forEach(function (link) {
		html += '\t<option value="' + link.url + '">' + link.name + '</option>\n';
	});
	
	// Close the <select> tag
	html += '</select>\n';

	// If linkOpen is 'button-click', add the button
	if (options.linkOpen === 'button-click') {
		if (linkTarget === '_self' || linkTarget === '_blank') {
		html += '<input type="button" onclick="window.open(document.getElementById(\'select_name\').value, \'' + linkTarget + '\');" value="GO">';
		} else if (linkTarget === 'popup_window') {
		html += '<input type="button" onclick="window.open(document.getElementById(\'select_name\').value, \'popup_window\', \'width=' + options.popupOptions.width + ',height=' + options.popupOptions.height + '\');" value="Open Popup">';
		} else if (linkTarget === 'iframe_window') {
		html += '<iframe src="" id="iframe_window" style="width:100%;height:400px;"></iframe>';
		html += '<input type="button" onclick="document.getElementById(\'iframe_window\').src = document.getElementById(\'select_name\').value;" value="Open in Iframe">';
		}
	}

	return html;
}
// GENERATE CODE END ***********************************