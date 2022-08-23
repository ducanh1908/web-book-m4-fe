
const API_URL ='http://localhost:3000';
let token = JSON.parse(localStorage.getItem('accessToken'));
let totalAuthor = 0;
let datas;
let page = 1,
    records = 100,
    totalCount = 0,
    search = '';

// if (!token) {
//     location.href = 'login.html'
// } else {
$(document).ready(function() {
    getBookList();
})

        // })


const Story = document.querySelector('#books');

function  getBookList() {
    $.ajax ({
        type :'GET',
        // headers: {
        //     'Authorization':'Bearer ' + token.token
        // },
        url:`${API_URL}/books`,
        success : function(data) {
                datas = data;
            totalAuthor = data.length;

            // Run on page load
            fetchData(records);

            $(document).on('click', '.page-item-numbers a', function() {
                page = parseInt($(this)[0].text);
                fetchData();
            });

            // Previous Page
            $('[aria-label="Previous"]').click(function() {
                if (page > 1) {
                    page--;
                }
                fetchData(records);
            });

            // Next page
            $('[aria-label="Next"]').click(function() {
                if (page * records < totalCount) {
                    page++;
                }
                fetchData(records);
            });
            // data fetching from API

        }

    })
}

function renderPagination() {
    $('.page-item-numbers').remove();
    let pagesNumbers = Math.ceil(totalCount / records);
    for (let i = 1; i <= pagesNumbers; i++) {
        $(`.pagination > li:nth-child(${i})`).after(`<li class="page-item page-item-numbers ${i == page ? 'active': ''}" ><a class="page-link" href="#">${i}</a></li>`);
    }
}

function fetchData() {
    totalCount = totalAuthor;
    Story.innerHTML = '';
    datas.slice((page - 1) * records, page * records).map((data) => {
        Story.innerHTML +=
            `<tr>
                                                   
                                                        <td class="">
                                                            <img src=${data.image} alt="table-user" width="100px" height="150px"  ">
                                                        </td>
                                                        <td>${data.name}</td>
                                                        <td>
                                                            ${data.author.name}

                                                        </td>
                                                        <td>
                                                            ${data.reprint}
                                                        </td>
                                                        <td>
                                                           ${data.price}
                                                        </td>
                                                        <td>
                                                            ${data.gerne.name}
                                                        </td>
                                                        <td>
                                                            ${data.publisher.name}
                                                        </td>
                                                        <td>
                                                            ${data.description}
                                                        </td>

                                                        <td>
                                                            <a href="javascript:void(0);" class="action-icon"> <i class="mdi mdi-square-edit-outline"></i></a>
                                                            <a href="javascript:void(0);" class="action-icon" onclick="showConfirmDelete('${data._id}')"> <i class="mdi mdi-delete"></i></a>
                                                        </td>
                                                    </tr>`
    })
    renderPagination();
}






function showConfirmDelete(id){
   
    Swal.fire({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
        if (result.isConfirmed) {
            deleteBook(id);
        }
    })
}

function deleteBook(id){
    $.ajax({
        type: 'DELETE',
        // headers: {
        //     'Authorization':'Bearer ' + token.token
        // },
        url:`${API_URL}/books/${id}`,
        success: function(){
            Swal.fire(
                'Deleted!',
                'Your file has been deleted.',
                'success'
            )
            $(`#${id}`).remove();
        }
    })
}
function resetForm() {
    $('#name').val('');
    $('#price').val('');
    $('#authorList').val('');
    $('#reprint').val('');
    $('#publisherList').val('');
    $('#description').val('');
    $('#gerneList').val('')
    $('#image').val('')
}

