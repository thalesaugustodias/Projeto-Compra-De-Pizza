let cart = [];
let modalQt = 1;
let modalKey = 0;

const q = (el) => document.querySelector(el);
const ql = (el) => document.querySelectorAll(el);

pizzaJson.map((item, index) => {
    let pizzaItem = q('.models .pizza-item').cloneNode(true);

    //Preenchendo informações em pizza-item

    pizzaItem.setAttribute('data-key', index);
    pizzaItem.querySelector('.pizza-item--img img').src = item.img;
    pizzaItem.querySelector('.pizza-item--name').innerHTML = item.name;
    pizzaItem.querySelector('.pizza-item--price').innerHTML = `R$ ${item.price.toFixed(2)}`;
    pizzaItem.querySelector('.pizza-item--desc').innerHTML = item.description;
    pizzaItem.querySelector('a').addEventListener('click', (e) => {
        e.preventDefault();
        let key = e.target.closest('.pizza-item').getAttribute('data-key');
        modalQt = 1;

        q('.pizzaBig img').src = pizzaJson[key].img;
        q('.pizzaInfo h1').innerHTML = pizzaJson[key].name;
        q('.pizzaInfo--desc').innerHTML = pizzaJson[key].description;
        q('.pizzaInfo--actualPrice').innerHTML = `R$ ${pizzaJson[key].price.toFixed(2)}`;
        q('.pizzaInfo--size.selected').classList.remove('selected');
        ql('.pizzaInfo--size').forEach((size, sizeIndex) => {
            if (sizeIndex == 2) {
                size.classList.add('selected');
            }
            size.querySelector('span').innerHTML = pizzaJson[key].sizes[sizeIndex];
        });

        q('.pizzaInfo--qt').innerHTML = modalQt;

        q('.pizzaWindowArea').style.opacity = 0;
        q('.pizzaWindowArea').style.display = 'flex';
        setTimeout(() => {
            q('.pizzaWindowArea').style.opacity = 1;
        }, 200);


    });
    q('.pizza-area').append(pizzaItem);
});


//Eventos do modal 

function closeModal() {
    q('.pizzaWindowArea').style.opacity = 0;
    setTimeout(() => {
        q('.pizzaWindowArea').style.display = 'none';
    }, 150);
}
ql('.pizzaInfo--cancelButton, .pizzaInfo--cancelMobileButton').forEach((item) => {
    item.addEventListener('click', closeModal);
});

q('.pizzaInfo--qtmenos').addEventListener('click', () => {

    if (modalQt > 1) {
        modalQt--;
        q('.pizzaInfo--qt').innerHTML = modalQt;
    }

});

q('.pizzaInfo--qtmais').addEventListener('click', () => {

    modalQt++;
    q('.pizzaInfo--qt').innerHTML = modalQt;

});
ql('.pizzaInfo--size').forEach((size, sizeIndex) => {
    size.addEventListener('click', (e) => {
        q('.pizzaInfo--size.selected').classList.remove('selected');
        size.classList.add('selected');
    });
});

q('.pizzaInfo--addButton').addEventListener('click', () => {

    let size = parseInt(q('.pizzaInfo--size.selected').getAttribute('data-key'))
    let identifier = pizzaJson[modalKey].id + '@' + size;
    let key = cart.findIndex((item) => item.identifier == identifier);

    if (key > -1) {
        cart[key].qt += modalQt;
    } else {
        cart.push({
            identifier,
            id: pizzaJson[modalKey].id,
            size,
            qt: modalQt

        });
    }
    updateCart();
    closeModal();
});

//Adicionando e atualizando informações no carrinho

function updateCart() {
    if(cart.length > 0) {
        q('aside').classList.add('show');
        q('.cart').innerHTML = '';

        for(let i in cart) {
            let pizzaItem = pizzaJson.find((item)=>item.id == cart[i].id);
            let cartItem = q('.models .cart--item').cloneNode(true);

            let pizzaSizeName;
            switch(cart[i].size) {
                case 0:
                    pizzaSizeName = 'P';
                    break;
                case 1:
                    pizzaSizeName = 'M';
                    break;
                case 2:
                    pizzaSizeName = 'G';
                    break;
            }
            let pizzaName = `${pizzaItem.name} (${pizzaSizeName})`;

            cartItem.querySelector('img').src = pizzaItem.img;
            cartItem.querySelector('.cart--item-nome').innerHTML = pizzaName;
            cartItem.querySelector('.cart--item--qt').innerHTML = cart[i].qt;

            q('.cart').append(cartItem);
        }
    } else {
        q('aside').classList.remove('show');
    }
}
