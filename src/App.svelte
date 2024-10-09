<script>
  import Modal from './routes/Modal.svelte';
  import Footer from './routes/Footer.svelte';
  import Header from './routes/Header.svelte';
  import Filter from './routes/Filter.svelte';
  import TailwindCss from './lib/TailwindCSS.svelte';
  import Cars from './routes/Cars.svelte';
  import CarDetails from "./routes/CarDetails.svelte";
 

  import Page from 'page';

  let currentRoute;
  let currentParams = {};

  let cars = [];
  let filteredCars = [];
  let selectedBrand = '';
  let selectedMake = '';
  let tempMinYear = '';
  let tempMaxYear = '';


  Page('/', () => { currentRoute = Cars; 
    currentParams = {};
  });
  Page('/cars/:id', (ctx) => { currentRoute = CarDetails; currentParams = ctx.params;
    currentParams = ctx.params;
   });

  Page('*', () => { currentRoute = undefined;
    currentParams = {};
   });

  function refreshCars() {
    fetch("http://localhost:3000/cars")
      .then(response => response.json())
      .then(data => {
        cars = data;
        filteredCars = data;
      });
  }

  
  function handleFilter(event) {
    selectedBrand = event.detail.selectedBrand;
    selectedMake = event.detail.selectedMake;
    tempMinYear = event.detail.minYear;
    tempMaxYear = event.detail.maxYear;

    filteredCars = cars.filter(car => {
      return (
        (selectedBrand ? car.brand === selectedBrand : true) &&
        (selectedMake ? car.model === selectedMake : true) &&
        (tempMinYear ? car.year >= parseInt(tempMinYear) : true) &&
        (tempMaxYear ? car.year <= parseInt(tempMaxYear) : true)
      );
    });
  }

  function handleClearFilters() {
    selectedBrand = '';
    selectedMake = '';
    tempMinYear = '';
    tempMaxYear = '';
    filteredCars = cars;
  }


let users = [
  { id: 1, name: 'Rokas', email: 'rokas@gmail.com', password: '123', isAdmin: true},
  { id: 1, name: 'Rimas', email: 'rimas@gmail.com', password: '123', isAdmin: false},
]



Page.start();


</script>




<TailwindCss/>


<Header />

{#if currentRoute === Cars}
  <Cars {cars} on:filter={handleFilter} on:clearFilters={handleClearFilters} />
{:else if currentRoute === CarDetails}
  <CarDetails {currentParams} />
{/if}


<Footer/>

