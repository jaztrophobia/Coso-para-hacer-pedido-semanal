const categorias = {

    Higiene: [
        "Papel Higiénico",
        "Jabón de Manos",
        "Cloro"
    ],

    Bebidas: [
        "Coca Cola",
        "Agua"
    ],

    Abarrotes: [
        "Arroz",
        "Frijol",
        "Azúcar"
    ]
};

const catalogo = document.getElementById("catalogo");

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

document.getElementById("generar")
.addEventListener("click", generarPedido);

function generarPedido(){

    const inputs = document.querySelectorAll(
        "input[type='number']"
    );

    const pedido = {};

    inputs.forEach(input => {

        const cantidad = Number(input.value);

        if(cantidad > 0){

            const categoria =
                input.dataset.categoria;

            if(!pedido[categoria]){
                pedido[categoria] = [];
            }

            pedido[categoria].push({
                nombre: input.dataset.producto,
                cantidad
            });
        }
    });

    dibujarPedido(pedido);
}

function dibujarPedido(pedido){

    const canvas =
        document.getElementById("pedidoCanvas");

    const ctx =
        canvas.getContext("2d");

    ctx.fillStyle = "#ffffff";
    ctx.fillRect(
        0,
        0,
        canvas.width,
        canvas.height
    );

    ctx.fillStyle = "#1f2937";
    ctx.fillRect(
        0,
        0,
        canvas.width,
        70
    );

    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 28px Arial";
    ctx.textAlign = "center";

    ctx.fillText(
        "PEDIDO SEMANAL",
        canvas.width / 2,
        42
    );

    ctx.fillStyle = "#555";
    ctx.font = "22px Arial";

    ctx.fillText(
        new Date().toLocaleDateString(),
        canvas.width / 2,
        95
    );

    let y = 140;

    let total = 0;

    for(const categoria in pedido){

        ctx.fillStyle = "#2563eb";

        ctx.fillRect(
            20,
            y - 25,
            560,
            35
        );

        ctx.fillStyle = "#fff";
        ctx.font = "bold 18px Arial";
        ctx.textAlign = "left";

        ctx.fillText(
            categoria.toUpperCase(),
            30,
            y
        );

        y += 40;

        ctx.fillStyle = "#000";
        ctx.font = "16px Arial";

        pedido[categoria].forEach(producto => {

            ctx.fillText(
                producto.nombre,
                30,
                y
            );

            ctx.fillText( `${
                producto.cantidad} pzs`,
                500,
                y
            );

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

    ctx.font = "bold 18px Arial";

    ctx.fillText(
        `Total de artículos: ${total}`,
        30,
        y
    );

    const enlace =
        document.createElement("a");

    enlace.download = "pedido.png";
    enlace.href =
        canvas.toDataURL("image/png");

    enlace.click();
}