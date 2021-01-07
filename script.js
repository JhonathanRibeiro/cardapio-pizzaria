const c  = (el)=>document.querySelector(el); 
const cs = (el)=>document.querySelectorAll(el);
//array do carrinho de compras que será populado com as pizzas 
let cart = [];
let modalQtd = 1;
let modalKey = 0;
//preenchendo o modal...
pizzaJson.map((pizza, index)=>{
    //clonando a div .models
    let pizzaItem = c('.models .pizza-item').cloneNode(true)
    //preenchendo os campos de pizza-item
    pizzaItem.setAttribute('data-key', index)
    pizzaItem.querySelector('.pizza-item--img img').src     = pizza.img
    pizzaItem.querySelector('.pizza-item--name').innerHTML  = pizza.name
    pizzaItem.querySelector('.pizza-item--desc').innerHTML  = pizza.description
    pizzaItem.querySelector('.pizza-item--price').innerHTML = `R$ ${pizza.price.toFixed(2)}`
    //
    pizzaItem.querySelector('a').addEventListener('click', (e)=>{
     //removendo evento padrão do link
     e.preventDefault();
     //recuperando o data-key de pizza-item selecionado
     let key = e.target.closest('.pizza-item').getAttribute('data-key')
     //recupera e formata o preço da pizza selecionada
     let FormatPrice = pizzaJson[key].price;
     modalQtd = 1;
     modalKey = key;
     //preenchendo as informações no modal
     c('.pizzaBig img').src = pizzaJson[key].img;
     c('.pizzaInfo h1').innerHTML = pizzaJson[key].name;
     c('.pizzaInfo--desc').innerHTML = pizzaJson[key].description;
     c('.pizzaInfo--actualPrice').innerHTML = FormatPrice.toLocaleString('pt-BR', {style: 'currency',currency: 'BRL'});
     c('.pizzaInfo--size.selected').classList.remove('selected')//resetando class
     cs('.pizzaInfo--size').forEach((size, sizeIndex)=>{
         if(sizeIndex == 2){
             //pizza grande selecionado por padrão
             size.classList.add('selected');
         }
         size.querySelector('span').innerHTML = pizzaJson[key].sizes[sizeIndex]
     });
        //inserindo a quantidade
        c('.pizzaInfo--qt').innerHTML = modalQtd;
        c('.pizzaWindowArea').style.opacity = 0;
        c('.pizzaWindowArea').style.display = 'flex';
        setTimeout(()=>{
            c('.pizzaWindowArea').style.opacity = 1;
        }, 200)
    })
    c('.pizza-area').append(pizzaItem)
});

//Eventos do Modal
function closeModal(){
    c('.pizzaWindowArea').style.opacity = 0;
    setTimeout(()=>{
        c('.pizzaWindowArea').style.display = 'none';
    }, 500);
}
//função cancelar - fechar o modal(desktop e mobile)
cs('.pizzaInfo--cancelButton, .pizzaInfo--cancelMobileButton').forEach((pizza)=>{
    pizza.addEventListener('click', closeModal);
});
// Botões de quantidade
c('.pizzaInfo--qtmenos').addEventListener('click', ()=>{
    if(modalQtd > 1){
        modalQtd--;
        c('.pizzaInfo--qt').innerHTML = modalQtd;
    }
});

c('.pizzaInfo--qtmais').addEventListener('click', ()=>{
    modalQtd++;
    c('.pizzaInfo--qt').innerHTML = modalQtd;
});

