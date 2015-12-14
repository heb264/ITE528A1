var taskListApp = {};
	//setting function variables for the app
	taskListApp.tasks = [];
	taskListApp.curTaskIndex= -1;

	//loading tasks by checking if any tasks are stored. if not create new locaStorage
	taskListApp.loadTasks = function(event){
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
	taskListApp.syncStorage = function(event){
    	localStorage['tasks'] = JSON.stringify(tasks);
  	};

  	taskListApp.dueDate = function(){
  		$('#dueDteTime').datePicer
  			showOn: "both",
  			buttonImageOnly: true,
  			buttonImage: 'calendar.gif',
  			buttonText: 'Calendar'
  		});
  		$.datepicker.formatDate("dd-mm-yyyy", new Date());
  	};

  	//display tasks
  	taskListApp.displayTasks = function(){
  		//creating tap handler
    	var createTapHandler = function(currentIndex){
        	taskListApp.setCurrentTask(currentIndex);
    	}
    	//Markasdone tap handler
	    var createMarkAsDoneTapHandler = function (currentIndex){
	        taskListApp.toggleCurrentTaskAsDone(currentIndex);
	     }

	     var createImageTapHandler = function(currentIndex){
	     	taskListApp.takePhoto(currentIndex)
	     	navigator.camera.getPicture(onSuccess, onFail, {
	        	quality: 50,
	        	destinationType: Camera.destinationType.FILE_URI
	      	});
	    	function onSuccess(imageURI) {
	        	var image = document.getElementById('taskImage');
	        	image.src = imageURI;
	      	}

	      	function onFail(message) {
	        	alert('Failed because: ' + message);
	      	}
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

	    //adding image
	    var taskImg =$('#taskImage');
	    task.taskImg.src = createImageTapHandler(i);

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
	      task.dueDate=$('#dueDteTime').val(datePicked);
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
  taskListApp.return{
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
	    	taskListApp.loadTasks(); //loading tasks
            taskListApp.displayTasks(); //displaying tasks
	    }

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

$('#home').on('pagecreate', function() {
    //taskListApp.init();

    $('#addTaskBtn').bind('tap', function(event, data) {
        var newTask = new TaskListApp.Task();
        console.dir(newTask);
        taskListApp.return.addTask(newTask);
    	};
});

$('#formPage').on('pagecreate', function() {
	$('#dueDteTime')
    $('#saveBtn').bind('tap', function(event, data) {
      	taskListApp..return.saveTask();
  	}
  });
        // This is required to avoid weird redirections
        event.preventDefault();
    }
});

$('#formPage').on('pagebeforeshow', function () {
  taskListApp.return.displayTask();
});

$('#deletePage').on('pagecreate', function () {
    $('#confirmBtn').bind('tap', function(event, data) {
        taskListApp.return.removeTask();
    }
});