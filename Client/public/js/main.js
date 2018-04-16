//javascript source code file
function main() {
	sessionStorage.setItem('team', null);
	sessionStorage.setItem('season', null);
	getSeasons(addSelectItemsToUI, "seasonDiv", "season");
	getTeams(addSelectItemsToUI, "teamDiv", "team");
}

/* click method for all switchButton-elements. Pressed button is selected. Sibling buttons are updated to notSelected.*/
function pressedSelector(button){

	button.classList.remove("switchButtonNotSelected");
	button.classList.add("switchButtonSelected");
	
    siblings = button.parentNode.children;
	
	for (var i = 0; i < siblings.length; i++){
		if (siblings[i] != button){
			siblings[i].classList.remove("switchButtonSelected");
			siblings[i].classList.add("switchButtonNotSelected");
		}
	}
}


/*Selects or deselects pressed element. Pressed element contains a text element with textContent.

  Gets children elements of clicked div, checks if sessionStorage contains
  data for item_type, checks if sessionStorage contains selected item, 
  and either deselects item or selects it. SessionStorage is updated with new array.
 */
function itemSelected(element, item_type){
	
	var children = element.children;
	
	var items = JSON.parse(sessionStorage.getItem(item_type));

	if (items == null){
		items = [];
	}
	
	if (children.length > 0){
		text = children[0].textContent;
		for (var i = 0; i < items.length; i++){
			if (items[i] == text) //deselect
			{
				items.splice(i, 1);
				sessionStorage.setItem(item_type, JSON.stringify(items));
				element.style.backgroundColor = "white";
				return;
			}
		}
		items.push(text);
		element.style.backgroundColor = "#4156f4";
		sessionStorage.setItem(item_type, JSON.stringify(items));
	}
			
}

/*
Get search parameters, and use getMatches from api_calls.js.
*/
function search(){
		
	gd_is_at_least = findParameterValue("match_gd_selector");	
	goal_difference = parseInt(document.getElementById("goal_difference").value);
	
	if (gd_is_at_least !== null){		
		if (!Number.isInteger(goal_difference)){	
			window.alert("Please input goal difference as a number");
			return;
		}
	}
	
	between = findParameterValue("matches_against_selector");
	playoff = findParameterValue("match_type_selector");
	played_at_home = findParameterValue("match_venue_selector");
	end_in_overtime = findParameterValue("match_end_selector");
	
	teams = JSON.parse(sessionStorage.getItem('team'));
	seasons = JSON.parse(sessionStorage.getItem('season'));
	
	getMatches(between, goal_difference, gd_is_at_least, playoff, played_at_home, end_in_overtime, teams, seasons, displayMatches);
}

/*
Function is used to assign a value for a search parameter. 
Function checks which index has class switchButtonSelected assigned to it.
if 2, return null,
if 1, return true,
if 0, return false.
*/
function findParameterValue(element_id){
	
	var element = document.getElementById(element_id);
	
	var children = element.children;
	var index = 0;
	
	for (var i = 0; i < children.length; i++){
		if (children[i].classList.contains("switchButtonSelected")){
			value = children[i].value;
			
			if (value === "null")
				return null;
			
			if (value === "false")
				return false;
			
			if (value === "true")
				return true;
		}
	}
			
} 

function sortByParam(param, data) {

	if (param === 'date')
		return sortByDate(data);

	return sortData(data, param);

}

/* General sorting for sorting without tiebreakers.*/
function sortData(data, param)
{
    return data.sort(function (a, b) {
		return b[param] - a[param];
    });
}


function sortByDate(data){
	
	/*Return year if there is a difference, return month if there's a difference, 
	and finally return day*/
	return data.sort(function (a, b) {
		aSplitted =	a['date'].split('-');
		bSplitted = b['date'].split('-');
		var year = bSplitted[0] - aSplitted[0];
		
		if (year !== 0)
			return year;
		
		var month = bSplitted[1] - aSplitted[1];
		
		if (month !== 0)
			return month;
		
		return bSplitted[2] - aSplitted[2];
		
    }); 
	
}

