let baseUrl = 'http://localhost:3000'
userFullName = ''

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
    $('.tagInput').hide();
    $(".afterLogin").show()
    $(".beforeLogin").hide()
    $(".firstPage").hide()
    $(".registerForm").hide()
    $(".loader").hide()
    $('#userSaved').hide();
    fetchDataBerita()
    fetchSavedBoX()
    $("#box-saved-news").show()

    getUserName()
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
    $(".firstPage").hide()
    $(".beforeLogin").hide()

}

//register client
function registerUser() {
    let fullname = $("#register-fullname").val()
    let email = $("#register-email").val()
    let password = $("#register-password").val()

    $.ajax({
        method: 'POST',
        url: `http://localhost:3000/register`,
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

    localStorage.setItem('username', email)
    // console.log(localStorage.username)

    $.ajax({
        method: 'POST',
        url: `http://localhost:3000/login`,
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
function fetchDataBerita() {
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
    }).fail(err => {
        console.log(err, "ERRor")
    }).always(() => {
        $("#title-for-user").text('Recomended For You:');
    })
}

// mencari berita dari inout search
function searchBerita(event) {
    console.log('masuk search luar')
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
    }).done(result => {
        console.log(result)
        $('#dataBerita').empty()
        $('.headline').hide()
        $.each(result, (i, e) => {
            console.log(e)
            $('#dataBerita').append(`
            <div class="card ">
            <img src="https://www.agfa.com/printing/wp-content/uploads/sites/19/2020/04/newspapers-stack-1to2-600x300.jpg">
            <div class="card-header">
              ${e.publishedAt}
            </div>
            <div class="card-body">
              <h4 class="card-title">${e.title}</h4>
              <p class="card-text">${e.description}</p>
              <a href="${e.news_url}" class="btn btn-dark">Baca Berita</a>

            </div>
            </div> 
            `);
        })
    }).fail(err => {
        console.log('masuk error search')
        console.log(err)
    }).always(() => {
        console.log('masuk always')
    })
}

//box heading title save berita kanan
function fetchSavedBoX() {
    console.log(`saved albar`)
    let Saved = []
    let dataTest = `test`
    $.ajax({
        method: 'GET',
        url: `http://localhost:3000/user/collection`,
        headers: {
            access_token: localStorage.access_token
        }
    })
        .done(res => {
            Saved = res
            $.each(Saved, (key, value) => {
                console.log(value.title)
                $("#box-saved-news").append(`
                <h4 class="card-title saved-count">Saved News : ${Saved.length}</h4>
                <h5 class="card-text saved-header">${value.title} <a>${value.tag}</a></h5>
                `)
            })
        })
        .fail(err => {
            console.log(`err saved news`, err)
        })
}

function getUserName() {
    console.log(`get full name function`)
    $("#user-name").append(`
        <div class="card-header" id="namaUser">Hello, ${(localStorage.username).split('@').slice(0,1)}</div>
        `)
}


// Menampilkan berita di sidebar kanan
// function fetchBeritaSaved() {
//     $.ajax({
//         method: "GET",
//         url: "http://localhost:3000" + '/user/collection',
//         headers: {
//             access_token: localStorage.access_token
//         }
//     }).done(result => {
//         $("#title-for-user").text('result:')
//         $('#saved-news').empty()
//         $.each(result, function (i, e) {
//             $('#saved-news').append(`
//              <div class="card headline">
//              <div class="card-header">
//                ${e.publishedAt}
//              </div>
//              <div class="card-body">
//                <h4 class="card-title"><a href="${e.news_url}">${e.title}</a></h4>
//                <span class="badge badge-dark">${e.folder}</span>
//              </div>
//              </div>
//              `)
//         })
//     }).fail(err => {
//         console.log(err)
//     })
// }

// Menampilkan semua berita ketika user melihat view all
function showSavedBerita(event) {
    event.preventDefault()
    $.ajax({
        method: "GET",
        url: "http://localhost:3000" + '/user/collection',
        headers: {
            access_token: localStorage.access_token
        }
    }).done(result => {
        $('#dataBerita').empty()
        // $('.headline').hide()
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
        console.log(err)
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
            console.log(err)
        })
    } else {
        $('#tagInput').hide();
        $("#simpanBerita").show();

    }
}