<script>
    import { userStore } from '../stores/userStores';
    import { onDestroy } from 'svelte';

    export let currentParams;
    let car = {};
    let bids = {};
    let loading = true;
    let error = null;
    let bidsLoading = true;
    let bidsError = null;
    let winningBidAmount = 0;
    let newBidAmount = 0;
    let bidderName = ''; 

    let id;
    if (currentParams) {
        ({ id } = currentParams);
    }
    let user = { id: null, username: '', email: '', isAdmin: false };

    

    const fetchWinningBid = async () => {
        try {
            const response = await fetch(`http://localhost:3000/cars/${id}/winning-bid`);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const { winningBid } = await response.json();
            winningBidAmount = winningBid.amount;
        } catch (err) {
            console.error("Error fetching winning bid:", err);
            bidsError = "Failed to load winning bid.";
        }
    };

    const fetchBids = async () => {
        await fetchWinningBid();
        try {
            const bidsResponse = await fetch(`http://localhost:3000/cars/${id}/bids`, {
                method: 'GET',
            });
            if (!bidsResponse.ok) {
                throw new Error('Network response was not ok');
            }
            const bidsData = await bidsResponse.json();
            bidsData.bids.forEach(bid => {
                if (!bids[bid.amount]) {
                    bids[bid.amount] = [];
                }
                bids[bid.amount].push(bid);
            });
            bidsLoading = false;
        } catch (err) {
            console.error("Error fetching bids", err);
            bidsError = "Failed to load";
            bidsLoading = false;
        }
    };

    const postNewBid = async () => {
        if (newBidAmount <= winningBidAmount) {
            alert("Bid must be higher than the current winning bid.");
            return;
        }

        const newBid = {
            carId: id,
            amount: newBidAmount,
            bidder: user.username,
            date: new Date().toISOString(),
        };

        try {
            const bidsResponse = await fetch(`http://localhost:3000/cars/${id}/bids`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newBid),
            });
            if (!bidsResponse.ok) {
                throw new Error('Network response was not ok');
            }
            const bidsData = await bidsResponse.json();
            if (!bids[newBid.amount]) {
                bids[newBid.amount] = [];
            }
            bids[newBid.amount].push(newBid);

            newBidAmount = 0;
        } catch (err) {
            console.error("Error posting new bid:", err);
            bidsError = "Failed to post new bid.";
        }
    };

    const fetchCarDetails = async () => {
        try {
            const carResponse = await fetch(`http://localhost:3000/cars/${id}`);
            if (!carResponse.ok) {
                throw new Error('Network response was not ok');
            }
            car = await carResponse.json();
            loading = false;
        } catch (err) {
            console.error("Error fetching car details:", err);
            error = "Failed to load car details.";
            loading = false;
        }
    };

    fetchBids();
    fetchCarDetails();


    const unsubscribe = userStore.subscribe(value => {
      user = { ...value };
    });
    

    onDestroy(() => {
        unsubscribe();
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

                <div class="w-1/3 pl-8 ">
                    <h3 class="text-xl font-bold mb-2 text-white">Bids</h3>

                    {#if user.username !== ''}
                    <div class="mb-4">
                        <input 
                            type="number" 
                            bind:value={newBidAmount} 
                            placeholder="Enter your bid amount" 
                            class="p-2 rounded"
                        />
                        <button 
                            on:click={postNewBid} 
                            class="bg-blue-500 text-white p-2 rounded ml-2"
                        >
                            Place Bid
                        </button>
                    </div>

                    {/if}

                    {#if bidsLoading}
                        <p>Loading bids...</p>
                    {:else if bidsError}
                        <p>{bidsError}</p>
                    {:else if Object.keys(bids).length > 0}
                        <ul class="space-y-2">
                            {#each Object.keys(bids).reverse() as amount}
                                <li class="bg-gray-700 p-2 rounded text-white">
                                    <h4 class="font-bold">Bid Amount: {amount} kebabs</h4>
                                    {#each bids[amount] as bid}
                                        <p><strong>Bidder:</strong> {bid.bidder}</p>
                                        <p><strong>Date:</strong> {new Date(bid.date).toLocaleString()}</p>
                                    {/each}
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


<style>
    input[type="number"] {
        -moz-appearance: textfield;
    }

    input[type="number"]::-webkit-outer-spin-button,
    input[type="number"]::-webkit-inner-spin-button {
        -webkit-appearance: none;
        margin: 0;
    }
</style>