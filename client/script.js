var serverUrl = 'http://localhost:3000'
var userName = null

$(document).ready(function () {
    console.log("masuk!");
    //cek token
    if (localStorage.access_token) {
        afterLogin()
    } else {
        firstPage()
    }
});

function firstPage() {
    $(".afterLogin").hide()
    $(".beforeLogin").hide()
    $(".firstPage").show()
    $(".registerForm").hide()
    $('#userSaved').hide();
}

function beforeLogin() {
    $(".afterLogin").hide()
    $(".beforeLogin").show()
    $(".firstPage").hide()
    $(".registerForm").hide()
    $('#userSaved').hide();
}

function afterLogin() {
    $(".afterLogin").show()
    $(".beforeLogin").hide()
    $(".firstPage").hide()
    $(".registerForm").hide()
    $('#userSaved').hide();
    fetchDataBerita()
}

function register() {
    $(".afterLogin").hide()
    $(".beforeLogin").hide()
    $(".firstPage").hide()
    $(".registerForm").show()
    $('#userSaved').hide()
}

// sign in app local
function loginApp(event) {
    event.preventDefault()
    let email = $("#email").val()
    let password = $("#password").val()
    console.log(email, password)

    $.ajax({
        method: 'POST',
        url: `${baseUrl}/login`,
        data: { email, password }
    })
        .done((result) => {
            console.log(`login sucesss`, result)
            // cara1
            // localStorage.access_token = res.access_token
            // cara2
            localStorage.setItem('access_token', result.access_token)
            afterLogin()
        })
        .fail((err) => {
            console.log(`Cant Login!`, err)
        })
        .always(function () {
            console.log(`compleate!`)
        })
}

$("#logout").click(() => {
    localStorage.removeItem(`access_token`)
    $("#email").val('')
    $("#password").val('')
    beforeLogin()
})

// function onSignIn(googleUser) {
//     var google_access_token = googleUser.getAuthResponse().id_token;
//     console.log(google_access_token)

//     $.ajax({
//         method: 'POST',
//         url: 'http://localhost:3000/googleLogin',
//         headers: {
//             google_access_token
//         }
//     })
//         .done(result => {
//             localStorage.setItem('access_token', result.access_token)
//             afterLogin()
//         })
//         .fail(err => {
//             console.log(err)
//         })
// }

// function signOut() {
//     var auth2 = gapi.auth2.getAuthInstance();
//     auth2.signOut().then(function () {
//         console.log('User signed out.');
//     });
// }

// dapetin berita dari rekomendasi server
function fetchDataBerita () {
    $.ajax({
        method: "GET",
        url: "http://localhost:3000" + '/news/headline',
        headers: {
            access_token: localStorage.access_token
        }
    }).done(result => {
        $.each(result, function (i, e) { 
             $('#dataBerita').append(`
             <div class="card headline">
             <div class="card-header">
               ${e.publishedAt}
             </div>
             <div class="card-body">
               <h4 class="card-title">${e.title}</h4>
               <p class="card-text">${e.description}</p>
               <a href="${e.news_url}" class="btn btn-primary">Baca Berita</a>
             </div>
             </div> 
             `);
        })
    }).fail( err => {
        console.log (err)
    }).always(()=> {
        $("#title-for-user").text('Recomended For You:');
    })
}

// mencari berita dari inout search
function searchBerita (event) {
    $.ajax({
        method: "GET",
        url: "http://localhost:3000" + '/news/search',
        headers: {
            access_token: localStorage.access_token
        },
        data: {
            query: $("#judul-berita").val()
        }
    }).done( result => {
        $('#dataBerita').empty()
        $('.headline').hide()
        $.each(result, (i, e) => {
            $('#dataBerita').append(`
            <div class="card ">
            <div class="card-header">
              ${e.publishedAt}
            </div>
            <div class="card-body">
              <h4 class="card-title">${e.title}</h4>
              <p class="card-text">${e.description}</p>
              <a href="${e.news_url}" class="btn btn-primary">Baca Berita</a>
            </div>
            </div> 
            `);
       })
    }).fail(err => {
        console.log (err)
    })
}

// Menampilkan berita di sidebar kanan
function fetchBeritaSaved () {
    $.ajax({
        method: "GET",
        url: "http://localhost:3000" + '/user/collection',
        headers: {
            access_token: localStorage.access_token
        }
    }).done(result => {
        $("#title-for-user").text('result:')
        $('#saved-news').empty()
        $.each(result, function (i, e) { 
             $('#saved-news').append(`
             <div class="card headline">
             <div class="card-header">
               ${e.publishedAt}
             </div>
             <div class="card-body">
               <h4 class="card-title"><a href="${e.news_url}">${e.title}</a></h4>
               <span class="badge badge-primary">${e.folder}</span>
             </div>
             </div>
             `);
        })
    }).fail( err=> {
        console.log (err)
    })
}

// Menampilkan semua berita ketika user melihat view all
function showSavedBerita (event) {
    event.preventDefault()
    $.ajax({
        method: "GET",
        url: "http://localhost:3000" + '/user/collection',
        headers: {
            access_token: localStorage.access_token
        }
    }).done( result => {
        $('#dataBerita').empty()
        $('.headline').hide()
        $.each(result, (i, e) => {
            $('#dataBerita').append(`
            <div class="card ">
            <div class="card-header">
              ${e.publishedAt}
            </div>
            <div class="card-body">
              <h4 class="card-title">${e.title}</h4>
              <p class="card-text">${e.description}</p>
              <span class="badge badge-primary">${e.folder}</span>
              <a href="${e.news_url}" class="btn btn-primary">Baca Berita</a>
            </div>
            </div>
            `);
       })
    }).fail(err => {
        console.log (err)
    })
}