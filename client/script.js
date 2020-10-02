baseUrl = 'http://localhost:3000'

$(document).ready(function () {
    console.log("masuk!");
    //cek token
    if (localStorage.access_token) {
        afterLogin()
    } else {
        firstPage()
    }
});

//show base-banner-page
function firstPage() {
    $(".afterLogin").hide()
    $(".beforeLogin").hide()
    $(".firstPage").show()
    $(".registerForm").hide()
    $(".loader").hide()
    $('#userSaved').hide();
}

//show login page
function beforeLogin() {
    $(".afterLogin").hide()
    $(".beforeLogin").show()
    $(".firstPage").hide()
    $(".registerForm").hide()
    $(".loader").hide()
    $('#userSaved').hide();
}

//show home-base
function afterLogin() {
    $(".afterLogin").show()
    $(".beforeLogin").hide()
    $(".firstPage").hide()
    $(".registerForm").hide()
    $(".loader").hide()
    $('#userSaved').hide();
    fetchDataBerita()
}

//show form register
function register() {
    $(".afterLogin").hide()
    $(".beforeLogin").hide()
    $(".firstPage").hide()
    $(".registerForm").show()
    $(".loader").hide()
}

//home after user login
function home() {
    $(".afterLogin").show()
    $(".beforeLogin").hide()
    $(".firstPage").hide()
    $(".registerForm").hide()
    $(".loader").hide()
}
//loader animate
function loader() {
    $(".afterLogin").hide()
    $(".beforeLogin").hide()
    $(".firstPage").hide()
    $(".registerForm").hide()
    $(".loader").show()
}

function onChangeLeaveEndDate() {
    console.log(`test functiom`)
    $(".loader").show()
    setTimeout(function () {
        $(".loader").hide()
        beforeLogin()
    }, 3000);

}

function transition() {
    console.log(`masuuk`)
    onChangeLeaveEndDate()
    $('#userSaved').hide()
}

//register client
function registerUser(event) {
    event.preventDefault()
    let fullname = $("#register-fullname").val()
    let email = $("#register-email").val()
    let password = $("#register-password").val()

    $.ajax({
        method: 'POST',
        url: `http://localhost:3000/user/register`,
        data: {
            fullname,
            email,
            password
        }
    })
        .done(res => {
            console.log(`register success`, res)
            //test regis
            beforeLogin()
        })
        .fail(err => {
            console.log(`register error`, err)
            console.log(fullname, email, password)
        })
}

// sign in app local
function loginApp(event) {
    event.preventDefault()
    let email = $("#email").val()
    let password = $("#password").val()
    console.log(email, password)

    $.ajax({
        method: 'POST',
        url: `http://localhost:3000/user/login`,
        data: { email, password }
    })
        .done((result) => {
            console.log(`login sucesss`, result)

            localStorage.setItem('access_token', result.access_token)
            afterLogin()
        })
        .fail((err) => {
            console.log(`Cant Login!`, err)

        })
}

$("#logout").click(() => {
    localStorage.removeItem(`access_token`)
    $("#email").val('')
    $("#password").val('')
    beforeLogin()
})

// function onSignIn(googleUser) {
//     const token_id = googleUser.getAuthResponse().id_token;

//     $.ajax({
//         method: 'POST',
//         url: 'http://localhost:3000/googlesignin',
//         data: {token_id}
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