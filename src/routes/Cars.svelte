<script>
    import TailwindCss from "../lib/TailwindCSS.svelte";
    import AddCar from "./AddCar.svelte";
    import Filter from "./Filter.svelte";
    import CarDetails from "./CarDetails.svelte";
    import { onMount } from 'svelte';
    import Page from 'page';
  
    let API_URL = "http://localhost:3000/cars";
  
    export let addMoreCars = false;
    export let cars = [];
    let allCars = [];

    let selectedCar = null;

    let loading = false;
    let searchTimeout;
    let page = 1;
    let pageSize = 10;


    const minYearOptions = Array.from({ length: 25 }, (_, i) => 2000 + i);
    const maxYearOptions = Array.from({ length: 25 }, (_, i) => 2000 + i);
  
    let brands = [];
    let models = [];
    let years = [];
  
    let selectedBrand = '';
    let selectedModel = '';
    let selectedYear = '';
    let searchQuery = '';

  
    let newCar = {};
  
    $: filteredCars = cars.filter(car => {
      const searchLower = searchQuery.toLowerCase();
      return (
        car.brand.toLowerCase().includes(searchLower) ||
        car.model.toLowerCase().includes(searchLower)
      );
    })
    .filter(car => {
      return (
        (selectedBrand === '' || car.brand === selectedBrand) &&
        (selectedModel === '' || car.model === selectedModel) &&
        (selectedYear === '' || car.year === selectedYear)
      );
    });
  
    $: paginatedCars = filteredCars.slice((page - 1) * pageSize, page * pageSize);
  
    function refreshList() {
      loading = true;
      fetch(API_URL)
        .then((response) => response.json())
        .then((data) => {
          cars = data;
          allCars = data;
          brands = [...new Set(cars.map(car => car.brand))];
          models = [...new Set(cars.map(car => car.model))];
          years = [...new Set(cars.map(car => car.year))];
        })
        .catch((err) => console.error("Error fetching cars: ", err))
        .finally(() => (loading = false));
    }

    const showCarDetails = (car) => {
    console.log(car.id);
    Page(`/cars/${car.id}`);
};

    const closeCarDetails = () => {
        selectedCar = null;
    }
  
    onMount(() => {
      refreshList();
    });
  
    const deleteCar = (id) => {
      fetch(`${API_URL}/${id}`, {
        method: "DELETE",
      })
        .then((response) => response.json())
        .then(() => {
          refreshList();
        })
        .catch((err) => console.error("Error deleting car", err));
    };
  
    const handleFilterChange = (event) => {
    const { selectedBrand, selectedModel, minYear, maxYear } = event.detail;

    cars = allCars.filter(car => {
      return (
        (selectedBrand ? car.brand === selectedBrand : true) &&
        (selectedModel ? car.model === selectedModel : true) &&
        (minYear ? car.year >= parseInt(minYear) : true) &&
        (maxYear ? car.year <= parseInt(maxYear) : true)
      );
    });
  };
  
    const handleCarAdded = () => {
      refreshList();
      addMoreCars = false;
    };
  
    const handleSearchInput = (event) => {
      clearTimeout(searchTimeout);
      searchTimeout = setTimeout(() => {
        searchQuery = event.target.value;
      }, 300);
    };

    const handleClearFilters = () => {
        cars = allCars;
    }

  </script>
  
  <TailwindCss />

  <div class = "bg-[#2D2F33] min-h-screen p-8">

    <div class="mb-6 text-right">
      <button 
        class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700 transition duration-300"
        on:click={() => (addMoreCars = true)}>
        Post New Car
      </button>
    </div>
  
  {#if addMoreCars}
    <div class="fixed inset-0 bg-black bg-opacity-80 flex justify-center items-center">
      <div class="p-6 rounded-lg max-w-lg w-full relative text-[#E0E0E0]">
        <button class="absolute top-2 right-2 text-red-500 bg-[#2C2C2E] border border-red-500 p-2 rounded-full hover:bg-red-500 hover:text-white transition-colors" on:click={() => (addMoreCars = false)}>
          ✕
        </button>
        <AddCar on:addCar={handleCarAdded}/>
      </div>
    </div>
  {/if}
  
  <div class="flex">
    
    <div class="w-1/4 p-4">
        <Filter
          {brands}
          {models}
          selectedBrand={selectedBrand}
          selectedModel={selectedModel}
          minYearOptions={minYearOptions}
          maxYearOptions={maxYearOptions}
          on:filter={handleFilterChange}
          on:clearFilters={handleClearFilters}
        />
      </div>


    <div class="w-3/4 p-6">
      <div class="max-w-lg mx-auto p-4">
        <input
          type="text"
          placeholder="Search cars by brand or model..."
          on:input={handleSearchInput}
          class="bg-gray-200 text-black px-4 py-2 rounded-lg w-full"
        />
      </div>
  
      <div class="flex flex-wrap justify-center gap-6 p-6">
        {#if loading}
            <p class="text-white">Loading cars...</p>
        {:else if paginatedCars.length > 0}
            {#each paginatedCars as listedCars}
                <div class="bg-[#2C2C2E] text-[#E0E0E0] rounded-lg shadow-md p-4 w-64 text-center">
                  <button on:click={() => showCarDetails(listedCars)}>
                    <img class="h-40 w-full object-cover rounded-t-lg" src={listedCars.url} alt="{listedCars.brand} {listedCars.model}" />
                    <h4 class="text-xl font-bold mb-2">{listedCars.brand} {listedCars.model}</h4>
                    <p class="text-gray-600">Year: {listedCars.year}, Price: {listedCars.price} kebabs</p>
                </button>
                    <button class="mt-4 px-4 py-2 bg-[#1abc9c] text-white rounded hover:bg-[#16a085] transition duration-300" on:click={() => deleteCar(listedCars.id)}>
                        Delete
                    </button>
                </div>
            {/each}
        {:else if searchQuery.length > 0}
            <p class="text-gray-500">No results for "{searchQuery}"</p>
        {:else}
            <p class="text-gray-500">The auction is empty.</p>
        {/if}
    </div>
  
      {#if filteredCars.length > pageSize}
        <div class="mt-4 flex justify-center space-x-4">
          <button on:click={() => page = Math.max(1, page - 1)} class="bg-blue-500 text-white px-4 py-2 rounded disabled:opacity-50" disabled={page === 1}>
            Previous
          </button>
          <button on:click={() => page += 1} class="bg-blue-500 text-white px-4 py-2 rounded disabled:opacity-50" disabled={page * pageSize >= filteredCars.length}>
            Next
          </button>
        </div>
      {/if}
    </div>
  </div>
</div>