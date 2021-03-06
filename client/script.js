let baseUrl = 'http://localhost:3000'
userFullName = ''
let userId = null

var title = null,
description = null,
publishedA =  null,
news_url = null



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
    fetchTag()
    fetchDataBerita()
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
    // ADD 
    var auth2 = gapi.auth2.getAuthInstance();
    auth2.signOut().then(function () {
        console.log('User signed out.');
    });
    beforeLogin()
})

function onSignIn(googleUser) {
    const token_id = googleUser.getAuthResponse().id_token;

    $.ajax({
        method: 'POST',
        url: 'http://localhost:3000/googlesignin',
        data: {token_id}
    })
        .done(result => {
            localStorage.setItem('access_token', result.access_token)
            afterLogin()
        })
        .fail(err => {
            console.log(err)
        })
}

// dapetin berita dari rekomendasi server
function fetchDataBerita () {
    console.log ('masuk')
    $.ajax({
        method: "GET",
        url: "http://localhost:3000" + '/news/headline',
        headers: {
            access_token: localStorage.access_token
        }
    }).done(result => {
        console.log(result)
        $('#dataBerita').empty()
        console.log ('masuik', result)
        $.each(result, function (i, e) { 
             $('#dataBerita').append(`
             <div class="card headline">
             <div class="card-header" id="pub-${i}">
               ${e.publishedAt}
             </div>
             <div class="card-body">
               <h4 class="card-title" id="judul-${i}">${e.title}</h4>
               <p class="card-text" id="des-${i}">${e.description}</p>
               <a target="_blank"  href="${e.news_url}" class="btn btn-primary" id="url-${i}">Baca Berita</a>
               <!-- <a href="#" onclick="saveBeritaForm(event, ${i})" class="btn btn-success" class="simpanBerita-${i}">Simpan
                            Berita</a> -->
                        <div class="input-group" id="tagInput-${i} tagInput">
                            <input type="text" class="form-control" placeholder="Tag" id="tagFromUser-${i}">
                            <div class="input-group-append">
                                <button class="btn btn-outline-secondary" type="button"
                                    onclick="saveBerita(event, ${i})">Simpan</button>
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

function searchBerita (event) {
    console.log ('masuk search luar')
    let judul = $("#cari-berita").val()
    console.log ('dari judul: ', judul)

    event.preventDefault()
    $.ajax({
        method: "POST",
        url: "http://localhost:3000" + '/news/search',
        headers: {
            access_token: localStorage.access_token
        },
        data: {
            query: judul
        }
    }).done(result => {
        console.log(result)
        $('#dataBerita').empty()
        $('.headline').hide()
        $.each(result, (i, e) => {
            console.log(e)
            // console.log (e)
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
            $("#box-saved-news").empty()
            $("#box-saved-news").append(`<h4 class="card-title saved-count">Saved News : ${Saved.length}</h4>`)
            $.each(Saved, (key, value) => {
                console.log(value.title)
                $("#box-saved-news").append(`
                <h5 class="card-text saved-header">-${value.title} <a>${value.tag}</a></h5>
                `)
            })
        })
        .fail(err => {
            console.log(`err saved news`, err)
        })
}

function getUserName() {
    console.log(`get full name function`)
    $("#user-name").empty()
    $("#user-name").append(`
        <div class="card-header" id="namaUser">Hello, ${(localStorage.username).split('@').slice(0,1)}</div>
        `)
}


function showRecomend(event) {
    event.preventDefault()

}

// Menampilkan Berita Collection
function showSavedBerita (event) {
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
              <span class="badge badge-primary">${e.tag}</span>
              <a target="_blank" href="${e.news_url}" class="btn btn-primary">Original Source</a>
              <div class="input-group-append">
                    <button class="btn btn-outline-secondary" type="button" onclick="deleteBerita(event, ${e.id})">Hapus</button>
                </div>
                <div class="input-group" id="tagInput-${i} tagInput">
                    <input type="text" class="form-control" placeholder="Tag" id="tagFromDatabase-${e.id}">
                    <div class="input-group-append">
                        <button class="btn btn-outline-secondary" type="button" onclick="changeTag(event, ${e.id})">Simpan</button>
                    </div>
                </div>
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
    console.log ('masuk save berita')
    var tag = $(`#tagFromUser-${id}`).val()
    var title = $(`#judul-${id}`).text()
    console.log (title, tag)
    if (tag) {
        $.ajax({
            type: "POST",
            url: "http://localhost:3000" + '/user/collection',
            headers: {
                access_token: localStorage.access_token
            },
            data: {
                // ini mengunakan data skeleton karena belum tahu
                title: $(`#judul-${id}`).text(),
                description: $(`#des-${id}`).text(),
                publishedAt: $(`#pub-${id}`).text(),
                news_url: $(`#url-${id}`).attr('href'),
                tag: tag,
            }
        }).done(result => {
            // setelah save 
            // $('#tagInput').hide();

            $(`#tagInput-${id}`).remove();
            // $('#tagInBerita').append(`
            //     ${result.tag}
            // `);
            console.log (result)
        }).fail(err => {
            console.log(err)
        })
    }
}

// Ini untuk hapus berita
function deleteBerita (event, id) {
    event.preventDefault()
    console.log (id)
    $.ajax({
        type: "DELETE",
        url: `http://localhost:3000/user/collection/id/${id}`,
        headers: {
            access_token: localStorage.access_token
        },
    }).done(result => {
        showSavedBerita(event)
    }).fail(err => {
        console.log (err)
    })
}

//change tag
function changeTag(event, id) {
    event.preventDefault()
    const tag = $(`#tagFromDatabase-${id}`).val()
    console.log (tag)
    if (tag) {
        $.ajax({
            type: "PATCH",
            url: `http://localhost:3000/user/collection/id/${id}`,
            headers: {
                access_token: localStorage.access_token
            },
            data: {
                tag: tag,
            }
        }).done(result => {
            showSavedBerita(event)
        }).fail(err => {
            console.log (err)
        })
    }
}

// Untuk menampilkan tag yang user punya
function fetchTag () {
    console.log ('masuk tag')
    $.ajax({
        method: "get",
        url: "http://localhost:3000" + '/news/tag',
        headers: {
            access_token: localStorage.access_token
        }
    }).done(result => {
        console.log ("berhasil", result)
        $.each(result, function (i, e) { 
             $('#saved-tag').append(`
             <div class="card-header">
             <a onclick="showSavedByTag(event, "${e.tag}")" href="#">${e.tag}</a>
            </div>
             `);
        });
    }) 
}

function showHeadline(event) {
    event.preventDefault();
    fetchDataBerita();
}