let baseUrl = 'http://localhost:3000'



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
    $('#userSaved').hide();
}

//show login page
function beforeLogin() {
    $(".afterLogin").hide()
    $(".beforeLogin").show()
    $(".firstPage").hide()
    $(".registerForm").hide()
    $('#userSaved').hide();
}

//show home-base
function afterLogin() {
    $('.tagInput').hide();
    $(".afterLogin").show()
    $(".beforeLogin").hide()
    $(".firstPage").hide()
    $(".registerForm").hide()
    $('#userSaved').hide();
    fetchDataBerita()
}

//show form register
function register() {
    $(".afterLogin").hide()
    $(".beforeLogin").hide()
    $(".firstPage").hide()
    $(".registerForm").show()
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
            // console.log(`register success`, res)
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
            // console.log(`login sucesss`, result)

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
        // $('#dataBerita').empty()
        // console.log ('masuik')
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
               <a href="#" onclick="saveBeritaForm(event, ${e.id})" class="btn btn-success" class="simpanBerita-${e.id}">Simpan
                            Berita</a>
                        <div class="input-group" class="tagInput-${e.id} tagInput">
                            <input type="text" class="form-control" placeholder="Tag" class="tagFromUser-${e.id}">
                            <div class="input-group-append">
                                <button class="btn btn-outline-secondary" type="button"
                                    onclick="saveBerita(event, ${e.id})">Simpan</button>
                            </div>
                        </div>
             </div>
             </div> 
             `);
        })
    }).fail( err => {
        console.log (err, "ERRor")
    }).always(()=> {
        $("#title-for-user").text('Recomended For You:');
    })
}

// mencari berita dari inout search
function searchBerita (event) {
    event.preventDefault()
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

// menampilkan add tag pada saat mau save berita

// console.log ("masuk")
function saveBeritaForm(event, id) {
    event.preventDefault()
    $(`.tagInput-${id}`).show();
    $(`.simpanBerita-${id}`).hide();
}

// Ini untuk save berita -- tinggal sesuaiin dengan server
function saveBerita(event, id) {
    event.preventDefault()
    var tag = $(`.tagFromUser${id}`).val();
    if (tag) {
        $.ajax({
            type: "POST",
            url: "http://localhost:3000" + '/user/collection',
            headers: {
                access_token: localStorage.access_token
            },
            data: {
                // ini mengunakan data skeleton karena belum tahu 
                tag: tag,
                id: id
            }
        }).done(result => {
            // setelah save 
            $('#tagInput').hide();
            $("#simpanBerita").hide();
            $('#tagInBerita').append(`
            ${result.tag}
            `);
        }).fail(err => {
            console.log (err)
        })
    } else {
        $('#tagInput').hide();
        $("#simpanBerita").show();

    }
}