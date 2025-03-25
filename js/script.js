$(document).ready(()=>{

    
    $(window).on('load', function () {
        $('#preloader').delay(3000).fadeOut("slow");
      
    });
  

    $('#searchInp').on('keyup', function () {
      const searchTerm = $(this).val().toLowerCase();
  
      
      $('.employeeRow').each(function () {
  
        if (name.includes(searchTerm)) {
          $(this).show();
        } else {
          $(this).hide();
        }
      });
    });
  
    $('#departmentsBtn').click(function () {
  
        
        $('#addBtn').attr("#addDepartmentModal");
        $('#departmentTableBody').html('');
        getAllDepartments();
  
    });

    $('#refreshBtn').click(function () {
  
      if ($('#personnelBtn').hasClass('active')) {
  
        $('#searchInp').val(''); 
        $('#personnelTableBody').html('');
  
      } else if($('#departmentsBtn').hasClass('active')){
       
        $('#searchInp').val('');
  
      }else{
        
        $('#searchInp').val('');
        $('#locationTableBody').html('');
      }
      
    });

    const filterBtn = ()=>{
    
        $("#filterBtn").click(function () {

            fetch('php/getAllLocations.php')
            .then(result=>{
                if(result.ok){
                    return result.json();
                }
                throw new Error('Request failed!');
            })
            .then(jsonResult =>{
                
                const filterBtnModalLocation = document.getElementById('filterBtnModalLocation');
                filterBtnModalLocation.innerHTML = '';

                const option = document.createElement('option');
                option.textContent = 'All';
                option.setAttribute('value', 0);
                filterBtnModalLocation.append(option);

                const locations = jsonResult.data;
                locations.forEach(location=>{

                    const option = document.createElement('option');
                    option.textContent = location.location;
                    option.setAttribute('value', location.id);
                    filterBtnModalLocation.append(option);
                });  
            });

            fetch('php/getAllDepartments.php')
            .then(result=>{
                if(result.ok){
                    return result.json();
                }
                throw new Error('Unable to retrieve data');
            })
            .then(jsonResult=>{
            
                const filterBtnModalDepartment = document.getElementById('filterBtnModalDepartment');
                filterBtnModalDepartment.innerHTML = '';

                const option = document.createElement('option');
                option.textContent = 'All';
                option.setAttribute('value', 0);
                filterBtnModalDepartment.append(option);

                const departments = jsonResult.data;
                departments.forEach(department=>{
                    const option = document.createElement('option');
                    option.textContent = department.name;
                    option.setAttribute('value', department.id);
                    filterBtnModalDepartment.append(option);
                })
            });
                
            const filterBtnModalLocation = document.getElementById('filterBtnModalLocation');
            const personnelTable = document.getElementById('personnelTable');
            const filterBtnModalDepartment = document.getElementById('filterBtnModalDepartment');
            const personnelTableBody = document.getElementById('personnelTableBody');

            if(filterBtnModalLocation.value > 0){
                filterBtnModalDepartment.value = 0;
            }
        
            filterBtnModalLocation.addEventListener('change', ()=>{

                const selectedLocation = filterBtnModalLocation.value;
                if(filterBtnModalLocation.value > 0){
                    filterBtnModalDepartment.value = 0;
                }

                for(let i=0; i<personnelTable.rows.length; i++){

                    personnelTable.rows[i].style.display = '';
                    
                }

                for(let i=0; i<personnelTable.rows.length; i++){

                    if(personnelTable.rows[i].cells[0].textContent != selectedLocation){
                        personnelTable.rows[i].style.display = 'none';
                    }
                }
                if(selectedLocation == 0){

                    personnelTableBody.innerHTML = '';
                    getAllPersonnel();
                }
                
            })

            filterBtnModalDepartment.addEventListener('change', ()=>{

                const selectedDepartment = filterBtnModalDepartment.value;
                if(filterBtnModalDepartment.value > 0){
                    filterBtnModalLocation.value = 0;
                }

                for(let i=0; i<personnelTable.rows.length; i++){

                    personnelTable.rows[i].style.display = '';
                    
                }

                for(let i=0; i<personnelTable.rows.length; i++){

                    if(personnelTable.rows[i].cells[1].textContent != selectedDepartment){
                        personnelTable.rows[i].style.display = 'none';
                    }
                }
                if(selectedDepartment == 0){

                    personnelTableBody.innerHTML = '';
                    getAllPersonnel();
                }

            })

      
        });

    }
    $('#filterBtnModal').on('show.bs.modal', function(){ 

        filterBtn();

    });

    const getAllPersonnel = () => {
      $.ajax({
        url: 'php/getAll.php',
        type: 'GET',
        dataType: 'json',
        success: function (result) {
          if (result.status.code == 200) {
  
            const data = result.data;
            populatePersonnelTable(data);
          }
        },
        error: function (jqXHR, textStatus, errorThrown) {
          console.error(jqXHR);
          alert('Data not available');
        },
      });
    };
  
    getAllPersonnel();
  
  
    
    const populatePersonnelTable = (data) => {

    const personnelTableBody = document.getElementById('personnelTableBody');

    const frag = document.createDocumentFragment();

    data.forEach(employee=>{
        const row = document.createElement('tr');
        row.classList = 'employeeRow';

        const employeeLocationID = document.createElement('td');
        employeeLocationID.classList = 'employeeLocationID d-none';
        const employeeLocationIDText = document.createTextNode(employee.locationID);
        employeeLocationID.append(employeeLocationIDText);
        row.append(employeeLocationID);

        const employeeDepartmentID = document.createElement('td');
        employeeDepartmentID.classList = 'employeeDepartmentID d-none';
        const employeeDepartmentIDText = document.createTextNode(employee.departmentID);
        employeeDepartmentID.append(employeeDepartmentIDText);
        row.append(employeeDepartmentID);

        const employeeName = document.createElement('td');
        employeeName.classList.add('align-middle', 'text-nowrap', 'employeeName');
        employeeName.append(document.createTextNode(`${employee.lastName}, ${employee.firstName}`));
        row.append(employeeName);

        const employeeDepartment = document.createElement('td');
        employeeDepartment.classList = 'align-middle text-nowrap d-none d-md-table-cell employeeDepartment';
        employeeDepartment.append(document.createTextNode(employee.department));
        row.append(employeeDepartment);

        const employeeLocation = document.createElement('td');
        employeeLocation.classList = 'align-middle text-nowrap d-none d-md-table-cell';
        employeeLocation.append(document.createTextNode(employee.location));
        row.append(employeeLocation);

        const employeeEmail = document.createElement('td');
        employeeEmail.classList = 'align-middle text-nowrap d-none d-md-table-cell';
        employeeEmail.append(document.createTextNode(employee.email));
        row.append(employeeEmail);

        const employeeButtons = document.createElement('td');
        employeeButtons.classList = 'text-end text-nowrap';

        const editButton = document.createElement('button');
        editButton.classList = 'btn btn-primary btn-sm rowBtn me-1';
        editButton.setAttribute('type', 'button');
        editButton.setAttribute('data-bs-toggle', "modal");
        editButton.setAttribute('data-bs-target', "#editPersonnelModal");
        editButton.setAttribute('data-id', employee.id);
        const i = document.createElement('i');
        i.classList = 'fa-solid fa-pencil fa-fw';
        editButton.append(i);

        const deleteButton = document.createElement('button');
        deleteButton.classList = 'btn btn-primary btn-sm rowBtn';
        const deleteButtonAttr = {type: 'button', 'data-bs-toggle': 'modal', 'data-bs-target': "#deletePersonnelModal", 'data-id': employee.id};
        for(const[key, value] of Object.entries(deleteButtonAttr)){
            deleteButton.setAttribute(key, value);

        }
        const y = document.createElement('i');
        y.classList = 'fa-solid fa-trash fa-fw';
        deleteButton.append(y);

        employeeButtons.append(editButton);
        employeeButtons.append(deleteButton);
        row.append(employeeButtons);

    
    });
    personnelTableBody.append(frag);
    
      
    };

    $('#addBtn').attr('data-bs-toggle', "modal");
    $('#addBtn').attr("#addPersonnelModal");

    $("#addPersonnelModal").on("show.bs.modal", function () {
        
        $.ajax({
        url: 'php/getAllDepartments.php',
        type: 'POST',
        dataType: 'JSON',
        success: function(result){
    
            if(result.status.code == 200){
    
                const departments = result.data;
            
                const addPersonnelDepartment = document.getElementById('addPersonnelDepartment');
                addPersonnelDepartment.innerHTML= '';
                departments.forEach((department)=>{
                    const option = document.createElement('option');
                    option.value = department.id;
                    option.textContent = department.name;
                    addPersonnelDepartment.appendChild(option);

                });
    
            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.error(jqXHR);
            alert('Data not available');
        }
        });
    
    });

    $("#addPersonnelForm").on("submit", function (e) { 

        e.preventDefault();

        const firstName = $('#addPersonnelFirstName').val();
        const lastName = $('#addPersonnelLastName').val();
        const jobTitle = $('#addPersonnelJobTitle').val();
        const email = $('#addPersonnelEmailAddress').val();
        const departmentID = $('#addPersonnelDepartment').val();

        $.ajax({
            url: 'php/insertPersonnel.php',
            type: 'POST',
            dataType: 'JSON',
            data: {firstName, lastName, jobTitle, email, departmentID},
            success: function(result){

                if(result.status.code == 200){

                    $('#addPersonnelLastName').val('');
                    $('#addPersonnelJobTitle').val('');
                    $('#addPersonnelEmailAddress').val('');
                    $('#addPersonnelDepartment').val('');
    
                    const addPersonnelMessage = document.getElementById('addPersonnelMessage');
                    const div = document.createElement('div');
                    div.innerHTML = '';
                    div.className = 'alert alert-success';
                    div.setAttribute('role', 'alert');
                    addPersonnelMessage.append(div);
    
                    $('#personnelTableBody').html('');
                    $("#addPersonnelForm").hide();
        
                    $('#addPersonnelModal').on('hidden.bs.modal', function () {
                        $('.alert-success').remove();
                        $('#addPersonnelForm, #addPersonnelYesBtn').show();
                    
                    });
    
                }

            },
            error: function (jqXHR, textStatus, errorThrown) {
            console.error(jqXHR);
            alert('Data not available');
            }
        });
        
    

    
    $("#editPersonnelModal").on("show.bs.modal", function (e) {
      let personnelID = $(e.relatedTarget).attr("data-id");
        
      $.ajax({
        url: "php/getPersonnelByID.php",
        type: "POST",
        dataType: "json",
        data: {id: personnelID},
        success: function (result) {
          if (result.status.code == 200) {
  
            
            $("#editPersonnelEmployeeID").val(result.data.personnel[0].id);
            $("#editPersonnelJobTitle").val(result.data.personnel[0].jobTitle);
            $("#editPersonnelEmailAddress").val(result.data.personnel[0].email);
            $("#editPersonnelDepartment").html("");
            const departments = result.data.department;
            const editPersonnelDepartment = document.getElementById('editPersonnelDepartment');
            departments.forEach((department)=>{
                const option = document.createElement('option');
                option.value = department.id;
                option.textContent = department.name;
                editPersonnelDepartment.appendChild(option);
            });

            $("#editPersonnelDepartment").val(result.data.personnel[0].departmentID);
            
          } else {
            $("#editPersonnelModal .modal-title").replaceWith("Error retrieving data");
          }
        },
        error: function (jqXHR, textStatus, errorThrown) {
          $("#editPersonnelModal .modal-title").replaceWith("Error retrieving data");
        }
      });
  


    
    $("#editPersonnelForm").on("submit", function (e) {
    
        const personnelID = $('#editPersonnelEmployeeID').val();
        const firstName= $("#editPersonnelFirstName").val();
        const lastName= $("#editPersonnelLastName").val();
        const emailAddress= $("#editPersonnelEmailAddress").val();
        const department= $("#editPersonnelDepartment").val();
  
        $.ajax({
          url: 'php/updatePersonnel.php',
          type: 'POST',
          dataType: 'json',
          data: {personnelID, firstName, lastName, emailAddress, department},
          success: function(result){
            if(result.status.code == 200){

                const editPersonnelMessage = document.getElementById('editPersonnelMessage');
                const div = document.createElement('div');
                div.innerHTML = '';
                div.className = 'alert alert-success';
                div.setAttribute('role', 'alert');
                div.textContent= 'Record updated successfully.';
                editPersonnelMessage.append(div);

                $('#personnelTableBody').html('');
                $("#editPersonnelForm, #editPersonnelYesBtn").hide();
    
                $('#editPersonnelModal').on('hidden.bs.modal', function () {
                    $('.alert-success').remove();
                    $('#editPersonnelForm, .editPersonnelBtn, #editPersonnelYesBtn').show();
                
                });
                

            

          },
          error: function (jqXHR, textStatus, errorThrown){
            $("#editDepartmentModal .modal-title").replaceWith("Error updating location");
          }
        })
        
    


    $("#deletePersonnelModal").on("show.bs.modal", function (e) {

      const deletePersonnelEmployeeID = document.getElementById('deletePersonnelEmployeeID');
      deletePersonnelEmployeeID.value = $(e.relatedTarget).attr("data-id");
  
      $.ajax({
        url: "php/getPersonnelByID.php",
        type: "POST",
        dataType: "json",
        data: {id: deletePersonnelEmployeeID.value},
        success: function (result) {
          if (result.status.code == 200) {

            const deletePersonnelConfirmation = document.getElementById('deletePersonnelConfirmation');
            deletePersonnelConfirmation.innerHTML = `Are you sure that you want to permanently delete <b>${result.data.personnel[0].lastName}</b> <b>${result.data.personnel[0].firstName}</b>`;
            
          } else {
            $("#deletePersonnelModal .modal-title").replaceWith("Error retrieving data");
          }
        },
        error: function (jqXHR, textStatus, errorThrown) {
          $("#deletePersonnelModal .modal-title").replaceWith("Error retrieving data");
        }
      });
  
    })

    
    $("#deletePersonnelForm").on("submit", function (e) {
  
        e.preventDefault(); 

        const personnelID = $('#deletePersonnelEmployeeID').val();
  
        $.ajax({
          url: 'php/deletePersonnelByID.php',
          type: 'POST',
          dataType: 'json',
          data: {personnelID},
          success: function(result){

            if(result.status.code == 200){

                const deletePersonnelMessage = document.getElementById('deletePersonnelMessage');
                const div = document.createElement('div');
                div.innerHTML = '';
                div.className = 'alert alert-success';
                div.setAttribute('role', 'alert');
                div.textContent= 'Record deleted successfully.';
                deletePersonnelMessage.append(div);

                $('#personnelTableBody').html('');
                
                $("#deletePersonnelForm, #deletepersonnelYesBtn").hide();
    
                $('#deletePersonnelModal').on('hidden.bs.modal', function () {
                    $('.alert-success').remove();
                    $('#deletePersonnelForm, .deletePersonnelBtn, #deletepersonnelYesBtn').show();
                
                });
                getAllPersonnel();

            }

          },
          error: function (jqXHR, textStatus, errorThrown){
            $("#deletePersonnelModal .modal-title").replaceWith("Error deleting data");
          }
        })
      
    });
  

    const getAllDepartments = () => {
      $.ajax({
        url: 'php/getAllDepartments.php',
        type: 'POST',
        dataType: 'json',
        success: function (result) {
          if (result.status.code == 200) {
  
            const data = result.data;
            populateDepartmentsTable(data);
  
          }
        },
        error: function (jqXHR, textStatus, errorThrown) {
          console.error(jqXHR);
          alert('Data not available');
        },
      });  
  
    
    const populateDepartmentsTable = (data) => {

    const departmentTableBody = document.getElementById('departmentTableBody');
    const frag = document.createDocumentFragment();

    data.forEach((department)=>{

        const row = document.createElement('tr');

        const departmentName = document.createElement('td');
        departmentName.classList = 'align-middle text-nowrap';
        departmentName.append(document.createTextNode(department.name));
        row.append(departmentName);

        const departmentLocation = document.createElement('td');
        departmentLocation.classList = 'align-middle text-nowrap d-none d-md-table-cell';
        departmentLocation.append(document.createTextNode(department.location));
        row.append(departmentLocation);

        const departmentButtons = document.createElement('td');
        departmentButtons.classList = 'align-middle text-end text-nowrap';
        

        const i = document.createElement('i');
        i.classList = 'fa-solid fa-pencil fa-fw';
        const editButton = document.createElement('button');
        editButton.classList = 'btn btn-primary btn-sm rowBtn me-1';
        const editButtonAttr = {type: "button", 'data-bs-toggle': "modal", 'data-bs-target': "#editDepartmentModal", 'data-id': department.id};
        for(const[key, value] of Object.entries(editButtonAttr)){
            editButton.setAttribute(key, value);
        }
        editButton.append(i);
        departmentButtons.append(editButton);
        
        const y = document.createElement('i');
        y.classList = 'fa-solid fa-trash fa-fw';
        const deleteButton = document.createElement('button');
        deleteButton.classList = 'btn btn-primary btn-sm rowBtn';
        const deleteButtonAttr = {type: "button", 'data-bs-toggle': "modal", 'data-bs-target': "#deleteDepartmentModal", 'data-id': department.id};
        for(const[key, value] of Object.entries(deleteButtonAttr)){
            deleteButton.setAttribute(key, value);
        }
        deleteButton.append(y);
        departmentButtons.append(deleteButton);
        
        row.append(departmentButtons);

    
    });

    departmentTableBody.append(frag);
  
    

    
    $("#addDepartmentModal").on("show.bs.modal", function () {

        $.ajax({
            url: 'php/getAllLocations.php',
            type: 'POST',
            dataType: 'JSON',
            success: function(result){
                if(result.status.code == 200){
    
                    const locations = result.data;
                    
                    const addDepartmentLocation = document.getElementById('addDepartmentLocation');
                    addDepartmentLocation.innerHTML= '';
                    locations.forEach((location)=>{

                        const option = document.createElement('option');
                        option.value = location.id;
                        option.textContent = location.location;
                        addDepartmentLocation.appendChild(option);
                
                    })
                }else{
                    alert('Data not available');
                }
            },
            error: function (jqXHR, textStatus, errorThrown) {
                console.error(jqXHR);
                alert('Data not available');
            }
    
    
    
  
    
    $('#addDepartmentForm').on('submit', function(e){

       const departmentName = $('#addDepartmentName').val();
       const departmentLocation = $('#addDepartmentLocation').val();        
        
        $.ajax({
        url: 'php/insertDepartment.php',
        type: 'POST',
        data: {departmentName, departmentLocation},
        dataType: 'JSON',
        success: function(result){
            if(result.status.code == 200){
                
                $('#addDepartmentName').val('');

                const addDepartmentMessage = document.getElementById('addDepartmentMessage');
                const div = document.createElement('div');
                div.innerHTML = '';
                div.className = 'alert alert-success';
                div.setAttribute('role', 'alert');
                div.textContent= 'Record added successfully.';
                addDepartmentMessage.append(div);

                $('#departmentTableBody').html('');
                $("#addDepartmentForm, #addDepartmentYesBtn").hide();
    
                $('#addDepartmentModal').on('hidden.bs.modal', function () {
                    $('.alert-success').remove();
                    $('#addDepartmentForm, .addDepartmentBtn, #addDepartmentYesBtn').show();
                
                });
                getAllDepartments();

            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.error(jqXHR);
            alert('Data not available');
        }
        })
  
    $("#editDepartmentModal").on("show.bs.modal", function (e) {
  
      let id = $(e.relatedTarget).attr("data-id"); 
        
      $.ajax({
        url: "php/getDepartmentByID.php",
        type: "POST",
        dataType: "json",
        data: {id},
        success: function (result) {
          if (result.status.code == 200) {
             let locations = result.data.location;
            
                $("#editDepartmentID").val(result.data.department[0].id);
                $("#editDepartmentName").val(result.data.department[0].name);
                $("#editDepartmentLocation").html("");                

                const editDepartmentLocation = document.getElementById('editDepartmentLocation');
                locations.forEach((location)=>{
                    const option = document.createElement('option');
                    option.value = location.id;
                    option.textContent = location.location;
                    editDepartmentLocation.appendChild(option);
                });

                $("#editDepartmentLocation").val(result.data.department[0].locationID);

        
            } else {
            $("#editDepartmentModal .modal-title").replaceWith("Error retrieving data");
            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
          $("#editDepartmentModal .modal-title").replaceWith("Error retrieving data");
        }
      });

    });

    $("#editDepartmentForm").on("submit", function (e) {
  
        e.preventDefault();   
  
        let name = $('#editDepartmentName').val();
        let location = $('#editDepartmentLocation').val();
        let id = $('#editDepartmentID').val();
  
        $.ajax({ 
          url: 'php/updateDepartment.php',
          type: "POST",
          dataType: "json",
          data: {selectedValue: location, departmentID: id, newDept: name },
          success: function (result){
                if (result.status.code == 200){

                    const editDepartmentMessage = document.getElementById('editDepartmentMessage');
                    const div = document.createElement('div');
                    div.innerHTML = '';
                    div.className = 'alert alert-success';
                    div.setAttribute('role', 'alert');
                    div.textContent= 'Record updated successfully.';
                    editDepartmentMessage.append(div);

                    $('#departmentTableBody').html('');
                    $("#editDepartmentYesBtn").hide();
    
                    $('#editDepartmentModal').on('hide.bs.modal', function () {

                        $('.alert-success').remove();
                        $('#editDepartmentForm, #editDepartmentYesBtn').show();
                
                    });
                    
                
                }

            },
            error: function (jqXHR, textStatus, errorThrown){
                $("#editDepartmentModal .modal-title").replaceWith("Error updating location");
            }

        });
    }

    
    $("#deleteDepartmentModal").on("show.bs.modal", function (e) {
  
      $('#deleteDepartmentID').val($(e.relatedTarget).attr("data-id"));
  
      $.ajax({
        url: "php/getDepartmentByID.php",
        type: "POST",
        dataType: "json",
        data: {id: $('#deleteDepartmentID').val()},
        success: function (result) {
            if(result.status.code == 200){

                $('#departmentName').val(result.data.department[0].name);
                $('#totalPersonnel').val(result.data.department[0].totalPersonnel);
                const deleteDepartmentConfirmation = document.getElementById('deleteDepartmentConfirmation');
                deleteDepartmentConfirmation.innerHTML = `Are you sure that you want to permanently delete record for <strong>${result.data.department[0].name}</strong>`;
            }
            else{
                $("#deleteDepartmentModal .modal-title").replaceWith("Error retrieving data");
            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
          $("#deleteDepartmentModal .modal-title").replaceWith("Error retrieving data");
        }
      });
  
    })


    $("#deleteDepartmentForm").on("submit", function (e) {
  

        if($('#totalPersonnel').val() != 0){

            const deleteDepartmentMessage = document.getElementById('deleteDepartmentMessage');
            const div = document.createElement('div');
            div.className = 'alert alert-success';
            div.setAttribute('role', 'alert');
            div.innerHTML = `<b>${$('#departmentName').val()}</b> has <b>${$('#totalPersonnel').val()}</b> employee(s), and can not be deleted.`;
            deleteDepartmentMessage.appendChild(div);

            $("#deleteDepartmentForm, #deletedepartmentYesBtn").hide();

            $('#deleteDepartmentModal').on('hidden.bs.modal', function () {

                $('.alert-success').remove();
                $('#deleteDepartmentForm, .deleteDepartmentBtn, #deletedepartmentYesBtn').show();
            
            });
    
        }else{
  
            $.ajax({ 
                url: 'php/deleteDepartmentByID.php',
                type: 'POST',
                dataType: 'json',
                data: {id: $('#deleteDepartmentID').val()},
                success: function(result){
                
                    if(result.status.code == 200){

                        const deleteDepartmentMessage = document.getElementById('deleteDepartmentMessage');
                        const div = document.createElement('div');
                        div.innerHTML = '';
                        div.className = 'alert alert-success';
                        div.setAttribute('role', 'alert');
                        div.textContent= 'Record deleted successfully.';
                        deleteDepartmentMessage.append(div);

                        $('#departmentTableBody').html('');
                        
                        $("#deleteDepartmentForm, #deletedepartmentYesBtn").hide();
            
                        $('#deleteDepartmentModal').on('hidden.bs.modal', function () {
                            $('.alert-success').remove();
                            $('#deleteDepartmentForm, .deleteDepartmentBtn, #deletedepartmentYesBtn').show();
                        
                        });
                        
                        getAllDepartments();

                    }
                },
                error: function (jqXHR, textStatus, errorThrown){

                    $("#deleteDepartmentModal .modal-title").replaceWith("Error deleting data");

                }
            })
        }   
      
    
    const getAllLocations = () => {
      $.ajax({
        url: 'php/getAllLocations.php',
        type: 'GET',
        dataType: 'json',
        success: function (result) {
          if (result.status.code == 200) {
  
            const data = result.data;
            populateLocationTable(data);
          }
        },
        error: function (jqXHR, textStatus, errorThrown) {
          console.error(jqXHR);
          alert('Data not available');
        },
      });
    
  
    getAllLocations();
  
    const populateLocationTable = (data) => { 

    const locationTableBody = document.getElementById('locationTableBody');
    const frag = document.createDocumentFragment();

    data.forEach((location)=>{
        const row = document.createElement('tr');
        row.classList = 'locationRow';

        const locationName = document.createElement('td');
        locationName.classList = 'align-middle text-nowrap locationName';
        locationName.append(document.createTextNode(location.location));
        row.append(locationName);

        const locationButtons = document.createElement('td');
        locationButtons.classList = 'text-end text-nowrap';

        const editButton = document.createElement('button');
        editButton.classList = 'btn btn-primary btn-sm rowBtn me-1';
        const editButtonAttr = {type: "button", 'data-bs-toggle': "modal",  'data-bs-target': "#editLocationModal", 'data-id': location.id};
        for(const[key, value] of Object.entries(editButtonAttr)){
            editButton.setAttribute(key, value);
        }
        const i = document.createElement('i');
        i.classList = 'fa-solid fa-pencil fa-fw';
        editButton.append(i);
        locationButtons.append(editButton);

        const deleteButton = document.createElement('button');
        deleteButton.classList = 'btn btn-primary btn-sm rowBtn';
        const deleteButtonAttr = {type: "button", 'data-bs-toggle': "modal",  'data-bs-target': "#deleteLocationModal", 'data-id': location.id};
        for(const[key, value] of Object.entries(deleteButtonAttr)){
            deleteButton.setAttribute(key, value);
        }
        const y = document.createElement('i');
        y.classList = 'fa-solid fa-trash fa-fw';
        deleteButton.append(y);
        locationButtons.append(deleteButton);


        row.append(locationButtons);

    });
    locationTableBody.append(frag);


    $("#addLocationModal").on("show.bs.modal", function () {
    
    })
    $('#addLocationForm').on('submit', function(e){

        e.preventDefault();
  
        const locationName = $('#addLocationName').val();       
          
        $.ajax({
            url: 'php/insertLocation.php',
            type: 'POST',
            data: {locationName},
            dataType: 'JSON',
            success: function(result){
    
                if(result.status.code == 200){
                    
                    $('#addLocationName').val('');

                    const addLocationMessage = document.getElementById('addLocationMessage');
                    const div = document.createElement('div');
                    div.innerHTML = '';
                    div.className = 'alert alert-success';
                    div.setAttribute('role', 'alert');
                    div.textContent= 'Record added successfully.';
                    addLocationMessage.append(div);

                    $('#locationTableBody').html('');
                    $("#addLocationForm, #addLocationYesBtn").hide();
        
                    $('#addDepartmentModal').on('hidden.bs.modal', function () {
                        $('.alert-success').remove();
                        $('#addLocationForm, .addLocationBtn, #addLocationYesBtn').show();
                    
                    });
                    getAllLocations();

                }
                else{

                    alert('Unsuccessful request.');
                }
            },
            error: function (jqXHR, textStatus, errorThrown) {
                console.error(jqXHR);
                alert('Data not available');
            }
        })
    }
    $("#editLocationModal").on("show.bs.modal", function (e) {

        $("#editLocationID").val($(e.relatedTarget).attr("data-id"));
   
        $.ajax({
            url: "php/getLocationByID.php",
            type: "POST",
            dataType: "json",
            data: {locationID: $("#editLocationID").val()},
            success: function (result) {
    
                if (result.status.code == 200) {
                    
                    $("#editLocationName").val(result.data[0].location);
        
                } else {
                    $("#editLocationModal .modal-title").replaceWith(
                    "Error retrieving data"
                    );
                }
    
            },
            error: function (jqXHR, textStatus, errorThrown) {
                $("#editLocationModal .modal-title").replaceWith("Error retrieving data");
            }
    
        });
      
    });
    $("#editLocationForm").on("submit", function (e) {
  
        e.preventDefault(); 
  
        let editedValue = $("#editLocationName").val();
        let locationID =  $("#editLocationID").val();
  
        $.ajax({  
            url: 'php/updateLocation.php',
            type: "POST",
            dataType: "json",
            data: {editedValue, locationID },
            success: function (result){
            
                if (result.status.code == 200){

                    const editLocationMessage = document.getElementById('editLocationMessage');
                    const div = document.createElement('div');
                    div.innerHTML = '';
                    div.className = 'alert alert-success';
                    div.setAttribute('role', 'alert');
                    div.textContent= 'Record updated successfully.';
                    editLocationMessage.append(div);

                    $('#locationTableBody').html('');
                    
                    $("#editLocationForm, #editLocationYesBtn").hide();

                    $('#editLocationModal').on('hide.bs.modal', function () {

                        $('.alert-success').remove();
                        $('#editLocationForm, .editLocationBtn').show();
                
                    });
                    getAllLocations();
                
                }

            },
            error: function (jqXHR, textStatus, errorThrown){
            $("#editLocationModal .modal-title").replaceWith("Error updating location");
            }
        });
    });
    $("#deleteLocationModal").on("show.bs.modal", function (e) {
    
        $('#deleteLocationID').val($(e.relatedTarget).attr("data-id"));
  
        $.ajax({
            url: "php/getLocationByID.php",
            type: "POST",
            dataType: "json",
            data: {locationID: $('#deleteLocationID').val()},
            success: function (result) {
                
                if(result.status.code == 200){

                    $('#locationName').val(result.data[0].location);
                    $('#totalDepartment').val(result.data[0].totalDepartment);
                    const deleteLocationConfirmation = document.getElementById('deleteLocationConfirmation');
                    deleteLocationConfirmation.innerHTML = `Are you sure that you want to permanently delete record for <strong>${result.data[0].location}</strong>`;
                }
                else{
                    $("#deleteLocationModal .modal-title").replaceWith("Error retrieving data");
                }
            },
            error: function (jqXHR, textStatus, errorThrown) {
                $("#deleteLocationModal .modal-title").replaceWith("Error retrieving data");
            }
        });
  
    })


    $("#deleteLocationForm").on("submit", function (e) {
  
        e.preventDefault(); 
        
        if($('#totalDepartment').val() != 0){

            const deleteLocationMessage = document.getElementById('deleteLocationMessage');
            const div = document.createElement('div');
            div.className = 'alert alert-success';
            div.setAttribute('role', 'alert');
            div.innerHTML = `<b>${$('#locationName').val()}</b> has <b>${$('#totalDepartment').val()}</b> department(s), and can not be deleted.`;
            deleteLocationMessage.appendChild(div);

            $("#deleteLocationForm, #locationYesBtn").hide();

            $('#deleteLocationModal').on('hidden.bs.modal', function () {
                $('.alert-success').remove();
                $('#deleteLocationForm, .deleteLocationBtn').show();
        
            });

        }else{
  
            $.ajax({ 
                url: 'php/deleteLocationByID.php',
                type: 'POST',
                dataType: 'json',
                data: {id: $('#deleteLocationID').val()},
                success: function(result){

                    if(result.status.code == 200){

                        const deleteLocationMessage = document.getElementById('deleteLocationMessage');
                        const div = document.createElement('div');
                        div.innerHTML = '';
                        div.className = 'alert alert-success';
                        div.setAttribute('role', 'alert');
                        div.textContent= 'Record deleted successfully.';
                        deleteLocationMessage.append(div);

                        $('#locationTableBody').html('');
                        
                        $("#deleteLocationForm, #locationYesBtn").hide();
            
                        $('#deleteLocationModal').on('hidden.bs.modal', function () {
                            $('.alert-success').remove();
                            $('#deleteLocationForm, .deleteLocationBtn').show();
                        
                        });
                        
                        getAllLocations();

                    }

                },
                error: function (jqXHR, textStatus, errorThrown){
                    $("#deleteLocationModal .modal-title").replaceWith("Error deleting data");
                }
            })
        }
    });

});