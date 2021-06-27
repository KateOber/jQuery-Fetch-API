///Purpose: display and search 12 random employees 
//          fetched from the public api
///         using jQuery and AJAX
///Author: Kate Obertas
$(document).ready(() => {

    //event handler to hide detailed card when close button is clicked 
    $('.modal-close-btn').on('click', () => $('.modal-container').hide());
    //hide detailed employee card
    $('.modal-container').hide();
    //setup and hide message for when no employee found in search
    var notFound = $('<h1>No employee found</h1>');
    $('.gallery').append(notFound);
    notFound.hide();

    //setup arrays
    var showedEmp = [];
    var employees = [];
    var cards = [];

    //fetch for each employee one by one
    //save as an object in array and display
    for (let x = 0; x < 12; x++) {

        $.ajax({
            url: 'https://randomuser.me/api/',
            dataType: 'json',
            success: data => {

                let res = data.results[0];

                //employee object
                employees[x] = {
                    id: x,
                    name: `${res.name.first} ${res.name.last}`,
                    email: res.email,
                    bday: res.dob.date.slice(0, 10),
                    phone: res.cell,
                    city: res.location.city,
                    state: res.location.state,
                    street: `${res.location.street.number} ${res.location.street.name}`,
                    postcode: res.location.postcode,
                    pic_med: res.picture.medium,
                    pic_large: res.picture.large
                };

                //card object
                cards[x] = $(`<div class="card" id='card${x}'>` +
                    `<div class="card-img-container">` +
                    `<img class="card-img" src="${employees[x].pic_med}" alt="profile picture">` +
                    ` </div>
                <div class="card-info-container">
                    <h3 id="name" class="card-name cap">${employees[x].name}</h3>
                    <p class="card-text">${employees[x].email}</p>
                    <p class="card-text cap">${employees[x].city + ", " + employees[x].state}</p>
                </div>
            </div>`);

                //cards displayed in real-time as fetched, can me be displayed
                //after the loop all at once
                $('.gallery').append(cards[x]);
                //add click event handler to display detailed card
                $(`#card${x}`).on('click', () => ShowCard(x));
            }
        });
    } //end of for loop

    //before search is engaged all employees are shown
    showedEmp = employees;

    //add click and keydown event handlers for search functionality
    $('.search-submit').click(() => FindEmployee());
    $('.search-input:input').keydown(() => FindEmployee());

    ///find employees who's names match search input
    ///not case sensitive, limits range of detailed card view
    ///to found employees only
    function FindEmployee() {

        //get the input from the search bar
        var search = $('.search-input:input').val().trim();

        //if search bar is cleared all employees will be displayed
        if (search == '') {
            showedEmp = employees;
            $('.card').show();
        } else {
            $('.card').hide();
            //find matching employees and display only their cards
            showedEmp = employees.filter(emp => emp.name.toLowerCase().includes(search));
            showedEmp.forEach((emp) => $(`#card${emp.id}`).show());
        }
        //display not found message if no employees match the search
        if (showedEmp.length == 0) {
            notFound.show();
        } else {
            notFound.hide();
        }
    }

    ///Show detailed card for selected employee.
    ///Range is limited to employees in showed array
    ///(those who matched the search)
    ///Next and Prev buttons will be disabled on corner cases respectively
    function ShowCard(id) {

        //setup variables for next and prev ids
        var next;
        var prev;

        for (let x = 0; x < showedEmp.length; x++) {
            if (showedEmp[x].id == id) {
                next = showedEmp[++x];
                prev = showedEmp[x - 2];
            }
        }

        //show the detailed card
        $('.modal-container').show();

        //change text to reflect selected employee's info
        $('.modal-img').attr('src', employees[id].pic_large)
        $('.modal-name').html(`${employees[id].name}`);
        $('.modal-text').eq(0).html(`${employees[id].email}`);
        $('.modal-text').eq(1).html(`${employees[id].city}`);
        $('.modal-text').eq(2).html(`${employees[id].phone}`);
        $('.modal-text').eq(3).html(`${employees[id].street}, ${employees[id].city}, ${employees[id].state}, ${employees[id].postcode}`);
        $('.modal-text').eq(4).html(`${employees[id].bday}`);

        //disable (gray out) buttons for corner cases and show next/prev employee in array 
        if (id == showedEmp[0].id) {
            $('.modal-prev').off('click').css('background', "rgba(255, 255, 255, 0.9)");
        } else
            $('.modal-prev').off('click').css('background', "rgba(0, 0, 0, 0.8)").on('click', () => ShowCard(prev.id));
        if (id == showedEmp[showedEmp.length - 1].id) {
            $('.modal-next').off('click').css('background', "rgba(255, 255, 255, 0.9)");
        } else
            $('.modal-next').off('click').css('background', "rgba(0, 0, 0, 0.8)").on('click', (e) => ShowCard(next.id));
    }

});