//botoes de seleção do tamanho da pizza
cs('.pizzaInfo--size').forEach((size, sizeIndex)=>{
    size.addEventListener('click', (e)=>{
        c('.pizzaInfo--size.selected').classList.remove('selected');
        size.classList.add('selected');
    });
});
c('.pizzaInfo--addButton').addEventListener('click', ()=>{
    //tamanho
    let size = parseInt(c('.pizzaInfo--size.selected').getAttribute('data-key'));
    //armazenando tamanho e id da pizza
    let identifier = pizzaJson[modalKey].id + `@${size}`;
    //Verificando e comparando o identifier se existir atribui o valor a si msm 
    let sizeInfo = cart.findIndex((item)=>item.identifier == identifier);

    if(sizeInfo > -1){
        //alterando a qtde
        cart[sizeInfo].qtd += modalQtd;
    } else {
        cart.push({
            identifier,
            id:pizzaJson[modalKey].id,
            size,
            qtd: modalQtd
        });
    }
    //atualiza o carrinho antes de fechar o modal
    updateCart();
    //fechando o modal
    closeModal();
});
//abrindo o carrinho no mobile
c('.menu-openner').addEventListener('click', ()=>{
    //só exibe o carrinho se existir algum valor
    if(cart.length > 0){
        c('aside').style.left = '0';
    }
});
//fechando o carrinho no mobile
c('.menu-closer').addEventListener('click', ()=>{
    c('aside').style.left = '100vw';
});
//Atualizando o carrinho de compras...
function updateCart(){
    //Atualizando a qtde do carrinho no mobile...
    let cartMobile = c('.menu-openner span').innerHTML = cart.length;
    //adicionando efeito css flash no botao do carrinho
    let cartBoxMobile = c('.menu-openner');
    if(cartMobile){
        //adicionando efeito css do carrinho no mobile
        cartBoxMobile.classList.add('flashCart');
    } else if(cartMobile < 1){
        //removendo efeito css do carinho no mobile
        cartBoxMobile.classList.remove('flashCart');
    }
    //exibindo o carrinho de compras 
    if(cart.length > 0){
        //exibe o carrinho de compras
        c('aside').classList.add('show');
        //limpando os campos
        c('.cart').innerHTML = '';

        let subtotal = 0;
        let desconto = 0;
        let total = 0;

        for(let i in cart){
            //retorna os itens da pizza, nome,size, etc...
            let pizzaItem = pizzaJson.find((item)=>item.id == cart[i].id);
            //calculo do subtotal da compra .... preço x qtde
            subtotal += pizzaItem.price * cart[i].qtd;

            //clonando os campos 
            let cartItem = c('.models .cart--item').cloneNode(true);
            
            let pizzaSizeName;
            switch(cart[i].size){
                case 0:
                    pizzaSizeName = 'Pequena';
                 break;
                case 1:
                    pizzaSizeName = 'Média';
                 break;
                case 2:
                    pizzaSizeName = 'Grande';
                 break;
            }

            //inserindo nome e tamanho da pizza na variavel pizzaName
            let pizzaName = `${pizzaItem.name} (${pizzaSizeName})`;
            //inserindo a img da pizza
            cartItem.querySelector('img').src = pizzaItem.img;
            //exibindo na tela o nome e o tamanho da pizza
            cartItem.querySelector('.cart--item-nome').innerHTML = pizzaName;
            //preenchendo a qtde informada pelo cliente
            cartItem.querySelector('.cart--item--qt').innerHTML = cart[i].qtd;
            //botão diminuir do carrinho
            cartItem.querySelector('.cart--item-qtmenos').addEventListener('click', ()=>{
                //só diminui se a qtde for maior que 1
                if(cart[i].qtd > 1){
                    //diminuindo do carrinho
                    cart[i].qtd--;
                } else {
                    //removendo o item caso seja 0
                    cart.splice(i, 1);
                }
                updateCart();
            });
            //botão adicionar do carrinho
            cartItem.querySelector('.cart--item-qtmais').addEventListener('click', ()=>{
                cart[i].qtd++;
                updateCart(); //atualiza o carrinho
            });
            //adicionando 
            c('.cart').append(cartItem);
        }
        //aplicando desconto de 10%
        desconto = subtotal * 0.1;
        //total da compra(total menos o desconto)
        total = subtotal - desconto;

        //exibindo o total de descontos e subtotal das compras
        c('.subtotal span:last-child').innerHTML = `R$ ${subtotal.toFixed(2)}`;
        c('.desconto span:last-child').innerHTML = `R$ ${desconto.toFixed(2)}`;
        c('.total span:last-child').innerHTML    = `R$ ${total.toFixed(2)}`;
    } else {
        c('aside').classList.remove('show');
        //fechando o carrinho mobile
        c('aside').style.left = '100vw';
    }
}














