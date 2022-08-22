
const API_URL ='http://localhost:3000';
let token = JSON.parse(localStorage.getItem('accessToken'));
let totalAuthor = 0;
let datas;
let page = 1,
records = 5,
totalCount = 0,
search = '';

if (!token) {
    location.href = 'auth-login-2.html'
} else {
    $(document).ready(function() {
        getAuthorList();
        })
        
}
const Story = document.querySelector('#authors');

function  getAuthorList() {
    $.ajax ({
        type :'GET',
        headers: {
            'Authorization':'Bearer ' + token.token
        },
        url:`${API_URL}/authors`,
        success : function(data) {
            datas = data;
            totalAuthor = data.length;
                    
                    // Run on page load
                    fetchData();

                    $(document).on('click', '.page-item-numbers a', function() {
                        page = parseInt($(this)[0].text);
                        fetchData();
                    });

                    // Previous Page
                    $('[aria-label="Previous"]').click(function() {
                        if (page > 1) {
                        page--;
                        }
                        fetchData();
                    });

                    // Next page 
                    $('[aria-label="Next"]').click(function() {
                        if (page * records < totalCount) {
                        page++;
                        }
                        fetchData();
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
`
    <tr id="${data._id}">
    
    <td class="table-user">
    <img src="${data.image}" alt="table-user" class="mr-2 rounded-circle">
    <a href="javascript:void(0);" class="text-body font-weight-semibold">${data.name}</a>
    </td>
    <td>${data.yearOfBirth}</td>
    <td>${data.worksAmount}</td>
    <td>${data.nationality}</td>
    <td> <a href="${data.linkWiki}">${data.linkWiki}</a></td>
    <td>
    <a href="javascript:void(0);" onclick="showUpdateForm('${data._id}')" class="action-icon"> <i class="mdi mdi-square-edit-outline"></i></a>
    <a onclick="showConfirmDelete('${data._id}')" class="action-icon"> <i class="mdi mdi-delete"></i> </a>
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
         deleteAuthor(id);
        }
      })
}

function deleteAuthor(id){
    $.ajax({
        type: 'DELETE',
        headers: {
            'Authorization':'Bearer ' + token.token
        },
        url:`${API_URL}/authors/${id}`,
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
    $('#yearOfBirth').val('');
    $('#worksAmount').val('');
    $('#nationality').val('');
    $('#linkWiki').val('');
    $('#image').val('');
    
}

function createAuthor() {
    let name = $('#name').val();
    let yearOfBirth = $('#yearOfBirth').val();
    let worksAmount = $('#worksAmount').val();
    let nationality = $('#nationality').val();
    let linkWiki = $('#linkWiki').val();
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
        console.log(firebase);
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
            let author = {
                name : name,
                yearOfBirth: yearOfBirth,
                worksAmount: worksAmount,
                nationality: nationality,
                linkWiki: linkWiki,
                image: url
            }
          
          $.ajax({
            type: 'POST',
            url:`${API_URL}/authors`,
            headers: {
                'Content-Type':'application/json',
                'Authorization':'Bearer ' + token.token
            },
            data: JSON.stringify(author),
            success: function(data) {
                totalAuthor++;
            let  html = `
            <tr id="${data._id}">
            <td class="table-user">
            <img src="${data.image}" alt="table-user" class="mr-2 rounded-circle">
            <a href="javascript:void(0);" class="text-body font-weight-semibold">${data.name}</a>
            </td>
            <td>${data.yearOfBirth}</td>
            <td>${data.worksAmount}</td>
            <td>${data.nationality}</td>
            <td>${data.linkWiki}</td>
            <td>
            <a href="javascript:void(0);" onclick="showUpdateForm('${data._id}')" class="action-icon"> <i class="mdi mdi-square-edit-outline"></i></a>
            <a onclick="showConfirmDelete('${data._id}')" class="action-icon"> <i class="mdi mdi-delete"></i> </a>
            </td>
            </tr>`
                $('#authors').append(html);
                resetForm();
                getAuthorList();    
            }
        })
    })
        .catch(console.error);
}
function showFormCreate() {
    let html = ` <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
    <button type="button" class="btn btn-primary" onclick="createAuthor()">Create Author</button>`
    $('#title').html('Create Author');
    $('#footer').html(html)
}

function showUpdateForm(id){
    let html = `<button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
    <button type="button" onclick="updateAuthor('${id}')" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#exampleModal">Update Author</button>`
    $('#title').html('Update Author');
    $('#footer').html(html);
    getAuthor(id);
}

function getAuthor(id){
    $.ajax({
        type:"GET",
        url:  `${API_URL}/authors/${id}`,
        success : function(data){
            $('#name').val(data.name);
            $('#yearOfBirth').val(data.yearOfBirth);
            $('#worksAmount').val(data.worksAmount);
            $('#nationality').val(data.nationality);
            $('#linkWiki').val(data.linkWiki);
            // $('#image').val(data.image);
            console.log(data.image);
        }
    })
};

function updateAuthor(id) {
    let name = $('#name').val();
    let yearOfBirth = $('#yearOfBirth').val();
    let worksAmount = $('#worksAmount').val();
    let nationality = $('#nationality').val();
    let linkWiki = $('#linkWiki').val();

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
        console.log(firebase);
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
            console.log('url',url);

            let author = {
                name : name,
                yearOfBirth: yearOfBirth,
                worksAmount: worksAmount,
                nationality: nationality,
                linkWiki: linkWiki,
                image: url
            }

            $.ajax({
                type: 'PUT',
                headers: {
                    'Content-Type':'application/json'
                },
                url:`${API_URL}/authors/${id}`,
                data : JSON.stringify(author),
                success: function(data) {

                    let  html = `<tr id="${data._id}">
                            <td>${totalAuthor}</td>
                            <td>${data.name}</td>
                            <td>${data.yearOfBirth}</td>
                            <td>${data.worksAmount}</td>
                            <td>${data.nationality}</td>
                            <td>${data.linkWiki}</td>
                            <td><img src="${data.image}" width="50px" height="60px";alt=""></td>
                            <td><button class="btn btn-danger" onclick="ShowConfirmDelete('${data._id}')">Delete</button>
                            <button class="btn btn-primary" onclick="showUpdateForm('${data._id}')">Update</button></td>
                            <td>`;
                            $(`#${id}`).replaceWith(html);
                }
        })
    })
}

