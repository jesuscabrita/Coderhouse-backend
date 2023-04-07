const socket = io();

///FUNCIONES DEL CHAT///

let user;
let chatBox = document.getElementById("chatBox");
let chatSubmit = document.getElementById("chatSumbit");

Swal.fire({
    title: "Ingresa un correo",
    input: "text",
    text: "Ingresa el usuario para comunicarte en el chat",
    inputValidator: (value) => {
        return !value && "Necesitas escribir un correo de usuario para continuar";
    },
    allowOutsideClick: false,
}).then((result) => {
    user = result.value;
    if (user) {
        Swal.fire({
            title: "Usuario conectado",
            text: `Bienvenido ${user}`,
            icon: "success",
            position: "top-end",
            toast: true,
            showConfirmButton: false,
            timer: 2000
        });
    }
});

chatBox.addEventListener("keypress", (event) => {
    if (event.key === "Enter") {
        sendMessage();
    }
});
    chatSubmit.addEventListener("click", sendMessage);

function sendMessage() {
    if (chatBox.value.trim().length > 0) {
        socket.emit("message", { user: user, message: chatBox.value });
        chatBox.value = "";
    }
}

socket.on("messageLogs", (data) => {
    let messages = "";
    data.forEach((message) => {
        console.log(message)
        let userMessage = `<div style="font-weight: 800; font-size: 22px">${message.user}</div>`
        let messageStyle = (message.user === user) ?
            "background-color: #3a573f; color: rgb(201, 190, 190); padding: 6px; border-radius: 8px; font-size: 18px; margin-bottom: 8px; display: flex; justify-content: end; width: 100%; display: flex; align-items: center;" :
            "background-color: #97ba9d; color: black; padding: 6px; border-radius: 8px; font-size: 18px; margin-bottom: 8px; display: flex; justify-content: start; width: 100%; display: flex; align-items: center;";
        messages += `<div style="${messageStyle}"> ${userMessage} : ${message.message} <button class="deleteButton" data-message-id="${message._id}"
        style="background: rgb(191, 93, 93);border: none; border-radius: 12px;font-size: 8px; cursor: pointer;"
        type="button">Eliminar</button></div>`;
    });

    messageLogs.innerHTML = messages;
});

socket.on("userConnected", (data) => {
    Swal.fire({
        title: "Usuario conectado",
        text: `${user} se ha conectado`,
        icon: "info",
        position: "top-start",
        toast: true,
        showConfirmButton: false,
        timer: 2000
    });
});

socket.on("userDisconnected", (data) => {
    Swal.fire({
        title: `Usuario ${user} desconectado`,
        text: `${user} se ha desconectado`,
        icon: "warning",
        position: "top-start",
        toast: true,
        showConfirmButton: false,
        timer: 2000
    });
});


///FUNCIONES DE LOS PRODUCTOS///


// socket.on('newProduct', (producto) => {
//     const listaProductos = document.getElementById('lista-productos');
//     listaProductos.innerHTML = ''
//     console.log('productonuevo', producto);

//     producto.forEach(element => {
//         const nuevoProductoHTML =  `
//     <div style="width: 380px;position: relative;box-shadow: 0 2px 7px #dfdfdf;margin: 10px auto;background: #fafafa;">
//         <div style="
//                 position: absolute;
//                 left: 0;
//                 top: 20px;
//                 text-transform: uppercase;
//                 font-size: 13px;
//                 font-weight: 700;
//                 background: red;
//                 color: #fff;
//                 padding: 3px 10px;">
//             Sale
//         </div>
//         <div style="display: flex;
//                 align-items: center;
//                 justify-content: center;
//                 height: 300px;
//                 background: #f0f0f0">
//             <img style="width: 100%;max-height: 100%;" src=${element.thumbnail} alt=${element.title}>
//         </div>
//         <div style="padding: 30px;">
//             <span style="
//                 display: block;
//                 font-size: 12px;
//                 font-weight: 700;
//                 text-transform: uppercase;
//                 color: #ccc;">
//                 ${element.category}
//             </span>
//             <h4><a href="">${element.title}</a></h4>
//             <p>${element.description}</p>
//             <div style="
//                 font-weight: 500;
//                 display: block;
//                 text-transform: uppercase;
//                 color: #363636;
//                 text-decoration: none;
//                 transition: 0.3s;">
//                 <div style=" font-size: 18px;color: #fbb72c;font-weight: 600;"><small>$${element.price}</small></div>
//                 <div>${element.code}</div>
//                 <div>Stock: ${element.stock}</div>
//             </div>
//         </div>
//     </div>
//     `;
//     listaProductos.insertAdjacentHTML('beforeend', nuevoProductoHTML);
//     });
// });

// socket.on('newProduct', (idProducto) => {
//     const listaProductos = document.getElementById('lista-productos');
//     const productos = listaProductos.children;

//     for (let i = 0; i < productos.length; i++) {
//     const producto = productos[i];

//     if (producto.getAttribute('data-id') == idProducto) {
//         producto.remove();
//         break;
//     }
//     }
// });

// socket.on('newProduct', (productoActualizado)=> {
//     const listaProductos = document.getElementById('lista-productos');
//     const productoAnterior = listaProductos.querySelector(`[data-id="${productoActualizado._id}"]`);
//     if (productoAnterior) {
//     productoAnterior.innerHTML = `
//     <div style="width: 380px;position: relative;box-shadow: 0 2px 7px #dfdfdf;margin: 10px auto;background: #fafafa;">
//         <div style="
//                 position: absolute;
//                 left: 0;
//                 top: 20px;
//                 text-transform: uppercase;
//                 font-size: 13px;
//                 font-weight: 700;
//                 background: red;
//                 color: #fff;
//                 padding: 3px 10px;">
//             Sale
//         </div>
//         <div style="display: flex;
//                 align-items: center;
//                 justify-content: center;
//                 height: 300px;
//                 background: #f0f0f0">
//             <img style="width: 100%;max-height: 100%;" src=${productoActualizado.thumbnail} alt="">
//         </div>
//         <div style="padding: 30px;">
//             <span style="
//                 display: block;
//                 font-size: 12px;
//                 font-weight: 700;
//                 text-transform: uppercase;
//                 color: #ccc;">
//                 ${productoActualizado.category}
//             </span>
//             <h4><a href="">${productoActualizado.title}</a></h4>
//             <p>${productoActualizado.description}</p>
//             <div style="
//                 font-weight: 500;
//                 display: block;
//                 text-transform: uppercase;
//                 color: #363636;
//                 text-decoration: none;
//                 transition: 0.3s;">
//                 <div style=" font-size: 18px;color: #fbb72c;font-weight: 600;"><small>$${productoActualizado.price}</small></div>
//                 <div>${productoActualizado.code}</div>
//                 <div>Stock: ${productoActualizado.stock}</div>
//             </div>
//         </div>
//     </div>
//     `;
//     }
// });
