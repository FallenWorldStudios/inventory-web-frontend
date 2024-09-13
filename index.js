const apiUrl = 'http://localhost:5065/api/items'; // Adjust the URL to match your API endpoint
let currentItemID = null; // Store the ID of the item being updated

// Function to fetch and display items
async function fetchItems() {
    const response = await fetch(apiUrl);
    const items = await response.json();
    console.log(items)
    const itemsList = document.getElementById('items-list');
    itemsList.innerHTML = '';

    items.forEach(item => {
        const li = document.createElement('li');
        li.textContent = `${item.name} - Quantity: ${item.quantity} - Price: $${item.price.toFixed(2)}`;
        itemsList.appendChild(li);

        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        deleteButton.onclick = () => deleteItem(item.id);
        li.appendChild(deleteButton);

        const updateButton = document.createElement('button');
        updateButton.textContent = 'Update';
        updateButton.onclick = () => selectItemForUpdate(item);
        li.appendChild(updateButton);
    });
}


async function updateItem(){
    const name = document.getElementById('item-name').value;
    const quantity = document.getElementById('item-quantity').value;
    const price = document.getElementById('item-price').value;

    const item = { name, quantity: parseInt(quantity), price: parseFloat(price) };
    console.log(currentItemID)

    if (currentItemID) {
        try {
            const response = await fetch(`${apiUrl}/${currentItemID}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(item)
            });

            if (!response.ok) {
                console.error(`Error updating item: ${response.status} ${response.statusText}`);
            } else {
                console.log(`Item updated successfully`);
            }
        } catch (error) {
            console.error(`Error updating item: ${error}`);
        } finally {
            currentItemID = null;
            clearForm();
            fetchItems();
        }
    }
}
// Function to add a new item or update an existing item
async function addItem() {
    const name = document.getElementById('item-name').value;
    const quantity = document.getElementById('item-quantity').value;
    const price = document.getElementById('item-price').value;

    const item = { name, quantity: parseInt(quantity), price: parseFloat(price) };

  
        await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(item)
        });
    

    clearForm();
    fetchItems();
}

// Function to select an item for updating
function selectItemForUpdate(item) {
    document.getElementById('item-name').value = item.name;
    document.getElementById('item-quantity').value = item.quantity;
    document.getElementById('item-price').value = item.price;
    currentItemID = item.id;
}

// Function to clear the form after adding/updating an item
function clearForm() {
    document.getElementById('item-name').value = '';
    document.getElementById('item-quantity').value = '';
    document.getElementById('item-price').value = '';
    currentItemID = null;
}

// Function to delete an item
async function deleteItem(id) {
    await fetch(`${apiUrl}/${id}`, {
        method: 'DELETE'
    });

    fetchItems();
}

// Function to delete all items
async function deleteAllItems() {
    const items = await fetch(apiUrl);
    const itemsList = await items.json();

    for (let item of itemsList) {
        await fetch(`${apiUrl}/${item.id}`, {
            method: 'DELETE'
        });
    }

    fetchItems();
}

// Load items when the page loads
window.onload = fetchItems;
