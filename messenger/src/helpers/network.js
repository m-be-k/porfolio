
/*
 "actor": "auth",
 "action": "login",
 "payload": {
                "username": username.value,
                "password": password.value
            }
    router.push('/chat');
 console.log('')
 */

// перенести через параметры. на регфор. чат .аурзформ.
export function sendRequest(actor, action, payload = {},onSuccess, onError) {
    fetch('http://localhost:4000/api', {
        method: 'POST',
        headers: {
            "Content-Type": "application/json"
        },
        credentials: "include",
        body: JSON.stringify({
            "actor": actor,
            "action": action,
            "payload": payload
        })
    })
        .then(response => response.json())
        .then(data => {
            if (data.status === 'success') {
                if (onSuccess) onSuccess(data.payload);
            } else {
                if (onError) onError(data.payload.message);
            }
        })
        .catch(error => {
            console.error('Network Error:', error);
            if (onError) onError('Ошибка соединения с сервером');
        });
}


// function run(callback){
//     callback();
// }
//
// /*
// let a = 123;
// console.log(a*5);
//
//
// let b = "texxt";
// console.log(b[1]);
//
//
// let c = [1,2,3,4];
// console.log(c.filter(x => x%2));
//
// alert("!!!!");
//  */
//
// run(()=>{
//     let a = 123;
//     console.log(a*5);
// });
//
// run(()=>{
//     let b = "texxt";
//     console.log(b[1]);
// });
//
// run(()=>{
//     let c = [1,2,3,4];
//     console.log(c.filter(x => x%2));
// });