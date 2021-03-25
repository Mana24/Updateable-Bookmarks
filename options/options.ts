let SaveButton: HTMLButtonElement =  <HTMLButtonElement>document.getElementById("SaveButton");
let SortingMethodSelector: HTMLSelectElement = <HTMLSelectElement>document.getElementById("SortingMethodSelector");
let UpdateTitleCheckboxDefault: HTMLInputElement = <HTMLInputElement>document.getElementById("UpdateTitleCheckboxDefault");
let SavedLabel: HTMLSpanElement = <HTMLSpanElement>document.getElementById("SavedLabel");

chrome.storage.sync.get(["Options"], (items):void => {
	let storageOptions:ExtensionOptions | undefined = items["Options"];
	// if there's options in storage we get the html to match them
	if(storageOptions) {
		console.log("found options in storage", storageOptions);
		// getting option by id which is the sorting method
		let optionToSelect:HTMLOptionElement = <HTMLOptionElement>document.getElementById(storageOptions.SortingMethod.toString())

		// updating HTML to match the previous settings found in storage
		UpdateTitleCheckboxDefault.checked = storageOptions.UpdateTitle;
		SortingMethodSelector.selectedIndex = optionToSelect.index;
	}
	// otherwise we leave the html elements as is

	// Enable the save options button after anything has changed
	SortingMethodSelector.onchange = (ev: Event) => { SaveButton.disabled = false };
	UpdateTitleCheckboxDefault.onchange = (ev: Event) => { SaveButton.disabled = false };
})


// Add event to button
SaveButton.onclick = SaveButtonClicked;

function SaveButtonClicked(ev:MouseEvent):void {
	// gather data from html elements to send to storage on save
	let updateTitle:boolean = UpdateTitleCheckboxDefault.checked;
	// the option elements in the selector element are IDed based on the SortingMethods enum
	let selectedOptionID:number = parseInt( SortingMethodSelector.selectedOptions[0].id ); 
	let sortingMethod:SortingMethods = selectedOptionID;

	let options:ExtensionOptions = { UpdateTitle: updateTitle, SortingMethod:sortingMethod }
	// finally we send the options we gathered neatly into storage
	chrome.storage.sync.set({"Options":options},()=> {
		SavedLabel.style.visibility = "visible";
	});
}