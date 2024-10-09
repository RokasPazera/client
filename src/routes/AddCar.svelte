<script>
    import { createEventDispatcher } from 'svelte';

    const dispatch = createEventDispatcher();

    let brand;
    let model;
    let year;
    let price;
    let url;

    let newCar={};

    let errorMessage = '';

    const handleSubmit = async () => {

        errorMessage = '';

        if (!brand || !model || !year || !price || !url) {
            errorMessage = 'All fields are required!';
            return;
        }

        if (brand !== 'BMW') {
            if (brand === 'bmw') {
                errorMessage = 'Must be all in capital letters. It is the best car brand after all!';
            } else {
                errorMessage = 'BRAND CAN ONLY BE BMW!!!!!';
            }
            return;
        }

        if(year< 2000){
            errorMessage = 'why are you posting a car from dinosaur era??? post a newer one...(newer than 2000)'
            return;
        }

        if(year > 2024){
            errorMessage = 'Are you serious???No way you live in the future!'
            return;
        }

        const newCar = {
            brand,
            model,
            year,
            price,
            url,
        };

        try{
            const response = await fetch("http://localhost:3000/cars", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(newCar)
            });

            const data = await response.json();
            if(response.ok){
                dispatch('addCar', data);
            }
        } catch(err){
            console.error(err);
        }
    };
</script>

<form on:submit|preventDefault={handleSubmit} class="bg-gray-800 p-6 rounded-lg shadow-md space-y-4">
    <h2 class="text-white text-xl font-semibold mb-4">Add a New Car</h2>
    {#if errorMessage}
        <p class="text-red-500">{errorMessage}</p>
    {/if}
    <input 
        class="block w-full p-3 border border-gray-700 bg-gray-900 text-white rounded focus:outline-none focus:ring-2 focus:ring-blue-500" 
        type="text" 
        placeholder="Brand" 
        bind:value={brand} 
    />
    <input 
        class="block w-full p-3 border border-gray-700 bg-gray-900 text-white rounded focus:outline-none focus:ring-2 focus:ring-blue-500" 
        type="text" 
        placeholder="Model" 
        bind:value={model} 
    />
    <input 
        class="block w-full p-3 border border-gray-700 bg-gray-900 text-white rounded focus:outline-none focus:ring-2 focus:ring-blue-500" 
        type="number" 
        placeholder="Year" 
        bind:value={year} 
    />
    <input 
        class="block w-full p-3 border border-gray-700 bg-gray-900 text-white rounded focus:outline-none focus:ring-2 focus:ring-blue-500" 
        type="number" 
        placeholder="Price" 
        bind:value={price} 
    />
    <input 
        class="block w-full p-3 border border-gray-700 bg-gray-900 text-white rounded focus:outline-none focus:ring-2 focus:ring-blue-500" 
        type="text" 
        placeholder="URL" 
        bind:value={url} 
    />
    <button 
        class="w-full bg-blue-600 text-white p-3 rounded hover:bg-blue-700 transition duration-300">
        Post!
    </button>
</form>

<style>

</style>