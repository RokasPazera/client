<script>
    import { onMount } from 'svelte';
    export let currentParams;
    let car = {};
    let bids = [];
    let { id } = currentParams; 
    let loading = true;
    let error = null;
    let bidsLoading = true;
    let bidsError = null;

    onMount(() => {
        fetch(`http://localhost:3000/cars/${id}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                car = data;
                loading = false;
            })
            .catch(err => {
                console.error("Error fetching car details:", err);
                error = "Failed to load car details.";
                loading = false;
            });

            fetch(`http://localhost:3000/cars/${id}/bids`)
            .then(response => {
                if(!response.ok){
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                bids = data.bids;
                bidsLoading = false;
            })
            .catch(err => {
                console.error("Error fetching bids", err);
                bidsError = "Failed to load";
                bidsLoading = false;
            })
    });

</script>
<div class="bg-[#2D2F33] min-h-screen p-8">
    <div class="flex flex-col items-center justify-center">
        {#if loading}
            <p>Loading car details...</p>
        {:else if error}
            <p>{error}</p>
        {:else if Object.keys(car).length > 0}
        <div class="flex flex-row w-full items-start bg-[#2C2C2E] rounded-lg shadow-md p-4">
                <div class="w-1/3">
                    <img 
                        src={car.url} 
                        alt="{car.brand} {car.model}" 
                        class="w-full h-64 mb-4 object-cover" 
                    />
                </div>

                <div class="w-1/3 pl-4 text-white text-center">
                    <h2 class="text-2xl font-bold mb-2">{car.brand} {car.model}</h2>
                    <p class="text-lg mb-4">{car.description}</p>
                    <div class="border-t-2 border-gray-600 pt-4">
                        <p class="text-white">Year: {car.year}</p>
                        <p class="text-white">Price: {car.price} kebabs</p>
                    </div>
                </div>


                <div class="w-1/3 pl-8 text-white">
                    <h3 class="text-xl font-bold mb-2">Bids</h3>
                        
                        {#if bidsLoading}
                            <p>Loading bids...</p>
                        {:else if bidsError}
                            <p>{bidsError}</p>
                        {:else if bids.length > 0}
                            <ul class="space-y-2">
                                {#each bids as bid}
                                    <li class="bg-gray-700 p-2 rounded">
                                        <p><strong>Bidder:</strong> {bid.bidder}</p>
                                        <p><strong>Amount:</strong> {bid.amount} kebabs</p>
                                        <p><strong>Date:</strong> {new Date(bid.date).toLocaleString()}</p>
                                    </li>
                                {/each}
                            </ul>
                        {:else}
                            <p>No bids available.</p>
                        {/if}
        </div> 
        </div>
        {:else}
            <p>No car details found.</p>
        {/if}
    </div>
</div>