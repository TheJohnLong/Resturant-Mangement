(function verifySubmission() {
	'use strict';
	window.addEventListener('load', function() {
    // Fetch all the forms we want to apply custom Bootstrap validation styles to
    var forms = document.getElementsByClassName('addEmployee');
	// Loop over them and prevent submission
	var validation = Array.prototype.filter.call(forms, function(form) {
		form.addEventListener('submit', function(event) {
			if (form.checkValidity() === false) {
			event.preventDefault();
			event.stopPropagation();
			}
			form.classList.add('was-validated');
		}, false);
		});
	}, false);
})();


//On submit, post a form to the api
function SubmitForm()
{
    event.preventDefault();
	
    var post = new XMLHttpRequest();

    // POST to the API
    post.open('POST', "/api/employees");
	
	// Handle errors	
	//To Do: Alert user if errors occured, even OnLoad
	post.error = function() 
	{
		alert("Request Failed!");
	};	
	
	// Handle on load
	post.onload = function() 
	{
		//Check for OK or CREATED status
		if (post.status === 200 || post.status === 201)
		{
			//Close modal
			$('#MGMT_AddEmployee').modal('hide');
		}
		else
		{
			//TODO: Create alert in HTML instead of using this to specify error
			var error = JSON.parse(post.responseText)
			console.log(error.message)
			
			alert(`Error ${post.status}: ${error.message}`);
		}
	};

    var formData = new FormData(document.getElementById("addEmployee"));
    post.send(formData);
}

// Function that does a GET request on the specified API
function requestData(url, selector)
{
	// Create our XMLHttpRequest variable
	var request = new XMLHttpRequest();
	request.open('GET', url);
	
	// Handle on load
	request.onload = function() 
	{
		if (request.status != 200)
		{
			alert(`Error ${request.status}: ${request.statusText}`);
		}
		else
		{
//			alert(`Done, got ${request.response.length} bytes`); // responseText is the server	
			if (selector == '#EmployeesTable')
				populateEmployeesTable(JSON.parse(request.responseText), selector)
		}
	};
	
	// Handle on errors	
	request.error = function() 
	{
		alert("Request Failed!");
	};

	request.send();	
}

// Sample function that deletes a user from the API
// Requires an HTML element WITH the ID filled in
// Trust me, it's stupid, but it works
function deleteUser(object)
{
	// Create our XMLHttpRequest variable
	var request = new XMLHttpRequest();

	// Create the deletion url for user
	var url = "/api/users/" + object.id;
	
	// Open a socket to the url
	request.open('DELETE', url);
	
	// Handle on load
	request.onload = function() 
	{
		if (request.status === 200 || request.status === 201 || request.status === 204)
		{
			alert("Deletion Successful!");
	        $('#EmployeesTable tr td').remove();
	        requestData('/api/employees', '#EmployeesTable');
		}
		else
		{
			alert(`Error ${request.status}: ${request.statusText}`);
		}
	};
	
	// Handle on errors	
	request.error = function() 
	{
		alert("Request Failed!");
	};

	request.send();	
	
}

// Function that builds the table in #MGMT_Employees
// data argument requires an JSON-ified data (Use JSON.Parse() before passing it in!)
function populateEmployeesTable(data, selector)
{
	// Build the table
	for(i = 0; i < data.length; i++)
	{
		var row = $('<tr/>')
		
		// Append first and last name into one variable
		var fullname = data[i].firstname + " " + data[i].lastname;
		row.append($('<td/>').html(fullname));
		
		// Append assignment
		var assignment = $('<div class="captialOneWord"/>').html(data[i].assignment);
		row.append($('<td/>').html(assignment));
		
		//Create buttons for specific ID
		var uid = data[i]._id.$oid;


		var deleteButton = $(`<button class="btn btn-danger" id=${uid}/>`).click(function() {
			deleteUser(this);
		}).html("DEL");
		
		row.append($('<td/>').html(deleteButton));
		


		$(selector).append(row);
	}
}

// Event listener for specific modals
// These listens for certain events on the management page and executes code when opened

// Create the table once the modal is shown (after it pops up)
$('#MGMT_Employees').on('shown.bs.modal', function(event)
{
	requestData('/api/employees', '#EmployeesTable');
});

$('#MGMT_AddEmployee').on('hide.bs.modal', function(event)
{
	$('#EmployeesTable tr td').remove();
	requestData('/api/employees', '#EmployeesTable');
});

// Remove the table's elements after the model is hidden
$('#MGMT_Employees').on('hide.bs.modal', function(event)
{
	$('#EmployeesTable tr td').remove();
});

$('#MGMT_Reports').on('show.bs.modal', function(){
   alert("Hello World!");
});