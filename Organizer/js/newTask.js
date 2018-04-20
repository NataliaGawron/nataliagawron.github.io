//removes multiple whitespaces from given text
function correctText(sometext){
    
    var properSentence = "init";

    sometext = sometext.split(" ");

    for(var i = 0; i < sometext.length; i++)
    {
        if(i == 0){
            if(sometext[i] != ' '){
                properSentence = sometext[i] + ' ';
                continue;
            }
        }
        if(sometext[i] != '')
        {
            properSentence += sometext[i];
        }
        else{
            continue;
        }
    }

    return properSentence;
}

//function does what it's name says
function isInputASpace(input, maxlength){
    // 80 is a value of maxlength input in html
    for(var i = 0; i < maxlength; i++){
        
        if(i == input.length){
            break;
        }

        if(input[i] != ' '){
            return false;
        }
        else{
            continue;
        }
    }
    return true;
}

function insertTaskDivContent(nameOfTask, numOfTask){
console.log("insert")
    var firstLine = nameOfTask;
    var secondLine = '<div class="rightPanel" id="rp-'+numOfTask+'">';
    var thirdLine = '<input type="checkbox" name="taskCompleted" id="done-'+numOfTask +' " />';
    var fourthLine = '<br />';
    var fifthLine = '<input type="button" name="removeTask" value="Usuń" id="remove-' + numOfTask + '" />';
    var sixthLine = '</div>';

    return firstLine + secondLine + thirdLine + fourthLine + fifthLine + sixthLine;

}



//function called by using submit button
function newTask(){
    var taskName = document.getElementById("typeNewTask").value;

    if(taskName.length == 0 || isInputASpace(taskName, 80)){
        alert("Nazwa zadanie nie może być pusta!");
        return console.error("error: task name can't be empty.");
    }
    else{
        taskName = correctText(taskName);
        
        //answer will be always +1 than desirable
        //so that's fine by me
        var inputIndexOfTask = document.getElementsByClassName("task").length;
        console.log(inputIndexOfTask);

        //add new div element and set it's attributes
        var mainList = document.getElementsByClassName("toDoList")[0];
        var newDiv = document.createElement("div");
        var newIndex = inputIndexOfTask + 1;
        newDiv.setAttribute("class","task");
        newDiv.setAttribute("id","t-" + newIndex);
        mainList.appendChild(newDiv);

        //insert desirable content
        newDiv.innerHTML = insertTaskDivContent(taskName, newIndex);      
    }
    //clear input field
    document.getElementById("typeNewTask").value = null;

    var task = new Task(taskName, false);
    addTaskServer(task);
    reloadButtons();
}



// call newTask function by clicking enter

function newTaskByEnter(e){
    if(e.keyCode === 13) {
        newTask();
    }
}

window.addEventListener("keypress", newTaskByEnter, false);

var addItemButton = document.getElementById("addByClick");
addItemButton.addEventListener("click", newTask, false);
for(var i = 0; i < addItemButton.length; i++){
    addItemButton[i].addEventListener("click", newTask, false);
}

    
function reloadCheckboxes(){
    
    var checkboxes = document.getElementsByName("taskCompleted");
    
    for(var i = 0; i < checkboxes.length; i++)
    {
        checkboxes[i].onclick = function()
        {
            var id = this.id;
            id = id.toString();
            id = id.substring(5, id.length);    
            checkboxClick(id);
        }
    }
    
    }

window.addEventListener("load", reloadCheckboxes, false);


