

var url = '';

var tasks = new Array();


function getTasks() { 
	qwest.get(url, {}, {cache: true}).then(
		function(xhr, response) {
            
            var mainList = document.getElementsByClassName("toDoList")[0];
            
			response.forEach(function(element, taskIndex = 1) { 
               
                tasks.push(element);
                
                var newDiv = document.createElement("div");
                newDiv.setAttribute("class","task");
                newDiv.setAttribute("id","t-" + taskIndex);

                var taskIndex = taskIndex++;
                var taskName = element.body.title;
          
                mainList.appendChild(newDiv);
                
                var firstLine = taskName;
                var secondLine = '<div class="rightPanel" id="rp-'+taskIndex+'">';
                var thirdLine = '<input type="checkbox" name="taskCompleted" id="done-'+ taskIndex +' " />';
                var fourthLine = '<br />';  
                var fifthLine = '<input type="button" name="removeTask" value="Usuń" id="remove-' + taskIndex + '" />';
                var sixthLine = '</div>';

                newDiv.innerHTML= firstLine + secondLine + thirdLine + fourthLine + fifthLine + sixthLine;
                
                reloadButtons(taskIndex);
                reloadCheckboxes(taskIndex);
                
                taskIndex++;
                            
                }
            )
        }
    )
}

window.onload = getTasks;

function fillTaskList(task){
    //fill tasks array
    getTasks();
    console.log(task)
    var n = task.length;

    var mainList = document.getElementsByClassName("toDoList")[0];

    for(var i = 0; i < n; i++){
    
        var taskIndex = i + 1;
        var taskName = task[i].title;
        var newDiv = document.createElement("div");
        newDiv.setAttribute("class","task");
        newDiv.setAttribute("id","t-" + taskIndex);
        mainList.appendChild(newDiv);

        newDiv.innerHTML = insertTaskDivContent(taskName, newIndex);
    }
    
    reloadButtons();
}


function addTaskServer(task) { // wysyłamy nowe zadanie po wciśnięciu klawisza ENTER lub kliknięciu przycisku
	qwest.post(url, {title: task.title, is_done: task.is_done}, {cache: true}); // wysłanie nowego zadania w postaci obiektu o właściwościach "title" i "is_done"
}

function deleteTask() { // usuwanie wybranego zadania pod wpływem wystąpienia pewnego zdarzenia
	qwest.delete(url+'/'+tasks[id].id, null, {cache: true}).then(function(xhr, response) { // usuwamy zadanie o danym identyfikatorze (tym razem nie musimy przesyłać ciała takiego zadania)
		refresh(); // odświeżamy stan strony
	});
}

function checkboxClick(id) { // stan kliknięcia checkboxa przy danym zadaniu (załóżmy, że funkcja wywołuje się po wystąpieniu pewnego zdarzenia
	tasks[this.id].body.is_done = this.checked; // zmiana stanu kliknięcia danego zadania w tablicy (zakładamy, że każde zadanie ma swój identyfikator, dla uproszczenia przyjąłem, że identyfikatorem jest pozycja w tablicy
	qwest.map('PATCH', url+'/'+tasks[this.id-1].id, tasks[this.id-1].body, {cache: true}).then(function(xhr, response) { // szukamy odpowiedniego zasobu na serwerze i modyfikujemy jego ciało
		refresh(); // odświeżamy stan strony
	});
}
