const catalogo = document.getElementById("catalogo");

fetch("productos.json")
    .then(respuesta => respuesta.json())
    .then(categorias => {
        inicializarCatalogo(categorias);
    })
    .catch(error => console.error("Error cargando los productos:", error));
function inicializarCatalogo(categorias) {
    for (const [categoria, productos] of Object.entries(categorias)) {
        const details = document.createElement("details");
        const summary = document.createElement("summary");
        summary.textContent = categoria;
        details.appendChild(summary);
        productos.forEach(producto => {
            const div = document.createElement("div");
            div.className = "producto";
            div.innerHTML = `
                <label>
                    ${producto}
                    <input
                        type="number"
                        min="0"
                        value="0"
                        data-producto="${producto}"
                        data-categoria="${categoria}"
                    >
                </label>
            `;
            details.appendChild(div);
        });

        catalogo.appendChild(details);
    }
}

document.getElementById("generar").addEventListener("click", () => {
    const pedido = {};

    document.querySelectorAll("input[type='number']").forEach(input => {
        const cantidad = parseInt(input.value, 10);

        if (cantidad > 0) {
            const categoria = input.dataset.categoria;
            const producto = input.dataset.producto;

            if (!pedido[categoria]) {
                pedido[categoria] = [];
            }

            pedido[categoria].push({
                nombre: producto,
                cantidad: cantidad
            });
        }
    });

    if (Object.keys(pedido).length === 0) {
        alert("Selecciona al menos un producto.");
        return;
    }

    dibujarPedido(pedido);
});

function dibujarPedido(pedido){
    const canvas = document.getElementById("pedidoCanvas");
    const ctx = canvas.getContext("2d");
    let altoNecesario = 140;
    //let totalArticulos = 0;
    
    for (const categoria in pedido) {
        altoNecesario += 40;
        pedido[categoria].forEach(() => {
            altoNecesario += 30;
        });
        altoNecesario += 20;
    }
    altoNecesario += 80;
    canvas.width = 600; 
    canvas.height = altoNecesario;

    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "#1f2937";
    ctx.fillRect(0, 0, canvas.width, 70);

    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 28px Arial";
    ctx.textAlign = "center";
    ctx.fillText("PEDIDO SEMANAL", canvas.width / 2, 42);

    ctx.fillStyle = "#555";
    ctx.font = "16px Arial";
    ctx.fillText(new Date().toLocaleDateString(), canvas.width / 2, 95);

    let y = 140;
    let total = 0;

    for(const categoria in pedido){
        ctx.fillStyle = "#2563eb";
        ctx.fillRect(20, y - 25, 560, 35);

        ctx.fillStyle = "#fff";
        ctx.font = "bold 18px Arial";
        ctx.textAlign = "left";
        ctx.fillText(categoria.toUpperCase(), 30, y);

        y += 40;
        
        pedido[categoria].forEach(producto => {
            ctx.fillStyle = "#000";
            ctx.font = "16px Arial";
            ctx.textAlign = "left";
            ctx.fillText(producto.nombre, 30, y);
            
            ctx.beginPath();
            ctx.setLineDash([4, 4]);
            ctx.moveTo(220, y - 5); 
            ctx.lineTo(480, y - 5);
            ctx.strokeStyle = "#888"; 
            ctx.stroke();
            ctx.setLineDash([]);
            
            ctx.textAlign = "right";
            ctx.fillText(producto.cantidad.toString(), 560, y);

            total += producto.cantidad;
            y += 30;
        });

        y += 20;
    }

    ctx.strokeStyle = "#ccc";
    ctx.beginPath();
    ctx.moveTo(20, y);
    ctx.lineTo(580, y);
    ctx.stroke();

    y += 40;

    ctx.fillStyle = "#000";
    ctx.font = "bold 18px Arial";
    ctx.textAlign = "left";
    ctx.fillText(`Total de artículos: ${total}`, 30, y);

    const enlace = document.createElement("a");
    enlace.download = "pedido.png";
    enlace.href = canvas.toDataURL("image/png");
    enlace.click();
}
