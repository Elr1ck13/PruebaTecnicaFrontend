let loadProducts = document.querySelector("button.btn-primary");
let cards = document.querySelectorAll("div.card");

loadProducts.addEventListener("click", function (event) {
  event.preventDefault();
  getProducts();
});

function getProducts() {
  fetch("https://api.escuelajs.co/api/v1/products")
    .then((res) => res.json())
    .then((data) => {
      productData = data;
      createCards(sliceEntries(data));
    })
    .catch((error) => {
      console.log(error.message);
    });
}

function sliceEntries(jsonData) {
  const entries = Object.entries(jsonData);
  
  let truncatedJson;
  if (entries.length > 41) {
    const slicedEntries = entries.slice(0, 41);
    return (truncatedJson = Object.fromEntries(slicedEntries));
  } else {
    return (truncatedJson = jsonData);
  }
}

function createCards(jsonData) {

    cards.forEach((card, index) => {
        if (jsonData[index]) {
            const product = jsonData[index];
             const svgElement = card.querySelector('.bd-placeholder-img');
            svgElement.style.display = 'none'; 

            const imgElement = document.createElement('img');
            imgElement.src = product.images[0];

            imgElement.classList.add('card-img-top'); 
            imgElement.alt = product.title; 

            card.insertBefore(imgElement, svgElement);

            const titleElement = document.createElement('h6'); 

            titleElement.textContent = product.title; 
            card.querySelector('.card-body').insertBefore(titleElement, card.querySelector('.card-text'));
            const descriptionElement = card.querySelector('.card-text');
            descriptionElement.textContent = product.description.slice(0, 100) + '...';

            const priceElement = card.querySelector('.text-body-secondary');
            priceElement.textContent = `${product.price}`;
             const viewButton = card.querySelector('.btn-outline-secondary');
            viewButton.id = `view-btn-${index}`;
            
            card.setAttribute('data-index', index);
        } else {
            card.style.display = 'none';
        }
         
    });

    document.addEventListener("click", (e) => {
        const btn = e.target.closest(".btn-outline-secondary");
        if (!btn) return;
        console.log("hola")
        showModal(btn.id,jsonData); 

    });
}


function showModal(buttonId, jsonData) {
    const index = buttonId.split('-').pop(); 
    const product = jsonData[index]; 

    let modalContent = `
        <div class="modal fade show" id="exampleModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true" style="display: block;">
            <div class="modal-dialog" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="exampleModalLabel">${product.title}</h5>
                        <!-- Botón de cierre sin el icono 'X' -->
                    </div>
                    <div class="modal-body">
                        <p>${product.description}</p>
                        <p>Categoría: ${product.category.name}</p>`;

    if (product.images.length > 1) {
        modalContent += '<div class="additional-images">';
        product.images.slice(1, 3).forEach(image => {
            modalContent += `<img src="${image}" style="width: 100%; margin-top: 10px;" alt="Additional Image">`;
        });
        modalContent += '</div>';
    }

    modalContent += `
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" onclick="closeModal()">Close</button>
                    </div>
                </div>
            </div>
        </div>
    `;

    document.body.insertAdjacentHTML('beforeend', modalContent);
    const modal = document.getElementById('exampleModal');
    modal.addEventListener('click', function(event) {
        if (event.target === modal) {
            closeModal();
        }
    });
}

function closeModal() {
    const modal = document.getElementById('exampleModal');
    if (modal) {
        modal.remove(); 
    }
}