function createBook() {
    let name = $('#name').val();
    let price = $('#price').val();
    let authorId = $('#authorList').val();
    let reprint = $('#reprint').val();
    let publisherId = $('#publisherList').val();
    let description = $('#description').val();
    let gerneId = $('#gerneList').val()
    
    const firebaseConfig = {
        apiKey: "AIzaSyBz6nRBLoqrZw5YtBHovGnKbPB29H7KgcU",
        authDomain: "yoongee.firebaseapp.com",
        projectId: "yoongee",
        storageBucket: "yoongee.appspot.com",
        messagingSenderId: "232240558056",
        appId: "1:232240558056:web:414ee09a0c3a80d3e53e5d",
        measurementId: "G-WWF2HKWXK1"
    };

    // Initialize Firebase
    firebase.initializeApp(firebaseConfig);

    const ref = firebase.storage().ref();
    const file = document.querySelector("#image").files[0];
    const nameImage = +new Date() + "-" + file.name;
    const metadata = {
        contentType: file.type
    };
    const task = ref.child(nameImage).put(file, metadata);
    task
        .then(snapshot => snapshot.ref.getDownloadURL())
        .then(url => {

            let book = {
                name: name,
                price: price,
                author:authorId,
                image: url,
                description: description,
                reprint: reprint,
                publisher:publisherId,
                gerne:gerneId
            };
            
            $.ajax({
                type: 'POST',
                url:`${API_URL}/books`,
                headers: {
                    'Content-Type':'application/json'
                    // ,'Authorization':'Bearer ' + token.token
                },
                data: JSON.stringify(book),
                success: function(data) {
                    resetForm();
                    fetchData();
                }
            })
        })
        .catch(console.error);
}
function showCreateForm() {
    resetForm()
    drawGerneSelectOption()
    drawAuthorSelectOption()
    drawPublisherSelectOption()
    let html = ` <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
    <button type="button" class="btn btn-primary" onclick="createBook()">Create Book</button>`
    $('#title').html('Create Book');
    $('#footer').html(html)
}
function drawGerneSelectOption() {
    $.ajax({
        type: 'GET', url: `${API_URL}/gernes`, success: function (data)
        {
           
            let html = '<option>Select gerne</option>' ;
            for (let gerne of data) {
                html += `<option value="${gerne._id}">${gerne.name}</option>`
            }
            $('#gerneList').html(html);
        }

    })
}function drawPublisherSelectOption() {
    $.ajax({
        type: 'GET', url: `${API_URL}/publishers`, success: function (data)
        {
          
            let html = '<option>Select gerne</option>' ;
            for (let publishers of data) {
                html += `<option value="${publishers._id}">${publishers.name}</option>`
            }
            $('#publisherList').html(html);
           
        }

    })
}
function drawAuthorSelectOption() {
    $.ajax({
        type: 'GET', url: `${API_URL}/authors`, success: function (data)
        {
          
            let html = '<option>Select Author</option>' ;
            for (let author of data) {
                html += `<option value="${author._id}">${author.name}</option>`
            }
            $('#authorList').html(html);
        }

    })
}

function showUpdateForm(id){
    let html = `<button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
    <button type="button" onclick="updateBook('${id}')" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#exampleModal">Update Author</button>`
    $('#title').html('Update Author');
    $('#footer').html(html);
    getBook(id);
}

function getBook(id){
    $.ajax({
        type:"GET",
        url:  `${API_URL}/books/${id}`,
        success : function(data){
            $('#name').val(data.name);
            $('#price').val(data.price);
             $('#author').val(data.author);
             $('#reprint').val(data.reprint);
             $('#publisher').val(data.publisher);
             $('#description').val(data.description);
            $('#gerne').val(data.gerne);

        }
    })
};

function updateBook(id) {
    let name = $('#name').val();
    let price = $('#price').val();
    let author = $('#author').val();
    let reprint = $('#reprint').val();
    let publisher = $('#publisher').val();
    let description = $('#description').val();
    let gerneId = $('#gerne').val();
    const firebaseConfig = {
        apiKey: "AIzaSyBz6nRBLoqrZw5YtBHovGnKbPB29H7KgcU",
        authDomain: "yoongee.firebaseapp.com",
        projectId: "yoongee",
        storageBucket: "yoongee.appspot.com",
        messagingSenderId: "232240558056",
        appId: "1:232240558056:web:414ee09a0c3a80d3e53e5d",
        measurementId: "G-WWF2HKWXK1"
    };

    // Initialize Firebase
    firebase.initializeApp(firebaseConfig);
    
    const ref = firebase.storage().ref();
    const file = document.querySelector("#image").files[0];
    const nameImage = +new Date() + "-" + file.name;
    const metadata = {
        contentType: file.type
    };
    const task = ref.child(nameImage).put(file, metadata);
    task
        .then(snapshot => snapshot.ref.getDownloadURL())
        .then(url => {

            let book = {
                name: name,
                price: price,
                author: author,
                image: url,
                description: description,
                reprint: reprint,
                publisher:publisher,
                gerne: {
                    _id: gerneId
                }
            };

            $.ajax({
                type: 'PUT',
                headers: {
                    'Content-Type':'application/json'
                },
                url:`${API_URL}/books/${id}`,
                data : JSON.stringify(book),
                success: function(data) {

                    let  html = `<tr>
                                                   
                                                        <td class="table-user">
                                                            <img src="${data.image}" alt="table-user" class="mr-2 rounded-circle">
                                                        </td>
                                                        <td>${data.name}</td>
                                                        <td>
                                                            ${data.author}
                                                        </td>
                                                        <td>
                                                            ${data.reprint}
                                                        </td>
                                                        <td>
                                                           ${data.price}
                                                        </td>
                                                        <td>
                                                            ${data.gerne}
                                                        </td>
                                                        <td>
                                                            ${data.publisher}
                                                        </td>
                                                        <td>
                                                            ${data.description}
                                                        </td>

                                                        <td>
                                                            <a href="javascript:void(0);" class="action-icon"> <i class="mdi mdi-square-edit-outline"></i></a>
                                                            <a href="javascript:void(0);" class="action-icon" onclick="showConfirmDelete()"> <i class="mdi mdi-delete"></i></a>
                                                        </td>
                                                    </tr>`;
                    $(`#${id}`).replaceWith(html);
                }
            })
        })
}


