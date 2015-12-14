var taskListApp = function(){
	//setting function variables for the app
	var tasks = [];
	var currentTaskIndex= -1;

	//loading tasks by checking if any tasks are stored. if not create new locaStorage
	var loadTasks = function(){
	    if(locaStorage){
	    var storedTasks = locaStorage["tasks"];
	      if(!storedTasks){
	        syncStorage();
	        }else {
	        tasks = JSON.parse(storedTasks);
	        }
	    }
	};

	//syncing local storage
	var syncStorage = function(){
    	localStorage['tasks'] = JSON.stringify(tasks);
  	};

  	//display tasks
  	var displayTasks = function(){
  		//creating tap handler
    	var createTapHandler = function(currentIndex){
        	taskListApp.setCurrentTask(currentIndex);
    	}
    	//Markasdone tap handler
	    var createMarkAsDoneTapHandler = function (currentIndex){
	        taskListApp.toggleCurrentTaskAsDone(currentIndex);
	     }
        //make event handler work properly
        event.preventDefault();

  	};

  	//using the camera to take an image to add to task.
    var takePhoto = function(){
      	navigator.camera.getPicture(onSuccess, onFail, {
        	quality: 50,
        	destinationType: Camera.destinationType.FILE_URI
      	});
    	function onSuccess(imageURI) {
        	var image = document.getElementById('taskImage');
        	image.src = imageURI;
      	};

      	function onFail(message) {
        	alert('Failed because: ' + message);
      	};
    };

    //creating the listview
    var list = $('#taskList');
    list.empty();
    for(var i = 0, length = task.length; i < length; ++i){
      var task = tasks[i];

      //edit link
      var editLink=$('<a>');
      editLink.attr('href', '#formpage');
      editLink.attr('data-transition', 'slide');
      editLink.bind('tap', createTapHandler(i));
      editLink.append(task.title);

      //done
      var doneLink = $('<a>')
      doneLink.bind=('tap', createMarkAsDoneTapHandler(i));

      //set class name
      var className = (task.done) ? 'taskdone' : 'tasknotdone';
      editLink.attr('class', className);


      //creating new list item
      var newLi = $('<li>');
      newLi.append(editLink);
      newLi.append(doneLink);
      list.append(newli);
    }
      list.listview('refresh', true);
      $('#counter').html(task.length + ' tasks');

  	  //filling the form
	  var fillForm = function(){
	    var task = tasks[curTaskIndex];
	    task.title=$('#taskName').val();
	    task.description=$('#taskDescription').val();
	    task.dueDate=$('#dueDteTime').val();
	    task.photoURL=$('#taskImage').src;

	  //changing the task completed slider depending on whether task is done or not
	    var flip = $('#taskDone');
	    var value = (task.done) ? 1 : 0;
	    flip[0].selectedIndex = value;
	    flip.slider('refresh');
	  };
    //updating current task
	    var updateCurrentTask = function(){
	      var task= task[curTaskIndex];
	      var task = tasks[curTaskIndex];
	      task.title=$('#taskName').val();
	      task.description=$('#taskDescription').val();
	      task.done=($('#taskDone').val()==='yes');
	      task.dueDate=$('#dueDteTime').val();
	      task.photoURL=$('#taskImage').src;
	    };

    //deleting task
	    var deleteCurrentTask = function(){
	      tasks.splice(curTaskIndex, 1);
	    };

    //toggling task completion
	    var toggleTask = function(i){
	    var task = tasks[i];
	    task.done = !task.done;
	    };
	
	//return functions for app
  return{
	    Task: function(){
	      this.title = 'new Task';
	      this.description = 'empty description';
	      this.dueDteTime = new Date();
	      this.done = false;
	      this.photoURL
	    },
	    addTask: function(task){
	      curTaskIndex = tasks.length;
	      tasks.push(task);
	      syncStorage();
	      displayTasks();
	    },
	    init: function(){
	      loadTasks();
	      displayTasks();
	    },
	    displayTask: function(){
	      fillForm();
	    },
	    saveTask: function(){
	      updateCurrentTask();
	      syncStorage();
	        $.mobile.changePage('#home', {
	        transition: 'slide',
	        reverse: true
	      });
	      displayTasks();
	    
	    },
	    setCurrentTask: function(i){
	      curTaskIndex = i;
	    },
	    toggleCurrentTaskAsDone: function(i){
	      toggleTask(i);
	      syncStorage();
	      displayTasks();
	    },
	    removeTask: function(){
	      deleteCurrentTask();
	      syncStorage();
	      displayTasks();
	      $.mobile.changePage('#home', {
	        transition: 'slide',
	        reverse: true
	      });
    	}
	}();
};

$('#home').on('pageinit', function() {
    taskListApp.init();

    $('#addTaskBtn').bind('tap', function(event, data) {
        var newTask = new TaskListApp.Task();
        console.dir(newTask);
        taskListApp.addTask(newTask);
    });
});

$('#formPage').on('pageinit', function() {
    $('#saveBtn').bind('tap', function(event, data) {
      taskListApp.saveTask();
        // This is required to avoid weird redirections
        event.preventDefault();
    });
});

$('#formPage').on('pagebeforeshow', function () {
  taskListApp.displayTask();
});

$('#deletePage').on('pageinit', function () {
    $('#confirmBtn').bind('tap', function(event, data) {
        taskListApp.removeTask();
    });
});