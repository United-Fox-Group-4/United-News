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
}

function beforeLogin() {
    $(".afterLogin").hide()
    $(".beforeLogin").show()
    $(".firstPage").hide()
    $(".registerForm").hide()
}

function afterLogin() {
    $(".afterLogin").show()
    $(".beforeLogin").hide()
    $(".firstPage").hide()
    $(".registerForm").hide()
}

function register() {
    $(".afterLogin").hide()
    $(".beforeLogin").hide()
    $(".firstPage").hide()
    $(".registerForm").show()
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